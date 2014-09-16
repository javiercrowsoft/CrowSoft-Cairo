(function() {
  "use strict";

  /*
      this module manages a dialog view ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Dialogs", function(Dialogs, Cairo, Backbone, Marionette, $, _) {

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
      toolbarKeyDocMail: "SEND_EMAIL"
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

    Dialogs.Util = {
      getTagChildIndex: function(tag) {
        var i = tag.indexOf(Dialogs.Constants.innerTab, 1);
        if(i > 0) {
          var n = Cairo.Util.val(tag.substring(1, i + Dialogs.Constants.innerTab.length));
          var q = Math.abs(Cairo.Math.truncate(n / 100));
          return (n - q * 100) * -1;
        }
      },
      getTagFatherIndex: function(tag) {
        var i = tag.indexOf(Dialogs.Constants.innerTab, 1);
        if(i > 0) {
          return Math.abs(Math.truncate(Cairo.Util.val(tag.substring(1, i + Dialogs.Constants.innerTab.length)) / 100));
        }
      },
      destroyGrids: function(view) {
        for(var i = view.getGrids().count()-1; i < view.getGrids().count(); i -= 1) {
          unload(view.getGrids().get(i));
        }
      }
    };
    
    Dialogs.Colors = {
      buttonFace: '#cecece'
    };

    Dialogs.Manager = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
        properties: new Dialogs.Properties(),
        menus:      new Dialogs.Menus(),
        tabs:       new Dialogs.Tabs()
      }

    });

  });

  ///////////////
  // Handler
  ///////////////

  Cairo.module("Dialog", function(Tree, Cairo, Backbone, Marionette, $, _) {

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

        var C_OFFSET_V  = 540;
        var C_OFFSET_V1 = 280;
        var C_OFFSET_V3 = 225;
        var C_OFFSET_H  = 1190;
        var C_OFFSET_H2 = 3780;
        var C_OFFSET_H3 = 1300;
        var C_OFFSET_H4 = 1000;

        var C_LINE_HEIGHT = 440;
        var C_LINE_LIGHT = 155;

        var K_W_CANCEL = -10;

        var Cairo.Configuration.Reports.reportSection = "RPT-CONFIG";
        var Cairo.Configuration.Reports.reportPath = "RPT_PATH_REPORTS";
        var Cairo.Configuration.Reports.commandTimeOut = "RPT_COMMAND_TIMEOUT";
        var Cairo.Configuration.Reports.connectionTimeOut = "RPT_CONNECTION_TIMEOUT";

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

        var m_gridManager = new Cairo.Entities.Dialogs.Grids.Manager();

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
        var m_title2 = "";
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
        var m_newKeyPropFocus = "";

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

        // returns the view
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

                toolBarClick:               docHandlerToolBarClick,
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

                maskEditChange:             docHandlerMaskEditChange

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

                toolBarButtonClick:       wizHandlerToolBarButtonClick,

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

                toolBarButtonClick:        masterHandlerToolBarButtonClick,

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

                m_masterView.getCancelButton().setText("Cancel";
                m_masterView.getCancelButton().cancel = true;

                m_masterView.getSaveButton().setText("Ok";
                m_masterView.getCancelButton().width = m_masterView.getSaveButton().width;

                m_masterView.getCloseButton().setVisible(false);
              }

              if(m_saveText)  { m_masterView.getSaveButton().text  = m_saveText; }
              if(m_saveWidth) { m_masterView.getSaveButton().width = m_saveWidth; }
              if(m_saveTop)   { m_masterView.getSaveButton().top   = m_saveTop; }
              if(m_saveLeft)  { m_masterView.getSaveButton().left  = m_saveLeft; }

              if(m_cancelText) { m_masterView.getCancelButton().setText(m_cancelText; }
              if(m_cancelTop)  { m_masterView.getCancelButton().top  = m_cancelTop; }
              if(m_cancelLeft) { m_masterView.getCancelButton().left = m_cancelLeft; }
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

        self.getOkCancelDialogResult = function(() {
          return m_okCancelResult;
        };

        self.setTabs = function(rhs) {
          m_tabs = rhs;
        };

        self.setNewKeyPropFocus = function(rhs) {
          m_newKeyPropFocus = rhs;
        };

        self.getNewKeyPropFocus = function() {
          return m_newKeyPropFocus;
        };

        self.setUseSelectIntValue = function(rhs) {
          m_useSelectIntValue = rhs;
        };

        self.setRowSelected = function(property, rowIndex) {
          try {
            var grid = property.getControl();
            if(grid) {
              grid.selectRow(rowIndex);
              property.selectedIndex = rowIndex;
            }
          }
          catch(ignore) {}
        };

        self.getMngGrid = function() {
          return m_gridManager;
        };

        self.setTabTopHeight = function(rhs) {
          m_tabTopHeight = rhs;
        }

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
        }

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
            setFocusControl(m_documentView.getGrid(0));
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

          var printManager = new Cairo.Printing.Manager();

          printManager.setPath(U.File.getValidPath(C.get(R.reportSection, R.reportPath, Cairo.Configuration.appPath())));
          printManager.setCommandTimeout(U.val(C.get(R.reportSection, R.commandTimeOut, 0)));
          printManager.setConnectionTimeout(U.val(C.get(R.reportSection, R.connectionTimeOut, 0)));

          printManager.showPrint(id, tblId, Cairo.Constants.NO_ID);
        };

        self.autoWidthColumn = function(property, keyCol) {
          // if kyeCol was given we only apply to that column
          //
          if(keyCol) {
            property.getControl().autoWidthColumn(property.getGrid().columns.get(keyCol).getIndex());
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
        self.grougrid = function(property, keyCol, keyColSort) {
            grougridEx(property, keyCol, keyColSort);
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

        self.grougridEx = function(property, keyCol, keyColSort, offSetColSort) {

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

              var col = property.getGrid().getColumns(keyCol);

              var grid = property.getControl();

              grid.clearGroups;
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
              col = property.getGrid().getColumns(keyColSort);

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
              for(var j = 1; j <= grid.getRows().count(); j++) {
                if(grid.rowIsGroup(j)) {
                  var row = new cABMGridRow();
                  row.setIsGroup(true);
                  row.setIndex(j);
                  rows.add(row);
                }
              }

              // sort the property rows collection to match sort in control
              //
              var sortedRows = new Dialogs.Grids.Rows();

              for(var j = 1; j <= grid.getRows().count(); j++) {
                var index = Cairo.Util.val(grid.cellText(j, 3));
                if(grid.rowIsGroup(j)) {
                  sortedRows.add(rows(j));
                }
                else {
                  for(var i = 1; i <= rows.count(); i++) {
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
              for(var j = 1; j <= grid.getRows().count(); j++) {
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

              for(var j = 1; j <= rows.count(); j++) {
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
        self.addAuxCol = function(property) {
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
            var grid = getView().getGrid(property.getIndex());
            if(grid !== null) {
              grid.setRedraw(redraw);
            }
          }
          catch(ignore) {}
        };

        self.refreshColumnPropertiesByIndex = function(property, keyCol) {
          return refreshColumnProperties(property, keyCol);
        };

        self.refreshColumnProperties = function(property, keyCol) {
          var column = property.getGrid().getColumns().get(keyCol);
          var grid = getView().getGrid(property.getIndex());

          // this is to avoid losing the column's width when refreshing
          //
          colGrid = grid.getColumns().get(column.getIndex());
          column.setWidth(colGrid.Width);

          m_gridManager.setColumnProperties(grid, column, colGrid);
        };

        // update edit status in all properties
        //
        self.refreshEnabledState = function(properties) {
          for(var _i = 0; _i < iProperties.count(); _i++) {
            setEnabled(properties.get(_i));
          }
          setTabIndexDescription();
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
                showValueEx(property, true, Cairo.Constants.DocumentSections.footer);
              }
              else if(m_isItems) {
                showValueEx(property, true, Cairo.Constants.DocumentSections.items);
              }
              else {
                showValueEx(property, true, Cairo.Constants.DocumentSections.header);
              }
            }
          }
          else {
            // masters and wizards
            //
            for(var _i = 0; _i < properties.count(); _i++) {
              showValueEx(properties.get(_i), true, "");
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

            for(var rowIndex = 1; rowIndex <= grid.getRows().count(); rowIndex++) {

              var row = rows.get(rowIndex);

              for(var colIndex = 1; colIndex <= colsToRefresh; colIndex++) {

                var col = columns.get(colIndex);
                var cell = row.get(colIndex);

                var cellControl = grid.cell(rowIndex, colIndex);
                cellControl.setItemData(cell.getId());

                if(col.getType() === Dialogs.PropertyType.date) {
                  cellControl.setText(Cairo.Util.getDateValueForGrid(cell.getValue()));
                }
                else if(col.getSubType() === Dialogs.PropertySubType.percentage) {
                  cellControl.setText(Cairo.Util.val(cell.getValue()) / 100);
                }
                else {
                  cellControl.setText(cell.getValue());
                }

                // cell format
                //
                var format = cell.getFormat();
                if(format !== null) {

                  cellControl.setForeColor(format.getColor());
                  cellControl.setBackColor(format.getBackColor());
                  cellControl.setTextAlign(format.getTextAlign());

                  var font = new  Cairo.Font();
                  font.setName(format.getFontName());
                  font.setItalic(format.getItalic());
                  font.setBold(format.getBold());
                  font.setSize(format.getFontSize());
                  font.setStrikeThrough(format.getStrike());
                  font.setUnderline(format.getUnderline());

                  cellControl.setFont(font);
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
          m_gridManager.showCellValue(getView().getGrid(property.getIndex()), property.getGrid(), row, col);
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
                  Cairo.Util.List.listSetListIndexForId(c, property.getListItemData());
                  break;

                case Dialogs.ListWhoSetItem.index:
                  Cairo.Util.List.listSetListIndex(c, property.getListListIndex());
                  break;

                case Dialogs.ListWhoSetItem.text:
                  Cairo.Util.List.listSetListIndexForText(c, property.getListText());
                  break;
              }

              if(c.getListIndex() === -1 && c.count() > 0) { c.setListIndex(0); }
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.select:

              var c = view.getSelects().get(property.getIndex());
              c.setId(property.getSelectId());

              if(m_useSelectIntValue) {
                c.setIntValue((property.getSelectIntValue() !== "") ? property.getSelectIntValue() : property.getSelectId()));
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

              c.setText(property.getValue();
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
              c.setText(property.getValue();
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.check:

              var c = view.checkBoxes().get(property.getIndex());
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
              c.setText(property.getValue();
              if(property.getBackColor() >= 0) {
                c.setBackColor(property.getBackColor());
              }

              break;

            case Dialogs.PropertyType.image:

              var c = view.getImages().get(property.getIndex());

              if(m_isWizard) {
                switch(Cairo.Util.val(property.getValue())) {
                  case 1:
                    c.setPicture(m_wizardView.getImgWiz1());
                    break;

                  case 3:
                    c.setPicture(m_wizardView.getImgWiz3());
                    break;

                  case 5:
                    c.setPicture(m_wizardView.getImgWiz5());
                    break;

                  default:
                    c.setPicture(property.getImage());
                    break;
                }
              }
              else {
                c.setPicture(property.getPicture());
              }

              break;

            case Dialogs.PropertyType.title:

              var c = view.getTitle2(property.getIndex());
              c.setText(property.getValue());

              break;

            case Dialogs.PropertyType.description:

              var c = view.getDescription(property.getIndex());
              c.setText(property.getValue());

              break;

            case Dialogs.PropertyType.grid:

              var c = view.getGrid(property.getIndex());
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
              inCurrentTag = (c.getTag().substring(0, lenStrTag).equals(strTag)
                              && c.getTag() !== ""
                              && !("cbTab".equals(c.getName()))
                              && (Cairo.Util.val(c.getTag().substring(lenStrTag + 1)) + m_firstTab).equals(m_currentTab));
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
              if(!(property.getKeyCol().equals(csNumberID)
                    || property.getKeyCol().equals(csStateID)
                    || (property.getTable() === Cairo.Tables.DOCUMENTO && m_isDocument))) {
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

            case Dialogs.PropertyType.List:
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
              view.checkBoxes().get(index).setEnabled(enabled);
              break;

            case Dialogs.PropertyType.button:
              view.getButtons().get(index).setEnabled(enabled);
              break;

            case Dialogs.PropertyType.grid:
              view.getGrid(index).setEnabled(enabled);
              break;
          }
        };

        // load property's control
        //
        self.loadControlEx(property, noGrids) {

          if(!property.getControlLoaded()) {
            if(!loadControl(property)) {
              return null;
            }
            property.setControlLoaded(true);
          }

          if(property.getType() !== Dialogs.PropertyType.grid || !noGrids) {
            showValueEx(property, false, "");
          }

          setTabIndexDescription();
          setBackgroundColor();
          return true;
        }

        // unload property's control
        //
        // TODO: this function can be rewrite because it is limited by vb6 array controls
        //       instead of unloading all controls in the array except the one at index zero
        //       we can just take the control from the property ( property.getControl() )
        //       and just unload it. there is no need to maintain the control at index zero
        //
        self.unloadControl = function(property) {

          if(property.getControlLoaded()) {

            property.setControl(null);

            var index = property.getIndex();

            var view = getView();

            switch(property.getType()) {

              case Dialogs.PropertyType.List:

                if(index === 0) {
                  view.getCombos().get(0).setVisible(0);
                }
                else {
                  unload(view.getCombos().get(index));
                }

                break;

              case Dialogs.PropertyType.select:

                if(index === 0) {
                  view.getSelects().get(0).setVisible(0);
                }
                else {
                  unload(view.getSelects().get(index));
                }

                break;

              case Dialogs.PropertyType.numeric:

                if(index === 0) {
                  view.getMaskEdits().get(0).setVisible(0);
                }
                else {
                  unload(view.getMaskEdits().get(index));
                }

                break;

              case Dialogs.PropertyType.date:
              case Dialogs.PropertyType.time:

                if(index === 0) {
                  view.getDatePickers().get(0).setVisible(0);
                }
                else {
                  unload(view.getDatePickers().get(index));
                }

                break;

              case Dialogs.PropertyType.label:

                if(index === 0) {
                  view.getCtlLabels().get(0).setVisible(0);
                }
                else {
                  unload(view.getCtlLabels().get(index));
                }

                break;

              case Dialogs.PropertyType.title:

                if(index === 0) {
                  view.getTitleLabel2().get(0).setVisible(0);
                }
                else {
                  unload(view.getTitleLabel2().get(index));
                }

                break;

              case Dialogs.PropertyType.progressBar:

                if(index === 0) {
                  view.getProgressBars().get(0).setVisible(0);
                }
                else {
                  unload(view.getProgressBars().get(index));
                }

                break;

              case Dialogs.PropertyType.description:

                if(index === 0) {
                  view.getDescription(0).setVisible(0);
                }
                else {
                  unload(view.getDescription(index));
                }

                break;

              case Dialogs.PropertyType.image:

                if(index === 0) {
                  view.getImages().get(0).setVisible(0);
                }
                else {
                  unload(view.getImages().get(index));
                }

                break;

              case Dialogs.PropertyType.text:
              case Dialogs.PropertyType.file:
              case Dialogs.PropertyType.folder:

                if(property.getSubType() === Dialogs.PropertySubType.memo) {
                  if(index === 0) {
                    view.getTextAreas().get(0).setVisible(0);
                  }
                  else {
                    unload(view.getTextAreas().get(index));
                  }
                }
                else {
                  if(index === 0) {
                    view.getTextInputs().get(0).setVisible(0);
                  }
                  else {
                    unload(view.getTextInputs().get(index));
                  }
                }

                break;

              case Dialogs.PropertyType.password:

                if(index === 0) {
                  view.getPasswordInputs().get(0).setVisible(0);
                }
                else {
                  unload(view.getPasswordInputs().get(index));
                }

                break;

              case Dialogs.PropertyType.check:

                if(index === 0) {
                  view.checkBoxes().get(0).setVisible(0);
                }
                else {
                  unload(view.checkBoxes().get(index));
                }

                break;

              case Dialogs.PropertyType.grid:

                if(index === 0) {
                  view.getGrid(0).setVisible(0);
                }
                else {
                  unload(view.getGrid(index));
                }

                break;

              case Dialogs.PropertyType.button:

                if(index === 0) {
                  view.getButtons().get(0).setVisible(0);
                }
                else {
                  unload(view.getButtons().get(index));
                }
                break;
            }

            index = property.getLabelIndex();
            if(index > 0) {
              unload(getView().getLabels().get(index));
            }
          }
        };

        self.closeWizard = function() {
          setChanged(false);
          unload(m_wizardView);
        };

        self.controlIsButton = function(control) { /* TODO: implement this. */ };
        self.controlIsLabel = function(control) { /* TODO: implement this. */ };
        self.controlIsToolbar = function(control) { /* TODO: implement this. */ };
        self.controlIsImage = function(control) { /* TODO: implement this. */ };
        self.controlIsGrid = function(control) { /* TODO: implement this. */ };

        self.tabGetFirstCtrl = function(index) {

          var tabIndex = 999;
          var view = getView();
          var controlsCount = view.getControls().count();
          var controls = view.getControls();
          var c = null;

          if(view.getTabs().get(index).getTag().indexOf(Dialogs.Constants.innerTab, 1)) {

            var childIndex = Dialogs.Util.getTagChildIndex(view.getTabs().get(index).getTag());
            var fatherIndex = Dialogs.Util.getTagFatherIndex(view.getTabs().get(index).getTag());

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
          var controlsCount = view.getControls().count();

          for(var _i = 0; _i < controlsCount; _i++) {
            c = .getControls().get(_i);
            if(c.getTag().substring(0, strTag.length) === strTag
                && c.getTag() !== ""
                && !(c.getName().equals("cbTab"))) {

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
          var controlsCount = view.getControls().count();

          for(var _i = 0; _i < controlsCount; _i++) {

            var c = .getControls().get(_i);

            if(c.getTag().substring(0, strTag.length) === strTag
                && c.getTag() !== ""
                && !(c.getName().equals("cbTab"))) {

              var isVisible = Cairo.Util.val(c.getTag().substring(strTag.length + 1)) + m_firstTab === index;
              c.setVisible(getControlVisible(c, isVisible));

              if(controlIsLabel(c)) {
                if(c.getBackColor() === Dialogs.Colors.buttonFace) {
                  c.setBackColor(view.getBackground().getBackColor());
                }
                if(c.getName().toLowerCase().equals("lb")) {
                  if(c.getText().trim() === "") {
                    c.setVisible(false);
                  }
                }
              }
              else if(controlIsCheckbox(c)) {
                c.BackColor = view.getBackground().getBackColor();
              }
              if(controlIsToolbar(c) && c.getVisible())) {
                view.SetToolbar(c);
              }
            }
          }
        };

        var getControlVisible = function(ctl, isVisible) {

          var propertiesCount = m_properties.count();
          for(var _i = 0; _i < propertiesCount; _i++) {
            var property = m_properties.get(_i);
            var c = property.getControl();
            if(c.getType() === ctrl.getType()) {
              if(!property.getVisible()) {
                isVisible = false;
              }
              break;
            }
            else if(controlIsLabel(c)) {
              if(!(ctl.getName().substring(0, 3).equals("lb2"))) {
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

            var childIndex = Dialogs.Util.getTagChildIndex(view.getTabs().get(index).getTag());
            var fatherIndex = Dialogs.Util.getTagFatherIndex(view.getTabs().get(index).getTag());

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
              if(controlIsButton(c) && c.getName().indexOf("cbTab", 1))) {
                if(c.getTag().indexOf(Dialogs.Constants.innerTab, 1)) {
                  var isVisible = Dialogs.Util.getTagFatherIndex(c.getTag()) === index;
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
            tabClick(firstTab.Index);
            m_currentInnerTab = Dialogs.Util.getTagChildIndex(firstTab.getTag());
          }
        };

        var setVisible = function(c, index) {

          var view = getView();
          c.setVisible(getControlVisible(c, isControlVisibleInTab(c, index)));

          if(controlIsLabel(c)) {
            if(c.getBackColor() === Dialogs.Colors.buttonFace) {
              c.setBackColor(view.getBackground().getBackColor());
            }
            if(c.getName().toLowerCase().equals("lb")) {
              if(c.getText().trim() === "") {
                c.setVisible(false);
              }
            }
          }
          else if(controlIsCheckbox(c)) {
            c.setBackColor(view.getBackground().getBackColor());
          }
          else if(controlIsToolbar(c) && c.getVisible())) {
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

          for(var i = 0; i <= menus.length; i++) {
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
          _rtn = false;

          indexTag = indexTag || 0;

          if(obj !== null) {

            m_client = obj;

            if(m_isDocument || m_isWizard) {
              m_loadHelp = true;
              m_loadNumeric = true;
              m_loadText = true;
            }

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
                if(view.Height < m_minHeight) {
                  view.setHeight(m_minHeight);
                }
                if(view.Width < m_minWidth) {
                  view.setWidth(m_minWidth);
                }
              }
            }

            if(showView(indexTag)) {

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

              refreshTitle();

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
                      if(viewIsMaster(view) || viewIsWizard(view))) {
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
                    if(viewIsMaster(view) || viewIsWizard(view))) {
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
              }
              _rtn = true;
            }
          }
          return _rtn;
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

        self.getViewMainImage() = function() {
          return getView().getImage();
        };

        self.getProperties() = function() {
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
          showValueEx(property, false, strTag);
        };

        self.getStrTag = function(property) {
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
            m_tabs = new cABMTabs();
          }
          return m_tabs;
        };

        self.setTitle2 = function(rhs) {
          m_title2 = rhs;
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
              property = getProperty(Dialogs.PropertyType.grid, index, 0);
              m_client.gridDblClick(property.Key, rowIndex, colIndex);
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
            property = getProperty(Dialogs.PropertyType.grid, index, 0);
            m_client.gridDblClick(property.Key, rowIndex, colIndex);
          }
        };

        var wizHandlerTabGetFirstCtrl = function(index) {
          return tabGetFirstCtrl(index);
        };

        ///////////////////////////////////////////////////////////////////////////////////////////
        // UI events

        //-----------
        // menu
        //
        var menuClick = function(itemNumber) {
          try {
            m_client.messageEx(Dialogs.Message.MSG_MENU_AUX, m_menu.getItemData(itemNumber));
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
          tabClick(index);
        };

        var masterHandlerCheckBoxClick = function(index) {
          checkBoxClick(index);
        };

        var masterHandlerCancelClick = function() {
          try {
            if(m_showOkCancel) {
              masterHandlerCloseClick();
              m_okCancelResult = false;
            }
            else {
              if(m_bSendRefresh) {
                m_client.messageEx(Dialogs.Message.MSG_DOC_REFRESH, null);
                refreshTitle();
                setChanged(false);
              }
              else {
                discardChanges();
              }
            }
          }
          catch(e) {
            Cairo.manageError(
              "Error in Master Cancel Click Handler",
              "An error has occurred when handling a 'cancel' action.",
              e.message);
          }
        };

        var masterHandlerCommandClick = function(index) {
          propertyHasChanged(Dialogs.PropertyType.button, index, getView().getButtons().get(index));
        };

        var masterHandlerCloseClick = function() {
          if(m_masterView !== null) {
            unload(m_masterView);
          }
        };

        var masterHandlerCopyClick = function() {
          m_client.copy();
          /* TODO: maybe we have to remove this */
          try {
            m_masterView.bringToFront();
          }
          case(ignore) {}
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
              case(ignore) {}
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

          // only on master or header of documents
          //
          if(!m_isItems && !m_isFooter) {
            saveChanges(false).then(function() {

              m_title2 = "";

              if(!m_isDocument && !m_bSendRefresh) {
                discardChanges(true);
              }

              m_client.editNew();

              if(m_bSendRefresh) {
                refreshTitle();
              }

              if(m_isDocument) {
                if(!newWithWizard()) {
                  moveFocus();
                }
              }

              setChanged(false);

              if(m_newKeyPropFocus !== "") {
                setFocusFromKeyProp(m_newKeyPropFocus);
              }
              else {
                if(m_isDocument) {
                  if(!newWithWizard()) {
                    view.setFocusFirstControl();
                  }
                }
              }
            });
          }
        };

        var moveFocus = function() {
          if(m_documentView !== null) {
            Cairo.safeExecute(function() { m_documentView.getDatePickers().get(0).setFocus() });
            Cairo.safeExecute(function() { m_documentView.getActiveControl().setFocus() });
          }
        };

        self.setFocusFromKeyProp = function(keyProp) {
          Cairo.safeExecute(function() { m_properties.get(keyProp).getControl().setFocus() });
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
                  showHelpAux();
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
          save(false, false).then(
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
          resetChanged();
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
              Dialogs.Util.destroyGrids(getView());
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

            when Yes:     it returns the promise with the result of calling save()

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
                    of calling save()
                    save is asynchronous (ajax call to server)
                  */
                  if(answer === "yes") {
                    return save(unloading, false).then(
                        function(saved) {
                          if(saved) {
                            setChanged(false);
                          }
                          return saved;
                        }
                      );
                  }
                  /*
                    the user wants to discard these changes
                  */
                  else if(answer === "no") {
                    setChanged(false);
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

        var masterHandlerGridColumnAfterEdit = function(index, lRow, lCol, newValue, newValueID, bCancel) {
          gridColumnEdit(true, index, lRow, lCol, 0, newValue, newValueID, bCancel);
        };

        var masterHandlerGridColumnAfterUpdate = function(index, lRow, lCol, newValue, newValueID) {
          gridColumnAfterUpdate(index, lRow, lCol, 0, newValue, newValueID);
        };

        var masterHandlerGridColumnBeforeEdit = function(index, lRow, lCol, iKeyAscii, bCancel) {
          gridColumnEdit(false, index, lRow, lCol, iKeyAscii, 0, 0, bCancel);
        };

        var masterHandlerGridColumnButtonClick = function(index, lRow, lCol, iKeyAscii, bCancel) {
          gridColumnButtonClick(index, lRow, lCol, iKeyAscii, bCancel);
        };

        var masterHandlerGridDblClick = function(index, rowIndex, colIndex) {
          if(m_clientManageGrid) {
            property = getProperty(Dialogs.PropertyType.grid, index, 0);
            m_client.gridDblClick(property.Key, rowIndex, colIndex);
          }
        };

        var masterHandlerGridDeleteRow = function(index, lRow, bCancel) {
          gridDeleteRow(index, lRow, bCancel);
        };

        var masterHandlerGridNewRow = function(index, rowIndex) {
          gridNewRow(index, rowIndex);
        };

        var masterHandlerGridAfterDeleteRow = function(index, rowIndex) {
          gridAfterDeleteRow(index, rowIndex);
        };

        var masterHandlerGridSelectionChange = function(index, lRow, lCol) {
          gridSelectionChange(index, lRow, lCol, Dialogs.GridSelectChangeType.GRID_SELECTION_CHANGE);
        };

        var masterHandlerGridSelectionRowChange = function(index, lRow, lCol) {
          gridSelectionChange(index, lRow, lCol, Dialogs.GridSelectChangeType.GRID_ROW_CHANGE);
        };

        var masterHandlerGridValidateRow = function(index, rowIndex, bCancel) {
          gridValidateRow(index, rowIndex, bCancel, true, false);
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

        var masterHandlerToolBarButtonClick = function(button) {
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
          docTabClick(index, tag);
        };

        // only change ctrl if there is a control in this tab
        // under this index
        //
        var docHandlerTabGetFirstCtrl = function(index, tag, ctrl) {
          var ctrlAux = docTabGetFirstCtrl(index, tag);
          if(ctrlAux !== null) {
            ctrl = ctrlAux;
          }
          return ctrl;
        };

        var docHandlerViewLoad = function() {
          resetChanged();
        };

        var docHandlerGridAfterDeleteRow = function(index, rowIndex) {
            gridAfterDeleteRow(index, rowIndex);
        };

        var docHandlerToolBarClick = function(button) {
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
                  save(false, false).then(
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
                  save(false, true).then(
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
                      if(anwer) {
                        m_client.messageEx(Dialogs.Message.MSG_DOC_DELETE, null).then(
                          function(success) {
                            if(success) {
                              resetChanged();
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
                  showMsg("Cargando alertas para este comprobante...");
                  m_client.messageEx(Dialogs.Message.MSG_DOC_ALERT, null).then(hideMsg);
                  break;

                case Dialogs.Constants.toolbarKeyDocTip:

                  Cairo.Util.sendEmailToCrowSoft("Sugestions for CrowSoft Cairo", "Documents: " + m_title2);
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
                  setFocusControl(m_documentView.getGrid(0));
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
        self.showMsg = function(msg, changeTop) {
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
                setChanged(false);
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
          tabClick(index);
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
                    setChanged(false);
                    unload(m_wizardView);
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
          resetChanged();
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
              Dialogs.Util.destroyGrids(getView());
              m_unloading = true;
              m_client.terminate();
              m_client = null;
            }
            m_wizardView = null;
          }
          catch(ignore) {}
        };

        var wizHandlerGridColumnAfterEdit = function(index, lRow, lCol, newValue, newValueID, bCancel) {
          gridColumnEdit(true, index, lRow, lCol, 0, newValue, newValueID, bCancel);
        };

        var wizHandlerGridColumnAfterUpdate = function(index, lRow, lCol, newValue, newValueID) {
          gridColumnAfterUpdate(index, lRow, lCol, 0, newValue, newValueID);
        };

        var wizHandlerGridColumnBeforeEdit = function(index, lRow, lCol, iKeyAscii, bCancel) {
          gridColumnEdit(false, index, lRow, lCol, iKeyAscii, 0, 0, bCancel);
        };

        var wizHandlerGridColumnButtonClick = function(index, lRow, lCol, iKeyAscii, bCancel) {
          gridColumnButtonClick(index, lRow, lCol, iKeyAscii, bCancel);
        };

        var wizHandlerGridDeleteRow = function(index, lRow, bCancel) {
          gridDeleteRow(index, lRow, bCancel);
        };

        var wizHandlerGridNewRow = function(index, rowIndex) {
          gridNewRow(index, rowIndex);
        };

        var wizHandlerGridAfterDeleteRow = function(index, rowIndex) {
          gridAfterDeleteRow(index, rowIndex);
        };

        var wizHandlerGridSelectionChange(index, lRow, lCol) {
          gridSelectionChange(index, lRow, lCol, Dialogs.GridSelectChangeType.GRID_SELECTION_CHANGE);
        };

        var wizHandlerGridSelectionRowChange = function(index, lRow, lCol) {
          gridSelectionChange(index, lRow, lCol, Dialogs.GridSelectChangeType.GRID_ROW_CHANGE);
        };

        var wizHandlerGridValidateRow = function(index, rowIndex, bCancel) {
          gridValidateRow(index, rowIndex, bCancel, true, false);
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

        var wizHandlerToolBarButtonClick = function(button) {
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
            unload(m_documentView);
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

        var docHandlerViewDestroy = function(cancel) {

            getView().UnloadCount = getView().UnloadCount + 1;

            var view = getView();

                if(m_isFooter || m_isItems) {

                    // Solo si el usuario no desidio cancelar el cierre del form
                    if(view.CancelUnload) { return; }

                    saveColumnsGrids();
                    m_unloading = true;

                    m_client = null;

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

                // Solo destruyo las grillas en el footer que
                // es el ultimo en recibir el evento unload
                //
                if(getView().UnloadCount === 3) { Dialogs.Util.destroyGrids(getView()); }

                m_documentView = null;
            // {end with: view}
        }

        var docHandlerGridColumnButtonClick = function(index, lRow, lCol, iKeyAscii, bCancel) {
            gridColumnButtonClick(index, lRow, lCol, iKeyAscii, bCancel);
        }

        var docHandlerGridColumnAfterEdit = function(index, lRow, lCol, newValue, newValueID, bCancel) {
            gridColumnEdit(true, index, lRow, lCol, 0, newValue, newValueID, bCancel);
        }

        var docHandlerGridColumnAfterUpdate = function(index, lRow, lCol, newValue, newValueID) {
            gridColumnAfterUpdate(index, lRow, lCol, 0, newValue, newValueID);
        }

        var docHandlerGridColumnBeforeEdit = function(index, lRow, lCol, iKeyAscii, bCancel) {
            gridColumnBeforeEdit = function(index, lRow, lCol, iKeyAscii, bCancel);
            if(bCancel) { return; }
            gridColumnEdit(false, index, lRow, lCol, iKeyAscii, 0, 0, bCancel);
        }

        var docHandlerGridDeleteRow = function(index, lRow, bCancel) {
            gridDeleteRow(index, lRow, bCancel);
        }

        var docHandlerGridNewRow = function(index, rowIndex) {
            gridNewRow(index, rowIndex);
        }

        var docHandlerGridValidateRow = function(index, rowIndex, bCancel) {
            gridValidateRow(index, rowIndex, bCancel, true, false);
        }

        var docHandlerGridSelectionChange = function(index, lRow, lCol) {
            gridSelectionChange(index, lRow, lCol, Dialogs.GridSelectChangeType.GRID_SELECTION_CHANGE);
        }

        var docHandlerGridSelectionRowChange = function(index, lRow, lCol) {
            gridSelectionChange(index, lRow, lCol, Dialogs.GridSelectChangeType.GRID_ROW_CHANGE);
        }

        var docHandlerSelectChange = function(index) {
            selectChange(index);
        }

        var docHandlerMaskEditChange = function(index) {
            maskEditChange(index);
        }

        var docHandlerDateChange = function(index) {
            dateChange(index);
        }

        var docHandlerOptionButtonClick = function(index) {
            optionButtonClick(index);
        }

        var docHandlerTextChange = function(index) {
            textChange(index);
        }

        var docHandlerTextAreaChange = function(index) {
            textAreaChange(index);
        }

        var docHandlerTextPasswordChange = function(index) {
            textPasswordChange(index);
        }

        // funciones del objeto
        var comboChange = function(index) {
            propertyHasChanged(Dialogs.PropertyType.list, index, getView().combos.get(index));
        }

        var checkBoxClick = function(index) {
            propertyHasChanged(Dialogs.PropertyType.check, index, getView().checkBoxes().get(index));
        }

        var gridDeleteRow = function(index, lRow, bCancel) {
            if(!m_clientManageGrid) { return; }

            property = null;
            property = getProperty(Dialogs.PropertyType.grid, index, 0);

            if(property === null) { return; }

            cIABMClientGrid clientGrid = null;
            clientGrid = m_client;

            if(clientGrid.DeleteRow(pGetPropertyKey(property), pCreateRow(index, property, lRow), lRow)) {
                property = null;
                property.getGrid().cABMCSGrid.getRows().Remove(lRow);
                bCancel = false;
                m_client.messageEx(Dialogs.Message.MSG_GRID_ROW_DELETED, property.Key);


                    Object grid = null;
                    grid = getView().getGrid(property.getIndex());
                    if(grid.getRows().count() <= 1) {
                        grid.getRows().count() = 2;
                    }
                }
                else {
                    bCancel = true;
                }
            }
        }

        var gridAfterDeleteRow = function(index, lRow) {
            property = null;
            property = getProperty(Dialogs.PropertyType.grid, index, 0);

            pRefreshRowsIndex(property, lRow);


                Object grid = null;
                grid = getView().getGrid(index);
                if(grid.getRows().count() < 1) {
                    grid.getRows.add();
                }
            }
        }

        var pRefreshRowsIndex = function(property, lRow) { // TODO: Use of ByRef founded Private Sub pRefreshRowsIndex(ByRef property As cIABMProperty, ByVal lRow As Long)
            try {

                for(lRow = lRow; lRow <= property.getGrid().cABMCSGrid.getRows().count(); lRow++) {
                    showCellValue(property, lRow, 1);
                }

                cGridAdvanced grid = null;
                property = null;

                grid = property.getControl();
                if(lRow <= grid.getRows().count()) {
                    grid.Cell(lRow, 1).getText() === lRow;
                }

            } catch (Exception ex) {
            }
        }

        var pSetRowBackground = function(index, property, lRow, lCol) { // TODO: Use of ByRef founded Private Sub pSetRowBackground(ByVal Index As Long, ByRef property As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long)
            try {

                cGridAdvanced grid = null;
                grid = getView().getGrid(index);

                if(property.getGrid().getColumns(lCol).getType() === Dialogs.PropertyType.grid) {
                    grid.SelectRow(lRow);
                }
                else {
                    grid.UnSelectRow;
                }
            } catch (Exception ex) {
            }
        }

        var gridSelectionChange = function(index, lRow, lCol, csEGridSelectChangeType what) {

            property = null;
            property = getProperty(Dialogs.PropertyType.grid, index, 0);

            if(property !== null) {
                property.SelectedIndex = lRow;

                if(what === Dialogs.GridSelectChangeType.GRID_SELECTION_CHANGE) {

                    pSetRowBackground(index, property, lRow, lCol);

                }
                else if(what === Dialogs.GridSelectChangeType.GRID_ROW_CHANGE) {

                    if(m_client === null) { return; }
                    m_client.messageEx(Dialogs.Message.MSG_GRID_ROW_CHANGE, property);
                }
            }
        }

        var gridNewRow = function(index, rowIndex) {
            if(m_clientManageGrid) {

                property = null;
                property = getProperty(Dialogs.PropertyType.grid, index, 0);

                if(property !== null) {

                    cIABMClientGrid clientGrid = null;
                    clientGrid = m_client;

                    clientGrid.NewRow(pGetPropertyKey(property), rowIndex);

                    setDefaults(property, rowIndex);
                }
            }
        }

        var setDefaults = function(property, rowIndex) { // TODO: Use of ByRef founded Private Sub setDefaults(ByRef property As cABMProperty, ByVal rowIndex As Long)
            Object grid = null;
            property = null;
            cIABMGridRow iRow = null;
            cIABMGridColumn col = null;
            var colIndex = 0;

            property = property;
            iRow = pCreateRow(property.getIndex(), property, rowIndex);

            property = property;
            iRow.get(1).setValue(property.Grid.cABMCSGrid.getRows().count() + 1;

            for(var _i = 0; _i < property.Grid.cABMDocProperties.getColumns().count(); _i++) {
                Col = property.Grid.Columns.get(_i);
                colIndex = colIndex + 1;
                if(!col.DefaultValue === null) {
                    // * TODO:** can't found type for with block
                    // * With iRow.get(colIndex)
                    __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = iRow.get(colIndex);
                        w___TYPE_NOT_FOUND.Id = col.DefaultValue.cABMCSGrid.getId();
                        w___TYPE_NOT_FOUND.setValue(col.DefaultValue.getValue();
                    // {end with: w___TYPE_NOT_FOUND}
                }
            }

            if(iRow === null) { return; }

            grid = getView().getGrid(property.getIndex());
            m_gridManager.loadFromRow(grid, iRow, rowIndex, property.Grid.cABMDocProperties.getColumns());
        }

        var gridColumnAfterUpdate = function(index, lRow, lCol, iKeyAscii, newValue, newValueID) {
            try {

                if(m_clientManageGrid) {

                    property = null;
                    property = null;

                    property = getProperty(Dialogs.PropertyType.grid, index, 0);

                    if(property !== null) {

                        cIABMClientGrid clientGrid = null;
                        String keyProp = "";

                        keyProp = pGetPropertyKey(property);

                        clientGrid = m_client;

                        // If the row not exists we have to create it because the client need it to hold
                        // calculated data
                        pCreateRowIfNotExists(property, index, lRow);

                        pSetColumnValueInProperty(property, index, lRow, lCol, newValue, newValueID);

                        // Multi
                        // Si no se generaron filas virtuales con esta llamada
                        // actualizo los valores en la grilla
                        //
                        if(!pProcessVirtualRow(property, index, lRow, lCol, keyProp, clientGrid)) {

                            // Let client one chance to calculate columns
                            clientGrid.ColumnAfterUpdate(keyProp, lRow, lCol);

                            pSetRowValueInGrid(index, property, lRow, property.getGrid().cABMCSGrid.getRows(lRow));

                        }

                        if(pIsEditColumn(property, lCol)) {

                            setChanged(true);

                        }
                    }
                }

                return;
            }
            catch(e) {
              Cairo.manageError(
                "Edit",
                "An error has occurred after editing in a grid.",
                e.message);
            }
        }

        var pIsEditColumn = function(property, lCol) {
            cABMGridColumn oCol = null;
            oCol = property.getGrid().getColumns(lCol);
            return oCol.getIsEditColumn();
        }

        var pProcessVirtualRow = function(property, var index, lRow, lCol, keyProp, clientGrid) { // TODO: Use of ByRef founded Private Function pProcessVirtualRow(ByRef property As cABMProperty, ByVal Index As Integer, ByVal lRow As Long, ByVal lCol As Long, ByVal KeyProp As String, ByRef ClientGrid As cIABMClientGrid) As Boolean
            _rtn = false;

            // Manejo de Filas Virtuales
            //
            var iAddRows = 0;
            var i = 0;
            var q = 0;
            cVirtualRowInfo vrInfo = null;
            vrInfo = new cVirtualRowInfo();

            if(pAddVirtualRows(pGetPropertyKey(property), lRow, lCol, iAddRows, vrInfo)) {

                _rtn = true;

                property = null;

                var n = 0;
                n = property.getGrid().cABMCSGrid.getRows().count();

                property.getControl().getRows().count() = n + iAddRows;

                iAddRows = n + iAddRows;

                var lColAmount = 0;
                lColAmount = pGetColIndexFromKey(property, vrInfo.getLColAmount());

                for(i = n; i <= iAddRows; i++) {
                    q = q + 1;
                    gridNewRow(index, i);
                    pCreateRowIfNotExists(property, index, i);

                    if(i < iAddRows) {
                        pSetColumnValueInProperty(property, index, i, lCol, vrInfo.getNewValue(q), Cairo.Util.val(vrInfo.getNewId(q)));

                        clientGrid.ColumnAfterEdit(keyProp, i, lCol, vrInfo.getNewValue(q), Cairo.Util.val(vrInfo.getNewId(q)));

                        // Let client one chance to calculate columns
                        clientGrid.ColumnAfterUpdate(keyProp, i, lCol);

                        if(lColAmount > 0) {
                            pSetColumnValueInProperty(property, index, i, lColAmount, vrInfo.getNewAmount(q), 0);

                            clientGrid.ColumnAfterEdit(keyProp, i, lColAmount, vrInfo.getNewAmount(q), 0);

                            // Let client one chance to calculate columns
                            clientGrid.ColumnAfterUpdate(keyProp, i, lColAmount);
                        }
                    }

                    pSetRowValueInGrid(index, property, i, property.getGrid().cABMCSGrid.getRows(i));
                }

            }

            return _rtn;
        }

        // Multi
        var pAddVirtualRows = function(String key, lRow, lCol, var iAddRows, cVirtualRowInfo vrInfo) { // TODO: Use of ByRef founded Private Function pAddVirtualRows(ByVal Key As String, ByVal lRow As Long, ByVal lCol As Long, ByRef iAddRows As Long, ByRef vrInfo As cVirtualRowInfo) As Boolean
            _rtn = false;
            if(m_client === null) { return _rtn; }

            vrInfo.setKey(key);
            vrInfo.setLRow(lRow);
            vrInfo.setLCol(lCol);

            if(m_client.messageEx(Dialogs.Message.MSG_GRID_VIRTUAL_ROW, vrInfo)) {

                if(vrInfo.getBAddRows()) {

                    iAddRows = vrInfo.getIAddRows();
                    _rtn = true;

                }
            }

            return _rtn;
        }

        var gridColumnBeforeEdit = function(index, lRow, lCol, iKeyAscii, bCancel) { // TODO: Use of ByRef founded Private Sub gridColumnBeforeEdit(ByVal Index As Integer, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer, ByRef bCancel As Boolean)
            try {

                if(!m_clientManageGrid) { return; }

                bCancel = false;

                property = null;
                property = null;
                cGridAdvanced oGrid = null;
                cIABMGridColumn column = null;
                cGridColumn c = null;

                property = getProperty(Dialogs.PropertyType.grid, index, 0);

                if(property === null) { return; }
                if(lRow > property.getGrid().cABMCSGrid.getRows().count()) { return; }

                oGrid = getView().getGrid(property.getIndex());
                column = property.getGrid().getColumns(lCol);
                c = oGrid.Columns(lCol);

                CSInterfacesABM.cIABMGridCellValue w_item = property.getGrid().cABMCSGrid.getRows().get(lRow).get(lRow).get(lCol);
                    if(w_item.Format === null) {

                        // With c;

                            c.EditType = column.PropertyType;
                            c.EditSubType = column.SubType;
                            c.Table = column.Table;
                            c.AllowEdit = column.getEnabled();
                            c.Enabled = column.getEnabled();
                            bCancel = !column.getEnabled();
                            c.HelpFilter = column.HelpFilter;
                            c.HelpSPFilter = column.HelpSPFilter;
                            c.HelpSPInfoFilter = column.HelpSPInfoFilter;

                            c.Size = column.Size;
                            c.Format = column.Format;

                            if(column.getType() === Dialogs.PropertyType.list) {
                                c.List = column.List;
                            }
                            else {
                                c.List = null;
                            }

                            if(column.getSubType() === Dialogs.PropertySubType.percentage) {
                                if(column.Format === "") {
                                    c.Format = "0.00 %";
                                }
                            }
                        // {end with: c}

                    }
                    else {

                        c.EditType = w_item.Format.PropertyType;
                        c.EditSubType = w_item.Format.SubType;
                        c.Table = w_item.Format.Table;
                        c.AllowEdit = w_item.Format.getEnabled();
                        c.Enabled = w_item.Format.getEnabled();
                        bCancel = !w_item.Format.getEnabled();
                        c.HelpFilter = w_item.Format.HelpFilter;
                        c.Size = w_item.Format.Size;
                        c.Format = w_item.Format.Format;

                        if(w_item.Format.getType() === Dialogs.PropertyType.list) {
                            c.List = w_item.Format.List;
                        }
                        else {
                            c.List = null;
                        }

                        if(w_item.Format.getSubType() === Dialogs.PropertySubType.percentage) {
                            if(w_item.Format.Format === "") {
                                c.Format = "0.00 %";
                            }
                        }
                    }
                // {end with: w_item}

                return;
            }
            catch(e) {
              Cairo.manageError(
                "Edit",
                "An error has occurred before editing in a grid.",
                e.message);
            }
        }

        var gridColumnEdit = function(after, var index, lRow, lCol, iKeyAscii, newValue, newValueID, bCancel) {
            try {

                if(m_clientManageGrid) {

                    property = null;
                    property = null;
                    var keyProp = 0;
                    cIABMClientGrid clientGrid = null;

                    property = getProperty(Dialogs.PropertyType.grid, index, 0);
                    bCancel = false;

                    if(property !== null) {

                        keyProp = pGetPropertyKey(property);
                        clientGrid = m_client;

                        if(after) {

                            // If the row not exists we have to create it because the client need it to hold
                            // calculated data
                            pCreateRowIfNotExists(property, index, lRow);

                            if(!clientGrid.ColumnAfterEdit(keyProp, lRow, lCol, newValue, newValueID)) {
                                bCancel = true;
                            }

                        }
                        else {

                            if(m_createRowInBeforeEdit) {
                                // If the row not exists we have to create it because the client need it to hold
                                // calculated data
                                pCreateRowIfNotExists(property, index, lRow);
                            }

                            if(!clientGrid.ColumnBeforeEdit(keyProp, lRow, lCol, iKeyAscii)) {
                                bCancel = true;
                            }
                        }

                    }
                    else {
                        bCancel = true;
                    }
                }
                else {
                    bCancel = true;
                }

                return;
            }
            catch(e) {
              Cairo.manageError(
                "Edit",
                "An error has occurred when editing in a grid.",
                e.message);
            }
        }

        var gridColumnButtonClick = function(index, lRow, lCol, iKeyAscii, bCancel) {
            try {

                if(m_clientManageGrid) {

                    property = null;
                    property = null;
                    var keyProp = 0;
                    cIABMClientGrid clientGrid = null;

                    property = getProperty(Dialogs.PropertyType.grid, index, 0);
                    bCancel = false;

                    if(property !== null) {

                        keyProp = pGetPropertyKey(property);
                        clientGrid = m_client;


                        // If the row not exists we have to create it because the client need it to hold
                        // calculated data
                        pCreateRowIfNotExists(property, index, lRow);

                        if(!clientGrid.ColumnButtonClick(keyProp, lRow, lCol, iKeyAscii)) {
                            bCancel = true;
                        }

                        // Si se trata de una columna de tipo TextButtonEx
                        //
                        // * TODO:** can't found type for with block
                        // * With property.getGrid()
                        __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = property.getGrid();
                            if(w___TYPE_NOT_FOUND.Columns(lCol).getSubType() === Dialogs.PropertyType.textButtonEx) {
                                String rtn = "";
                                // * TODO:** can't found type for with block
                                // * With .cABMCSGrid.getRows().get(lRow).get(lCol)
                                __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Rows.get(lRow).get(lCol);
                                    rtn = w___TYPE_NOT_FOUND.getValue();
                                    if(GetInputEx(rtn)) {
                                        w___TYPE_NOT_FOUND.setValue(rtn;
                                    }
                                // {end with: w___TYPE_NOT_FOUND}
                            }
                        // {end with: w___TYPE_NOT_FOUND}

                        //
                        // bCancel es para informarle a la grilla que el button click se manejo por la clase
                        // ya sea true o false el codigo que sigue siempre se ejecuta
                        //
                        pSetRowValueInGrid(index, property, lRow, property.getGrid().cABMCSGrid.getRows(lRow));

                        setChanged(true);

                    }
                    else {
                        bCancel = true;
                    }
                }
                else {
                    bCancel = true;
                }

                return;
            }
            catch(e) {
              Cairo.manageError(
                "Edit",
                "An error has occurred when editing in a grid.",
                e.message);
            }
        }

        var pCreateRowIfNotExists = function(property, var index, lRow) { // TODO: Use of ByRef founded Private Sub pCreateRowIfNotExists(ByRef property As cIABMProperty, ByVal Index As Integer, ByVal lRow As Long)
            cIABMGridRow row = null;

            var w_rows = property.getGrid().cABMCSGrid.getRows();
                row = w_rows.get(lRow);
                if(row === null) {
                    row = pCreateRow(index, property, lRow);
                    w_rows.Add(row);
                }
            // {end with: w_rows}
        }

        var pGetColIndexFromKey = function(property, var lKey) {
            var _rtn = 0;
            if(lKey === -1) {
                _rtn = -1;
            }
            else {
                cIABMGridRow row = null;
                row = property.getGrid().cABMCSGrid.getRows().get(1);
                if(row === null) {
                    return _rtn;
                }
                cIABMGridCellValue iCell = null;
                var i = 0;
                for(i = 1; i <= row.count(); i++) {
                    iCell = row.get(i);
                    if(iCell.Key === lKey) {
                        _rtn = i;
                        return _rtn;
                    }
                }
            }
            return _rtn;
        }

        var pSetColumnValueInProperty = function(property, var index, lRow, lCol, newValue, newValueID) { // TODO: Use of ByRef founded Private Sub pSetColumnValueInProperty(ByRef property As cIABMProperty, ByVal Index As Integer, ByVal lRow As Long, ByVal lCol As Long, ByVal NewValue As Variant, ByVal NewValueID As Long)
            cIABMGridRow row = null;
            cIABMGridCellValue iCell = null;
            cABMGridRowValue oCell = null;
            cGridAdvanced grd = null;

            var w_rows = property.getGrid().cABMCSGrid.getRows();

                row = w_rows.get(lRow);
                if(row === null) {
                    row = pCreateRow(index, property, lRow);
                    w_rows.Add(row);
                }

                iCell = row.get(lCol);
                oCell = iCell;

                // With iCell;
                    iCell.Id = newValueID;
                    iCell.setValue(newValue;
                // {end with: iCell}

                // Si esto no funca mala leche :P
                //


                    property = property;
                    grd = property.getControl();
                    oCell.setSelectIntValue(grd.Cell(lRow, lCol).getTag());
                // {end with: w_rows}
            }
        }

        var gridValidateRow = function(index, rowIndex, bCancel, bAddRow, bIsEmpty) { // TODO: Use of ByRef founded Private Function gridValidateRow(ByVal Index As Integer, ByVal rowIndex As Long, ByRef bCancel As Boolean, ByVal bAddRow As Boolean, ByRef bIsEmpty As Boolean) As Boolean
            rtn = false;

            if(m_clientManageGrid) {

                property = null;
                property = null;

                property = getProperty(Dialogs.PropertyType.grid, index, 0);
                bCancel = false;

                if(property !== null) {

                    cIABMClientGrid clientGrid = null;
                    cIABMGridRow iRow = null;
                    cABMGridRow oRow = null;
                    String keyProp = "";

                    clientGrid = m_client;
                    keyProp = pGetPropertyKey(property);

                    iRow = pCreateRow(index, property, rowIndex);

                    if(clientGrid.IsEmptyRow(keyProp, iRow, rowIndex)) {
                        Cairo.Util.sendKeys("{TAB}");
                        bCancel = true;
                        bIsEmpty = true;

                        // La fila esta vacia asi que es valida
                        rtn = true;

                        // Let Client one chance to validate and modify row values
                    }
                    else if(!clientGrid.ValidateRow(keyProp, iRow, rowIndex)) {
                        bCancel = true;

                        // El cliente no valido la fila
                        rtn = false;
                    }
                    else {

                        // La fila es valida
                        rtn = true;

                        // Put Client's values to Grid
                        pSetRowValueInGrid(index, property, rowIndex, iRow);

                        if(bAddRow) {

                            // Keep updated the rows collection
                            cABMGridRows oRows = null;

                            oRows = property.getGrid().cABMCSGrid.getRows();

                            // With oRows;

                                orows.remove(rowIndex, false);

                                oRow = iRow;
                                oRow.setIndex(rowIndex);

                                oRows.add(iRow);

                                if(!iRow.get(c_keyRowItem) === null) {
                                    iRow.get(c_keyRowItem).setValue(rowIndex;
                                }

                            // {end with: oRows}

                            bCancel = !property.getGrid()Add;
                        }
                        else {
                            bCancel = true;
                        }
                    }

                }
                else {
                    bCancel = true;
                }
            }
            else {
                bCancel = true;
            }

            return rtn;
        }

        var selectChange = function(index) {
            propertyHasChanged(Dialogs.PropertyType.select, index, getView().getSelects().get(index));
        }

        var maskEditChange = function(index) {
            propertyHasChanged(Dialogs.PropertyType.numeric, index, getView().getMaskEdits().get(index));
        }

        var dateChange = function(index) {
            cMaskEdit c = null;

            c = getView().getDatePickers().get(index);

            if(c.getType() === csMkTime) {
                propertyHasChanged(Dialogs.PropertyType.time, index, c);
            }
            else {
                propertyHasChanged(Dialogs.PropertyType.date, index, c);
            }

        }

        var optionButtonClick = function(index) {
            propertyHasChanged(Dialogs.PropertyType.option, index, getView().getOptionButtons().get(index));
        }

        var textButtonClick = function(index, cancel) {
            property = null;

            property = getProperty(Dialogs.PropertyType.text, index, 0);

            if(property === null) { return; }

            m_client.messageEx(Dialogs.Message.MSG_BUTTON_TEXT_CLICK, property);

            if(property.getSubType() === Dialogs.PropertyType.textButtonEx) {
                String rtn = "";
                // * TODO:** can't found type for with block
                // * With getView().getTextInputs().get(index)
                __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = getView().getTextInputs().get(index);
                    rtn = w___TYPE_NOT_FOUND.text;
                    if(GetInputEx(rtn)) {
                        w___TYPE_NOT_FOUND.setText(rtn;
                    }
                // {end with: w___TYPE_NOT_FOUND}
            }

        }

        var toolBarButtonClick = function(MSComctlLib.Button button) {
            propertyHasChanged(Dialogs.PropertyType.toolbar, 0, button);
        }

        var textChange = function(index) {
            propertyHasChanged(Dialogs.PropertyType.text, index, getView().getTextInputs().get(index));
        }

        var textAreaChange = function(index) {
            propertyHasChanged(Dialogs.PropertyType.text, index, getView().getTextAreas().get(index), false, Dialogs.PropertySubType.memo);
        }

        var textPasswordChange = function(index) {
            propertyHasChanged(Dialogs.PropertyType.password, index, getView().getPasswordInputs().get(index));
        }

        var pGetPropertyKey = function(property) {
            property = null;
            return property.Key;
        }

        var pGetKeyFromRowValue = function(cIABMGridRows rows, rowIndex, var iCol) {

            if(rows.count() < rowIndex) { return ""; }
            if(rows.get(rowIndex).count() < iCol) { return ""; }

            cABMGridRowValue rowValue = null;
            rowValue = rows.get(rowIndex).get(iCol);
            if(rowValue === null) { return ""; }
            return rowValue.getStrKey();
        }

        var pCreateRow = function(index, property, rowIndex) {
            cIABMGridRow row = null;
            cIABMGridColumn col = null;
            cIABMGridCellValue cell = null;
            cABMGridRowValue oCell = null;
            var colIndex = 0;
            String sKey = "";

            row = new cABMGridRow();

            for(var _i = 0; _i < property.getGrid().getColumns().count(); _i++) {
                Col = property.getGrid().Columns.get(_i);
                colIndex = colIndex + 1;
                if(colIndex === 1) {
                    cell = row.Add(null, c_keyRowItem);
                }
                else {
                    sKey = pGetKeyFromRowValue(property.getGrid().cABMCSGrid.getRows(), rowIndex, colIndex);
                    if(LenB(sKey)) {
                        cell = row.Add(null, sKey);
                    }
                    else {
                        cell = row.Add(null);
                    }
                }

                // With getView().getGrid(index).cell(rowIndex, colIndex);
                    cell.Id = getView().GR.ItemData;
                    oCell = cell;
                    oCell.setSelectIntValue(getView().GR.getTag());

                    if(col.getType() === Dialogs.PropertyType.date) {
                        cell.setValue(mUtil.getDateValueForGridClient(getView().GR.text);

                    }
                    else if(col.getSubType() === Dialogs.PropertySubType.percentage) {
                        cell.setValue(Cairo.Util.val(getView().GR.text) * 100;

                    }
                    else {
                        cell.setValue(getView().GR.text;
                    }

                    cell.Key = col.Key;
                // {end with: getView().GR}
            }

            return row;
        }

        var pSetRowValueInGrid = function(index, property, rowIndex, cIABMGridRow row) { // TODO: Use of ByRef founded Private Sub pSetRowValueInGrid(ByVal Index As Integer, ByVal property As cIABMProperty, ByVal rowIndex As Long, ByRef Row As cIABMGridRow)

            cIABMGridColumn col = null;
            cIABMGridCellValue cell = null;
            var colIndex = 0;
            cGridAdvanced oGrid = null;
            cABMGridRow oRow = null;

            cABMGridCellFormat oFormat = null;
            cIABMGridCellFormat iFormat = null;
            StdFont oFont = null;

            oGrid = getView().getGrid(index);

            oRow = row;
            oGrid.RowBackColor(rowIndex) = oRow.getBackColor();
            oGrid.RowForeColor(rowIndex) = oRow.getForeColor();

            for(var _i = 0; _i < property.getGrid().getColumns().count(); _i++) {
                Col = property.getGrid().Columns.get(_i);
                colIndex = colIndex + 1;
                cell = row.get(colIndex);

                // * TODO:** can't found type for with block
                // * With oGrid.Cell(rowIndex, colIndex)
                __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = oGrid.Cell(rowIndex, colIndex);
                    oGrid.CellItemdata(rowIndex, colIndex) === cell.getId();

                    if(col.getType() === Dialogs.PropertyType.date) {
                        w___TYPE_NOT_FOUND.setText(Cairo.Util.getDateValueForGrid(cell.getValue());

                    }
                    else if(col.getSubType() === Dialogs.PropertySubType.percentage) {
                        w___TYPE_NOT_FOUND.setText(Cairo.Util.val(cell.getValue()) / 100;

                    }
                    else {
                        w___TYPE_NOT_FOUND.setText(cell.getValue();
                    }

                    // Formato de cada celda
                    //
                    iFormat = cell.Format;
                    if(iFormat !== null) {

                        oFormat = cell.Format;

                        if(!iFormat.Enabled || !col.Enabled) {
                            w___TYPE_NOT_FOUND.BackColor = vbButtonFace;
                            oFormat.setBold(true);
                        }
                        else {
                            w___TYPE_NOT_FOUND.BackColor = iFormat.BackColor;
                        }

                        w___TYPE_NOT_FOUND.ForeColor = iFormat.Color;

                        w___TYPE_NOT_FOUND.textAlign = oFormat.getAlign();
                        oFont = new StdFont();
                        // With oFont;
                            oFont.Name = oFormat.getFontName();
                            oFont.Italic = oFormat.getItalic();
                            oFont.Bold = oFormat.getBold();
                            oFont.Size = oFormat.getFontSize();
                            oFont.Strikethrough = oFormat.getStrike();
                            oFont.Underline = oFormat.getUnderline();
                        // {end with: oFont}
                        w___TYPE_NOT_FOUND.Font = oFont;

                    }
                    else {

                        if(!col.Enabled && !m_noChangeBackColorCell) {
                            w___TYPE_NOT_FOUND.BackColor = vbButtonFace;
                        }

                    }

                // {end with: w___TYPE_NOT_FOUND}
            }

        }

        var showView = function(var tabIndex, noGrids, bSetFocus) {
            property = null;
            cIABMProperties iProperties = null;
            property = null;
            var tabs = 0;
            var count = 0;

            iProperties = m_properties;
            m_labelLeft = C_OFFSET_H;

            for(var _i = 0; _i < iProperties.count(); _i++) {
                property = iProperties.get(_i);
                if(pGetTabIndex(property) > tabs) { tabs = pGetTabIndex(property); }
            }

            showTabs(tabs);

            m_showingForm = true;
            m_tabIndex = 0;

            for(var _i = 0; _i < iProperties.count(); _i++) {
                property = iProperties.get(_i);
                loadControlEx(property, noGrids);
            }

            m_showingForm = false;

            var view = getView();

                count = view.getControls().count();

                if(!m_isDocument) {
                    if(m_isWizard) {
                        view.getNextButton().tabIndex = count;
                        view.getCancelButton().tabIndex = count;
                        view.getBackButton().tabIndex = count;
                    }
                    else {
                        view.getSaveButton().tabIndex = count;
                        view.getCancelButton().tabIndex = count;
                        view.getCloseButton().tabIndex = count;
                    }
                }

                if(tabIndex !== -1) {
                    if(m_isDocument) {
                        docTabClickEx(Cairo.Constants.DocumentSections.items, tabIndex);
                        docTabClickEx(Cairo.Constants.DocumentSections.footer, tabIndex);
                        docTabClickEx(Cairo.Constants.DocumentSections.header, tabIndex);
                        view.getTabs().get(tabIndex + m_firstTab).TabSelected === true;
                    }
                    else {
                        tabClick(tabIndex);
                        view.getTabs().get(tabIndex).TabSelected = true;
                    }
                }

                if(bSetFocus) { view.SetFocusFirstControl; }
            // {end with: view}

            return true;
        }

        var loadControl = function(property) { // TODO: Use of ByRef founded Private Function LoadControl(ByRef property As cABMProperty) As Boolean

            Control f = null;
            property = null;

            cIABMProperties iProperties = null;
            cABMGrid oGrid = null;

            var nTabIndex = 0;
            nTabIndex = pGetTabIndex(property);

            var view = getView();
                switch(property.getType()) {

                    case Dialogs.PropertyType.List:
                        if(m_loadList) {
                            Load(view.getCombos().get(view.CB.count() + 1));
                        }
                        else {
                            m_loadList = true;
                        }

                        c = view.getCombos().get(view.CB.count());
                        pSetFont(c, property);

                        break;
                    case Dialogs.PropertyType.select:
                        if(m_loadHelp) {
                            Load(view.getSelects().get(view.HL.count() + 1));
                        }
                        else {
                            m_loadHelp = true;
                        }

                        c = view.getSelects().get(view.HL.count());
                        c.setHelpType = property.getHelpType();
                        c.setForAbm = property.IsForAbm;
                        c.setTable = property.getTable();
                        c.setButtonStyle = cHelpButtonSingle;
                        c.setSPFilter = property.HelpSPFilter;
                        c.setSPInfoFilter = property.HelpSPInfoFilter;
                        c.reset();
                        pSetFont(c, property);

                        break;
                    case Dialogs.PropertyType.numeric:
                        if(m_loadNumeric) {
                            Load(view.getMaskEdits().get(view.ME.count() + 1));
                        }
                        else {
                            m_loadNumeric = true;
                        }

                        c = view.getMaskEdits().get(view.ME.count());
                        c.csType = property.SubType;
                        if(property.getSubType() === 0) {
                            VBA.ex.Raise(csErrores.CSERRORABMLOADCONTROLSUBTYPENOTDEFINED, "CSABMInterface.LoadControl", "Error al cargar controles en ABM Generico. No se ha indicado un subnType para la propiedad numerica: "+ property.getName());
                        }

                        if(m_isFooter) {
                            c.Width = 1100;
                            c.BackColor = view.getFooterBackground().getBackColor();
                            c.EnabledNoChngBkColor = true;
                        }
                        pSetFont(c, property);
                        c.FormatNumber = property.Format;

                        break;
                    case Dialogs.PropertyType.date:
                    case Dialogs.PropertyType.time:
                        if(m_loadDate) {
                            Load(view.getDatePickers().get(view.getDatePickers().count() + 1));
                        }
                        else {
                            m_loadDate = true;
                        }

                        c = view.getDatePickers().get(view.getDatePickers().count());
                        if(property.getType() === Dialogs.PropertyType.date) {
                            c.csType = csMkDate;
                        //'Dialogs.PropertyType.time
                        }
                        else {
                            c.csType = csMkTime;
                        }
                        pSetFont(c, property);

                        break;
                    case Dialogs.PropertyType.option:
                        f = view.FR(property.OptionGroup);

                        // With f;
                            if(!f.getTag() !== "") {
                                f.Top = m_nextTop[nTabIndex];
                                f.Left = m_left[nTabIndex];
                                f.setVisible(true);
                                f.setTag = property.getTabIndex();
                            }
                        // {end with: f}

                        Load(view.getOptionButtons().get(view.OP.count() + 1));
                        c = view.getOptionButtons().get(view.OP.count());


                        break;
                    case Dialogs.PropertyType.label:
                        if(m_loadLabel) {
                            Load(view.getCtlLabels().get(view.LB2.count() + 1));
                        }
                        else {
                            m_loadLabel = true;
                        }

                        c = view.getCtlLabels().get(view.LB2.count());
                        pSetFont(c, property);
                        if(property.getBackColor() !== -1) {
                            c.BackStyle = 1;
                        }
                        else {
                            c.BackStyle = 0;
                        }
                        c.Alignment = property.textAlign;

                        break;
                    case Dialogs.PropertyType.title:
                        if(m_loadTitle) {
                            Load(view.getTitleLabel2().get(view.getTitleLabel2().count() + 1));
                        }
                        else {
                            m_loadTitle = true;
                        }

                        c = view.getTitleLabel2().get(view.getTitleLabel2().count());
                        pSetFont(c, property);

                        break;
                    case Dialogs.PropertyType.progressBar:
                        if(m_loadProgressBar) {
                            Load(view.getProgressBars().get(view.prgBar.count() + 1));
                        }
                        else {
                            m_loadProgressBar = true;
                        }

                        c = view.getProgressBars().get(view.prgBar.count());

                        break;
                    case Dialogs.PropertyType.description:
                        if(m_loaddescription) {
                            Load(view.getDescription(view.LBDescription.count() + 1));
                        }
                        else {
                            m_loaddescription = true;
                        }

                        c = view.getDescription(view.LBDescription.count());
                        pSetFont(c, property);

                        break;
                    case Dialogs.PropertyType.image:
                        if(m_loadImage) {
                            Load(view.getImages().get(view.Img.count() + 1));
                        }
                        else {
                            m_loadImage = true;
                        }

                        c = view.getImages().get(view.Img.count());

                        break;
                    case Dialogs.PropertyType.text:

                        if(property.getSubType() === Dialogs.PropertyType.memo) {
                            if(m_loadTextM) {
                                Load(view.getTextAreas().get(view.TXM.count() + 1));
                            }
                            else {
                                m_loadTextM = true;
                            }

                            c = view.getTextAreas().get(view.TXM.count());

                        }
                        else {
                            if(m_loadText) {
                                Load(view.getTextInputs().get(view.TX.count() + 1));
                                view.getTextInputs().get(view.TX.count()).setWidth(m_textOrigWidth);
                            }
                            else {
                                m_loadText = true;
                            }

                            c = view.getTextInputs().get(view.TX.count());
                            if(c.setMask !== undefined) {
                                c.ButtonStyle = (property.getSubType() === Dialogs.PropertyType.textButton  || property.getSubType() === Dialogs.PropertyType.textButtonEx) ? cButtonSingle : cButtonNone);
                                c.setMask(property.getTextMask());
                                c.csType = csMkText;
                            }
                            c.PasswordChar = "";
                        }

                        c.MaxLength = property.Size;
                        c.Alignment = property.textAlign;

                        // Para soportar cajas multinline
                        // que permiten desplazarce con las flechas
                        // entre renglones, pero no aceptan edicion
                        //
                        c.InputDisabled = property.getInputDisabled();

                        pSetFont(c, property);

                        break;
                    case Dialogs.PropertyType.file:
                        if(m_loadText) {
                            Load(view.getTextInputs().get(view.TX.count() + 1));
                        }
                        else {
                            m_loadText = true;
                        }

                        c = view.getTextInputs().get(view.TX.count());
                        // With c;
                            c.MaxLength = property.Size;
                            c.csType = CSMaskEdit2.csMkFile;
                            c.FileFilter = property.HelpFilter;
                            c.PasswordChar = "";
                        // {end with: c}
                        pSetFont(c, property);

                        break;
                    case Dialogs.PropertyType.folder:
                        if(m_loadText) {
                            Load(view.getTextInputs().get(view.TX.count() + 1));
                        }
                        else {
                            m_loadText = true;
                        }

                        c = view.getTextInputs().get(view.TX.count());
                        // With c;
                            c.MaxLength = property.Size;
                            c.csType = CSMaskEdit2.csMkFolder;
                            c.PasswordChar = "";
                        // {end with: c}
                        pSetFont(c, property);

                        break;
                    case Dialogs.PropertyType.password:
                        if(m_loadPassword) {
                            Load(view.getPasswordInputs().get(view.txPassword.count() + 1));
                        }
                        else {
                            m_loadPassword = true;
                        }

                        c = view.getPasswordInputs().get(view.txPassword.count());
                        c.ButtonStyle = cButtonNone;
                        c.PasswordChar = "*";
                        pSetFont(c, property);

                        break;
                    case Dialogs.PropertyType.check:
                        if(m_loadCheck) {
                            Load(view.checkBoxes().get(view.CHK.count() + 1));
                        }
                        else {
                            m_loadCheck = true;
                        }

                        c = view.checkBoxes().get(view.CHK.count());
                        c.setText("  ";
                        c.Width = 400;

                        break;
                    case Dialogs.PropertyType.grid:
                        if(m_loadGrid) {
                            Load(view.getGrid(view.GR.count() + 1));
                        }
                        else {
                            m_loadGrid = true;
                        }

                        c = view.getGrid(view.GR.count());
                        c.Editable = property.getGrid()Edit;
                        m_gridManager.setPropertys(c);

                        oGrid = property.getGrid();
                        c.DontSelectInGotFocus = oGrid.getDontSelectInGotFocus();

                        // Formatos adicionales a la interfaz cIABMGrid
                        c.RowMode = oGrid.getRowSelect();

                        break;
                    case Dialogs.PropertyType.button:
                        if(m_loadButton) {
                            Load(view.getButtons().get(view.CMD.count() + 1));
                        }
                        else {
                            m_loadButton = true;
                        }

                        c = view.getButtons().get(view.CMD.count());
                        pSetFont(c, property);

                        break;
                    case Dialogs.PropertyType.ToolBar:
                        Frame frameToolBar = null;
                        c = pLoadToolBar(property, frameToolBar);

                        // With frameToolBar;
                            frameToolBar.BorderStyle = 0;
                        // {end with: frameToolBar}

                        // With c;
                            c.Top = 0;
                            c.Left = 0;
                            c.Appearance = ccFlat;
                        // {end with: c}

                        property.setToolbar(c);
                        break;
                }

                if(property.getType() !== Dialogs.PropertyType.ToolBar) {
                    property.setIndex(c.Index);
                }
            // {end with: view}

            pSetTabIndex(c);
            m_tabIndex = m_tabIndex + 1;

            property.setControl(c);

            // Aplico formateos personalizados
            if(property.Height > 0) {
                c.Height = property.Height;
            }

            if(property.Width > 0) {
                c.Width = property.Width;
            }

            // Si se indica un top en funcion de una propiedad
            if(property.TopFromProperty !== "") {
                iProperties = m_properties;
                property = iProperties(property.TopFromProperty);
                property.Top = property.getTop();

                // Modificamos m_LastTop para poder indicar un top en funcion
                // de una propiedad. Es decir combinar TopFromProperty y TopToPrevious
                m_lastTop = property.getTop();
            }

            // Si se indico un top en funcion del control anterior
            if(property.TopToPrevious !== 0) {

                if(property.getType() === Dialogs.PropertyType.option) {
                    m_lastTop = m_lastTopOp;
                }

                // Si se indica -1 significa el mismo top que el control anterior
                if(property.TopToPrevious === -1) {
                    property.Top = m_lastTop;
                }
                else {
                    property.Top = m_lastTop + property.TopToPrevious;
                }
            }

            if(property.Top !== -1) {
                c.Top = property.Top;
            }

            // Si se indica un left en funcion de una propiedad
            if(property.LeftFromProperty !== "") {
                iProperties = m_properties;
                property = iProperties(property.LeftFromProperty);
                property.Left = property.getLeft();

                // Modificamos m_LastLeft para poder indicar un left en funcion
                // de una propiedad. Es decir combinar LeftFromProperty y LeftToPrevious
                m_lastLeft = property.getLeft();

                // Si hay left personalizado, pero no se indico un left para el label
                // le ponemos el default
                if(property.LeftLabel === 0) { property.LeftLabel = -C_OFFSET_H; }
            }

            // Si se indico un left en funcion del control anterior
            if(property.LeftToPrevious !== 0) {

                if(property.getType() === Dialogs.PropertyType.option) {
                    m_lastLeft = m_lastLeftOp;
                }

                // Si se indica -1 significa el mismo left que el control anterior
                if(property.LeftToPrevious === -1) {
                    property.Left = m_lastLeft;
                }
                else {
                    property.Left = m_lastLeft + property.LeftToPrevious;
                }
            }

            if(property.Left !== -1) {
                // Si hay left personalizado, pero no se indico un left para el label
                // le ponemos el default
                if(property.LeftLabel === 0) { property.LeftLabel = -C_OFFSET_H; }

                c.Left = property.Left;
            }

            //
            // Si el control va a quedar sobre la linea lo corro a la derecha y empiezo desde arriba otra vez
            //

            var view = getView();

                if(m_isItems) {

                    // * TODO:** can't found type for with block
                    // * With .getTabItems
                    __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = view.getTabItems;
                        if(m_nextTop[nTabIndex] + c.Height > w___TYPE_NOT_FOUND.Top + w___TYPE_NOT_FOUND.Height - 50) {
                            setNewTopAndLeft(property);
                        }
                    // {end with: w___TYPE_NOT_FOUND}

                }
                else if(m_isFooter) {

                    // * TODO:** can't found type for with block
                    // * With .shTabFooter
                    __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = view.shTabFooter;
                        if(m_nextTop[nTabIndex] + c.Height > w___TYPE_NOT_FOUND.Top + w___TYPE_NOT_FOUND.Height) {
                            setNewTopAndLeft(property);
                        }
                    // {end with: w___TYPE_NOT_FOUND}

                }
                else {
                    if(m_nextTop[nTabIndex] + c.Height + C_LINE_LIGHT + 50 > view.Line1.Y1) {
                        setNewTopAndLeft(property);
                    }
                }
            // {end with: view}

            // With c;
                if(m_isDocument) {
                    if(m_isItems) {
                        c.setTag(Cairo.Constants.DocumentSections.items+ property.getTabIndex());
                    }
                    else if(m_isFooter) {
                        c.setTag(Cairo.Constants.DocumentSections.footer+ property.getTabIndex());
                    }
                    else {
                        c.setTag(Cairo.Constants.DocumentSections.header+ property.getTabIndex());
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
                pSetBackColor(c, property);
                pSetButton(c, property);
            // {end with: c}

            // With property;
                if(property.getType() === Dialogs.PropertyType.option) {
                    var r = 0;
                    var q = 0;
                    if(property.OptionGroup - 1 > m_leftOp.length) {
                        r = m_leftOp.length;
                        G.redimPreserve(m_leftOp, property.OptionGroup);
                        var view = getView();
                            for(q = r; q <= m_leftOp.length; q++) {
                                m_leftOp[q] = view.getOptionButtons().get(0).getLeft();
                            }
                        // {end with: view}
                    }
                    if(property.OptionGroup - 1 > m_nextTopOp.length) {
                        r = m_nextTopOp.length;
                        G.redimPreserve(m_nextTopOp, property.OptionGroup);
                        var view = getView();
                            for(q = r; q <= m_nextTopOp.length; q++) {
                                m_nextTopOp[q] = view.getOptionButtons().get(0).getTop();
                            }
                        // {end with: view}
                    }

                    if(property.Left === -1) {
                        c.Left = m_leftOp[property.OptionGroup];
                    }
                    if(property.Top === -1) {
                        c.Top = m_nextTopOp[property.OptionGroup];
                    }
                    if(property.Width === 0) {
                        c.Width = 1500;
                    }
                    c.setText(property.getName();

                    // Agrando el Frame
                    if(c.Top + c.Height > f.Height) { f.Height = c.Top + c.Height + 50; }

                    if(f.Height + f.Top > getView().Line1.Y1) {
                        f.Top = m_nextTop[nTabIndex] - 100;
                        f.Left = m_left[nTabIndex];
                    }

                    if(c.Left + c.Width > f.Width) { f.Width = c.Left + c.Width + 20; }

                    if(property.TopFrame !== 0) { f.Top = property.TopFrame; }
                    if(property.LeftFrame !== 0) { f.Left = property.LeftFrame; }

                    m_nextTopOp[property.OptionGroup] = m_nextTopOp[property.OptionGroup] + C_LINE_HEIGHT;

                }
                else if(property.getType() === Dialogs.PropertyType.toolbar) {

                    // With frameToolBar;
                        frameToolBar.Width = property.Width;
                        frameToolBar.Top = property.TopFrame;
                        frameToolBar.Left = property.LeftFrame;
                        if(property.Height > 0) {
                            frameToolBar.Height = property.Height;
                        }
                        else {
                            frameToolBar.Height = c.Height;
                        }
                        frameToolBar.setTag = property.getTabIndex();
                        frameToolBar.BackColor = getView().getBackground().getBackColor();
                    // {end with: frameToolBar}

                    Toolbar tbl = null;

                    tbl = c;
                    // With tbl;
                        tbl.Appearance = cc3D;
                        tbl.BorderStyle = ccFixedSingle;
                    // {end with: tbl}

                    CSKernelClient2.fABM.setToolbar(tbl, property.Buttons);

                    property.LeftNotChange = true;
                    property.TopNotChange = true;

                }
                else if(property.getType() === Dialogs.PropertyType.label
                        || property.getType() === Dialogs.PropertyType.title
                        || property.getType() === Dialogs.PropertyType.description) {

                    if(property.Top === -1) {
                        c.Top = m_nextTop[nTabIndex];
                    }

                    if(property.Left === -1) {
                        c.Left = m_left[nTabIndex] + m_labelLeft;
                    }

                }
                else {

                    Label lB = null;

                    var view = getView();
                        Load(view.getLabels().get(view.LB.count() + 1));
                        lB = view.getLabels().get(view.LB.count());
                    // {end with: view}

                    // With lB;
                        property.setLabelIndex(lB.Index);
                        lB.setText(property.getName();
                        lB.Left = m_left[nTabIndex];
                        lB.BackStyle = 0;
                        lB.setTag = c.getTag();
                        lB.bringToFront();
                        if(property.getType() === Dialogs.PropertyType.button) {
                            lB.setVisible(false);
                        }
                    // {end with: lB}

                    // Etiquetas invisibles
                    // para Grillas, Botones e Imagenes
                    //
                    if(property.LeftLabel === -1) {
                        // With lB;
                            lB.setVisible(false);
                            //' Si una etiqueta tiene tag=-1
                            lB.setTag = "-1";
                            // no se modifica su propiedad
                            // visible en el ShowValue
                        // {end with: lB}
                    }

                    // Formateo especial para Grids
                    if(property.getType() === Dialogs.PropertyType.grid) {
                        if(property.Left === -1) {
                            c.Left = m_left[nTabIndex];
                        }

                        if(m_isItems) {
                            c.Top = m_nextTop[nTabIndex];
                            // With lB;
                                lB.setVisible(false);
                                //' Si una etiqueta tiene tag=-1
                                lB.setTag = "-1";
                                // no se modifica su propiedad
                                // visible en el ShowValue
                            // {end with: lB}
                        }
                        else {
                            if(property.Top === 0) {
                                c.Top = m_nextTop[nTabIndex] + 300;
                                // With lB;
                                    lB.Top = m_nextTop[nTabIndex];
                                    lB.Width = c.Width;
                                // {end with: lB}
                            }
                        }
                        if(property.Width === -1  || property.Width === 0) {
                            c.Width = getView().ScaleWidth - c.Left - 300;
                        }

                    }
                    else if(m_isDocument && property.getTable() === Cairo.Tables.DOCUMENTO) {

                        // With c;
                            c.Left = 3600;
                            c.Top = 80;
                            c.Width = 3500;
                            c.FontSize = 11;
                            c.FontBold = true;
                            c.Height = 330;
                            c.setTag("";
                            c.BorderColor = vbButtonFace;
                        // {end with: c}

                        // With lB;
                            lB.setVisible(false);
                            lB.setTag = -1;
                        // {end with: lB}

                    }
                    else if(m_isDocument && (property.getKeyCol().equals(csNumberID) || property.getKeyCol().equals(csStateID))) {

                        if(property.getKeyCol().equals(csNumberID)) {
                            c.Left = 7300;
                            c.Width = 1200;
                        }
                        else {
                            c.Left = 8700;
                            c.Width = 3000;
                        }
                        c.Top = 80;
                        c.FontSize = 11;
                        c.FontBold = true;
                        c.Height = 330;
                        c.EnabledNoChngBkColor = true;
                        c.ForeColor = vbWhite;
                        c.BackColor = vbButtonShadow;
                        c.BorderColor = vbButtonFace;
                        lB.setVisible(false);
                        lB.setTag = -1;
                        c.setTag("";

                    }
                    else {

                        if(property.Top !== -1) {

                            lB.Top = property.Top;
                        }
                        else {
                            // OptionGroup la uso para indicar un offset cuando la
                            // property no es de nType Option sirve para permitir un
                            // posicionamiento mas fino de los controles. Solo se usa en
                            // cuenta.
                            lB.Top = m_nextTop[nTabIndex] + property.OptionGroup;

                            // OptionGroup la uso para indicar un offset cuando la
                            // property no es de nType Option sirve para permitir un
                            // posicionamiento mas fino de los controles. Solo se usa en
                            // cuenta.
                            c.Top = m_nextTop[nTabIndex] + property.OptionGroup;
                        }

                        switch(property.getType()) {
                            case Dialogs.PropertyType.date:
                                c.Width = 1400;
                                break;
                            case Dialogs.PropertyType.time:
                                c.Width = 800;
                                break;
                        }

                        if(m_isFooter) {
                            if(property.Left === -1) {
                                c.Left = m_left[nTabIndex];
                            }
                            // With lB;
                                lB.Left = c.Left;
                                lB.Top = c.Top - C_OFFSET_V3;
                                lB.Height = 225;
                                lB.Alignment = vbRightJustify;
                                lB.Width = 1000;
                            // {end with: lB}
                        }
                        else {
                            if(property.Left !== -1) {
                                lB.Left = c.Left + property.LeftLabel;
                                lB.Width = Abs(property.LeftLabel);
                            }
                            else {
                                c.Left = m_left[nTabIndex] + m_labelLeft;
                                if(property.LeftLabel !== 0) {
                                    lB.Left = c.Left + property.LeftLabel;
                                    lB.Width = Abs(property.LeftLabel);
                                }
                            }
                        }

                    }
                }

                // Me guardo el Top y el Left de esta propiedad
                // With property;
                    property.setTop(c.Top);
                    property.setLeft(c.Left);
                    property.setWidth(c.Width);
                    property.setHeight(c.Height);
                // {end with: property}

                // Si el control modifica el Left de los que vienen detras
                if(!property.LeftNotChange) {

                    // Si fue un option button hay que fijarce en el contenedor
                    if(property.getType() === Dialogs.PropertyType.option) {
                        if(property.LeftFrame !== 0  && !property.LeftNotChange) {
                            m_left[nTabIndex] = f.Left;
                        }
                    }
                    else {
                        // Si el control indico un left fijo, los demas se alinean con el
                        if(property.Left !== -1  && property.LeftToPrevious === 0) {
                            m_left[nTabIndex] = property.Left + property.LeftLabel;
                            m_labelLeft = Abs(property.LeftLabel);
                        }
                    }
                }

                // Me guardo el ultimo Left
                m_lastLeft = m_left[nTabIndex];
                m_lastLeftOp = c.Left;

                // Me guardo el ultimo Top
                m_lastTop = m_nextTop[nTabIndex];
                m_lastTopOp = c.Top;

                // Ahora hay que calcular donde empieza el renglo para el proximo control

                // Si el control modifica el Top para los que vienen detras
                if(!property.TopNotChange) {
                    // Si el control tiene un top personalizado entonces
                    // parto de dicho top para el calculo. Siempre y cuando no sea un OptionButton
                    if(property.Top !== -1  && property.getType() !== Dialogs.PropertyType.option  && !property.TopNotChange) {

                        m_lastTop = property.Top;

                        // Si el control inidica un alto personalizado
                        if(property.Height > 0) {
                            m_nextTop[nTabIndex] = property.Top + c.Height + C_LINE_LIGHT;
                        }
                        else {
                            m_nextTop[nTabIndex] = property.Top + C_LINE_HEIGHT;
                        }
                    }
                    else {
                        // Si el control inidica un alto personalizado. Siempre y cuando no sea un OptionButton
                        if(property.Height > 0 && property.getType() !== Dialogs.PropertyType.option) {
                            m_nextTop[nTabIndex] = m_nextTop[nTabIndex] + c.Height + C_LINE_LIGHT;

                            // Si se uso el alto standar (C_LINE_Height)
                        }
                        else {
                            //
                            // Siempre incremento el NextTop general incluso si es una property de nType option o Grid
                            // ya que por cada option que exista se agrega un renglo de C_LINE_Height y eso es correcto.
                            // En el caso de las Grids no trabaja bien, pero como por ahora solo hay una Grid por tab,
                            // no trae ningun problema.
                            //
                            // Aunque hay una excepcion: Cuando se trata de documentos el help de documento va en la barra de titulo
                            if(!(m_isDocument && (property.getTable() === Cairo.Tables.DOCUMENTO  || property.getKeyCol().equals(csNumberID) || property.getKeyCol().equals(csStateID)))) {
                                m_nextTop[nTabIndex] = m_nextTop[nTabIndex] + C_LINE_HEIGHT;
                            }
                        }
                    }
                }

                // Finalmente valido el ancho del form
                if(property.getType() === Dialogs.PropertyType.option) {
                    setNewWidthForm(property, f.Width + f.Left);
                }
                else {
                    setNewWidthForm(property, 0);
                }
            // {end with: property}

            return true;
        }

        var setNewTopAndLeft = function(property) { // TODO: Use of ByRef founded Private Sub SetNewTopAndLeft(ByRef property As cIABMProperty)
            var nTabIndex = 0;

            nTabIndex = pGetTabIndex(property);

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
            // {end with: view}

        }

        var pSetTabIndex = function(Object c) { // TODO: Use of ByRef founded Private Sub pSetTabIndex(ByRef c As Object)

                c.TabIndex = m_tabIndex;
            }
        }

        var setNewWidthForm = function(property, var frameSize) { // TODO: Use of ByRef founded Private Sub SetNewWidthForm(ByRef property As cABMProperty, ByVal FrameSize As Integer)



                var offsetH = 0;
                property = null;

                property = property;

                var view = getView();
                    if(view.getBackground().getLeft() === 0) {
                        offsetH = 120;
                    }
                    else {
                        offsetH = 400;
                    }

                    if(frameSize > 0) {
                        if(view.Width < frameSize + offsetH) {
                            view.Width = frameSize + offsetH;
                            view.getBackground().setWidth(view.ScaleWidth - view.getBackground().getLeft() * 2);
                        }
                    }
                    else {
                        if(view.Width < property.getWidth() + property.getLeft() + offsetH) {
                            view.Width = property.getWidth() + property.getLeft() + offsetH;
                        }
                        view.getBackground().setWidth(view.ScaleWidth - view.getBackground().getLeft() * 2);
                    }
                // {end with: view}
            }
        }

        var getProperty = function(csTypeABMProperty nType, var index, csSubTypeABMProperty subType) {
            property = null;
            property = null;
            cIABMProperties iProperties = null;
            found = false;

            if(m_properties === null) { return; }

            iProperties = m_properties;

            // Para Toolbars no hay indice
            if(nType === Dialogs.PropertyType.toolbar) {
                Toolbar tbl = null;

                tbl = getView().GetToolBar;
                for(var _i = 0; _i < iProperties.count(); _i++) {
                    property = iProperties.get(_i);
                    if(property.getType() === nType) {
                        if(property.setToolbar(Is tbl)) {
                            return property;
                            break;
                        }
                    }
                }

            }
            else {
                for(var _i = 0; _i < iProperties.count(); _i++) {
                    property = iProperties.get(_i);

                    // With property;

                        found = false;

                        // Tratamiento especial para textos que
                        // tambien pueden ser carpetas o archivos
                        if(nType === Dialogs.PropertyType.text) {

                            if(property.getType() === Dialogs.PropertyType.text  && subType === Dialogs.PropertySubType.memo) {
                                if(property.getSubType() === subType) {
                                    found = true;
                                }
                            }
                            else {

                                // Los textbox y los Dialogs.PropertyType.file y Dialogs.PropertyType.folder estan dentro
                                // del mismo arreglo de controles ( TX )
                                //
                                if((property.getType() === Dialogs.PropertyType.text  || property.getType() === Dialogs.PropertyType.file  || property.getType() === Dialogs.PropertyType.folder) && property.SubType !== Dialogs.PropertySubType.memo  && property.getSubType() === subType) {

                                    found = true;

                                    // Finalmente puede tratarse de una caja de texto
                                    // con boton asi que SubType es Dialogs.PropertyType.textButton o Dialogs.PropertyType.textButtonEx
                                    // pero cuando me llaman desde TextButtonClick me pasan 0 en
                                    // SubType ya que puede ser un Dialogs.PropertyType.file, Dialogs.PropertyType.folder o Dialogs.PropertyType.text
                                    // asi que este ultimo if captura los textbox que tienen boton
                                    // normalmente Descriptionciones en controles de una linea
                                    // o cajas de texto con boton que se resuelve por la clase
                                    // cliente que maneja las reglas de negocio de esta edicion.
                                    //
                                }
                                else if((property.getType() === Dialogs.PropertyType.text  && (property.getSubType() === Dialogs.PropertyType.textButton  || property.getSubType() === Dialogs.PropertyType.textButtonEx))) {

                                    found = true;

                                }
                            }
                        }
                        else {
                            if(property.getType() === nType) {
                                found = true;
                            }
                        }

                        // Ok, encontre una propiedad del mismo
                        // tipo, pero ahora tengo que ver que se
                        // trata del control que estoy buscando
                        // ya que puede haber mas de un control
                        // de este tipo en el form.
                        //
                        // Para identificar la propiedad usamos
                        // el indice del control.
                        //
                        if(found) {
                            if(property.getIndex() === index) {
                                return property;
                                break;
                            }
                        }
                    // {end with: property}
                }
            }
        }

        var propertyHasChanged = function(nType, index, c, bNoRefresh, subType) {
            _rtn = false;
            try {

                property = null;
                property2 = null;
                property = null;
                cIABMProperties iProperties = null;

                Static(Refreshing As Boolean);

                if(Refreshing || m_showingForm) {
                    Refreshing = false;
                    _rtn = true;
                    return _rtn;
                }

                property = getProperty(nType, index, subType);

                iProperties = m_properties;

                if(property !== null) {


                    // With property;
                        switch(nType) {
                            case Dialogs.PropertyType.List:
                                property.ListListIndex = c.ListIndex;
                                property.ListText = c.text;
                                if(c.ListIndex >= 0) {
                                    property.ListItemData = c.getItemData(c.ListIndex);
                                }
                                else {
                                    property.ListItemData = 0;
                                }
                                break;
                            case Dialogs.PropertyType.text:
                            case Dialogs.PropertyType.password:
                            case Dialogs.PropertyType.file:
                            case Dialogs.PropertyType.folder:
                                property.setValue(c.text;
                                break;
                            case Dialogs.PropertyType.numeric:
                                property.setValue(c.csValue;
                                break;
                            case Dialogs.PropertyType.date:
                            case Dialogs.PropertyType.time:
                                property.setValue(c.csValue;
                                break;
                            case Dialogs.PropertyType.option:

                                if(c.getValue()) {
                                    // Aca hay que cambiar al resto de las Properties de este Group de
                                    // option buttons
                                    for(var _i = 0; _i < iProperties.count(); _i++) {
                                        property2 = iProperties.get(_i);
                                        if(!property2(Is property)) {
                                            if(property2.getType() === Dialogs.PropertyType.option  && property2.OptionGroup === property.OptionGroup) {
                                                property2.setValue(0;
                                            }
                                        }
                                    }
                                }

                                property.setValue(c.getValue();
                                break;
                            case Dialogs.PropertyType.select:
                                property.setValue(c.ValueUser;
                                property.getSelectId() = Cairo.Util.val(c.getId());
                                property.setSelectIntValue(c.getId());
                                break;
                            case Dialogs.PropertyType.check:
                                property.setValue(c.getValue();
                                break;
                            case Dialogs.PropertyType.ToolBar:
                                property.setValue(c.Key;
                                break;
                        }

                        if(m_client.propertyChange(property.Key) && !bNoRefresh) {
                            Refreshing = true;
                            for(var _i = 0; _i < iProperties.count(); _i++) {
                                property = iProperties.get(_i);
                                showValueEx(property, m_noChangeColsInRefresh);
                            }
                        }
                    // {end with: property}
                }

                if(!pIsButton(property) && pIsEditProperty(property)) {

                    if(m_isDocument) {
                        if(property !== null) {
                            if(property.getTable() !== Cairo.Tables.DOCUMENTO) {
                                setChanged(true);
                            }
                        }
                    }
                    else {
                        setChanged(true);
                    }
                }

                Refreshing = false;
                _rtn = true;

                // Si es un ABM de maestros
                // permitimos al objeto de negocios
                // que indique se debe cerrar el form
                //
                if(m_masterView !== null) {
                    if(m_sendSave) {
                        m_masterView.ctrlKeySave();
                    }
                    else if(m_sendClose) {
                        m_masterView.ctrlKeyClose();
                    }
                }

                return _rtn;
            }
            catch(e) {
              Cairo.manageError(
                "Update",
                "An error has occurred when updating a property.",
                e.message);
            }
            return _rtn;
        }

        var pIsButton = function(property) { // TODO: Use of ByRef founded Private Function pIsButton(ByRef property As cIABMProperty) As Boolean
            if(property === null) { return false; }
            return property.getType() === Dialogs.PropertyType.button;
        }

        var pIsEditProperty = function(property) { // TODO: Use of ByRef founded Private Function pIsEditProperty(ByRef property As cABMProperty) As Boolean
            if(property === null) { return false; }
            return property.getIsEditProperty();
        }

        self.validateEx = function() {
            if(!pFillGrids()) { return false; }
            if(!pValidate()) { return false; }
            return true;
        }

        self.validateProp = function(property, strKey) { // TODO: Use of ByRef founded Public Sub ValidateProp(ByRef property As cIABMProperty, ByVal strKey As String)
            cIABMProperties iProps = null;

            if(property === null) {
                iProps = m_properties;
                property = iProps.get(strKey);
            }
            else {
                property = property;
            }

            if(!TypeOf(property.getControl() Is cshelp2.cHelp)) { return; }

            cshelp2.cHelp hL = null;
            hL = property.getControl();
            hL.Validate;
        }

        var pValidateItemsAndFooter = function() {
            _rtn = false;
            cABMGeneric genDocEx = null;

            if(m_isDocument) {

                genDocEx = m_client.messageEx(Dialogs.Message.MSG_DOC_EX_GET_ITEMS, null);
                if(!genDocEx.validateEx()) { return _rtn; }

                genDocEx = m_client.messageEx(Dialogs.Message.MSG_DOC_EX_GET_FOOTERS, null);
                _rtn = genDocEx.validateEx();

            }
            else {
                _rtn = true;
            }
            return _rtn;
        }

        self.save = function() {
            _rtn = false;
            _rtn = save(false, false);
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
            return _rtn;
        }

        var save = function(bUnloading, bSaveAs) {
            _rtn = false;
            try {

                if(m_isItems) { return _rtn; }
                if(m_isFooter) { return _rtn; }

                m_inSave = true;

                Cairo.LoadingMessage.showWait();

                pRefreshAux();
                pFillList();

                if(!pFillGrids()) { / * *TODO:** goto found: GoTo ExitProc* /  }

                // OJO: Esto se cambio de lugar y se puso antes
                //      de los validate para que no se de el bug
                //      de click en los checkbox de las grillas
                //      que afectaba los abm de cliente y proveedor
                //
                //      Si notamos que hay algun bug nuevo este es
                //      nuestro sospechoso de siempre!!!
                //
                if(!m_isDocument) {
                    pSetEnabled(false);
                }

                // Only for debug
                //
                //Dim iProperties As cIABMProperties
                //Set iProperties = m_Properties
                //Dim row As cABMGridRow

                //Set row = iProperties.get("Items").grid.getRows().get(1)
                //
                // Comentar despues de depurar

                // Para informarle al documento que comienza
                // la serie de llamadas de validacion
                // Esto es necesario en OrdenDeServicio para no
                // preguntar tres veces por cada Validate, si
                // se el usuario acepta el reingreso o no
                //
                if(m_isDocument) {
                    m_client.messageEx(Dialogs.Message.MSG_DOC_EX_PRE_VALIDATE, null);
                }

                if(!pValidate()) {
                    if(!m_isDocument) {
                        pSetEnabled(true);
                    }
                    / * *TODO:** goto found: GoTo ExitProc* /
                }

                if(!pValidateItemsAndFooter()) {
                    if(!m_isDocument) {
                        pSetEnabled(true);
                    }
                    / * *TODO:** goto found: GoTo ExitProc* /
                }

                // Grabacion normal de un documento
                //
                if(!bSaveAs) {

                    if(!m_client.Save()) {
                        if(!m_isDocument) {
                            pSetEnabled(true);
                        }
                        / * *TODO:** goto found: GoTo ExitProc* /
                    }

                }
                else {

                    // Grabacion Como que permite que un documento
                    // se guarde como otra cosa, util para convertir
                    // una factura en un presupuesto
                    //
                    if(!m_client.messageEx(Dialogs.Message.MSG_SAVE_AS, null)) {
                        if(!m_isDocument) {
                            pSetEnabled(true);
                        }
                        / * *TODO:** goto found: GoTo ExitProc* /
                    }

                }

                if(!m_isDocument) {
                    pSetEnabled(true);
                }

                if(!bUnloading) {

                    if(!m_isDocument && !m_bSendRefresh && !m_showOkCancel) {

                        discardChanges(false);
                    }
                    else {
                        m_client.messageEx(Dialogs.Message.MSG_DOC_REFRESH, null);
                        if(!m_isDocument) {
                            refreshTitle();
                        }
                        getView().SetFocusFirstControl;
                    }
                }

                setChanged(false);
                _rtn = true;

                / * *TODO:** goto found: GoTo ExitProc* /
            }
            catch(e) {
              Cairo.manageError(
                "Saving",
                "An error has occurred when saving.",
                e.message);
                m_inSave = false;
            }
            return _rtn;
        }

        var pFillList = function() {
            property = null;
            property = null;
            cIABMProperties iProperties = null;
            var index = 0;

            iProperties = m_properties;

            for(Index = 1; Index <= getView().CB.count(); Index++) {
                for(var _j = 0; _j < iProperties.count(); _j++) {
                    property = iProperties.get(_j);
                    if(property.getType() === Dialogs.PropertyType.list) {
                        if(property.getIndex() === index) {

                            var view = getView();
                                property.ListItemData = ListID(view.getCombos().get(index));
                                property.ListListIndex = view.getCombos().get(index).ListIndex;
                                property.ListText = view.getCombos().get(index).text;
                            // {end with: view}
                        }
                    }
                }
            }

            //  For Index = 1 To Frm.CBhock.count()
            //    For Each property In iProperties
            //      If property.getType() = Dialogs.PropertyType.list Then
            //        Set property = property
            //        If property.Index = Index Then
            //
            //          With Frm
            //            property.ListItemData = ListID(.CBhock(Index))
            //            property.ListListIndex = .CBhock(Index).ListIndex
            //            property.ListText = .CBhock(Index).text
            //          End With
            //        End If
            //      End If
            //    Next
            //  Next
        }

        var pFillGrids = function() {
            property = null;
            property = null;
            cIABMProperties iProperties = null;
            var index = 0;

            iProperties = m_properties;

            var view = getView();

                for(Index = 0; Index <= view.GR.count(); Index++) {
                    for(var _j = 0; _j < iProperties.count(); _j++) {
                        property = iProperties.get(_j);
                        if(property.getType() === Dialogs.PropertyType.grid) {
                            if(property.getIndex() === index) {

                                if(!pFillRows(property.getGrid(), view.getGrid(index))) { return false; }

                            }
                        }
                    }
                }
            // {end with: view}

            return true;
        }

        var pFillRows = function(cIABMGrid grid, cGridAdvanced grCtrl) { // TODO: Use of ByRef founded Private Function pFillRows(ByRef Grid As cIABMGrid, ByRef grCtrl As cGridAdvanced) As Boolean
            cIABMGridColumn col = null;
            var colIndex = 0;
            var rowIndex = 0;
            cIABMGridCellValue cell = null;
            cIABMGridRow row = null;
            bIsEmpty = false;

            bHaveKey = false;
            String[] vKeys() = null;
            cABMGridRows oRows = null;
            cABMGridRowValue oCell = null;

            oRows = grid.getRows();

            if(oRows.getHaveKey()) {

                bHaveKey = true;
                G.redim(vKeys, grid.getRows().count(), grid.Columns.count());

                cABMGridRow oRow = null;

                for(rowIndex = 1; rowIndex <= grid.getRows().count(); rowIndex++) {
                    oRow = grid.getRows().get(rowIndex);
                    vKeys[rowIndex, 1].equals(oRow.getKey());

                    for(colIndex = 2; colIndex <= grid.Columns.count(); colIndex++) {
                        row = oRow;
                        if(colIndex <= row.count()) {
                            oCell = row.get(colIndex);
                            vKeys[rowIndex, colIndex].equals(oCell.getStrKey());
                        }
                    }
                }
            }

            grid.getRows().clear();

            // Clear borra m_HaveKey
            //
            if(bHaveKey) {
                oRows.setHaveKey(bHaveKey);
            }

            // With grCtrl;
                for(rowIndex = 1; rowIndex <= grCtrl.getRows().count(); rowIndex++) {

                    // The last row can be empty because it is for new items
                    // so if no columns with values exists don't add to grid.rows
                    if(rowIndex === grCtrl.getRows().count()) {

                        // Only for grid that allow add new rows
                        property = null;
                        property = getProperty(Dialogs.PropertyType.grid, grCtrl.Index, 0);
                        if(property.getGrid()Add) {
                            if(!gridValidateRow(grCtrl.Index, rowIndex, false, false, bIsEmpty)) {
                                return null;
                            }
                        }
                    }

                    if(!bIsEmpty) {

                        if(bHaveKey) {
                            if(rowIndex <= (vKeys, 1).length) {
                                if(vKeys[rowIndex, 1] !== "") {
                                    row = grid.getRows().add(null, vKeys[rowIndex, 1]);
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

                        for(colIndex = 2; colIndex <= grid.Columns.count(); colIndex++) {

                            col = grid.Columns(colIndex);

                            // * TODO:** can't found type for with block
                            // * With .cell(rowIndex, colIndex)
                            __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = grCtrl.Cell(rowIndex, colIndex);

                                if(bHaveKey) {
                                    if(rowIndex <= (vKeys, 1).length && colIndex <= (vKeys, 1vKeys, 2).length) {
                                        if(vKeys[rowIndex, colIndex] !== "") {
                                            if(vKeys[rowIndex, colIndex] === c_keyRowItem) {
                                                if(row.get(c_keyRowItem) === null) {
                                                    cell = row.Add(null, vKeys[rowIndex, colIndex]);
                                                }
                                                else {
                                                    cell = row.Add(null);
                                                }
                                            }
                                            else {
                                                cell = row.Add(null, vKeys[rowIndex, colIndex]);
                                            }
                                        }
                                        else {
                                            cell = row.Add(null);
                                        }
                                    }
                                    else {
                                        cell = row.Add(null);
                                    }
                                }
                                else {
                                    cell = row.Add(null);
                                }

                                cell.Id = w___TYPE_NOT_FOUND.ItemData;
                                oCell = cell;
                                oCell.setSelectIntValue(w___TYPE_NOT_FOUND.getTag());

                                if(col.getType() === Dialogs.PropertyType.check) {
                                    cell.Id = w___TYPE_NOT_FOUND.ItemData;

                                }
                                else if(col.getType() === Dialogs.PropertyType.date) {
                                    cell.setValue(mUtil.getDateValueForGridClient(w___TYPE_NOT_FOUND.text);

                                }
                                else if(col.getSubType() === Dialogs.PropertySubType.percentage) {
                                    cell.setValue(Cairo.Util.val(w___TYPE_NOT_FOUND.text) * 100;

                                }
                                else {
                                    cell.setValue(w___TYPE_NOT_FOUND.text;
                                }
                            // {end with: w___TYPE_NOT_FOUND}

                            cell.Key = col.Key;
                        }
                    }
                }
            // {end with: grCtrl}

            return true;
        }

        var saveColumnsGrids = function() {
            var i = 0;
            property = null;

            var view = getView();

                for(i = 0; i <= view.GR.count(); i++) {

                    property = getProperty(Dialogs.PropertyType.grid, i, 0);

                    if(property !== null) {
                        m_gridManager.saveColumnWidth(view.getGrid(i), getGridName(property));
                        m_gridManager.saveColumnOrder(view.getGrid(i), getGridName(property));
                    }
                }
            // {end with: view}
        }

        var discardChanges = function(dontCallClient) {
            try {

                Cairo.LoadingMessage.showWait();

                property = null;
                cIABMProperties iProperties = null;

                iProperties = m_properties;

                for(var _i = 0; _i < iProperties.count(); _i++) {
                    property = iProperties.get(_i);
                    property.setControl(null);
                }

                var view = getView();
                    var q = 0;

                    saveColumnsGrids();

                    initVectorsPosition();

                // * TODO:** the error label ControlError: couldn't be found

                    var i = 0;

                    view.getMaskEdits().get(0).setVisible(false);
                    for(i = 1; i <= view.ME.count(); i++) {
                        unload(view.getMaskEdits().get(i));
                    }

                    view.getDatePickers().get(0).setVisible(false);
                    for(i = 1; i <= view.getDatePickers().count(); i++) {
                        unload(view.getDatePickers().get(i));
                    }

                    view.getSelects().get(0).setVisible(false);
                    for(i = 1; i <= view.HL.count(); i++) {
                        unload(view.getSelects().get(i));
                    }

                    for(i = 1; i <= view.OP.count(); i++) {
                        unload(view.getOptionButtons().get(i));
                    }

                    for(i = 1; i <= view.FR.count(); i++) {
                        unload(view.FR(i));
                    }

                    view.checkBoxes().get(0).setVisible(false);
                    for(i = 1; i <= view.CHK.count(); i++) {
                        unload(view.checkBoxes().get(i));
                    }

                    view.getButtons().get(0).setVisible(false);
                    for(i = 1; i <= view.CMD.count(); i++) {
                        unload(view.getButtons().get(i));
                    }

                    view.getCombos().get(0).setVisible(false);
                    for(i = 1; i <= view.CB.count(); i++) {
                        unload(view.getCombos().get(i));
                    }

                    view.getTextInputs().get(0).setVisible(false);
                    for(i = 1; i <= view.TX.count(); i++) {
                        unload(view.getTextInputs().get(i));
                    }

                    view.getTextAreas().get(0).setVisible(false);
                    for(i = 1; i <= view.TXM.count(); i++) {
                        unload(view.getTextAreas().get(i));
                    }

                    view.getPasswordInputs().get(0).setVisible(false);
                    for(i = 1; i <= view.txPassword.count(); i++) {
                        unload(view.getPasswordInputs().get(i));
                    }

                    view.getLabels().get(0).setVisible(false);
                    for(i = 1; i <= view.LB.count(); i++) {
                        unload(view.getLabels().get(i));
                    }

                    Dialogs.Util.destroyGrids(getView());

                    if(viewIsWizard(view) || viewIsMaster(view)) {
                        for(i = 1; i <= view.LB2.count(); i++) {
                            unload(view.getCtlLabels().get(i));
                        }
                    }

                    if(viewIsWizard(view)) {
                        for(i = 1; i <= view.prgBar.count(); i++) {
                            unload(view.getProgressBars().get(i));
                        }
                        for(i = 1; i <= view.getDescription().count(); i++) {
                            unload(view.getDescription(i));
                        }
                    }

                    if(viewIsWizard(view) || viewIsMaster(view)) {

                        for(i = 1; i <= view.getTitleLabel2().count(); i++) {
                            unload(view.getTitleLabel2().get(i));
                        }

                        for(i = 1; i <= view.Img.count(); i++) {
                            unload(view.getImages().get(i));
                        }
                    }

                    view.UnLoadToolbar;

                    initLoadMembers();

                // {end with: view}

                / * *TODO:** label found: seguir:* /
            }
            try {

                if(!dontCallClient) {
                  m_client.discardChanges();
                }

                return;
            }
            catch(e) {
              Cairo.manageError(
                "Discard Changes",
                "An error has occurred when discarding changes.",
                e.message);
                MngError(VBA.ex, "discardChanges", C_MODULE, "");
            }
        }

        var pValidate = function() {
            _rtn = false;
            if(!m_client.Validate()) { return _rtn; }

            if(m_clientManageGrid) {

                var rowIndex = 0;
                property = null;
                cIABMProperties iProperties = null;
                oldRedraw = false;

                iProperties = m_properties;

                for(var _i = 0; _i < iProperties.count(); _i++) {
                    property = iProperties.get(_i);
                    property = property;

                    if(property.getType() === Dialogs.PropertyType.grid) {

                        //' property.ctl.Redraw cuando recompile cGridAdvanced voy
                        oldRedraw = true;
                        // a agregar el get a Redraw
                        property.getControl().Redraw = false;

                        for(rowIndex = 1; rowIndex <= property.Grid.cABMCSGrid.getRows().count(); rowIndex++) {
                            if(!gridValidateRow(property.getIndex(), rowIndex, false, true, false)) {
                                property.getControl().Redraw = oldRedraw;
                                return _rtn;
                            }
                        }

                        property.getControl().Redraw = oldRedraw;
                    }
                }
            }

            _rtn = true;
            / * *TODO:** label found: ExitProc:* /
            return _rtn;
        }

        self.setTabCtlIndex = function() {

            cIABMTabs iTabs = null;
            cIABMTabItem iTab = null;
            cABMTabItem oTab = null;
            var index = 0;

            iTabs = m_tabs;
            for(var _i = 0; _i < iTabs.count(); _i++) {
                iTab = iTabs.get(_i);
                oTab = iTab;
                oTab.setCtlIndex(index);
                index = index + 1;
            }

            cIABMProperties iProperties = null;
            iProperties = m_properties;

            property = null;

            for(var _i = 0; _i < iProperties.count(); _i++) {
                property = iProperties.get(_i);

                if(property.getTabIndex() < 0) {

                    iTab = pGetTabFather(property.getTabIndex());

                    property = property;
                    // With property;
                        property.setTabIndex(property.getTabIndex());
                        property.getTabIndex() = iTab.Index;
                    // {end with: property}

                }
            }

        }

        var pGetTabFather = function(index) {
            cIABMTabs iTabs = null;
            cIABMTabItem iTab = null;
            cABMTabItem oTab = null;

            iTabs = m_tabs;
            for(var _i = 0; _i < iTabs.count(); _i++) {
                iTab = iTabs.get(_i);
                if(iTab.Index === index) {
                    oTab = iTab;
                    if(!(oTab.getFatherTab().equals(""))) {
                        return iTabs(oTab.getFatherTab());
                    }
                }
            }

        }

        var showTabs = function(var tabs) {
            var i = 0;
            float left = 0;
            float top = 0;
            var topItems = 0;
            cIABMTabItem iTab = null;
            cIABMTabItem iTab2 = null;
            bDontResize = false;
            var tabTopHeight = 0;

            left = 90;

            if(m_tabTopHeight === 0) {
                tabTopHeight = 540;
            }
            else {
                tabTopHeight = m_tabTopHeight;
                getView().getBackground().top = m_tabTopHeight + getView().cbTab.get(0).Height - 10;
                m_constTop = getView().getBackground().top + 200;
            }

            var view = getView();

                if(m_isItems) {
                    top = view.getTabItems().top - view.getTabs().get(0).getHeight();
                    topItems = 10;
                }
                else if(m_isFooter) {
                    top = view.getFooterBackground().top - view.getTabs().get(0).getHeight();
                }
                else {
                    if(m_isDocument) {
                        top = 1080;
                    }
                    else {
                        //' 540
                        top = tabTopHeight;
                    }
                }

                for(i = 1; i <= view.cbTab.count(); i++) {
                    if(m_isItems) {
                        if(view.getTabs().get(i).getTag() === Cairo.Constants.DocumentSections.footer  || view.getTabs().get(i).getTag() === Cairo.Constants.DocumentSections.items) {
                            unload(view.getTabs().get(i));
                        }
                    }
                    else if(m_isFooter) {
                        if(view.getTabs().get(i).getTag() === Cairo.Constants.DocumentSections.footer) {
                            unload(view.getTabs().get(i));
                        }
                    }
                    else {
                        unload(view.getTabs().get(i));
                    }
                }

                cIABMTabs iTabs = null;
                cABMTabItem oTab = null;
                var k = 0;

                if(m_tabs !== null) {

                    iTabs = m_tabs;
                    tabs = (iTabs.count() - 1 > tabs) ? iTabs.count() - 1 : tabs);
                }

                if(tabs === 0) { return; }

                // * TODO:** can't found type for with block
                // * With .cbTab
                __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = view.cbTab;
                    if(w___TYPE_NOT_FOUND.count() === 1) {
                        m_firstTab = 0;
                    }
                    else {
                        m_firstTab = w___TYPE_NOT_FOUND.count();
                    }
                // {end with: w___TYPE_NOT_FOUND}

                for(i = m_firstTab; i <= tabs + m_firstTab; i++) {
                    if(i > 0) { Load(view.getTabs().get(i)); }

                    // * TODO:** can't found type for with block
                    // * With .getTabs().get(i)
                    __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = view.getTabs().get(i);
                        if(m_isDocument) {
                            if(m_isItems) {
                                w___TYPE_NOT_FOUND.setTag = Cairo.Constants.DocumentSections.items;
                                w___TYPE_NOT_FOUND.setTabGroup = 1;
                            }
                            else if(m_isFooter) {
                                w___TYPE_NOT_FOUND.setTag = Cairo.Constants.DocumentSections.footer;
                                w___TYPE_NOT_FOUND.setTabGroup = 2;
                            }
                            else {
                                w___TYPE_NOT_FOUND.setTag = Cairo.Constants.DocumentSections.header;
                                w___TYPE_NOT_FOUND.setTabGroup = 3;
                            }
                        }

                        k = k + 1;

                        oTab = iTabs(k);
                        if(!(oTab.getFatherTab().equals(""))) {
                            iTab = iTabs(oTab.getFatherTab());
                            iTab2 = oTab;
                            w___TYPE_NOT_FOUND.setTag = w___TYPE_NOT_FOUND.getTag()+ Dialogs.Constants.innerTab+ String.valueOf((iTab.Index * 100) + Abs(iTab2.Index));

                            if(oTab.getLeft() !== 0) {
                                bDontResize = true;
                                left = oTab.getLeft();
                            }
                            if(oTab.getTop() !== 0) {
                                bDontResize = true;
                                top = oTab.getTop();
                            }
                        }

                        w___TYPE_NOT_FOUND.setText = "Tab"+ ((Integer) i).toString();
                        w___TYPE_NOT_FOUND.setTabStop = false;
                        w___TYPE_NOT_FOUND.setVisible(!m_hideTabButtons);
                        if(left + w___TYPE_NOT_FOUND.Width > getView().Width) {
                            left = 90;
                            top = top + w___TYPE_NOT_FOUND.Height - 20;
                        }
                        w___TYPE_NOT_FOUND.Top = top + topItems;
                        w___TYPE_NOT_FOUND.Left = left;
                        w___TYPE_NOT_FOUND.bringToFront();
                        w___TYPE_NOT_FOUND.BackColorPressed = vb3DHighlight;
                        left = left + w___TYPE_NOT_FOUND.Width - 20;
                    // {end with: w___TYPE_NOT_FOUND}
                }

                var q = 0;

                G.redim(m_left, tabs);
                G.redim(m_nextTop, tabs);

                for(q = 0; q <= m_nextTop.length; q++) {
                    m_nextTop[q] = m_constTop;
                    m_left[q] = m_constLeft;
                }

                if(m_tabs === null) { return; }

                ///////////////////////////////////////////////////////////////
                // Textos y anchos
                //
                Form f = null;
                f = Me.getView();
                CSButton.cButton cbTab = null;

                left = 90;
                if(m_isItems) {
                    top = view.getTabItems().top - view.getTabs().get(0).getHeight();
                    topItems = 10;
                }
                else if(m_isFooter) {
                    top = view.getFooterBackground().top - view.getTabs().get(0).getHeight();
                }
                else {
                    if(m_isDocument) {
                        top = 1080;
                    }
                    else {
                        //' 540
                        top = tabTopHeight;
                    }
                }

                for(var _i = 0; _i < iTabs.count(); _i++) {
                    iTab = iTabs.get(_i);
                    if(iTab.Index < 0) {
                        oTab = iTab;
                        cbTab = view.getTabs().get(oTab.getCtlIndex() + m_firstTab);
                        cbTab.setText("&"+ Abs(iTab.Index)+ "-"+ iTab.Name;
                    }
                    else {
                        cbTab = view.getTabs().get(iTab.Index + m_firstTab);
                        cbTab.setText("&"+ iTab.Index + m_firstTab + 1+ "-"+ iTab.Name;
                    }

                    if(!bDontResize) {
                        cbTab.Width = f.textWidth(cbTab.text) + 300;
                        if(left + cbTab.Width > f.Width) {
                            left = 100;
                            top = top + cbTab.Height - 20;
                        }
                        cbTab.Left = left;
                        cbTab.Top = top + topItems;
                        left = left + cbTab.Width - 20;
                    }
                }

                view.getBackground().bringToFront();
            // {end with: view}
        }

        var pSetButton = function(Control control, property) { // TODO: Use of ByRef founded Private Sub pSetButton(ByRef Control As Control, ByRef property As cABMProperty)

            if(c.getType !== undefined) {
                // With control;
                    if(control.getType() !== csMkText  && control.getType() !== csMkTime) {
                        if(control.Enabled) {

                            if(property.getNoShowButton()) {
                                control.ButtonStyle = cButtonNone;
                            }
                            else {
                                control.ButtonStyle = cButtonSingle;
                            }
                        }
                        else {
                            control.ButtonStyle = cButtonNone;
                        }
                    }
                // {end with: control}
            }
        }

        var pLoadToolBar = function(prop, Frame f) { // TODO: Use of ByRef founded Private Function pLoadToolBar(ByVal Prop As cABMProperty, ByRef f As Frame) As Toolbar
            return m_masterView.loadToolbar(f);
        }

        var moveNext = function() {
            try {

                cWizardGeneric wizardClient = null;
                wizardClient = m_client;
                wizardClient.moveNext();

                return;
            }
            catch(e) {
              Cairo.manageError(
                "Moving",
                "An error has occurred when moving to the next document.",
                e.message);
            }
        }

        var moveBack = function() {
          m_client.moveBack();
        };

        self.refreshFont = function(property) { // TODO: Use of ByRef founded Public Sub RefreshFont(ByRef property As cIABMProperty)
            property = property;

            if(property.getControl() === null) { return; }
            pSetFont(property.getControl(), property);
        }

        self.refreshPosition = function(property) { // TODO: Use of ByRef founded Public Sub RefreshPosition(ByRef property As cIABMProperty)
            property = property;

            if(property.getControl() === null) { return; }


                property.getControl().Left = property.Left;
                property.getControl().Top = property.Top;
                property.getControl().Width = property.Width;
                property.getControl().Height = property.Height;
            }
        }

        var pSetFont = function(Control c, property) { // TODO: Use of ByRef founded Private Sub pSetFont(ByRef c As Control, ByRef property As cIABMProperty)


                // With property;
                    if(property.FontName !== "") {
                        c.FontName = property.FontName;
                    }
                    if(property.FontSize > 0) {
                        c.FontSize = property.FontSize;
                    }
                    c.FontUnderline = property.FontUnderline;
                    c.FontBold = property.FontBold;
                    c.FontItalic = property.FontItalic;
                    if(property.ForeColor !== -1) {
                        c.ForeColor = property.ForeColor;
                    }
                // {end with: property}
            }
        }

        var pSetBackColor = function(Control c, property) { // TODO: Use of ByRef founded Private Sub pSetBackColor(ByRef c As Control, ByRef property As cIABMProperty)

                // With property;
                    if(property.getBackColor() !== -1) {
                        c.BackColor = property.getBackColor();
                    }
                // {end with: property}
            }
        }

        self.setTabIndexDescription = function() {
            property = null;
            property = null;
            cIABMProperties iProperties = null;

            if(m_isDocument) {

                iProperties = m_properties;

                var view = getView();

                    for(var _i = 0; _i < iProperties.count(); _i++) {
                        property = iProperties.get(_i);
                        if(property.getSubType() === Dialogs.PropertySubType.memo) {
                            view.getTextAreas().get(property.getIndex()).setTabIndex(view.getControls().count());
                        }
                    }
                // {end with: view}
            }
        }

        var pRefreshAux = function() {
            var index = 0;
            property = null;
            cIABMProperties iProperties = null;
            var i = 0;

            iProperties = m_properties;

            var view = getView();

                for(i = 1; i <= properties.count(); i++) {

                    property = iProperties(i);
                    index = property.getIndex();

                    switch(iProperties(i).PropertyType) {

                        case Dialogs.PropertyType.check:
                            propertyHasChanged(Dialogs.PropertyType.check, index, view.CHK.get(index), true);

                            break;
                        case Dialogs.PropertyType.date:
                        case Dialogs.PropertyType.time:
                            propertyHasChanged(Dialogs.PropertyType.date, index, view.getDatePickers().get(index), true);

                            break;
                        case Dialogs.PropertyType.select:
                            propertyHasChanged(Dialogs.PropertyType.select, index, view.HL.get(index), true);

                            break;
                        case Dialogs.PropertyType.List:
                            propertyHasChanged(Dialogs.PropertyType.list, index, view.CB.get(index), true);

                            break;
                        case Dialogs.PropertyType.numeric:
                            propertyHasChanged(Dialogs.PropertyType.numeric, index, view.ME.get(index), true);

                            break;
                        case Dialogs.PropertyType.option:
                            propertyHasChanged(Dialogs.PropertyType.option, index, view.OP.get(index), true);

                            break;
                        case Dialogs.PropertyType.password:
                            propertyHasChanged(Dialogs.PropertyType.password, index, view.txPassword.get(index), true);

                            break;
                        case Dialogs.PropertyType.text:
                        case Dialogs.PropertyType.file:
                        case Dialogs.PropertyType.folder:
                            if(iProperties(i).getSubType() === Dialogs.PropertySubType.memo) {
                                propertyHasChanged(Dialogs.PropertyType.text, index, view.TXM.get(index), true, Dialogs.PropertySubType.memo);
                            }
                            else {
                                propertyHasChanged(Dialogs.PropertyType.text, index, view.TX.get(index), true);
                            }

                            break;
                    }
                }
            // {end with: view}
        }

        self.resetChanged = function() {
          setChanged(false);
          m_unloading = false;
        };

        var askDelete = function(msg) {
          return Cairo.Modal.confirmCancelViewYesDanger(
            "Delete",
            msg
          );
        };

        var reloadDocument = function() {


                if(m_unloading) { return; }

                showMsg("Descartando los cambios hechos al documento ...");
                m_client.messageEx(Dialogs.Message.MSG_DOC_REFRESH, null);
                setChanged(false);
                hideMsg();
            }
        }

        self.printDocumento = function() {
            print(false);
        }

        self.printDocEx = function(var id) {
            print(false, id);
        }

        self.printDocumentoCobranzaCdo = function(obj) { // TODO: Use of ByRef founded Public Sub PrintDocumentoCobranzaCdo(ByRef Obj As CSInterfacesABM.cIABMClient)

                CSInterfacesABM.cIABMClient oldClient = null;
                oldClient = m_client;
                m_client = obj;
                print(false);
                m_client = oldClient;
            }
        }

        self.printDocWithResult = function(obj, id, docId) { // TODO: Use of ByRef founded Public Function PrintDocWithResult(ByRef Obj As CSInterfacesABM.cIABMClient, ByVal Id As Long, ByVal DocId As Long) As Boolean
            _rtn = false;


                CSInterfacesABM.cIABMClient oldClient = null;
                oldClient = m_client;
                m_client = obj;

                _rtn = pPrintDocWithResult(id, docId);

                m_client = oldClient;

            }
            return _rtn;
        }

        self.pPrintDocWithResult = function(id, docId) {
            _rtn = false;

            if(id === Cairo.Constants.NO_ID) {
                return _rtn;
            }

            //'CSPrintManager.cPrintManager
            Object printManager = null;

            printManager = CSKernelClient2.CreateObject("CSPrintManager2.cPrintManager");

            // With printManager;

                printManager.IsForEmail = false;
                printManager.EmailAddress = pGetEmailAddress();
                printManager.Path = GetValidPath(Cairo.Configuration.get(Cairo.Configuration.Reports.reportSection, Cairo.Configuration.Reports.reportPath, Cairo.Configuration.appPath()));
                printManager.CommandTimeout = Cairo.Util.val(Cairo.Configuration.get(Cairo.Configuration.Reports.reportSection, Cairo.Configuration.Reports.commandTimeOut, 0));
                printManager.ConnectionTimeout = Cairo.Util.val(Cairo.Configuration.get(Cairo.Configuration.Reports.reportSection, Cairo.Configuration.Reports.connectionTimeOut, 0));

                printManager.DescriptionUser = pGetDescriptionUser();
                printManager.setTitle(pGetPrintTitle());

                printManager.ShowPrint(id, Cairo.Constants.NO_ID, docId);

                _rtn = printManager.DocImpreso;

            // {end with: printManager}

            return _rtn;
        }

        var print = function(byEmail, id) {

            try {

                //'CSPrintManager.cPrintManager
                Object printManager = null;
                CSIDocumento.cIDocumento iDoc = null;

                if(!TypeOf(m_client Is CSIDocumento.cIDocumento)) { / * *TODO:** goto found: GoTo ExitProc* /  }
                iDoc = m_client;

                if(id === Cairo.Constants.NO_ID) {
                    id = iDoc.getId();
                }

                if(id === Cairo.Constants.NO_ID) {
                    MsgInfo("Debe grabar el documento para poder imprimirlo", "Imprimir");
                    / * *TODO:** goto found: GoTo ExitProc* /
                }

                printManager = CSKernelClient2.CreateObject("CSPrintManager2.cPrintManager");

                // OJO: Esto es nuevo y puede traer problemas
                //      es para que no se impriman formularios
                //      con cambios sin guardar
                //
                if(!m_inSave) {

                    if(!saveChanges(false)) { / * *TODO:** goto found: GoTo ExitProc* /  }

                }

                // With printManager;

                    printManager.IsForEmail = byEmail;
                    printManager.EmailAddress = pGetEmailAddress();
                    printManager.Path = GetValidPath(Cairo.Configuration.get(Cairo.Configuration.Reports.reportSection, Cairo.Configuration.Reports.reportPath, Cairo.Configuration.appPath()));
                    printManager.CommandTimeout = Cairo.Util.val(Cairo.Configuration.get(Cairo.Configuration.Reports.reportSection, Cairo.Configuration.Reports.commandTimeOut, 0));
                    printManager.ConnectionTimeout = Cairo.Util.val(Cairo.Configuration.get(Cairo.Configuration.Reports.reportSection, Cairo.Configuration.Reports.connectionTimeOut, 0));

                    printManager.DescriptionUser = pGetDescriptionUser();
                    printManager.AutoPrint = m_autoPrint;

                    printManager.ShowPrint(id, Cairo.Constants.NO_ID, iDoc.DocId);

                    if(printManager.DocImpreso) {
                        reloadDocument();
                    }
                // {end with: printManager}

                / * *TODO:** goto found: GoTo ExitProc* /
            }
            catch(e) {
              Cairo.manageError(
                "Printing",
                "An error has occurred when printing.",
                e.message);
            }
        }

        var pGetDescriptionUser = function() {
            String rtn = "";

            rtn = m_client.messageEx(Dialogs.Message.MSG_EXPORT_GET_FILE_NAME_POSTFIX, null);

            return rtn;
        }

        var pGetPrintTitle = function() {
            String rtn = "";

            rtn = m_client.messageEx(Dialogs.Message.MSG_PRINT_GET_TITLE, null);

            return rtn;
        }

        var pGetEmailAddress = function() {


                String emailAddress = "";

                emailAddress = m_client.messageEx(Dialogs.Message.MSG_EXPORT_GET_EMAIL, null).trim();

                return emailAddress;
            }
        }

        var newWithWizard = function() {
          try {
            return mMsgConstantes.varToBool(m_client.messageEx(Dialogs.Message.MSG_DOC_NEW_WITH_WIZARD, null));
          }
          catch(ignore) {}
        };

        var pGetTabIndex = function(property) { // TODO: Use of ByRef founded Private Function pGetTabIndex(ByRef property As cIABMProperty) As Long
            var _rtn = 0;
            // With property;
                if(property.getTabIndex() === Dialogs.TabIndexType.TAB_ID_XT_ALL
                    || property.getTabIndex() === Dialogs.TabIndexType.TAB_ID_XT_ALL2) {
                    _rtn = 0;
                }
                else {
                    _rtn = property.getTabIndex();
                }
            // {end with: property}
            return _rtn;
        }

        var initVectorsPosition = function() {
            m_left[0] = m_constLeft;
            m_leftOp[0] = m_constLeftOp;
            m_nextTop[0] = m_constTop;
            m_nextTopOp[0] = m_constTopOp;
        }

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
        }

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
                m_isFooter = false;
                m_isItems = false;
                m_viewShowed = false;
                m_minHeight = 5310;
                m_minWidth = 8640;
                m_tabHideControlsInAllTab = -1;

                m_properties = new cABMProperties();

                G.redim(m_nextTop, 0);
                G.redim(m_nextTopOp, 0);
                G.redim(m_left, 0);
                G.redim(m_leftOp, 0);
            }
        }

        self.terminate = function() {


                m_menu = null;

                G.redim(m_nextTop, 0);
                G.redim(m_nextTopOp, 0);
                G.redim(m_left, 0);
                G.redim(m_leftOp, 0);

                m_properties = null;
                m_client = null;
                m_tabs = null;
                m_gridManager = null;

                if(m_masterView !== null) {
                    unload(m_masterView);
                }
                if(m_documentView !== null) {
                    unload(m_documentView);
                }
                if(m_wizardView !== null) {
                    unload(m_wizardView);
                }

                m_masterView = null;
                m_documentView = null;
                m_wizardView = null;

            }
        };

        self.getGridName = function(property) {
          if(property.getName() !== "") {
            return m_client.getTitle() + "_" + property.getName();
          }
          else {
            return m_client.getTitle() + "_" + property.getKey();
          }
        };

        var setNoResize = function() {
            property = null;
            cABMGrid grid = null;
            var i = 0;
            var indexGrid = 0;
            cIABMProperties iProperties = null;

            iProperties = m_properties;

            for(var _i = 0; _i < iProperties.count(); _i++) {
                property = iProperties.get(_i);

                if(property.getType() === Dialogs.PropertyType.grid) {
                    i = i + 1;
                    grid = property.Grid;

                    property = property;

                    if(!property.getControl() === null && getView() Is m_masterView) {
                        indexGrid = getView().GetIndexGrid(property.getControl());
                        if(indexGrid === 0) { indexGrid = i; }
                    else {
                        indexGrid = i;
                    }

                    getView().SetDontResize(indexGrid) = grid.setDontResize();

                    // Solo aplicamos un valor a esta propiedad
                    // cuando explicitamente se indico que no se
                    // debe redimencionar la grilla. Esto es asi
                    // por que el comportamiento original no estaba
                    // previsto que el programador indicara que se
                    // podia modificar el alto de las grillas, sino
                    // que el framework lo definia por si solo.
                    //
                    // Ahora el programador puede indicar que no se
                    // debe redimencionar el alto de una grilla, pero
                    // no puede indicar que si se puede.
                    //
                    // Esto en algun momento se puede reprogramar para
                    // que quede mas coherente.
                    //
                    if(grid.setDontResizeHeight()) {
                        getView().SetDontResizeHeight(indexGrid) = true;

                        if(!property.getControl() === null) {
                            pSetGridHeight(property.getControl(), property.Height);
                        }
                    }
                }
            }
        }

        var pSetGridHeight = function(ctl, height) {

                if(height > 0) {
                    ctl.Height = height;
                }
            }
        }

        var pSetEnabled = function(bEnabled) {


                Object ctl = null;
                var i = 0;

                if(bEnabled) {
                    for(var _i = 0; _i < getView().getControls().count(); _i++) {
                        ctl = Frm.getControls().get(_i);
                        if(controlIsGrid(ctl)) {
                            i = i + 1;
                            if(m_enabledState[i]) {
                                ctl.Enabled = true;
                            }
                        }
                    }

                    G.redim(m_enabledState, 0);
                }
                else {

                    G.redim(m_enabledState, 0);

                    for(var _i = 0; _i < getView().getControls().count(); _i++) {
                        ctl = Frm.getControls().get(_i);
                        if(controlIsGrid(ctl)) {
                            i = i + 1;
                            G.redimPreserve(m_enabledState, i);
                            m_enabledState[i] = ctl.getEnabled();
                            ctl.Enabled = false;
                        }
                    }
                }
            }
        }

        self.refreshTitle = function() {
          view = getView();
          if(!valEmpty(m_title2, csText)) {
              view.getTitleLabelEx2().setText(" - "+ m_title2);
              view.getTitleLabelEx2().setLeft(view.getTitleLabel().getLeft() + view.getTitleLabel().getWidth() + 50);
          }
          else {
              view.getTitleLabelEx2().setText("");
          }
        }

        self.refreshFormText = function() {

                getView().setText(getViewText();
            }
        }

        var getViewText = function() {
          return m_viewText + Cairo.Company.name + " - " + m_client.getTitle() + " || Press F12 to see the a shortcut key list";
        };

        var setBackgroundColor = function() {
            if(mUtil.gBackgroundColor !== 0) {

                setBackColorTagMainEx(mUtil.gBackgroundColor);

            }
        }

        self.setBackColorTagMainEx = function(color) {
            mUtil.gBackgroundColor = color;
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
                m_wizardView.getTitleBackground().setBackColor(vbWhite);
            }
        }

        var isControlVisibleInTab = function(c, index) { // TODO: Use of ByRef founded Private Function isControlVisibleInTab(ByRef c As Object, ByVal Index As Long) As Boolean
            return (Cairo.Util.val(c.getTag()) === index  
                    || (Cairo.Util.val(c.getTag()) === Dialogs.TabIndexType.TAB_ID_XT_ALL  
                        && index !== m_tabHideControlsInAllTab) 
                    || Cairo.Util.val(c.getTag()) === Dialogs.TabIndexType.TAB_ID_XT_ALL2);
        }

        var wizDisableButtons = function() {

                if(m_wizardView === null) { return; }
                //m_wizardView.Enabled = False
                //m_wizardView.getNextButton().Enabled = False
                m_inProcess = true;
                VBA.ex.Clear;
            }
        }

        var wizEnableButtons = function() {

                if(m_wizardView === null) { return; }
                //m_wizardView.Enabled = True
                //m_wizardView.getNextButton().Enabled = True
                m_inProcess = false;
                VBA.ex.Clear;
            }
        }

        ////////////////////////////////
        //  Codigo estandar de errores
        //  On Error GoTo ControlError
        //
        //  GoTo ExitProc
        //ControlError:
        //  MngError err,"", C_Module, vbnullstring
        //  If Err.Number Then Resume ExitProc
        //ExitProc:
        //  On Error Resume Next


      }
    };

  });

}());