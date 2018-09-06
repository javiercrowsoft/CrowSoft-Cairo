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
      white: '#ff',
      buttonFace: '#cecece',
      buttonShadow: '#cecece',
      tabBackColor: '#ffffff',
      backgroundColor: '#cecece',
      windowBackground: '#000000'
    };

    Dialogs.BackgroundType = {
      opaque: 1,
      transparent: 2
    };

    Dialogs.ButtonStyle = {
      none: 1,
      single: 2
    };

    Dialogs.TextAlign = {
      left:   0,
      center: 1,
      right:  2
    };

    Dialogs.Buttons = {

      // group 1

      BUTTON_NEW: 1,
      BUTTON_EDIT: 2,
      BUTTON_REVOKE: 4,
      BUTTON_DELETE: 8,
      BUTTON_CUT: 16,
      BUTTON_COPY: 32,
      BUTTON_PASTE: 64,
      BUTTON_SEARCH: 128,
      BUTTON_PRINTOBJ: 256,
      BUTTON_PREVIEW: 512,
      BUTTON_DEACTIVE: 1024,
      BUTTON_EXIT: 2048,
      BUTTON_ROLS: 4096,
      BUTTON_PERMISSIONS: 8192,
      BUTTON_SAVE: 16384,
      BUTTON_WITH_PARAMS: 32768,
      BUTTON_WITHOUT_PARAMS: 65536,
      BUTTON_UPDATE: 131072,
      BUTTON_GRID: 262144,

      BUTTON_INVALIDATE: 524288,
      BUTTON_EDIT_STATE: 1048576,
      BUTTON_RELOAD: 2097152,
      BUTTON_ATTACH: 4194304,
      BUTTON_DOC_APLIC: 8388608,
      BUTTON_DOC_FIRST: 16777216,
      BUTTON_DOC_PREVIOUS: 33554432,
      BUTTON_DOC_NEXT: 67108864,
      BUTTON_DOC_LAST: 134217728,
      BUTTON_DOC_SIGNATURE: 268435456,
      BUTTON_DOC_HELP: 536870912,
      BUTTON_DOC_MODIFY: 1073741824,

      // group 2

      BUTTON_DOC_AUX: 1,
      BUTTON_DOC_EDIT: 2,
      BUTTON_DOC_TIP: 4,
      BUTTON_DOC_MERGE: 8,
      BUTTON_DOC_ALERT: 16,
      BUTTON_DOC_ACTION: 32,
      BUTTON_DOC_MAIL: 64,
      BUTTON_SAVE_PARAMS: 128,
      BUTTON_RELOAD_PARAMS: 256,
      BUTTON_SAVE_AS: 512,
      BUTTON_SEARCH_LISTDOC: 1024
    }

  });

  ///////////////
  // Handler
  ///////////////

  Cairo.module("Dialogs", function(Dialogs, Cairo, Backbone, Marionette, $, _) {

    var val = Cairo.Util.val;

    var hasKey = function(cell, index, key) {
      return cell.getKey() === key;
    };

    var cell = function(row, key) {
      return row.getCells().selectFirst(hasKey, key);
    };

    var cellVal = function(row, key) {
      return cell(row, key).getValue();
    };

    Dialogs.cell = cell;

    Dialogs.cellVal = cellVal;

    Dialogs.cellFloat = function(row, key) {
      return val(cellVal(row, key));
    };

    Dialogs.cellId = function(row, key) {
      return cell(row, key).getId();
    }
  });

  ///////////////
  // Views
  ///////////////

  Cairo.module("Dialogs.Views", function(Views, Cairo, Backbone, Marionette, $, _) {

    var Dialogs = Cairo.Dialogs;
    var Controls = Cairo.Controls;
    var NO_ID = Cairo.Constants.NO_ID;
    var P = Cairo.Promises;
    var call = P.call;

    Views.Controller = {

      newDialog: function() {

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

        var m_gridManager = Cairo.Dialogs.Grids.Manager;

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
        var m_tabOffset = -1;

        // flag: show okay cancel instead of save cancel
        //
        var m_showOkCancel = false;

        // flag:
        //
        // true:  save or okay was pressed
        // false: cancel was pressed
        //
        var m_okCancelResult = false;
        var m_modalDefer = null;

        var m_tabIndex = 0;

        // flag: don't move the buttons save and cancel when resizing
        //
        var m_noMoveGenericButton = false;

        var m_cancelText = "";
        var m_saveText = "";

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

        var m_tabHideControlsInAllTab = 0;

        var m_masterView   = null;
        var m_wizardView   = null;
        var m_documentView = null;

        var m_backgroundColor = 0;

        var m_sendRefresh = false;

        var m_owner = null;

        var self = {};

        self.setTabHideControlsInAllTab = function(value) {
          m_tabHideControlsInAllTab = value;
        };

        self.setBNoChangeBackColorCell = function(value) {
          m_noChangeBackColorCell = value;
        };

        self.setFormText = function(value) {
          m_viewText = value;
        };

        self.setPopMenuClient = function(value) {
          m_popMenuClient = value;
        };

        self.getSetFocusFirstCtrlInNew = function() {
          return m_setFocusFirstCtrlInNew;
        };

        self.setSetFocusFirstCtrlInNew = function(value) {
          m_setFocusFirstCtrlInNew = value;
        };

        self.setNoButtons1 = function(value) {
          m_noButtons1 = value;
        };

        self.setNoButtons2 = function(value) {
          m_noButtons2 = value;
        };

        self.setNoButtons3 = function(value) {
          m_noButtons3 = value;
        };

        self.setButtonsEx2 = function(value) {
          m_buttonsEx2 = value;
        };

        self.setButtonsEx3 = function(value) {
          m_buttonsEx3 = value;
        };

        self.setBSendSave = function(value) {
          m_sendSave = value;
        };

        self.setBSendClose = function(value) {
          m_sendClose = value;
        };

        self.setBSendAutoSave = function(value) {
          m_sendAutoSave = value;
        };

        self.setSendNewDoc = function(value) {
          m_sendNewDoc = value;
        };

        self.setSendNewABM = function(value) {
          m_sendNewABM = value;
        };

        self.getInSave = function() {
          return m_inSave;
        };

        self.getSavingAs = function() {
          return m_savingAs;
        };

        self.setIsWizard = function(value) {
          m_isWizard = value;
        };

        self.setNoAskForSave = function(value) {
          m_noAskForSave = value;
        };

        self.setNoMoveGenericButton = function(value) {
          m_noMoveGenericButton = value;
        };

        self.setSaveText = function(value) {
          m_saveText = value;
        };

        self.setCancelText = function(value) {
          m_cancelText = value;
        };

        self.setSendRefresh = function(sendRefresh) {
          m_sendRefresh = sendRefresh;
        };

        var docToolbarClick = function(key) {
          var button = { key: key };
          return function() {
            return docHandlerToolbarClick(button);
          };
        };


        var setDocumentListeners = function() {
          m_documentView.addListener({
            buttonClick:                docHandlerButtonClick,

            closeClick:                 docToolbarClick(Dialogs.Constants.toolbarKeyClose),
            copyClick:                  docToolbarClick(Dialogs.Constants.toolbarKeyCopy),
            documentsClick:             docToolbarClick(Dialogs.Constants.toolbarKeyAttach),
            newClick:                   docToolbarClick(Dialogs.Constants.toolbarKeyNew),
            printClick:                 docToolbarClick(Dialogs.Constants.toolbarKeyPrint),
            saveClick:                  docToolbarClick(Dialogs.Constants.toolbarKeySave),
            editClick:                  docToolbarClick(Dialogs.Constants.toolbarKeyDocEdit),
            invalidateClick:            docToolbarClick(Dialogs.Constants.toolbarKeyInvalidate),
            deleteClick:                docToolbarClick(Dialogs.Constants.toolbarKeyDelete),
            applyClick:                 docToolbarClick(Dialogs.Constants.toolbarKeyApply),
            statusClick:                docToolbarClick(Dialogs.Constants.toolbarKeyEditState),
            alarmsClick:                docToolbarClick(Dialogs.Constants.toolbarKeyDocAlert),
            historyClick:               docToolbarClick(Dialogs.Constants.toolbarKeyHistory),

            selectKeyDown:              docHandlerSelectKeyDown,

            tabClick:                   docHandlerTabClick,
            tabGetFirstCtrl:            docHandlerTabGetFirstCtrl,

            viewLoad:                   docHandlerViewLoad,
            viewBeforeDestroy:          docHandlerViewBeforeDestroy,
            viewDestroy:                docHandlerViewDestroy,

            comboChange:                docHandlerComboChange,
            checkboxClick:              docHandlerCheckboxClick,

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
            textPasswordChange:         docHandlerTextPasswordChange,

            containsProperty:           docHandlerContainsProperty
          });
        };

        var setWizardListeners = function() {
          m_wizardView.addListener({
            comboChange:              wizHandlerComboChange,

            tabGetFirstCtrl:          wizHandlerTabGetFirstCtrl,
            tabClick:                 wizHandlerTabClick,

            checkboxClick:            wizHandlerCheckboxClick,

            cancelClick:              wizHandlerCancelClick,
            backClick:                wizHandlerBackClick,
            buttonClick:              wizHandlerButtonClick,
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
        };

        var setMasterListeners = function() {
          m_masterView.addListener({
            viewKeyDown:               masterHandlerViewKeyDown,

            afterShowModal:            masterHandlerAfterShowModal,

            popItemClick:              masterHandlerPopItemClick,

            tabGetFirstCtrl:           masterHandlerTabGetFirstCtrl,
            tabClick:                  masterHandlerTabClick,

            comboChange:               masterHandlerComboChange,
            checkboxClick:             masterHandlerCheckboxClick,

            buttonClick:               masterHandlerButtonClick,
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
        };

        // returns the view
        //
        // @return Dialogs.Views.View
        //
        var getView = function() {
          // documents
          //
          if(m_isDocument) {
            if(m_documentView === null) {
              m_documentView = Views.createDocumentView();
              setDocumentListeners();
              m_mustCompleteLoading = true;
            }
            return m_documentView;
          }
          //
          // wizards
          //
          else if(m_isWizard) {
            if(m_wizardView === null) {
              m_wizardView = Views.createWizardView();
              setWizardListeners();
              m_mustCompleteLoading = true;
            }
            return m_wizardView;
          }
          //
          // masters
          //
          else {
            if(m_masterView === null) {
              m_masterView = Views.createMasterView();
              setMasterListeners();
              m_mustCompleteLoading = true;
              setCanPrint();
              setShowPermissions();

              // only master dialogs can be of OkCancel type
              //
              if(m_showOkCancel) {

                m_masterView.getCancelButton().setText("Cancel");
                m_masterView.getCancelButton().setIsCancel(true);
                m_masterView.getSaveButton().setText("Ok");
                m_masterView.getCloseButton().setVisible(false);
              }

              if(m_saveText)  { m_masterView.getSaveButton().setText(m_saveText); }
              if(m_cancelText) { m_masterView.getCancelButton().setText(m_cancelText); }
            }

            return m_masterView;
          }
        };

        self.getView = getView;

        // hide tab buttons is used in wizards
        //
        self.setHideTabButtons = function(value) {
          m_hideTabButtons = value;
        };

        self.setOkCancelDialog = function(value) {
          m_showOkCancel = value;
        };

        self.getOkCancelDialogResult = function() {
          return m_okCancelResult;
        };

        self.setTabs = function(value) {
          m_tabs = value;
        };

        self.setNewPropertyKeyFocus = function(value) {
          m_newPropertyKeyFocus = value;
        };

        self.getNewPropertyKeyFocus = function() {
          return m_newPropertyKeyFocus;
        };

        self.setUseSelectIntValue = function(value) {
          m_useSelectIntValue = value;
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

        self.setChanged = function(value) {
          // in documents the view define if it was changed
          //
          if(m_isDocument) {
            if(getView()) {
              getView().changed = value;
            }
          }
          else {
            m_changed = value;
          }
        };

        // in some edit cases we need to know the value
        // of a cell to handle the beforeEdit event.
        // for example this happens in kit edition.
        // there we need to know the pr_id of an alternative
        // component to get how many serial numbers it needs
        // before allow the edition of the serial number
        //
        self.setCreateRowInBeforeEdit = function(value) {
          m_createRowInBeforeEdit = value;
        };

        self.setNoChangeColsInRefresh = function(value) {
          m_noChangeColsInRefresh = value;
        };

        self.getAutoPrint = function() {
          return m_autoPrint;
        };

        self.setAutoPrint = function(value) {
          m_autoPrint = value;
        };

        self.setBackColorTabMain = function(color) {
          if(m_documentView) {
            /* TODO: fix me this is used to identify NC in sales and purchases
            m_documentView.getTab().setBackColor(color);
            m_documentView.getTabFooter().setBackColor(color);
            m_documentView.getTabItems().setBackColor(color);
            */
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
          var R = Cairo.Settings.Reports;
          var U = Cairo.Util;
          var C = Cairo.Settings;

          var printManager = new Cairo.Entities.Printing.Manager();

          printManager.setPath(U.File.getValidPath(C.get(R.reportSection, R.reportPath, Cairo.Settings.appPath())));
          printManager.setCommandTimeout(U.val(C.get(R.reportSection, R.commandTimeOut, 0)));
          printManager.setConnectionTimeout(U.val(C.get(R.reportSection, R.connectionTimeOut, 0)));

          printManager.showPrint(id, tblId, NO_ID);
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
              group.setKey(Cairo.Util.val(col.getKey()) + 2);
              group.setSortType(Cairo.Constants.ShellSortOrder.ascending);

              // add sorting
              //
              col = property.getGrid().getColumns().get(keyColSort);

              group = grid.addGroup();
              group.setName(col.getName());
              group.setIndex(2);
              group.setKey(Cairo.Util.val(col.getKey()) + offSetColSort);
              group.setSortType(Cairo.Constants.ShellSortOrder.ascending);
              group.setIsSortCol(true);

              // do the grouping and sorting
              //
              grid.refreshGroupsAndFormulasEx(true);
              grid.expandAllGroups();
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
              var sortedRows = new Dialogs.Grids.createRows();

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
                e.message,
                e);
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

            for(var _i = 0, count = rows.count(); _i < count; _i++) {
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
              grid.draw();
            }
          }
          catch(ignore) {}
        };

        self.refreshColumnPropertiesByIndex = function(property, indexCol) {
          /* when the index is number the get method of collections uses it as an index */
          return self.refreshColumnProperties(property, indexCol);
        };

        self.refreshColumnProperties = function(property, keyCol) {
          var column = property.getGrid().getColumns().get(keyCol);
          var grid = getView().getGrids().get(property.getIndex());
          var colGrid = grid.getColumns().get(column.getIndex());
          m_gridManager.refreshColumnProperties(grid, column, colGrid);
        };

        // update edit status in all properties
        //
        self.refreshEnabledState = function(properties) {
          for(var _i = 0, count = properties.count(); _i < count; _i++) {
            self.setEnabled(properties.get(_i));
          }
          self.setTabIndexDescription();
        };

        // update value in all properties
        //
        self.showValues = function(properties) {
          if(m_isDocument) {
            // documents are edited using three dialog objects
            //
            for(var _i = 0, count = properties.count(); _i < count; _i++) {
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
            for(var _i = 0, count = properties.count(); _i < count; _i++) {
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

                  var font = Cairo.createFont();
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

          noChangeColumns = noChangeColumns === undefined ? false : noChangeColumns;
          strTag = strTag === undefined ? "" : strTag;

          switch(property.getType()) {

            case Dialogs.PropertyType.list:

              var c = view.getCombos().get(property.getIndex());
              c.clear();

              for(var _i = 0, count = property.getList().count(); _i < count; _i++) {
                var item = property.getList().get(_i);
                c.add(item.getValue(), item.getId());
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

              if(c.getListIndex() === -1 && c.count() > 0) { c.selectByIndex(0); }
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.select:

              var c = view.getSelects().get(property.getIndex());

              if(m_useSelectIntValue) {
                c.setId(
                  (property.getSelectIntValue() !== "")
                  ? property.getSelectIntValue()
                  : property.getSelectId());
              }
              else {
                c.setId(property.getSelectId());
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
              c.setText(property.getValue());
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

              var c = view.getCheckboxes().get(property.getIndex());
              c.setValue(Cairo.Util.val(property.getValue()) !== 0);
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.button:

              var c = view.getButtons().get(property.getIndex());
              c.setText(property.getName());
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.label:

              var c = view.getLabels().get(property.getIndex());
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

              var c = view.getTitleLabels().get(property.getIndex());
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
            lbl = view.getCtrlLabels().get(property.getLabelIndex());
          }

          if(c !== null) {

            var inCurrentTag = false;
            var lenStrTag = strTag.length;

            if(m_isDocument) {

              if(m_currentTab < m_tabOffset) {
                m_currentTab = m_tabOffset;
              }

              // strTag is used to know if this tab is owned
              // by the document dialog calling this method
              // (header, items or footer)
              //
              inCurrentTag = (c.getTag().substring(0, lenStrTag) === strTag
                              && c.getTag() !== ""
                              && !Controls.isTab(c)
                              && (Cairo.Util.val(c.getTag().substring(lenStrTag)) + m_tabOffset) === m_currentTab);
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
              view.getCheckboxes().get(index).setEnabled(enabled);
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
          setBackgroundColor();
          return true;
        };

        // unload property's control
        //
        self.unloadControl = function(property) {

          if(property.getControlLoaded()) {

            var index = property.getControl().getIndex();

            property.setControl(null);
            property.setControlLoaded(false);

            var view = getView();
            var propertyType = property.getType();

            switch(propertyType) {

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

                removeControl(view.getLabels().get(index));
                break;

              case Dialogs.PropertyType.title:

                removeControl(view.getTitleLabels().get(index));
                break;

              case Dialogs.PropertyType.progressBar:

                removeControl(view.getProgressBars().get(index));
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

                removeControl(view.getCheckboxes().get(index));
                break;

              case Dialogs.PropertyType.grid:

                removeControl(view.getGrids().get(index));
                break;

              case Dialogs.PropertyType.button:

                removeControl(view.getButtons().get(index));
                break;
            }

            //
            // update control index in all properties of the same type
            //
            for(var i = 0, count = m_properties.count(); i < count; i += 1) {
              var p = m_properties.get(i);
              if(propertyType === p.getType()) {
                if(property.getIndex() < p.getIndex()) {
                  p.setCtrlIndex(p.getIndex() -1);
                }
              }
            }

            index = property.getLabelIndex();
            if(index > 0) {
              removeControl(getView().getCtrlLabels().get(index));
            }
          }
        };

        self.closeWizard = function() {
          self.setChanged(false);
          removeControl(m_wizardView);
        };

        var controlIsButton = function(control) {
          return control.getObjectType() === "cairo.controls.button";
        };
        var controlIsLabel = function(control) {
          return control.getObjectType() === "cairo.controls.label";
        };
        var controlIsToolbar = function(control) {
          return control.getObjectType() === "cairo.controls.toolbar";
        };
        var controlIsImage = function(control) {
          return control.getObjectType() === "cairo.controls.image";
        };
        var controlIsGrid = function(control) {
          return control.getObjectType() === "cairo.controls.grid";
        };
        var controlIsCheckbox = function(control) {
          return control.getObjectType() === "cairo.controls.checkbox";
        };

        self.tabGetFirstCtrl = function(index) {

          var tabIndex = 999;
          var view = getView();
          var controls = view.getControls();
          var controlsCount = controls.count();
          var c = null;

          if(view.getTabs().get(index).getTag().indexOf(Dialogs.Constants.innerTab, 0) >= 0) {

            var childIndex = getTagChildIndex(view.getTabs().get(index).getTag());
            var fatherIndex = getTagFatherIndex(view.getTabs().get(index).getTag());

            for(var _i = 0; _i < controlsCount; _i++) {

              c = controls.get(_i);

              // TODO: remove after testing
              //if(!(controlIsButton(c) && c.getName().indexOf("cbTab", 1))) {
              if(!Controls.isTab(c)) {
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

              // TODO: remove after testing
              //if(!(controlIsButton(c) && c.getName().indexOf("cbTab", 1))) {
              if(!Controls.isTab(c)) {
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
                && !Controls.isTab(c)) {

              var isVisible = Cairo.Util.val(c.getTag().substring(strTag.length)) + m_tabOffset === index;

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
              if(!m_isItems && !m_isFooter) {
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
                && !Controls.isTab(c)) {

              var isVisible = Cairo.Util.val(c.getTag().substring(strTag.length)) + m_tabOffset === index;
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
                c.setBackColor(view.getBackground().getBackColor());
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
            if(c === ctl) {
              if(!property.getVisible()) {
                isVisible = false;
              }
              break;
            }
            else if(controlIsLabel(ctl)) {
              if(ctl.getName() === "__labelForControl__") {
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

        self.tabClick = function(index, fromWizard) {
          var firstTab = null;
          var view = getView();
          var controlsCount = view.getControls().count();
          var controls = view.getControls();
          var tab = view.getTabs().get(index);

          m_currentInnerTab = 0;

          if(tab.getTag().indexOf(Dialogs.Constants.innerTab, 0) >= 0) {

            var childIndex = getTagChildIndex(tab.getTag());
            var fatherIndex = getTagFatherIndex(tab.getTag());

            for(var _i = 0; _i < controlsCount; _i++) {
              var c = controls.get(_i);
              if(!Controls.isTab(c)) {
                if(c.getTag().trim() !== "") {
                  if(Cairo.Util.val(c.getTag()) !== fatherIndex) {
                    setVisible(c, childIndex);
                  }
                }
              }
            }

            tab.virtualPush(fromWizard);

            m_currentInnerTab = childIndex;

          }
          else {
            m_currentTab = index;

            for(var _i = 0; _i < controlsCount; _i++) {
              var c = controls.get(_i);
              if(Controls.isTab(c)) {
                if(c.getTag().indexOf(Dialogs.Constants.innerTab, 0) >= 0) {
                  var isVisible = getTagFatherIndex(c.getTag()) === index;
                  c.setVisible(isVisible);
                  if(isVisible) {
                    if(firstTab === null) {
                      firstTab = c;
                    }
                  }
                }
              }
              else if(c.getTag().trim() !== "") {
                setVisible(c, index);
              }
            }
          }

          if(firstTab !== null) {
            self.tabClick(firstTab.getIndex(), fromWizard);
            m_currentInnerTab = getTagChildIndex(firstTab.getTag());
          }
          view.showRows();
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

        self.showModal = function(obj, tabIndex) {
          m_modalDefer = new Cairo.Promises.Defer();

          self.show(obj, tabIndex);

          return m_modalDefer.promise;
        };

        var resolveModalPromise = function() {
          if(m_modalDefer !== null) {
            m_modalDefer.resolve();
          }
        };

        self.show = function(obj, tabIndex) {
          try {
            Cairo.LoadingMessage.showWait();
            return showDialog(obj, tabIndex);
          }
          catch(e) {
            Cairo.manageError(
              "Showing Dialog",
              "An error has occurred when showing a dialog.",
              e.message,
              e);
            return false;
          }
          finally {
            Cairo.LoadingMessage.close();
          }
        };

        /*
        *
        * called when the client has already loaded this dialog and wants only to make the
        * view visible
        *
        * */
        self.showDialog = function() {
          try {
            getView().showDialog();
          }
          catch(e) {
            Cairo.manageError(
              "Showing Dialog",
              "An error has occurred when showing a dialog.",
              e.message,
              e);
            return false;
          }
        };

        self.closeDialog = function() {
          try {
            getView().closeDialog();
          }
          catch(e) {
            Cairo.manageError(
              "Closing Dialog",
              "An error has occurred when closing a dialog.",
              e.message,
              e);
            return false;
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

        var implementsGrid = function(obj) {
          return obj.columnAfterEdit !== undefined;
        };

        var loadView = function(view, id) {
          /* TODO: implements this. */
          return true;
        };
        var loadViewConfiguration = function(view, id) {
          /* TODO: implements this. */
          return true;
        };

        var viewIsMaster = function(view) { return view.getType() === 'Dialog'; };
        var viewIsDocument = function(view) { return view.getType() === 'Document'; };
        var viewIsWizard = function(view) { return view.getType() === 'Wizard'; };

        var showDialog = function(obj, tabIndex) {
          var success = false;

          tabIndex = tabIndex || 0;

          if(obj !== null) {

            m_client = obj;

            var view = getView();

            m_clientManageGrid = implementsGrid(m_client);

            if(m_mustCompleteLoading) {
              m_mustCompleteLoading = false;

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
            }

            showView();

            view.setText(m_client.getTabTitle ? m_client.getTabTitle() : m_client.getTitle());
            view.setPath(m_client.getPath());
            view.setName(m_client.getEditorName());

            if(m_hideTitle) {
              view.getTitle().setVisible(false);
            }

            if(viewIsMaster(view)) {
              view.getEditDocumentsButton().setVisible(m_client.editDocumentsEnabled());
              view.getNewButton().setVisible(m_client.addEnabled());
              view.getCopyButton().setVisible(m_client.copyEnabled());
            }

            self.refreshViewTitle();
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
                      view.showModalDialog();
                    }
                  }
                  else {
                    view.showDialog();
                  }
                }
              }
              else {
                view.setLoading(false);
                if(m_inModalWindow) {
                  if(!m_viewShowed) {
                    m_viewShowed = true;
                    if(viewIsMaster(view) || viewIsWizard(view)) {
                      view.preShowView();

                      if(viewIsWizard(view)) {
                        loadViewConfiguration(getView(), "master_" + Cairo.Company.getName() + " - "+ m_client.getTitle());
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
                    view.showModalDialog();
                  }
                }
                else {
                  if(viewIsMaster(view) || viewIsWizard(view)) {
                    view.preShowView();

                    if(viewIsWizard(view)) {
                      loadViewConfiguration(getView(), "master_" + Cairo.Company.getName() + " - "+ m_client.getTitle());
                    }
                  }
                  view.showDialog();
                }
              }
            }
            selectTab(tabIndex);
            success = true;
          }
          return success;
        };

        var selectTab = function(tabIndex) {
          if(tabIndex !== -1) {
            var view = getView();
            if(m_isDocument) {
              if(m_isItems) {
                docTabClickEx(Cairo.Constants.DocumentSections.items, tabIndex + m_tabOffset);
              }
              else if(m_isFooter) {
                docTabClickEx(Cairo.Constants.DocumentSections.footer, tabIndex + m_tabOffset);
              }
              else {
                docTabClickEx(Cairo.Constants.DocumentSections.header, tabIndex);
              }
              view.getTabs().get(tabIndex + m_tabOffset).setTabSelected(true);
            }
            else {
              self.tabClick(tabIndex);
              view.getTabs().get(tabIndex).setTabSelected(true);
            }
          }
        };

        self.setHideTitle = function(value) {
          m_hideTitle = value;
        };

        self.setInModalWindow = function(value) {
          value = value !== undefined ? value : false;
          m_inModalWindow = value;
        };

        self.getInModalWindow = function() {
          return m_inModalWindow;
        };

        self.setIsDocument = function(value) {
          m_isDocument = value;
        };

        self.setIsFooter = function(value) {
          m_isFooter = value;
        };

        self.setIsItems = function(value) {
          m_isItems = value;
        };

        self.setView = function(value) {
          m_documentView = value;
          setDocumentListeners();
        };

        self.getViewMainImage = function() {
          return getView().getImage();
        };

        self.getProperties = function() {
          return m_properties;
        };

        self.refreshControls = function(noGrids) {
          if(!m_unloading) {
            showView(noGrids, false);
            try {
              var tab = getView().getTabs().get(m_currentTab);
              tab.virtualPush();
            }
            catch(ignore) {}
          }
        };

        self.showValue = function(property, noChangeColumns) {
          var strTag = "";
          if(m_isDocument) {
            strTag = getTag(property);
          }
          self.showValueEx(property, noChangeColumns, strTag);
        };

        var getTag = function(property) {
          return Cairo.safeExecute(
            function() {
              if(property.getControl() !== null) {
                var tag = property.getControl().getTag();
                return tag.substring(0, tag.length -1);
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
            m_tabs = Cairo.Collections.createCollection(Cairo.Dialogs.createTab);
          }
          return m_tabs;
        };

        self.setTitle = function(value) {
          m_title = value;
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

        var masterHandlerTabGetFirstCtrl = function(index) {
          return self.tabGetFirstCtrl(index);
        };

        var docHandlerContainsProperty = function(control) {
          for(var _i = 0, count = m_properties.count(); _i < count; _i++) {
            if(m_properties.get(_i).getControl() === control) {
              return true;
            }
          }
          return false;
        };

        var docHandlerButtonClick = function(index) {
          propertyHasChanged(Dialogs.PropertyType.button, index, getView().getButtons().get(index));
        };

        var docHandlerGridDblClick = function(index, eventArgs) {
          if(m_isItems) {
            if(m_clientManageGrid) {
              var property = getProperty(Dialogs.PropertyType.grid, index, 0);
              m_client.gridDblClick(property.getKey(), eventArgs.row, eventArgs.col);
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

        var wizHandlerGridDblClick = function(index, eventArgs) {
          if(m_clientManageGrid) {
            var property = getProperty(Dialogs.PropertyType.grid, index, 0);
            m_client.gridDblClick(property.getKey(), eventArgs.row, eventArgs.col);
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
              e.message,
              e);
          }
        };

        //------------
        // masters
        //
        var masterHandlerComboChange = function(index) {
          comboChange(index);
        };

        var masterHandlerTabClick = function(event) {
          self.tabClick(event.index);
        };

        var masterHandlerCheckboxClick = function(index) {
          checkboxClick(index);
        };

        var masterHandlerCancelClick = function() {
          var p = null;

          try {
            if(m_showOkCancel) {
              masterHandlerCloseClick();
              m_okCancelResult = false;
              resolveModalPromise();
            }
            else {
              if(m_sendRefresh) {
                m_client.messageEx(Dialogs.Message.MSG_DOC_REFRESH, null);
                self.refreshTitle();
                self.setChanged(false);
              }
              else {
                p = discardChanges(false);
              }
            }
          }
          catch(e) {
            Cairo.manageError(
              "Error in Master Cancel Click Handler",
              "An error has occurred when handling a 'cancel' action.",
              e.message,
              e);
          }
          return (p || P.resolvedPromise(true));
        };

        var masterHandlerButtonClick = function(index) {
          propertyHasChanged(Dialogs.PropertyType.button, index, getView().getButtons().get(index));
        };

        var masterHandlerCloseClick = function() {
          if(m_masterView !== null) {
            m_masterView.close();
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
              e.message,
              e);
          }
        };

        var doNew = function(view) {
          var p = null;

          // only in master or header of documents
          //
          if(!m_isItems && !m_isFooter) {
            p = saveChanges(false).whenSuccess(function() {

              var p = null;

              Cairo.LoadingMessage.showWait();

              m_title = "";

              if(!m_isDocument && !m_sendRefresh) {
                p = discardChanges(true);
              }

              p = p || P.resolvedPromise();

              return p
                .then(m_client.editNew)
                .then(function() {
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

                  return p || P.resolvedPromise();
                })
                .then(function() {
                  var p = null;

                  self.setChanged(false);

                  if(m_newPropertyKeyFocus !== "") {
                    self.setFocusFromPropertyKey(m_newPropertyKeyFocus);
                  }
                  else {
                    if(m_isDocument) {
                      p = newWithWizard().then(function() {
                        view.setFocusFirstControl();
                        return true;
                      });
                    }
                  }
                  return p || P.resolvedPromise(true);
                });
            });
          }
          return (p || P.resolvedPromise(true)).then(
            function(success) {
              Cairo.LoadingMessage.close();
              return success;
            }
          );
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
            m_client.messageEx(Dialogs.Message.MSG_ABM_PRINT, null).then(function(answer) {
              if(answer !== true) {
                Cairo.infoViewShow("Printing", "This dialog doesn't have a print option");
              }
            });
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
            Cairo.Util.File.editFile(Cairo.Util.File.getValidPath(Cairo.Settings.appPath()) + "cairo.html");
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
                  resolveModalPromise();
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
          catch(ignore) {
            Cairo.logError("Error in masterHandlerViewDestroy", ignore);
          }

          try {
            destroy();
          }
          catch(ignore) {
            Cairo.logError("Error in masterHandlerViewDestroy", ignore);
          }
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
          return (p || P.resolvedPromise(true));
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
        var masterHandlerGridColumnAfterEdit = function(index, eventArgs) {
          return gridColumnEdit(true, index, eventArgs.row, eventArgs.col, 0, eventArgs.newValue, eventArgs.newValueId);
        };

        var masterHandlerGridColumnAfterUpdate = function(index, eventArgs) {
          return gridColumnAfterUpdate(index, eventArgs.row, eventArgs.col, 0, eventArgs.newValue, eventArgs.newValueId);
        };

        // TODO: refactor promise is returned by this function
        //
        var masterHandlerGridColumnBeforeEdit = function(index, eventArgs) {
          // TODO: investigate why it calls gridColumnEdit instead of gridBeforeColumnEdit()
          return gridColumnEdit(false, index, eventArgs.row, eventArgs.col, eventArgs.keyAscii, 0, 0);
        };

        var masterHandlerGridColumnButtonClick = function(index, eventArgs) {
          return gridColumnButtonClick(index, eventArgs.row, eventArgs.col);
        };

        var masterHandlerGridDblClick = function(index, eventArgs) {
          if(m_clientManageGrid) {
            var property = getProperty(Dialogs.PropertyType.grid, index, 0);
            m_client.gridDblClick(property.getKey(), eventArgs.row, eventArgs.col);
          }
        };

        var masterHandlerGridDeleteRow = function(index, eventArgs) {
          return gridDeleteRow(index, eventArgs.row);
        };

        var masterHandlerGridNewRow = function(index, eventArgs) {
          return gridNewRow(index, eventArgs.row);
        };

        var masterHandlerGridAfterDeleteRow = function(index, eventArgs) {
          gridAfterDeleteRow(index, eventArgs.row);
        };

        var masterHandlerGridSelectionChange = function(index, eventArgs) {
          gridSelectionChange(index, eventArgs.row, eventArgs.col, Dialogs.GridSelectChangeType.GRID_SELECTION_CHANGE);
        };

        var masterHandlerGridSelectionRowChange = function(index, eventArgs) {
          gridSelectionChange(index, eventArgs.row, eventArgs.col, Dialogs.GridSelectChangeType.GRID_ROW_CHANGE);
        };

        var notCancel = function(result) {
          return !result.cancel;
        };

        var masterHandlerGridValidateRow = function(index, eventArgs) {
          return gridValidateRow(index, eventArgs.row, true).then(notCancel);
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

        var docHandlerTabClick = function(event) {
          self.docTabClick(event.index, event.tag);
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

        var docHandlerGridAfterDeleteRow = function(index, eventArgs) {
            gridAfterDeleteRow(index, eventArgs.row);
        };

        var docHandlerToolbarClick = function(button) {
          try {

            if(!m_isItems && !m_isFooter && button !== null) {

              switch(button.key) {

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
                    function(success) {
                      if(success) {
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

                  m_client.messageEx(Dialogs.Message.MSG_TOOLBAR_BUTTON_CLICK, button.key);
                  break;
              }
            }
          }
          catch(e) {
            Cairo.manageError(
              "Error in Document Toolbar Click Handler",
              "An error has occurred when processing '" + button.key + "' action.",
              e.message,
              e);
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
          return doNew(m_documentView).then(hideMsg);
        };

        var showMsg = function(msg) {
          /* TODO: implement this with an alert or something similar in the document's view instead of using the generic
           * LoadingMessage dialog which shows a modal dialog with a spinner and is shown on top of the question dialog
           *
           * */
          //Cairo.LoadingMessage.show("Documents", msg);
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

        var wizHandlerTabClick = function(event) {
          self.tabClick(event.index);
        };

        var wizHandlerCheckboxClick = function(index) {
          checkboxClick(index);
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

        var wizHandlerButtonClick = function(index) {
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
          catch(ignore) {
            Cairo.logError("Error in wizHandlerViewDestroy", ignore);
          }

          try {
            destroy();
          }
          catch(ignore) {
            Cairo.logError("Error in wizHandlerViewDestroy", ignore);
          }

        };

        // TODO: refactor promise is returned by this function
        //
        var wizHandlerGridColumnAfterEdit = function(index, eventArgs) {
          return gridColumnEdit(true, index, eventArgs.row, eventArgs.col, 0, eventArgs.newValue, eventArgs.newValueId);
        };

        var wizHandlerGridColumnAfterUpdate = function(index, eventArgs) {
          return gridColumnAfterUpdate(index, eventArgs.row, eventArgs.col, 0, eventArgs.newValue, eventArgs.newValueId);
        };

        // TODO: refactor promise is returned by this function
        //
        var wizHandlerGridColumnBeforeEdit = function(index, eventArgs) {
          // TODO: investigate why it calls gridColumnEdit instead of gridBeforeColumnEdit()
          return gridColumnEdit(false, index, eventArgs.row, eventArgs.col, eventArgs.keyAscii, 0, 0);
        };

        var wizHandlerGridColumnButtonClick = function(index, eventArgs) {
          return gridColumnButtonClick(index, eventArgs.row, eventArgs.col, eventArgs.keyAscii);
        };

        var wizHandlerGridDeleteRow = function(index, eventArgs) {
          return gridDeleteRow(index, eventArgs.row);
        };

        var wizHandlerGridNewRow = function(index, eventArgs) {
          return gridNewRow(index, eventArgs.row);
        };

        var wizHandlerGridAfterDeleteRow = function(index, eventArgs) {
          gridAfterDeleteRow(index, eventArgs.row);
        };

        var wizHandlerGridSelectionChange = function(index, eventArgs) {
          gridSelectionChange(index, eventArgs.row, eventArgs.col, Dialogs.GridSelectChangeType.GRID_SELECTION_CHANGE);
        };

        var wizHandlerGridSelectionRowChange = function(index, eventArgs) {
          gridSelectionChange(index, eventArgs.row, eventArgs.col, Dialogs.GridSelectChangeType.GRID_ROW_CHANGE);
        };

        var wizHandlerGridValidateRow = function(index, eventArgs) {
          return gridValidateRow(index, eventArgs.row, true).then(notCancel);
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
              e.message,
              e);
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
              e.message,
              e);
          }
        };

        var wizHandlerTextPasswordChange = function(index) {
          textPasswordChange(index);
        };

        //------------
        // Documents
        var docHandlerComboChange = function(index) {
          comboChange(index);
        };

        var docHandlerCheckboxClick = function(index) {
          checkboxClick(index);
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

          try {
            var view = getView();
            view.setUnloadCount(view.getUnloadCount() + 1);

            if (m_isFooter || m_isItems) {

              // only if the user didn't cancel the close tab or window action
              //
              if (!view.getCancelUnload()) {
                saveColumnsGrids();
                m_unloading = true;
                m_client = null;
              }
            }
            else {

              if (m_client !== null) {

                view.CancelUnload = false;

                saveColumnsGrids();
                m_unloading = true;

                m_client.terminate();
                m_client = null;
              }
            }

            // grids are destroyed only in footer because it is the last to process the unload event
            //
            if (view.getUnloadCount() === 3) {
              destroyGrids(view);
            }
          }
          catch(ignore) {
            Cairo.logError("Error in docHandlerViewDestroy", ignore);
          }

          m_documentView = null;

          try {
            destroy();
          }
          catch(ignore) {
            Cairo.logError("Error in docHandlerViewDestroy", ignore);
          }
        };

        var docHandlerGridColumnButtonClick = function(index, eventArgs) {
          return gridColumnButtonClick(index, eventArgs.row, eventArgs.col, eventArgs.keyAscii);
        };

        var docHandlerGridColumnAfterEdit = function(index, eventArgs) {
          return gridColumnEdit(true, index, eventArgs.row, eventArgs.col, 0, eventArgs.newValue, eventArgs.newValueId);
        };

        var docHandlerGridColumnAfterUpdate = function(index, eventArgs) {
          return gridColumnAfterUpdate(index, eventArgs.row, eventArgs.col, 0, eventArgs.newValue, eventArgs.newValueId);
        };

        // TODO: refactor promise is returned by this function
        //
        var docHandlerGridColumnBeforeEdit = function(index, eventArgs) {
          if(gridColumnBeforeEdit(index, eventArgs.row, eventArgs.col)) {
            return gridColumnEdit(false, index, eventArgs.row, eventArgs.col, eventArgs.keyAscii, 0, 0);
          }
          else {
            return P.resolvedPromise(false);
          }
        };

        var docHandlerGridDeleteRow = function(index, eventArgs) {
          return gridDeleteRow(index, eventArgs.row);
        };

        var docHandlerGridNewRow = function(index, eventArgs) {
          return gridNewRow(index, eventArgs.row);
        };

        var docHandlerGridValidateRow = function(index, eventArgs) {
          return gridValidateRow(index, eventArgs.row, true).then(notCancel);
        };

        var docHandlerGridSelectionChange = function(index, eventArgs) {
          gridSelectionChange(index, eventArgs.row, eventArgs.col, Dialogs.GridSelectChangeType.GRID_SELECTION_CHANGE);
        };

        var docHandlerGridSelectionRowChange = function(index, eventArgs) {
          gridSelectionChange(index, eventArgs.row, eventArgs.col, Dialogs.GridSelectChangeType.GRID_ROW_CHANGE);
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

        var comboChange = function(index) {
          propertyHasChanged(Dialogs.PropertyType.list, index, getView().combos.get(index));
        };

        var checkboxClick = function(index) {
          propertyHasChanged(Dialogs.PropertyType.check, index, getView().getCheckboxes().get(index));
        };

        var gridDeleteRow = function(index, rowIndex) {
          var p = null;
          try {
            if(m_clientManageGrid) {

              var property = getProperty(Dialogs.PropertyType.grid, index, 0);

              if(property !== null) {
                if(property.getGrid().getRows().count() > rowIndex) {
                  p = m_client.deleteRow(getPropertyKey(property), createRow(index, property, rowIndex), rowIndex).then(
                    function(success) {
                      if(success) {
                        property.getGrid().getRows().remove(rowIndex);
                        return m_client.messageEx(Dialogs.Message.MSG_GRID_ROW_DELETED, property.getKey()).then(
                          function() {
                            return true;
                          }
                        );
                      }
                      else {
                        return false;
                      }
                    }
                  );
                }
                else {
                  p = P.resolvedPromise(true);
                }
              }
            }
          }
          catch(e) {
            Cairo.manageError(
              "Delete a row",
              "An error has occurred when deleting a row in a grid.",
              e.message,
              e);
          }
          return (p || P.resolvedPromise(false));
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
            if(rowIndex < grid.getRows().count()) {
              grid.cellText(rowIndex, 1) === rowIndex;
            }

          }
          catch(ignore) {}
        };

        var setRowBackground = function(index, property, rowIndex, colIndex) {
          try {
            var grid = getView().getGrids().get(index);
            if(property.getGrid().getColumns().item(colIndex).getType() === Dialogs.PropertyType.grid) {
              grid.selectRow(rowIndex); // TODO: investigate how this is supposed to work, maybe this should be removed
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
                return m_client.messageEx(Dialogs.Message.MSG_GRID_ROW_CHANGE, property);
              }
            }
          }
        };

        var gridNewRow = function(index, rowIndex) {
          var p = null;
          if(m_clientManageGrid) {
            var property = getProperty(Dialogs.PropertyType.grid, index, 0);
            if(property !== null) {
              p = m_client.newRow(getPropertyKey(property), rowIndex).then(
                function() {
                  setDefaults(property, rowIndex);
                  return true;
                }
              );
            }
          }
          return p || P.resolvedPromise(true);
        };

        var setDefaults = function(property, rowIndex) {

          var row = createRow(property.getIndex(), property, rowIndex);

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

        var gridColumnAfterUpdate = function(index, rowIndex, colIndex, keyAscii, newValue, newValueId) {
          var p = null;

          try {

            if(m_clientManageGrid) {

              var property = getProperty(Dialogs.PropertyType.grid, index, 0);

              if(property !== null) {

                var propertyKey = getPropertyKey(property);

                // If the row doesn't exist we have to create it because the client need it to hold
                // calculated data
                createRowIfDoesntExist(property, index, rowIndex);

                setColumnValueInProperty(property, index, rowIndex, colIndex, newValue, newValueId);

                // Multi
                // if virtual rows were not created in this call
                // we update the grid
                //
                p = processVirtualRow(property, index, rowIndex, colIndex, propertyKey).then(
                  function(wasMultiRow) {
                    var p = null;

                    if(wasMultiRow === false) {
                      //
                      // Let client one chance to calculate columns
                      //
                      p = m_client.columnAfterUpdate(propertyKey, rowIndex, colIndex).then(
                        function() {
                          setRowValueInGrid(index, property, rowIndex, property.getGrid().getRows().get(rowIndex));
                          return true;
                        }
                      );
                    }

                    p = p || P.resolvedPromise(true);

                    return p.then(
                      function() {
                        if(columnIsEditable(property, colIndex)) {
                          self.setChanged(true);
                        }
                        return true;
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
              e.message,
              e);
          }

          return p || P.resolvedPromise(false);
        };

        var columnIsEditable = function(property, colIndex) {
          return property.getGrid().getColumns().get(colIndex).isEditable();
        };

        //
        // multi rows let the user to select more than one FK in a single selection
        // when the user does a multi row selection all events are managed by this function
        //
        // the return value is used to inform the type of selection
        //
        // true:    multi row selection
        // false:   normal selection
        //
        var processVirtualRow = function(property, index, rowIndex, colIndex, propertyKey) {

          return addVirtualRows(
            getPropertyKey(property), rowIndex, colIndex
          ).then(
            function(virtualRow) {
              //
              // we need to check that the return value of self.messageEx contains the virtualRow info
              //
              if(virtualRow.getSuccess === undefined) {
                Cairo.raiseError("Grid Edition", "The 'self.messageEx = function(messageId, info) {' method must return the info parameter when the message is 'Dialogs.Message.MSG_GRID_VIRTUAL_ROW'");
              }
              //
              // it is not a virtual row selection so we return false
              //
              if(virtualRow.getSuccess() === false) {
                return false;
              }
              else {
                var rowsInGrid = property.getGrid().getRows().count();
                var lastRow = rowsInGrid + virtualRow.getRowsToAdd();

                var colAmount = getColIndexFromKey(property, virtualRow.getColAmount());
                var q = 0;

                var p = P.resolvedPromise();

                //
                // for every new row we need to serialize
                // two set of events ( columnAfterEdit, columnAfterUpdate )
                // one set is to add the FK and the other is to calculate totals
                // when there is an amount column in the grid
                //
                var addVirtualRow = function() {
                  //
                  // first inform the client we are adding a row
                  //
                  return gridNewRow(index, i).then(
                    function() {
                      createRowIfDoesntExist(property, index, i);
                    }
                  ).then(
                    //
                    // this function contains all the validations and calls to the client to let it calculate
                    // and update cell's values.
                    //
                    function() {
                      var p = null;
                      //
                      // all virtual rows but the last one fire ColumnAfterEdit - ColumnAfterUpdate
                      //
                      if(i < lastRow -1) {
                        //
                        // updte the property with the FK
                        //
                        setColumnValueInProperty(property, index, i, colIndex, virtualRow.getNewValue(q), Cairo.Util.val(virtualRow.getNewId(q)));

                        p = m_client.columnAfterEdit(
                            propertyKey,
                            i,
                            colIndex,
                            virtualRow.getNewValue(q),
                            Cairo.Util.val(virtualRow.getNewId(q))
                        ).then(
                          function() {
                            //
                            // let client one chance to calculate cell's values
                            //
                            return m_client.columnAfterUpdate(
                                propertyKey,
                                i,
                                colIndex
                            ).then(
                              function() {
                                var p = null;
                                if(colAmount > 0) {
                                  //
                                  // updte the property with the amount
                                  //
                                  setColumnValueInProperty(property, index, i, colAmount, virtualRow.getNewAmount(q), 0);

                                  p = m_client.columnAfterEdit(
                                      propertyKey,
                                      i,
                                      colAmount,
                                      virtualRow.getNewAmount(q),
                                      0
                                  ).then(
                                    function() {
                                      //
                                      // let client one chance to calculate columns
                                      //
                                      return m_client.columnAfterUpdate(propertyKey, i, colAmount);
                                    }
                                  );
                                }
                                return p || P.resolvedPromise();
                              }
                            );
                          }
                        );
                      }
                      p = p || P.resolvedPromise();
                      return p.then(function() {
                        //
                        // finally we update the grid control
                        //
                        setRowValueInGrid(index, property, i, property.getGrid().getRows().item(i));
                      });
                    }
                  );
                };

                //
                // for every new row we need to serialize
                // two set of events ( columnAfterEdit, columnAfterUpdate )
                // one set is to add the FK and the other is to calculate totals
                // when there is an amount column in the grid
                //
                for(var i = rowsInGrid; i < lastRow; i++) {
                  p = p.then(addVirtualRow);
                  q = q + 1;
                }
                //
                // it was a multi row selection so we return true
                //
                return p.then(function() { return true; });
              }
            }
          );
        };

        var addVirtualRows = function(key, rowIndex, colIndex) {
          var virtualRow = Cairo.Dialogs.Grids.createVirtualRow();
          //
          // if the client is null just return a succes with result in false to cancel the addition
          //
          if(m_client === null) {
            return P.resolvedPromise(virtualRow);
          }
          else {
            //
            // inform the client the row and column where the wirtual row addition originated
            //
            virtualRow.setInfo({
              key: key,
              row: rowIndex,
              col: colIndex
            });

            //
            // the client will return a promise
            //
            return m_client.messageEx(Dialogs.Message.MSG_GRID_VIRTUAL_ROW, virtualRow);
          }
        };

        // TODO: check uses of this function to refactor _cancel_
        //
        var gridColumnBeforeEdit = function(index, rowIndex, colIndex) {
          var isEditable = false;
          try {

            if(m_clientManageGrid) {

              var property = getProperty(Dialogs.PropertyType.grid, index, 0);

              if(property !== null) {

                var grid = property.getGrid();
                var column = grid.getColumns().get(colIndex);
                var col = getView().getGrids().get(property.getIndex()).getColumns().get(colIndex);
                var rows = grid.getRows();
                var format = null;

                if(rowIndex < rows.count()) {
                  format = rows.get(rowIndex).get(colIndex).getFormat();
                }

                if(format === null) {
                  col.setType(column.getType());
                  col.setSubType(column.getSubType());
                  col.setSelectTable(column.getSelectTable());
                  col.setEditable(column.getEnabled());
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
                isEditable = col.getEnabled() && col.isEditable();
              }
            }
          }
          catch(e) {
            Cairo.manageError(
              "Edit",
              "An error has occurred before editing in a grid.",
              e.message,
              e);
          }
          return isEditable;
        };

        var gridColumnEdit = function(after, index, rowIndex, colIndex, keyAscii, newValue, newValueId) {
          var p = null;
          try {

            if(m_clientManageGrid) {

              var property = getProperty(Dialogs.PropertyType.grid, index, 0);

              if(property !== null) {

                var propertyKey = getPropertyKey(property);

                if(after) {

                  // If the row doesn't exists we have to create it because the client need it to hold
                  // calculated data
                  createRowIfDoesntExist(property, index, rowIndex);

                  p = m_client.columnAfterEdit(propertyKey, rowIndex, colIndex, newValue, newValueId);
                }
                else {

                  if(m_createRowInBeforeEdit) {
                    // If the row doesn't exists we have to create it because the client need it to hold
                    // calculated data
                    createRowIfDoesntExist(property, index, rowIndex);
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
              e.message,
              e);
          }
          return (p || P.resolvedPromise(false));
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
        // this function (when column.subType === textButtonEx)
        //
        // TODO: remove argument keyAscii ( not only in this function but in all clients m_client.columnButtonClick )
        //
        var gridColumnButtonClick = function(index, rowIndex, colIndex, keyAscii) {
          var p = null;
          try {

            if(m_clientManageGrid) {

              var property = getProperty(Dialogs.PropertyType.grid, index, 0);

              if(property !== null) {

                var propertyKey = getPropertyKey(property);

                // If the row not exists we have to create it because the client need it to hold
                // calculated data
                createRowIfDoesntExist(property, index, rowIndex);

                p = m_client.columnButtonClick(propertyKey, rowIndex, colIndex, keyAscii).then(
                  //
                  // the mustHandleEvent flag is passed to the grid to inform that the client has handled the button
                  // this code is executed either mustHandleEvent === true or false
                  //
                  function(mustHandleEvent) {
                    var p = null;
                    var grid = property.getGrid();

                    var updateCell = function() {
                      setRowValueInGrid(index, property, rowIndex, grid.getRows().item(rowIndex));
                      self.setChanged(true);
                    };

                    // if this column's type is textButtonEx we show the input text dialog
                    //
                    if(grid.getColumns().get(colIndex).getSubType() === Dialogs.PropertySubType.textButtonEx) {
                      var cell = grid.getRows().get(rowIndex).get(colIndex);
                      p = Cairo.Modal.inputFormView("", "", cell.getValue())
                        .then(function(text) { cell.setValue(text);});
                    }

                    p = (p || P.resolvedPromise(mustHandleEvent)).then(function() {
                      updateCell();
                      return mustHandleEvent;
                    });

                    return p;
                  }
                );
              }
            }
          }
          catch(e) {
            Cairo.manageError(
              "Edit",
              "An error has occurred when editing in a grid.",
              e.message,
              e);
          }
          return (p || P.resolvedPromise(false));
        };

        var createRowIfDoesntExist = function(property, index, rowIndex) {
          var rows = property.getGrid().getRows();
          var row = rows.getOrElse(rowIndex, null);
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
              for(var i = 0; i < rowCount; i++) {
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

        var setColumnValueInProperty = function(property, index, rowIndex, colIndex, newValue, newValueId) {
          var rows = property.getGrid().getRows();
          var row = rows.get(rowIndex);

          if(row === null) {
            row = createRow(index, property, rowIndex);
            rows.add(row);
          }

          var cell = row.get(colIndex);

          Cairo.safeExecute(function() {
            cell.setId(newValueId);
            cell.setValue(newValue);
            cell.setSelectIntValue(property.getControl().cell(rowIndex, colIndex).getTag());
          });

          row.getCells().inspect();
        };

        var putClientValuesIntoGrid = function(index, property, row, rowIndex, bAddRow, isValid) {
          if(isValid) {
            //
            // put client's values into the grid
            //
            row.getCells().item(0).setValue(rowIndex + 1);
            setRowValueInGrid(index, property, rowIndex, row);

            if(bAddRow) {
              var rows = property.getGrid().getRows();
              rows.remove(rowIndex);
              row.setIndex(rowIndex);
              rows.addBefore(rowIndex, row);

              if(row.get(Dialogs.Constants.keyRowItem) !== null) {
                row.get(Dialogs.Constants.keyRowItem).setValue(rowIndex + 1);
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
                isEmpty: false,
                isValid: true
              };
            }
          }
          else {
            return {
              cancel:  true,
              isEmpty: false,
              isValid: false // m_client set this row as invalid
            };
          }
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
                      call(putClientValuesIntoGrid, index, property, row, rowIndex, bAddRow)
                    );
                  }
                }
              );
            }
          }

          return (p || P.resolvedPromise({
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

                if(property.getSubType() === Dialogs.PropertySubType.textButtonEx) {
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
          return p || P.resolvedPromise();
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
          if(rows.count() > rowIndex && rows.get(rowIndex).count() > colIndex) {
            var cell = rows.get(rowIndex).get(colIndex);
            if(cell !== null) {
              key = cell.getKey();
            }
          }
          return key;
        };

        var createRow = function(index, property, rowIndex) {
          var row = Dialogs.Grids.createRow();
          var cell = null;
          var columns = property.getGrid().getColumns();
          var rows = property.getGrid().getRows();
          var gridCtrl = getView().getGrids().get(index);

          var count = columns.count();
          for(var _i = 0; _i < count; _i++) {

            var col = columns.get(_i);

            if(_i === 0) {
              cell = row.add(null, Dialogs.Constants.keyRowItem);
            }
            else {
              var key = getKeyFromRowValue(rows, rowIndex, _i);
              if(key !== "") {
                cell = row.add(null, key);
              }
              else {
                cell = row.add(null);
              }
            }

            var gridCell = gridCtrl.cell(rowIndex, _i);
            cell.setId(gridCell.getItemData());
            cell.setSelectIntValue(gridCell.getTag());

            if(col.getType() === Dialogs.PropertyType.date) {
              cell.setValue(Cairo.Util.getDateValueFromGrid(gridCell.getText()));
            }
            else if(col.getSubType() === Dialogs.PropertySubType.percentage) {
              cell.setValue(Cairo.Util.val(gridCell.getText()) * 100);
            }
            else {
              cell.setValue(gridCell.getText());
            }
            cell.setKey(col.getKey());
          }

          return row;
        };

        var setRowValueInGrid = function(index, property, rowIndex, row) {
          var gridControl = getView().getGrids().get(index);

          //
          // during this function the grid's DOM shouldn't be modified
          //
          gridControl.setRedraw(false);

          gridControl.setRowBackColor(rowIndex, row.getBackColor());
          gridControl.setRowForeColor(rowIndex, row.getForeColor());

          var columns = property.getGrid().getColumns();

          for(var _i = 0, count = columns.count(); _i < count; _i++) {
            var col = columns.get(_i);
            var cell = row.get(_i);

            var gridCell = gridControl.cell(rowIndex, _i);
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

          gridControl.setRedraw(true);
          gridControl.draw(rowIndex);
        };

        var showView = function(noGrids, bSetFocus) {
          var tabs = 0;
          var property = null;

          var propertyCount = m_properties.count();
          for(var _i = 0; _i < propertyCount; _i++) {
            property = m_properties.get(_i);
            if(getTabIndex(property) > tabs) {
              tabs = getTabIndex(property);
            }
          }

          showTabs(tabs + 1);

          m_showingForm = true;
          m_tabIndex = 0;

          for(var _i = 0; _i < propertyCount; _i++) {
            property = m_properties.get(_i);
            self.loadControlEx(property, noGrids);
          }

          self.setTabIndexDescription();

          m_showingForm = false;

          var view = getView();

          var lastTabIndex = 9999;

          if(!m_isDocument) {
            if(m_isWizard) {
              view.getNextButton().setTabIndex(lastTabIndex);
              view.getCancelButton().setTabIndex(lastTabIndex);
              view.getBackButton().setTabIndex(lastTabIndex);
            }
            else {
              view.getSaveButton().setTabIndex(lastTabIndex);
              view.getCancelButton().setTabIndex(lastTabIndex);
              view.getCloseButton().setTabIndex(lastTabIndex);
            }
          }

          //
          // some times new controls are added to the view like in
          // product edition when a template is selected
          //
          view.showAddedControls();

          if(bSetFocus) {
            view.setFocusFirstControl();
          }
        };

        //
        // wizard buttons
        //
        self.getCmdBack = function() {
          return getView().getBackButton();
        };

        self.getCmdCancel = function() {
          return getView().getCancelButton();
        };

        self.getCmdNext = function() {
          return getView().getNextButton();
        };

        var getInputType = function(subType) {
          var type = 0;

          switch(subType) {
            case Dialogs.PropertySubType.money:
              type = Controls.InputType.money;
              break;

            case Dialogs.PropertySubType.integer:
              type = Controls.InputType.integer;
              break;

            case Dialogs.PropertySubType.double:
              type = Controls.InputType.double;
              break;

            case Dialogs.PropertySubType.percentage:
              type = Controls.InputType.percentage;
              break;
          }
          return type;
        };

        var loadControl = function(property) {

          var nTabIndex = getTabIndex(property);
          var view = getView();
          var controlType = property.getType();
          var subType = property.getSubType();

          var label = null;

          if(property.getType() !== Dialogs.PropertyType.option
            && property.getType() !== Dialogs.PropertyType.toolbar
            && property.getType() !== Dialogs.PropertyType.label
            && property.getType() !== Dialogs.PropertyType.title
            && property.getNoShowLabel() === false
            && ! (m_isDocument
                  && (
                       property.getSelectTable() === Cairo.Tables.DOCUMENTO
                    || property.getKeyCol() === Cairo.Constants.NUMBER_ID
                    || property.getKeyCol() === Cairo.Constants.STATUS_ID
                   )
                 )
            ) {

            label = addControl(view, Dialogs.PropertyType.controlLabel);
            label.setTabGroupIndex(nTabIndex); // tab index in a control is for tab key navigation
            setTabGroup(label);
          }

          var c = addControl(view, controlType, subType);
          c.setTabGroupIndex(nTabIndex); // tab index in a control is for tab key navigation
          setTabGroup(c);

          if(label !== null) {
            label.setLabelFor(c._ID_);
            label.setVisible(property.getVisible());
          }

          switch(controlType) {

            case Dialogs.PropertyType.select:

              c.setSelectType(property.getSelectType());
              c.setSelectNoUseActive(property.getSelectNoUseActive());
              c.setTable(property.getSelectTable());
              c.setName(property.getName());
              c.reset();
              setFont(c, property);
              break;

            case Dialogs.PropertyType.numeric:

              if(subType === 0) {
                Cairo.raiseError("Dialog.loadControl", "subType wasn't set for property: " + property.getName());
              }

              c.setType(getInputType(subType));

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
              if(property.getSubType() === Dialogs.PropertySubType.title) {
                c.setCSSClass("label-title");
              }
              else if(property.getSubType() === Dialogs.PropertySubType.mainTitle) {
                c.setCSSClass("label-main-title");
              }
              else if(property.getSubType() === Dialogs.PropertySubType.subTitle) {
                c.setCSSClass("label-sub-title");
              }
              break;

            // this is here to avoid confuse someone reading the code and thinking we forgot this type
            //
            // case Dialogs.PropertyType.progressBar:
            // case Dialogs.PropertyType.image:

              // nothing to do :D
              //break;

            case Dialogs.PropertyType.title:
            case Dialogs.PropertyType.list:
            case Dialogs.PropertyType.button:

              setFont(c, property);
              break;

            case Dialogs.PropertyType.text:

              if(subType !== Dialogs.PropertySubType.memo) {
                if(c.getMask() !== "") {
                  var buttonStyle = subType === Dialogs.PropertySubType.textButton || subType === Dialogs.PropertySubType.textButtonEx;
                  buttonStyle = buttonStyle ? Dialogs.ButtonStyle.single : Dialogs.ButtonStyle.none;
                  c.setButtonStyle(buttonStyle);
                  c.setMask(property.getTextMask());
                  c.setType(Controls.InputType.text);
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

            case Dialogs.PropertyType.grid:

              c.setEnabled(property.getGridEditEnabled());
              m_gridManager.setProperties(c);

              var grid = property.getGrid();
              c.setNoSelectInGotFocus(grid.getNoSelectInGotFocus());
              c.setRowMode(grid.getRowMode());
              break;

            case Dialogs.PropertyType.toolbar:

              property.setToolbar(c);
              break;
          }

          if(property.getCSSClass() !== "") {
            c.setCSSClass(property.getCSSClass());
          }

          if(property.getType() !== Dialogs.PropertyType.toolbar) {
            property.setCtrlIndex(c.getIndex());
          }

          setTabIndex(c);
          m_tabIndex += 1;

          property.setControl(c);

          if(m_isDocument) {
            if(c.getTag() !== 'document_header') {
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
          }
          else {
            if(property.getTabIndex2() !== 0) {
              c.setTag(property.getTabIndex2());
            }
            else {
              c.setTag(property.getTabIndex());
            }
          }

          c.setEnabled(property.getEnabled());
          c.setName(property.getName());
          setBackColor(c, property);
          setButton(c, property);

          /* documents header */
          if(m_isDocument) {

            if(property.getSelectTable() === Cairo.Tables.DOCUMENTO) {

              c.setFontSize(11);
              c.setFontBold(true);
              c.setTag("document_header");
            }
            else if(property.getKeyCol() === Cairo.Constants.NUMBER_ID
                    || property.getKeyCol() === Cairo.Constants.STATUS_ID) {

              c.setFontSize(11);
              c.setFontBold(true);
              c.setForeColor(Dialogs.Colors.white);
              c.setBackColor(Dialogs.Colors.buttonShadow);
              c.setBorderColor(Dialogs.Colors.buttonFace);
              c.setTag("document_header");
            }
          }

          /* label formatting */

          if(property.getType() === Dialogs.PropertyType.option) {
            c.setText(property.getName());
          }
          else if(property.getType() === Dialogs.PropertyType.toolbar) {

            // TODO: implement frameToolbar
            //
            var frameToolbar = null;
            frameToolbar.setTag(property.getTabIndex());
            setToolbar(tbl, property.getButtons());
          }
          else if(label !== null
                  && property.getType() !== Dialogs.PropertyType.label
                  && property.getType() !== Dialogs.PropertyType.title) {

            property.setLabelIndex(label.getIndex());
            label.setText(property.getName());
            label.setBackStyle(Dialogs.BackgroundType.transparent);
            label.setTag(c.getTag());
            if(property.getType() === Dialogs.PropertyType.button) {
              label.setVisible(false);
            }

            // hide labels for grids, buttons and images
            //
            if(property.labelIsHidden()) {
              label.setVisible(false);
              // labels with tag === -1 aren't modified by showValue
              label.setTag("-1");
            }

            // special formats for grids
            //
            if(property.getType() === Dialogs.PropertyType.grid) {

              if(m_isItems) {
                label.setVisible(false);
                label.setVisible(false);
                label.setTag("-1");      // labels with tag === -1 aren't modified by showValue
              }
            }
            else {

              if(m_isFooter) {
                label.setTextAlign(Dialogs.TextAlign.right);
              }
            }
          }

          return true;
        };

        var setTabIndex = function(c) {
          Cairo.safeExecute(function() { c.setTabIndex(m_tabIndex); });
        };

        var getProperty = function(type, index, subType) {

          var property;
          var found = false;
          var propertyCount = m_properties.count();

          subType = subType === undefined ? null : subType;

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
                    //   subType === Dialogs.PropertySubType.textButton or Dialogs.PropertySubType.textButtonEx
                    // textButtonClick call will pass 0 as subType
                    //
                    // so this if handles text controls which has a button and aren't file or folder
                    //
                    else if((property.getType() === Dialogs.PropertyType.text
                      && (property.getSubType() === Dialogs.PropertySubType.textButton
                      || property.getSubType() === Dialogs.PropertySubType.textButtonEx))) {

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

          return null;
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
                        self.showValueEx(property, m_noChangeColsInRefresh, "");
                      }
                    }
                  }
                );
              }

              // TODO: I don't like this code because I think it should be
              // including in the above if. I don't see a reason to execute
              // this code when property is null the original code was coded
              // this way. It should be refactored.

              p = p || P.resolvedPromise(true);

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
                      //
                      // TODO: maybe this should check if there are unsaved changes and ask
                      //       the user to confirm he/she wants to close this dialog
                      //
                      m_masterView.close();
                    }
                  }

                  return (p || P.resolvedPromise(true));
                }
              );
            }
          }
          catch(e) {
            Cairo.manageError(
              "Update",
              "An error has occurred when updating a property.",
              e.message,
              e);
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
        var validateItemsAndFooters = function() {
          var p = null;
          if(m_isDocument) {
            p = m_client.messageEx(Dialogs.Message.MSG_DOC_EX_GET_ITEMS, null).then(
              function(dialog) {
                return dialog.validateEx();
              }
            ).then(
              function(success) {
                if(success) {
                  return m_client.messageEx(Dialogs.Message.MSG_DOC_EX_GET_FOOTERS, null).then(
                    function(dialog) {
                      return dialog.validateEx();
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
            p = P.resolvedPromise(true);
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
                resolveModalPromise();
              }
            }
          );
        };

        // TODO: refactor promise is returned by this function
        //
        var saveDialog = function(unloading, saveAs) {
          var defer = new P.Defer();
          var success = function(success) { defer.resolve(success); };
          var error = function() { defer.resolve(false); }
          setTimeout(function(){ _saveDialog().then(success, error); }, 300);
          return defer.promise;
        };

        var _saveDialog = function(unloading, saveAs) {
          var p = null;

          try {

            if(!m_isItems && !m_isFooter) {

              m_inSave = true;

              //
              // first we need to take all input from the view's controls and update
              // the properties collection
              //
              refreshAux();
              fillList();

              //
              // with grids we need to call the client so it could mean an ajax request
              // that is why we use promises
              //
              p = fillGrids().whenSuccess(
              //
              //  if there aren't errors just disabled all controls so the user can't
              //  input anything until we have finished with saving
              //
              //
                function() {
                  var p = null;

                  if(!m_isDocument) {
                    setEnabled(false);
                  }

                  // tell the document client the validation is starting
                  //
                  if(m_isDocument) {
                    p = m_client.messageEx(Dialogs.Message.MSG_DOC_EX_PRE_VALIDATE, null);
                  }

                  return p || P.resolvedPromise();
                },
                false
              ).then(
              //
              // now we need to validate
              // again validation could mean an ajax request
              //
                validate

              ).whenSuccess(
              //
              // if validation succeeded we check items and footers
              //
                validateItemsAndFooters

              ).whenSuccess(
              //
              // all validation succeeded, now we save
              //
                function() {

                  Cairo.LoadingMessage.showWait();

                  // standard document, wizard or master save
                  //
                  if(!saveAs) {
                    return m_client.save();
                  }
                  else {

                    // saveAs allows to save copys of documents between different document types
                    // like save an invoice like budget
                    //
                    return m_client.messageEx(Dialogs.Message.MSG_SAVE_AS, null);
                  }
                }
              ).whenSuccess(
              //
              // if save has succeeded we need to refresh some parts of the view
              //
                function() {
                  var p = null;

                  if(!m_isDocument) {
                    setEnabled(true);
                  }

                  if(!unloading) {
                    var refreshAfterSave = function() {
                      if(!m_isDocument) {
                        self.refreshTitle();
                      }
                      getView().setFocusFirstControl();
                    };

                    if(!m_isDocument && !m_sendRefresh && !m_showOkCancel) {
                      p = discardChanges(false).then(refreshAfterSave);
                    }
                    else {
                      p = m_client.messageEx(Dialogs.Message.MSG_DOC_REFRESH, null).then(refreshAfterSave);
                    }
                  }

                  p = p || P.resolvedPromise(true);

                  //
                  // this function always returns success
                  //
                  return p.successful;
                }
              ).whenSuccess(
                /*

                  save has SUCCEEDED

                  we reset the changed flag and returns TRUE

                */
                function() {
                  self.setChanged(false);
                  return true;
                },
                /*

                 save has FAILED

                 we enable controls and retuns FALSE

                */
                function() {
                  if(!m_isDocument) {
                    setEnabled(true);
                  }
                  return false;
                }
              );

            }
          }
          catch(e) {
            Cairo.manageError(
              "Saving",
              "An error has occurred when saving.",
              e.message,
              e);
          }

          p = p || P.resolvedPromise(false);

          return p.then(
            function(success) {
              m_inSave = false;
              Cairo.LoadingMessage.close();
              return success;
            }
          );
        };

        var fillList = function() {
          var listCount = getView().getCombos().count();
          var propertyCount = m_properties.count();
          var view = getView();
          for(var index = 0; index < listCount; index++) {
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
          var p = P.resolvedPromise(true);

          var view = getView();
          var gridCount = view.getGrids().count();
          var propertyCount = m_properties.count();

          var callFillRow = function(property, index) {
            return function(success) {
              if(success) {
                return fillRows(property.getGrid(), view.getGrids().get(index));
              }
              else {
                return false; // cancel next promises
              }
            }
          };

          for(var index = 0; index < gridCount; index++) {
            for(var _j = 0; _j < propertyCount; _j++) {
              var property = m_properties.get(_j);
              if(property.getType() === Dialogs.PropertyType.grid) {
                if(property.getIndex() === index) {
                  p = p.then(callFillRow(property, index));
                }
              }
            }
          }
          return p;
        };

        // TODO: refactor promise is returned by this function
        //
        var fillRows = function(grid, gridCtrl) {

          // by default all rows are valid and aren't empty
          //
          var result = {
            cancel:  false,
            isEmpty: false,
            isValid: true
          };

          var p = P.resolvedPromise(result);
          var colIndex = 0;
          var rowIndex = 0;
          var rowCount = 0;
          var columnCount = 0;

          var keys = [];

          // TODO: check if when implement this clear method it is needed to clear haveKey

          ///////////////////////////////////////////////////////////////////////
          //
          // make a copy of all the keys
          //
          var haveKey = grid.getHaveKey();

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

          grid.setHaveKey(haveKey);
          //
          // end copy keys
          ///////////////////////////////////////////////////////////////////////

          var fillRow = function(rowIndex, result) {
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

                var col = grid.getColumns().item(colIndex);
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

            return result;
          };

          // the grid's rows collection doesn't contain the new row
          // not all grids allow to add new rows
          // getRowCount contemplate all this cases
          //
          rowCount = gridCtrl.getRowCount();
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
                p = p.then(call(gridValidateRow, gridCtrl.getIndex(), rowIndex, false));
              }
            }

            if(p === null) {
              fillRow(rowIndex, result);
            }
            else {
              p = p.then(call(fillRow, rowIndex));
            }
          }

          return p.then(function(result) {
            return result.isValid;
          });
        };

        var saveColumnsGrids = function() {
          var view = getView();
          var count = view.getGrids().count();
          for(var i = 0; i < count; i++) {
            var property = getProperty(Dialogs.PropertyType.grid, i, 0);
            if(property !== null) {
              m_gridManager.saveColumnOrder(view.getGrids().get(i), getGridName(property));
            }
          }
        };

        var discardChanges = function(dontCallClient) {
          var p = null;

          try {

            if(!dontCallClient) {
              p = m_client.discardChanges();
            }
          }
          catch(e) {
            Cairo.manageError(
              "Discard Changes",
              "An error has occurred when discarding changes.",
              e.message,
              e);
          }

          return (p || P.resolvedPromise(true));
        };

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
                var p = P.resolvedPromise(true);
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
                      if(success === true || success.isValid === true) {
                        //
                        // gridValidateRow will ask the client to validate one row
                        // and will returns a promise
                        //
                        return gridValidateRow(property.getIndex(), rowIndex, true).then(
                          function(success) {
                            if(success.isValid === false) {
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
                  return p;
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

          var propertyCount = m_properties.count();
          var tabCount = m_tabs.count();

          for(var _i = 0; _i < tabCount; _i++) {
            m_tabs.get(_i).setCtrlIndex(_i);
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

        var createFirstTabIfNotExists = function() {
          var tabs = self.getTabs();
          if(tabs.count() === 0) {
            tabs.add();
          }
        };

        var showTabs = function(tabs) {

          var view = getView();

          createFirstTabIfNotExists();

          tabs = (m_tabs.count() > tabs) ? m_tabs.count() : tabs;

          var tabsCtrl = view.getTabs();
          var tab;

          //
          // only the first time this function is called we initialize
          // m_tabOffset
          //
          m_tabOffset = m_tabOffset === -1 ? tabsCtrl.count() : m_tabOffset;

          for(var i = m_tabOffset, k = 0; i < tabs + m_tabOffset; i += 1, k += 1) {

            tab = m_tabs.get(k);

            if(tab.getControl() === null) {

              var tabCtrl = view.getTabs().add();

              tab.setControl(tabCtrl);

              if(m_isDocument) {
                if(m_isItems) {
                  tabCtrl.setTag(Cairo.Constants.DocumentSections.items);
                  tabCtrl.setColumns(1);
                  tabCtrl.setTabGroup(1);
                }
                else if(m_isFooter) {
                  tabCtrl.setTag(Cairo.Constants.DocumentSections.footer);
                  tabCtrl.setColumns(6);
                  tabCtrl.setTabGroup(2);
                }
                else {
                  tabCtrl.setTag(Cairo.Constants.DocumentSections.header);
                  tabCtrl.setColumns(4);
                }
              }
              else {
                tabCtrl.setColumns(4);
              }

              if(tab.getFatherTab() !== "") {
                var fatherTab = m_tabs.get(tab.getFatherTab());
                tabCtrl.setTag(tabCtrl.getTag()
                              + Dialogs.Constants.innerTab
                              + ((fatherTab.getIndex() * 100) + Math.abs(tab.getIndex())).toString());

              }

              tabCtrl.setText("Tab" + i.toString());
              tabCtrl.setTabStop(false);
              tabCtrl.setVisible(!m_hideTabButtons);
              tabCtrl.setLayout(tab.getLayout());
            }
          }

          var tabCount = m_tabs.count();
          for(var _i = 0; _i < tabCount; _i++) {
            tab = m_tabs.get(_i);
            if(tab.getIndex() < 0) {
              tabCtrl = view.getTabs().get(tab.getCtrlIndex() + m_tabOffset);
              tabCtrl.setText(tab.getName());
            }
            else {
              tabCtrl = view.getTabs().get(tab.getIndex() + m_tabOffset);
              tabCtrl.setText(tab.getName());
            }
          }
        };

        var setButton = function(control, property) {

          if(control.getType !== undefined) {
            if(!(
                  control.getObjectType() === "Controls.input"
                    && control.getType() !== Controls.InputType.text
                )
              && !(
                  control.getObjectType() === "Controls.datePicker"
                    && control.getType() !== Controls.DatePickerType.time
                  )
              ) {

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
            return m_client.moveNext();
          }
          catch(e) {
            Cairo.manageError(
              "Moving",
              "An error has occurred when moving to the next step.",
              e.message,
              e);
            return P.resolvedPromise(false);
          }
        };

        var moveBack = function() {
          try {
            return m_client.moveBack();
          }
          catch(e) {
            Cairo.manageError(
              "Moving",
              "An error has occurred when moving to the previous step.",
              e.message,
              e);
            return P.resolvedPromise(false);
          }
        };

        self.refreshFont = function(property) {
          if(property.getControl() !== null) {
            setFont(property.getControl(), property);
          }
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
                propertyHasChanged(Dialogs.PropertyType.check, index, view.getCheckboxes().get(index), true);
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
        };

        self.printDocEx = function(id) {
          return print(false, id);
        };

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
          if(id === NO_ID) {
            return P.resolvedPromise(false);
          }
          else {
            var config = Cairo.Settings;
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
                return printManager.showPrint(id, NO_ID, docId);
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
            if(m_isDocument === true) {

              id = id || NO_ID;

              if(id === NO_ID) {
                id = m_client.id();
              }

              if(id === NO_ID) {
                Cairo.infoViewShow("Printing", "The document must be saved before printing");
              }

              if(!m_inSave) {
                p = saveChanges(false);
              }

              p = p || P.resolvedPromise(true);

              p.whenSuccess(
                function() {
                  var config = Cairo.Settings;
                  var reportConfig = config.Reports;
                  var printManager = Cairo.Entities.Printing.createManager();

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
                  .whenSuccessWithResult(
                    function(result) {
                      printManager.setEmailAddress(result.email.trim());
                      return getUserDescription();
                    }
                  ).whenSuccess(
                    function(description) {
                      printManager.setUserDescription(description);
                    }
                  ).then(
                    function() {
                      printManager.setAutoPrint(m_autoPrint);
                      return printManager.showPrint(id, NO_ID, m_client.docId())
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
              e.message,
              e);
          }

          return (p || P.resolvedPromise(false));
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
          return (p || P.resolvedPromise(false));
        };

        var getTabIndex = function(property) {
          var index = 0;
          if(property.getTabIndex() !== Dialogs.TabIndexType.TAB_ID_XT_ALL
            && property.getTabIndex() !== Dialogs.TabIndexType.TAB_ID_XT_ALL2) {
            index = property.getTabIndex();
          }
          return index;
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

        //
        // initialization and termination
        //

        var initialize = function() {

          m_isDocument = false;
          m_isFooter   = false;
          m_isItems    = false;
          m_viewShowed = false;

          m_tabHideControlsInAllTab = -1;

          m_properties = Dialogs.createProperties();
        };

        var destroy = function() {

          m_menu = null;

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

        var setEnabled = function(bEnabled) {
          var view = getView();
          var controlCount = view.getControls().count();
          var i = 0;

          if(bEnabled) {
            for(var _i = 0; _i < controlCount; _i++) {
              var ctl = view.getControls().get(_i);
              if(controlIsGrid(ctl)) {
                if(m_enabledState[i]) {
                  ctl.setEnabled(true);
                }
                i = i + 1;
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
            var subTitle = view.getSubTitle();
            subTitle.setText(m_client.getTitle() + " - "+ m_title);
            subTitle.flash();
          }
          else {
            view.getSubTitle().setText(m_client.getTitle());
          }
        };

        self.refreshViewTitle = function() {
          Cairo.safeExecute(function() {
            getView().setTitle(getViewTitle());
          });
        };

        var getViewTitle = function() {
          return m_viewText + Cairo.Company.getName()
            + " - " + m_client.getTitle()
            + " || Press F12 to see the a shortcut key list";
        };

        // TODO: implement or remove
        var setBackgroundColor = function() {
          if(m_backgroundColor !== 0) {
            self.setBackColorTabMainEx(Dialogs.Colors.backgroundColor);
          }
        };

        self.setBackColorTabMainEx = function(color) {
          m_backgroundColor = color;
          if(m_masterView !== null) {
            m_masterView.getBackground().setBackColor(color);
          }
          else if(m_documentView !== null) {
            m_documentView.getBackground().setBackColor(color);
            m_documentView.getTabItems().setBackColor(color);
          }
          else if(m_wizardView !== null) {
            m_wizardView.getBackground().setBackColor(color);
            m_wizardView.getDialogBackground().setBackColor(color);
            m_wizardView.getTitleBackground().setBackColor(Dialogs.Colors.tabBackColor);
          }
        };

        var isControlVisibleInTab = function(c, index) {
          var tabIndex = Cairo.Util.val(c.getTag());
          return (tabIndex === index
                  || (tabIndex === Dialogs.TabIndexType.TAB_ID_XT_ALL
                        && index !== m_tabHideControlsInAllTab)
                  || tabIndex === Dialogs.TabIndexType.TAB_ID_XT_ALL2);
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
          getView().removeControl(c);
        };

        var addControl = function(view, type, subType) {
          var ctrl = null;

          switch(type) {
            case Dialogs.PropertyType.select:
              ctrl = view.getSelects().add();
              break;

            case Dialogs.PropertyType.text:
            case Dialogs.PropertyType.file:
            case Dialogs.PropertyType.folder:

              if(subType === Dialogs.PropertySubType.memo) {
                ctrl = view.getTextAreas().add();
              }
              else {
                ctrl = view.getTextInputs().add();
              }
              break;

            case Dialogs.PropertyType.numeric:
              ctrl = view.getMaskEdits().add();
              break;

            case Dialogs.PropertyType.option:
              ctrl = view.getOptionButtons().add();
              break;

            case Dialogs.PropertyType.list:
              ctrl = view.getCombos().add();
              break;

            case Dialogs.PropertyType.check:
              ctrl = view.getCheckboxes().add();
              break;

            case Dialogs.PropertyType.password:
              ctrl = view.getPasswordInputs().add();
              break;

            case Dialogs.PropertyType.grid:
              ctrl = view.getGrids().add();
              break;

            case Dialogs.PropertyType.date:
            case Dialogs.PropertyType.time:
              ctrl = view.getDatePickers().add();
              break;

            case Dialogs.PropertyType.button:
              ctrl = view.getButtons().add();
              break;

            case Dialogs.PropertyType.progressBar:
              ctrl = view.getProgressBars().add();
              break;

            case Dialogs.PropertyType.label:
              ctrl = view.getLabels().add();
              break;

            case Dialogs.PropertyType.title:
              ctrl = view.getTitleLabels().add();
              break;

            case Dialogs.PropertyType.controlLabel:
              ctrl = view.getCtrlLabels().add();
              ctrl.setName("__labelForControl__");
              break;
          }

          return ctrl;
        };

        var groupGridEx = function(property, keyCol, keyColSort) {
          // TODO: implement this.
        };

        var setToolbar = function() {
          // TODO: implement this.
        };

        var setTabGroup = function(c) {
          if(m_isDocument) {
            if(m_isItems) {
              c.setTabGroup(1);
            }
            else if(m_isFooter) {
              c.setTabGroup(2);
            }
            else {
              c.setTabGroup(0);
            }
          }
          else {
            c.setTabGroup(0);
          }
        };

        var getTagChildIndex = function(tag) {
          var index = 0;
          var i = tag.indexOf(Dialogs.Constants.innerTab, 0);
          if(i >= 0) {
            var n = Cairo.Util.val(tag.substring(i + Dialogs.Constants.innerTab.length));
            var q = Math.abs(Cairo.Math.truncate(n / 100));
            index = (n - q * 100) * -1;
          }
          return index;
        };

        var getTagFatherIndex = function(tag) {
          var index = 0;
          var i = tag.indexOf(Dialogs.Constants.innerTab, 0);
          if(i >= 0) {
            return Math.abs(Cairo.Math.truncate(Cairo.Util.val(tag.substring(i + Dialogs.Constants.innerTab.length)) / 100));
          }
          return index;
        };

        var destroyGrids = function(view) {
          var count = view.getGrids().count();
          for(var i = 0; i < count; i += 1) {
            removeControl(view.getGrids().get(i));
          }
        };

        self.bringToFront = function() {
          getView().bringToFront();
        };

        self.focus = self.bringToFront;

        initialize();

        return self;
      }
    };

  });

}());