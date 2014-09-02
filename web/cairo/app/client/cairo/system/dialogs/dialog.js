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

        var C_RPT_KEY = "RPT-CONFIG";
        var C_RPT_PATH_REPORTS = "RPT_PATH_REPORTS";
        var C_RPT_COMMAND_TIMEOUT = "RPT_COMMAND_TIMEOUT";
        var C_RPT_CONNECTION_TIMEOUT = "RPT_CONNECTION_TIMEOUT";

        // allows controls to be visible in different tabs
        //
        var TabIndexType = Cairo.Entities.Dialogs.TabIndexType;

        var GridSelectChangeType = {
          GRID_SELECTION_CHANGE: 1,
          GRID_ROW_CHANGE:       3
        };

        var m_enabledState = [];

        var m_inProcess = false;

        var m_client;

        var m_properties;

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
        var m_formText = "";

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
        var m_formShowed = false;

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
          m_formText = rhs;
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

                m_masterView.cmdCancel.text = "Cancel";
                m_masterView.cmdCancel.cancel = true;

                m_masterView.cmdSave.text = "Ok";
                m_masterView.cmdCancel.width = m_masterView.cmdSave.width;

                m_masterView.cmdClose.visible = false;
              }

              if(m_saveText)  { m_masterView.cmdSave.text  = m_saveText; }
              if(m_saveWidth) { m_masterView.cmdSave.width = m_saveWidth; }
              if(m_saveTop)   { m_masterView.cmdSave.top   = m_saveTop; }
              if(m_saveLeft)  { m_masterView.cmdSave.left  = m_saveLeft; }

              if(m_cancelText) { m_masterView.cmdCancel.text = m_cancelText; }
              if(m_cancelTop)  { m_masterView.cmdCancel.top  = m_cancelTop; }
              if(m_cancelLeft) { m_masterView.cmdCancel.left = m_cancelLeft; }
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

        self.setUseHelpValueProcess = function(rhs) {
          m_useSelectIntValue = rhs;
        };

        self.setRowSelected = function(property, rowIndex) {
          try {
            var grid = property.getCtl();
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

              for (var q = 0; q < m_nextTop.length; q++) {
                m_nextTop[q] = m_constTop;
                m_left[q] = m_constLeft;
              }
            }
          }
        }

        self.refreshSelStartToEnd = function(property) {
          try {
            var c = property.getCtl()
            c.selStart(c.text.length());
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
            property.getCtl().SetFocus;
          }
          catch(ignore) {}
        };

        self.setFocusInGridItems() {
          try {
            setFocusControl(m_documentView.getGrid(0));
            Cairo.Util.sendKeys("{ENTER}");
          }
        }

        self.printABM(int id, int tblId) {

            //'CSPrintManager.cPrintManager
            Object printManager = null;

            printManager = CSKernelClient2.CreateObject("CSPrintManager2.cPrintManager");

            // With printManager;
                printManager.Path = GetValidPath(mMngIni.iniGetEx(C_RPT_KEY, C_RPT_PATH_REPORTS, mUtil.gAppPath));
                printManager.CommandTimeout = mUtil.val(mMngIni.iniGetEx(C_RPT_KEY, C_RPT_COMMAND_TIMEOUT, 0));
                printManager.ConnectionTimeout = mUtil.val(mMngIni.iniGetEx(C_RPT_KEY, C_RPT_CONNECTION_TIMEOUT, 0));

                printManager.ShowPrint(id, tblId, csNO_ID);
            // {end with: printManager}
        }


        // Por cada columna llama a la rutina
        // encargada de calcular el ancho
        //
        self.autoWidthColumn(cIABMProperty iProperty, String keyCol) { // TODO: Use of ByRef founded Public Sub AutoWidthColumn(ByRef iProperty As cIABMProperty, Optional ByVal KeyCol As String)

            cABMProperty oProperty = null;
            cIABMGridColumns columns = null;
            int i = 0;

            oProperty = iProperty;
            columns = iProperty.Grid.columns;

            cGridAdvanced oGrid = null;
            cABMGridColumn column = null;

            // Obtengo un puntero a la interfaz cGridAdvanced
            //
            oGrid = oProperty.getCtl();

            // Si pasan una columna especifica
            // solo se aplica a dicha columna
            //
            if(keyCol.length()) {

                // Obtengo un puntero a la interfaz cABMGridColumn
                //
                column = columns.Item(keyCol);

                oGrid.AutoWidthColumn(column.getIndex());
            }
            else {
                oGrid.AutoWidthColumns;
            }
        }

        // Permite agrupar una grilla de edicion
        //
        // NOTA: Este codigo es una version preliminar y
        //       muy limitada que solo permite agrupar por
        //       una columna y ordenar por otra, ademas tiene
        //       muchas limitaciones en cuanto a la posicion de las
        //       columnas por las que se agrupa y ordena.
        //       La columna a agrupar debe ser la 3 y la columna a
        //       ordenar debe ser la 5 y aun no se porque :), pero sino
        //       cumplen con esta regla, va a fallar la edicion.
        //
        //       Calculo que pa el 2015 lo tendremos mejorado :P
        //
        self.groupGrid(cIABMProperty iProperty, String keyCol, String keyColSort) { // TODO: Use of ByRef founded Public Sub GroupGrid(ByRef iProperty As cIABMProperty, ByVal KeyCol As String, ByVal KeyColSort As String)

            groupGridEx(iProperty, keyCol, keyColSort);

        }

        //
        // Importante: offSetColSort permite insertar columnas
        //             entre la primer columna y la columna de ordenamiento
        //             pero hay que tener en cuenta que se debe sumar
        //             3 mas el numero de columnas insertadas
        //
        //   Por defecto la grilla debe tener 5 columnas:
        //
        //                 col 1 cualquier cosa
        //                 col 2 cualquier cosa
        //                 col 3 la columna de agrupamiento si o si
        //                 col 4 cualquier cosa
        //                 col 5 la columna de ordenamiento
        //
        //   si col 5 no contiene la columna de ordenamiento hay que modifcar
        //   el valor de offSetColSort
        //
        //   Por ejemplo: en las grillas de hoja de ruta y picking list
        //                tenemos la siguiente configuracion
        //
        //                 col 1 KI_PKLPV_ID
        //                 col 2 KI_PV_ID
        //                 col 3 KI_CLIENTE - la columna de agrupamiento si o si
        //                 col 4 KI_TIPO
        //                 col 5 KI_SELECT
        //                 col 6 KI_FECHA / KI_NRODOC la columna de ordenamiento
        //
        //                 y por ende offSetColSort es 4
        //

        self.groupGridEx(cIABMProperty iProperty, String keyCol, String keyColSort, int offSetColSort) { // TODO: Use of ByRef founded Public Sub GroupGridEx(ByRef iProperty As cIABMProperty, ByVal KeyCol As String, ByVal KeyColSort As String, Optional ByVal offSetColSort As Integer = 3)




                cMouseWait mouse = null;
                mouse = new cMouseWait();

                cABMProperty oProp = null;
                oProp = iProperty;

                if(oProp.getCtl() === null) { return; }

                // Ocultamos la grilla para evitar el refresh
                //
                boolean bVisible = false;
                boolean bCanRemove = false;

                bCanRemove = iProperty.GridRemove;
                bVisible = oProp.getCtl().Visible;

                iProperty.GridRemove = false;
                oProp.getCtl().Visible = false;
                oProp.getCtl().GridCtrl.Redraw = false;

                cIABMGridColumn col = null;
                col = iProperty.Grid.cABMDocProperties.getColumns(keyCol);

                cGridAdvanced grid = null;
                grid = oProp.getCtl();

                // Eliminamos los grupos
                //
                grid.ClearGroups;
                grid.RefreshGroupsAndFormulasEx(true);

                // Eliminamos por completo toda la info de agrupamiento
                // del control, sino hacemos esto falla al reagrupar
                //
                grid.ClearEx(true, true, true, true, true);

                // Cargamos la grilla regenerando columnas
                //
                getMngGrid().loadFromRows(oProp.getCtl(), iProperty.Grid, false, iProperty.Name);

                // Agregamos el agrupamiento
                //
                // * TODO:** can't found type for with block
                // * With grid.AddGroup()
                __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = grid.AddGroup();
                    w___TYPE_NOT_FOUND.Name = col.Name;
                    w___TYPE_NOT_FOUND.Index = 1;
                    w___TYPE_NOT_FOUND.Key = mUtil.val(col.Key) + 2;
                    w___TYPE_NOT_FOUND.SortType = CCLOrderAscending;
                // {end with: w___TYPE_NOT_FOUND}

                // Agregamos el ordenamiento
                //
                col = iProperty.Grid.cABMDocProperties.getColumns(keyColSort);

                // * TODO:** can't found type for with block
                // * With grid.AddGroup()
                __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = grid.AddGroup();
                    w___TYPE_NOT_FOUND.Name = col.Name;
                    w___TYPE_NOT_FOUND.Index = 2;
                    w___TYPE_NOT_FOUND.Key = mUtil.val(col.Key) + offSetColSort;
                    w___TYPE_NOT_FOUND.SortType = CCLOrderAscending;
                    w___TYPE_NOT_FOUND.IsSortCol = true;
                // {end with: w___TYPE_NOT_FOUND}

                // Agrupamos y ordenamos
                //
                grid.RefreshGroupsAndFormulasEx(true);
                grid.ExpandAllGroups;
                grid.AutoWidthColumns;
                grid.GridLines = true;

                cABMGridRow row = null;
                int j = 0;
                int i = 0;
                int k = 0;

                // Elimino filas auxiliares que agregue
                // para que la grilla tenga tantas filas
                // como la coleccion Rows del objeto cIABMGrid
                // (Son filas de grupos)
                //
                cIABMGridRows rows = null;
                rows = iProperty.Grid.rows;

                i = 1;
                while (i < rows.Count) {
                    row = rows.Item(i);
                    if(row.getIsGroup()) {
                        rows.Remove(i);
                    }
                    else {
                        i = i + 1;
                    }
                }

                // Ahora voy a agregar tantas filas
                // auxiliares como grupos existan en
                // el control Grid a la coleccion Rows
                // del objeto cIABMGrid para que conincidan
                //
                for (j = 1; j <= grid.Rows; j++) {

                    if(grid.RowIsGroup(j)) {
                        row = new cABMGridRow();
                        row.setIsGroup(true);
                        row.setIndex(j);
                        rows.Add(row);
                    }
                }

                // Re-ordeno la coleccion Rows para que
                // coincida con el orden en la grilla
                //
                int index = 0;
                cABMGridRows sortedRows = null;
                sortedRows = new cABMGridRows();

                for (j = 1; j <= grid.Rows; j++) {

                    index = VBA.mUtil.val(grid.CellText(j, 3));

                    if(grid.RowIsGroup(j)) {
                        sortedRows.add(rows(j));
                    }
                    else {

                        for (i = 1; i <= rows.Count; i++) {
                            row = rows.Item(i);
                            if(!row.getIsGroup()) {
                                if(index === row.getIndex()) {

                                    // El indice debe estar en 0 para
                                    // que lo inserte al final
                                    //
                                    row.setIndex(0);
                                    if(LenB(row.getKey())) {
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

                // Refrezco en la grilla
                //
                k = 0;
                for (j = 1; j <= grid.Rows; j++) {
                    if(!grid.RowIsGroup(j)) {
                        k = k + 1;
                        grid.CellText(j, 3) === k;
                    }
                }

                // Selecciono la primer columna
                //
                if(grid.Rows) {
                    grid.SelectedRow = 2;
                    grid.SelectedCol = 5;
                }

                grid.ColumnWidth(1) = 10;
                grid.ColumnWidth(2) = 10;

                grid.RowMode = false;

                cABMGrid abmGrid = null;
                abmGrid = iProperty.Grid;

                abmGrid.setRows(sortedRows);

                // Ahora actualizo los indices
                //
                rows = sortedRows;
                k = 0;

                for (j = 1; j <= rows.Count; j++) {
                    row = rows.Item(j);
                    if(!row.getIsGroup()) {
                        k = k + 1;
                        row.setIndex(k);
                        row.item(1).Value = k;
                    }
                }

                pAddAuxCol(iProperty);

                / * *TODO:** goto found: GoTo ExitProc* /
                / * *TODO:** label found: ControlError:* /

                MngError(VBA.ex, "GroupGrid", C_MODULE, "Linea: "+ Erl+ "\\r\\n"+ "\\r\\n"+ "Description: "+ VBA.ex.Descriptiontion);
                if(VBA.ex.Number) { / * *TODO:** resume found: Resume(ExitProc)* /  }

                / * *TODO:** label found: ExitProc:* /
                if(oProp === null) { return; }
                if(oProp.getCtl() === null) { return; }

                oProp.getCtl().GridCtrl.Redraw = true;
                oProp.getCtl().Visible = bVisible;

                iProperty.GridRemove = bCanRemove;

                VBA.ex.Clear;
            }
        }

        self.refreshButtonsStyle(cIABMProperty iProp) {


                cABMProperty oProp = null;
                oProp = iProp;

                if(oProp.getCtl() === null) { return; }

                if(iProp.ForeColor != -1) {
                    oProp.getCtl().ForeColor = iProp.ForeColor;
                }

                if(iProp.BackColor != -1) {
                    oProp.getCtl().BackColor = iProp.BackColor;
                    oProp.getCtl().BackColorUnpressed = iProp.BackColor;
                    boolean buttonEnabled = false;
                    buttonEnabled = oProp.getCtl().Enabled;
                    oProp.getCtl().Enabled = !buttonEnabled;
                    oProp.getCtl().Enabled = buttonEnabled;
                }

            }
        }


        // Agrego columnas auxiliares para que la cantidad
        // de columnas en el control coincida con la cantidad
        // en la coleccion de columnas y tambien en la cantidad
        // de celdas de cada fila
        //
        private void pAddAuxCol(cIABMProperty iProperty) { // TODO: Use of ByRef founded Private Sub pAddAuxCol(ByRef iProperty As cIABMProperty)
            "#aux_group_1"
    .equals(Const c_col_aux_group1 As String);
            "#aux_group_2"
    .equals(Const c_col_aux_group2 As String);

            cABMGridColumns cols = null;
            cols = iProperty.Grid.cABMDocProperties.getColumns();

            // Columnas
            //
            if(iProperty.Grid.cABMDocProperties.getColumns().item(c_col_aux_group1) === null) {
                CSInterfacesABM.cIABMGridColumn w_add = cols.add(null, c_col_aux_group1, 1);
                    w_add.Visible = false;
                // {end with: w_add}
            }

            if(iProperty.Grid.cABMDocProperties.getColumns().item(c_col_aux_group2) === null) {
                CSInterfacesABM.cIABMGridColumn w_add = cols.add(null, c_col_aux_group2, 1);
                    w_add.Visible = false;
                // {end with: w_add}
            }

            // Celdas
            //
            cABMGridRow row = null;

            for (int _i = 0; _i < iProperty.Grid.cABMCSGrid.getRows().size(); _i++) {
                Row = iProperty.Grid.Rows.getItem(_i);
                if(row.item(c_col_aux_group1) === null) {
                    row.add(, null, c_col_aux_group1, 1);
                }
                if(row.item(c_col_aux_group2) === null) {
                    row.add(, null, c_col_aux_group2, 1);
                }
            }

            cABMProperty oProp = null;
            oProp = iProperty;

            cGridAdvanced gridAd = null;
            gridAd = oProp.getCtl();

            if(gridAd.Columns(c_col_aux_group1) === null) {
                gridAd.Columns.cABMGridRows.add(, null, c_col_aux_group1);
            }

            if(gridAd.Columns(c_col_aux_group2) === null) {
                gridAd.Columns.cABMGridRows.add(, null, c_col_aux_group2);
            }

            VBA.ex.Clear;

        }

        self.drawGrid(cIABMProperty iProperty, boolean bRedraw) { // TODO: Use of ByRef founded Public Sub DrawGrid(ByRef iProperty As cIABMProperty, ByVal bRedraw As Boolean)

            cABMProperty oProperty = null;
            cGridAdvanced oGrid = null;

            // Obtengo punteros a las interfaces
            // especificas
            //
            oProperty = iProperty;
            oGrid = getView().getGrid(oProperty.getIndex());

            if(oGrid === null) { return; }

            oGrid.Redraw = bRedraw;

        }


        // Actualiza las propiedades de una columna
        //
        public Object refreshColumnPropertiesByIndex(cIABMProperty iProperty, int keyCol) { // TODO: Use of ByRef founded Public Function RefreshColumnPropertiesByIndex(ByRef iProperty As cIABMProperty, ByVal KeyCol As Long)
            return pRefreshColumnProperties(iProperty, keyCol);
        }

        public Object refreshColumnProperties(cIABMProperty iProperty, String keyCol) { // TODO: Use of ByRef founded Public Function RefreshColumnProperties(ByRef iProperty As cIABMProperty, ByVal KeyCol As String)
            return pRefreshColumnProperties(iProperty, keyCol);
        }

        private Object pRefreshColumnProperties(cIABMProperty iProperty, Object keyCol) { // TODO: Use of ByRef founded Private Function pRefreshColumnProperties(ByRef iProperty As cIABMProperty, ByVal KeyCol As Variant)
            cABMGridColumn column = null;
            cABMProperty oProperty = null;
            cGridAdvanced oGrid = null;

            // Obtengo punteros a las interfaces
            // especificas
            //
            oProperty = iProperty;
            column = iProperty.Grid.cABMDocProperties.getColumns().item(keyCol);
            oGrid = getView().getGrid(oProperty.getIndex());

            // Todo esto es para no perder el
            // ancho de la columna al refrescar
            // las propiedades
            //
            cIABMGridColumn iColumn = null;
            cGridColumn colGrid = null;
            iColumn = column;
            colGrid = oGrid.Columns.cABMGridRow.item(column.getIndex());
            iColumn.Width = colGrid.Width;

            getMngGrid().setColumnPropertys(oGrid, column, colGrid);
        }

        // Modifica el estado de edicion de todas las propiedades
        //
        self.refreshEnabledState(cIABMProperties iProperties) { // TODO: Use of ByRef founded Public Sub RefreshEnabledState(ByRef iProperties As cIABMProperties)
            cIABMProperty iProperty = null;

            for (int _i = 0; _i < iProperties.size(); _i++) {
                iProperty = iProperties.getItem(_i);
                setEnabled(iProperty);
            }

            pSetTabIndexDescription();
        }

        // Modifica los valores de todas las propiedades
        //
        self.showValues(cIABMProperties iProperties) { // TODO: Use of ByRef founded Public Sub ShowValues(ByRef iProperties As cIABMProperties)
            cIABMProperty iProperty = null;

            // Tratamiento especial para documentos
            //
            if(m_isDocument) {

                // Los documentos se dividen en tres objetos
                // cABMGeneric
                //
                for (int _i = 0; _i < iProperties.size(); _i++) {
                    iProperty = iProperties.getItem(_i);

                    if(m_isFooter) {
                        showValue(iProperty, true, c_Footer);

                    }
                    else if(m_isItems) {
                        showValue(iProperty, true, c_Items);

                    //' Header
                    }
                    else {
                        showValue(iProperty, true, c_Header);
                    }
                }

            //' ABM de maestros y asistentes
            }
            else {

                for (int _i = 0; _i < iProperties.size(); _i++) {
                    iProperty = iProperties.getItem(_i);
                    showValue(iProperty, true);
                }
            }
        }

        // Permite refrezcar de la forma mas eficiente posible
        // las filas de la grilla, se utiliza en el cashflow
        //
        // cols_to_refresh permite indicar hasta que columnas
        // se deben refrezcar, es util para grillas con muchas
        // columnas que no se editan, es decir no cambian
        // el truco esta en poner todas estas columnas hacia
        // la derecha, y las editables hacia la izquierda
        //
        // si cols_to_refresh = 0 se refrezcan todas las columnas
        //
        self.refreshGridRows(cIABMProperty iProperty, int cols_to_refresh) {

            if(iProperty.PropertyType != cspGrid) { return; }

            cABMProperty oProp = null;
            oProp = iProperty;

            if(oProp.getCtl() === null) { return; }

            cGridAdvanced grCtrl = null;
            int rowIndex = 0;
            int index = 0;
            cIABMGridRows rows = null;
            cIABMGridColumns columns = null;

            grCtrl = oProp.getCtl();
            rows = iProperty.Grid.rows;
            columns = iProperty.Grid.columns;

            cIABMGridColumn col = null;
            cIABMGridCellValue cell = null;
            int colIndex = 0;
            cABMGridRow oRow = null;
            cIABMGridRow row = null;
            cABMGridCellFormat oFormat = null;
            cIABMGridCellFormat iFormat = null;
            StdFont oFont = null;

            if(cols_to_refresh > columns.Count) {
                cols_to_refresh = columns.Count;
            }

            if(cols_to_refresh <= 0) {
                cols_to_refresh = columns.Count;
            }

            // With grCtrl;
                grCtrl.Redraw = false;

                for (RowIndex = 1; RowIndex <= grCtrl.Rows; RowIndex++) {

                    row = rows.Item(rowIndex);

                    for (ColIndex = 1; ColIndex <= cols_to_refresh; ColIndex++) {

                        col = columns.Item(colIndex);
                        cell = row.Item(colIndex);

                        // * TODO:** can't found type for with block
                        // * With .cell(rowIndex, colIndex)
                        __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = grCtrl.Cell(rowIndex, colIndex);
                            w___TYPE_NOT_FOUND.ItemData = cell.Id;

                            if(col.PropertyType === cspDate) {
                                w___TYPE_NOT_FOUND.text = mUtil.getDateValueForGrid(cell.Value);

                            }
                            else if(col.SubType === cspPercent) {
                                w___TYPE_NOT_FOUND.text = mUtil.val(cell.Value) / 100;

                            }
                            else {
                                w___TYPE_NOT_FOUND.text = cell.Value;
                            }

                            // Formato de cada celda
                            //
                            iFormat = cell.Format;
                            if(iFormat != null) {

                                oFormat = cell.Format;
                                w___TYPE_NOT_FOUND.ForeColor = iFormat.Color;
                                w___TYPE_NOT_FOUND.BackColor = iFormat.BackColor;

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

                        // {end with: w___TYPE_NOT_FOUND}
                    }

                    oRow = row;
                    grCtrl.RowBackColor(rowIndex) = oRow.getBackColor();
                    grCtrl.RowForeColor(rowIndex) = oRow.getForeColor();

                }
                grCtrl.Redraw = true;
            // {end with: grCtrl}

        }

        self.refreshRowColor(cIABMProperty iProperty, int rowIndex, cIABMGridRow row) { // TODO: Use of ByRef founded Public Sub RefreshRowColor(ByVal iProperty As cIABMProperty, ByVal RowIndex As Long, ByRef Row As cIABMGridRow)

            cABMProperty oProp = null;
            cGridAdvanced oGrid = null;
            cABMGridRow oRow = null;

            oProp = iProperty;
            oGrid = oProp.getCtl();

            if(oGrid === null) { return; }

            oRow = row;
            oGrid.RowBackColor(rowIndex) = oRow.getBackColor();
            oGrid.RowForeColor(rowIndex) = oRow.getForeColor();
        }
        // Inicializa las variables auxiliares
        //
        self.resetLayoutMembers() {
            G.redim(m_nextTop, 0);
            G.redim(m_nextTopOp, 0);
            G.redim(m_left, 0);
            G.redim(m_leftOp, 0);

            initVectorsPosition();

            m_lastTop = 0;
            m_lastLeft = 0;
            m_lastLeftOp = 0;
            m_lastTopOp = 0;
            m_labelLeft = 0;
        }

        // Inicializa el left y el top de un
        // Tab
        //
        self.resetTabLeftTop(int tabIndex) {
            m_nextTop[tabIndex] = m_constTop;
            m_left[tabIndex] = 2500;
            m_labelLeft = C_OFFSET_H;
        }

        // Modifica el contenido de una celda
        //
        self.showCellValue(cIABMProperty iProperty, int lRow, int lCol) { // TODO: Use of ByRef founded Public Function ShowCellValue(ByRef iProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean

            cABMProperty oProperty = null;

            oProperty = iProperty;

            getMngGrid().showCellValue(getView().getGrid(oProperty.getIndex()), iProperty.Grid, lRow, lCol);
        }

        // Modifica el valor de una propiedad
        //
        self.showValue(cABMProperty oProperty, boolean noChangeColumns, String strTag) { // TODO: Use of ByRef founded Public Function ShowValue(ByRef oProperty As cABMProperty, Optional ByVal NoChangeColumns As Boolean, Optional ByVal strTag As String) As Boolean

            cIABMProperty iProperty = null;
            cIABMListItem item = null;
            Control c = null;
            Label lbl = null;

            iProperty = oProperty;

            Object w_frm = getView();

                switch (iProperty.PropertyType) {

                    case  csTypeABMProperty.cspList:

                        c = w_frm.CB(oProperty.getIndex());
                        c.Clear;

                        for (int _i = 0; _i < iProperty.List.size(); _i++) {
                            Item = iProperty.List.getItem(_i);
                            // With c;
                                c.AddItem(item.Value);
                                c.ItemData(c.NewIndex) = item.Id;
                            // {end with: c}
                        }

                        switch (iProperty.ListWhoSetItem) {

                            case  csListWhoSetItem.csListItemData:
                                ListSetListIndexForId(c, iProperty.ListItemData);

                                break;
                            case  csListWhoSetItem.csListListIndex:
                                ListSetListIndex(c, iProperty.ListListIndex);

                                break;
                            case  csListWhoSetItem.csListText:
                                ListSetListIndexForText(c, iProperty.ListText);

                                break;
                        }

                        if(c.ListIndex === -1  && c.ListCount > 0) { c.ListIndex = 0; }
                        c.Enabled = iProperty.Enabled;

                        break;
                    case  csTypeABMProperty.cspHelp:
                        c = w_frm.HL(oProperty.getIndex());

                        // With c;
                            c.Id = iProperty.HelpId;

                            if(m_useSelectIntValue) {
                                c.ValueHelp = (iProperty.HelpValueProcess != "") ? iProperty.HelpValueProcess : iProperty.HelpId);
                            }
                            else {
                                c.ValueHelp = iProperty.HelpId;
                            }

                            c.ValueUser = iProperty.Value;
                            c.ValueProcess = iProperty.HelpValueProcess;
                            c.ColumnValueProcess = iProperty.HelpFieldValueProcess;
                            c.Filter = iProperty.HelpFilter;
                            c.SPFilter = iProperty.HelpSPFilter;
                            c.SPInfoFilter = iProperty.HelpSPInfoFilter;
                            c.Enabled = iProperty.Enabled;
                            c.Table = iProperty.Table;
                        // {end with: c}

                        break;
                    case  csTypeABMProperty.cspNumeric:

                        c = w_frm.ME(oProperty.getIndex());

                        // With c;
                            c.csValue = iProperty.Value;
                            c.Enabled = iProperty.Enabled;
                        // {end with: c}

                        break;
                    case  csTypeABMProperty.cspDate:
                    case  csTypeABMProperty.cspTime:

                        c = w_frm.MEFE(oProperty.getIndex());

                        // With c;
                            c.csValue = iProperty.Value;
                            c.Enabled = iProperty.Enabled;
                        // {end with: c}

                        break;
                    case  csTypeABMProperty.cspOption:

                        c = w_frm.OP(oProperty.getIndex());

                        // With c;
                            c.Value = iProperty.Value;
                            c.Enabled = iProperty.Enabled;
                        // {end with: c}

                        break;
                    case  csTypeABMProperty.cspText:
                    case  csTypeABMProperty.cspFile:
                    case  csTypeABMProperty.cspFolder:

                        if(iProperty.SubType === cspMemo) {

                            c = w_frm.TXM(oProperty.getIndex());
                        }
                        else {

                            c = w_frm.TX(oProperty.getIndex());
                            if(c(instanceOf cMaskEdit)) {
                                c.Mask = iProperty.textMask;
                            }
                        }

                        // With c;
                            c.text = iProperty.Value;
                            c.Enabled = iProperty.Enabled;
                        // {end with: c}

                        // Si el control tiene mascara
                        // actualizo en iProperty.value
                        // con el texto formateado
                        //
                        if(c(instanceOf cMaskEdit)) {
                            if(c.Mask != "") {
                                iProperty.Value = c.text;
                            }
                        }

                        break;
                    case  csTypeABMProperty.cspPassword:

                        c = w_frm.txPassword(oProperty.getIndex());

                        // With c;
                            c.text = iProperty.Value;
                            c.Enabled = iProperty.Enabled;
                        // {end with: c}

                        break;
                    case  csTypeABMProperty.cspCheck:

                        c = w_frm.CHK(oProperty.getIndex());

                        // With c;
                            c.Value = (mUtil.val(iProperty.Value) != 0) ? vbChecked : vbUnchecked);
                            c.Enabled = iProperty.Enabled;
                        // {end with: c}

                        break;
                    case  csTypeABMProperty.cspButton:

                        c = w_frm.CMD(oProperty.getIndex());

                        // With c;
                            c.text = iProperty.Name;
                            c.Enabled = iProperty.Enabled;
                        // {end with: c}

                        break;
                    case  csTypeABMProperty.cspLabel:

                        c = w_frm.LB2(oProperty.getIndex());
                        c.text = iProperty.Value;
                        if(iProperty.BackColor >= 0) {
                            c.BackColor = iProperty.BackColor;
                        }

                        break;
                    case  csTypeABMProperty.cspImage:

                        c = w_frm.Img(oProperty.getIndex());

                        // With c;
                            if(getView(instanceOf fWizard)) {
                                switch (mUtil.val(iProperty.Value)) {
                                    case  1:
                                        c.Picture = m_wizardView.ImgWiz1.Picture;
                                        break;
                                    case  3:
                                        c.Picture = m_wizardView.ImgWiz3.Picture;
                                        break;
                                    case  5:
                                        c.Picture = m_wizardView.ImgWiz5.Picture;
                                    break;
                                    default:
                                        c.Picture = iProperty.Picture;
                                        break;
                                }
                            }
                            else {
                                c.Picture = iProperty.Picture;
                            }
                            c.ZOrder;
                        // {end with: c}

                        break;
                    case  csTypeABMProperty.cspTitle:
                        c = w_frm.lbTitle2(oProperty.getIndex());
                        c.text = iProperty.Value;

                        break;
                    case  csTypeABMProperty.cspDescriptiontion:
                        c = w_frm.LBDescription(oProperty.getIndex());
                        c.text = iProperty.Value;

                        break;
                    case  csTypeABMProperty.cspGrid:

                        Object grid = null;

                        grid = w_frm.getGrid(oProperty.getIndex());
                        c = grid;
                        grid.Enabled = iProperty.Enabled;

                        cABMGrid oGrid = null;
                        oGrid = iProperty.Grid;
                        grid.MultiSelect = oGrid.getMultiSelect();

                        cABMCSGrid w_mngGrid = getMngGrid();

                            w_mngGrid.setAllowAddNew(grid, iProperty.GridAdd);
                            w_mngGrid.setAllowEdit(grid, iProperty.GridEdit);
                            w_mngGrid.setAllowDelete(grid, iProperty.GridRemove);

                            if(!w_mngGrid.loadFromRows(grid, iProperty.Grid, noChangeColumns, pGetNameGrid(iProperty))) {
                                return null;
                            }

                            if(iProperty.GridAdd) {
                                pSetDefaults(iProperty, grid.Rows);
                            }
                        // {end with: w_mngGrid}

                        break;
                    case  csTypeABMProperty.cspProgressBar:
                        c = getView().prgBar(oProperty.getIndex());
                        double iVal = 0;
                        iVal = mUtil.val(iProperty.Value);
                        c.Value = (iVal <= 100) ? iVal : 100);
                        break;
                }

                // Obtengo la etiqueta asociada al control
                //
                if(oProperty.getLabelIndex() != 0) {
                    lbl = w_frm.LB(oProperty.getLabelIndex());
                }

            // {end with: w_frm}

            if(c != null) {

                boolean bInCurrenTag = false;
                int lenStrTag = 0;

                lenStrTag = strTag.length();

                // With c;

                    // Si es un documento
                    //
                    if(m_isDocument) {

                        if(m_currentTab < m_firstTab) {
                            m_currentTab = m_firstTab;
                        }

                        // strTag permite saber si el tab pertenece
                        // al objeto de documento que esta realizando
                        // la llamada. (header, items, footer)
                        //
                        bInCurrenTag = c.Tag.substring(0, lenStrTag).equals(strTag) && c.Tag != ""  && !("cbTab".equals(c.Name)) && (mUtil.val(c.Tag.substring(lenStrTag + 1)) + m_firstTab).equals(m_currentTab);
                    }
                    else {
                        int valTag = 0;
                        valTag = mUtil.val(c.Tag);
                        if(valTag < 0 && valTag > TabIndexType.TAB_ID_XT_ALL) {
                            bInCurrenTag = (valTag === m_currentInnerTab) || (valTag === TabIndexType.TAB_ID_XT_ALL  && m_currentInnerTab != m_tabHideControlsInAllTab) || (valTag === TabIndexType.TAB_ID_XT_ALL2);
                        }
                        else {
                            bInCurrenTag = (valTag === m_currentTab) || (valTag === TabIndexType.TAB_ID_XT_ALL  && m_currentTab != m_tabHideControlsInAllTab) || (valTag === TabIndexType.TAB_ID_XT_ALL2);
                        }
                    }

                    if(bInCurrenTag) {

                        c.Visible = iProperty.Visible;
                        if(lbl != null) {
                            if(mUtil.val(lbl.Tag) != -1) {
                                lbl.Visible = iProperty.Visible;
                            }
                        }

                    }
                    else {
                        if(!(oProperty.getKeyCol().equals(csNumberID) || oProperty.getKeyCol().equals(csStateID) || (iProperty.Table === Cairo.Tables.DOCUMENTO  && m_isDocument))) {
                            c.Visible = false;
                            if(lbl != null) {
                                lbl.Visible = false;
                            }
                        }
                        else {
                            c.Visible = true;
                        }
                    }
                // {end with: c}
            }

            DoEvents;

            return true;
        }

        // Modifica el estado de edicion de los controles
        //
        self.setEnabled(cABMProperty oProperty) { // TODO: Use of ByRef founded Public Sub SetEnabled(ByRef oProperty As cABMProperty)
            cIABMProperty iProperty = null;
            cIABMListItem item = null;
            int nIndex = 0;
            boolean bEnabled = false;

            iProperty = oProperty;

            nIndex = oProperty.getIndex();
            bEnabled = iProperty.Enabled;

            Object w_frm = getView();

                switch (iProperty.PropertyType) {

                        //      Case csTypeABMProperty.cspAdHock
                        //        .CBhock(nIndex).Enabled = bEnabled

                    case  csTypeABMProperty.cspList:
                        w_frm.CB(nIndex).Enabled = bEnabled;

                        break;
                    case  csTypeABMProperty.cspHelp:
                        w_frm.HL(nIndex).Enabled = bEnabled;

                        break;
                    case  csTypeABMProperty.cspNumeric:
                        w_frm.ME(nIndex).Enabled = bEnabled;

                        break;
                    case  csTypeABMProperty.cspDate:
                    case  csTypeABMProperty.cspTime:
                        w_frm.MEFE(nIndex).Enabled = bEnabled;

                        break;
                    case  csTypeABMProperty.cspOption:
                        w_frm.OP(nIndex).Enabled = bEnabled;

                        break;
                    case  csTypeABMProperty.cspText:
                    case  csTypeABMProperty.cspFile:
                    case  csTypeABMProperty.cspFolder:
                        if(iProperty.SubType === cspMemo) {
                            w_frm.TXM(nIndex).Enabled = bEnabled;
                        }
                        else {
                            w_frm.TX(nIndex).Enabled = bEnabled;
                        }

                        break;
                    case  csTypeABMProperty.cspPassword:
                        w_frm.txPassword(nIndex).Enabled = bEnabled;

                        break;
                    case  csTypeABMProperty.cspCheck:
                        w_frm.CHK(nIndex).Enabled = bEnabled;

                        break;
                    case  csTypeABMProperty.cspButton:
                        w_frm.CMD(nIndex).Enabled = bEnabled;

                        break;
                    case  csTypeABMProperty.cspGrid:
                        Object grid = null;
                        grid = w_frm.getGrid(nIndex);
                        grid.Enabled = bEnabled;
                        break;
                }
            // {end with: w_frm}

            DoEvents;
        }

        // Carga los controles asociados a las propiedades
        //
        self.loadControlEx(cABMProperty oProperty, boolean noGrids) { // TODO: Use of ByRef founded Public Function LoadControlEx(ByRef oProperty As cABMProperty, Optional ByVal NoGrids As Boolean) As Boolean

            cIABMProperty iProperty = null;

            if(!oProperty.getControlLoaded()) {

                if(!loadControl(oProperty)) {
                    return null;
                }

                oProperty.setControlLoaded(true);
            }

            iProperty = oProperty;

            if(iProperty.PropertyType != cspGrid  || !noGrids) {

                showValue(oProperty);
            }

            pSetTabIndexDescription();

            pSetBackgroundColor();

            return true;
        }

        // Descarga los controles
        //
        self.unloadControl(cABMProperty oProperty) { // TODO: Use of ByRef founded Public Sub UnloadControl(ByRef oProperty As cABMProperty)

            cIABMProperty iProperty = null;

            if(oProperty.getControlLoaded()) {

                oProperty.setCtl(null);

                iProperty = oProperty;

                int nIndex = 0;
                nIndex = oProperty.getIndex();

                Object w_frm = getView();
                    switch (iProperty.PropertyType) {

                            //        Case csTypeABMProperty.cspAdHock
                            //
                            //          If nIndex = 0 Then
                            //            .CBhock(0).Visible = 0
                            //          Else
                            //            Unload .CBhock(nIndex)
                            //          End If

                        case  csTypeABMProperty.cspList:

                            if(nIndex === 0) {
                                w_frm.CB(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.CB(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspHelp:

                            if(nIndex === 0) {
                                w_frm.HL(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.HL(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspNumeric:

                            if(nIndex === 0) {
                                w_frm.ME(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.ME(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspDate:
                        case  csTypeABMProperty.cspTime:

                            if(nIndex === 0) {
                                w_frm.MEFE(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.MEFE(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspLabel:

                            if(nIndex === 0) {
                                w_frm.LB2(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.LB2(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspTitle:

                            if(nIndex === 0) {
                                w_frm.lbTitle2(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.lbTitle2(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspProgressBar:

                            if(nIndex === 0) {
                                w_frm.prgBar(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.prgBar(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspDescriptiontion:

                            if(nIndex === 0) {
                                w_frm.LBDescription(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.LBDescription(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspImage:

                            if(nIndex === 0) {
                                w_frm.Img(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.Img(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspText:
                        case  csTypeABMProperty.cspFile:
                        case  csTypeABMProperty.cspFolder:

                            if(iProperty.SubType === cspMemo) {
                                if(nIndex === 0) {
                                    w_frm.TXM(0).cABMGridRow.setVisible(0);
                                }
                                else {
                                    Unload(w_frm.TXM(nIndex));
                                }
                            }
                            else {
                                if(nIndex === 0) {
                                    w_frm.TX(0).cABMGridRow.setVisible(0);
                                }
                                else {
                                    Unload(w_frm.TX(nIndex));
                                }
                            }

                            break;
                        case  csTypeABMProperty.cspPassword:

                            if(nIndex === 0) {
                                w_frm.txPassword(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.txPassword(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspCheck:

                            if(nIndex === 0) {
                                w_frm.CHK(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.CHK(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspGrid:

                            if(nIndex === 0) {
                                w_frm.getGrid(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.getGrid(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspButton:

                            if(nIndex === 0) {
                                w_frm.CMD(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.CMD(nIndex));
                            }
                            break;
                    }
                // {end with: w_frm}

                nIndex = oProperty.getLabelIndex();
                if(nIndex > 0) {
                    Unload(getView().LB(nIndex));
                }
            }
        };

        self.closeWizard() {
            setChanged(false);
            Unload(m_wizardView);
        }

        public Object tabGetFirstCtrl(int index) {
            Control c = null;
            int childIndex = 0;
            int fatherIndex = 0;
            boolean bVisible = false;
            int tabIndex = 0;

            tabIndex = 999;

            Object w_frm = getView();

                if(w_frm.cbTab(index).Tag.indexOf(c_InerTab, 1)) {

                    childIndex = mUtil.getTagChildIndex(w_frm.cbTab(index).Tag);
                    fatherIndex = mUtil.getTagFatherIndex(w_frm.cbTab(index).Tag);

                    for (int _i = 0; _i < w_frm.Controls.size(); _i++) {
                        c = .Controls.getItem(_i);
                        if(!CBool(TypeOf c Is cButton && c.Name.indexOf("cbTab", 1))) {
                            if(LenB(c.Tag.trim())) {
                                if(mUtil.val(c.Tag) != fatherIndex) {

                                    bVisible = pGetControlVisible(c, pGetCtrlVisibleInTab(c, childIndex));
                                    //Val(c.Tag) = ChildIndex Or Val(c.Tag) = csETabIdxT_All)

                                    if(bVisible) {

                                        if(c(instanceOf Label)) {
                                            // Nada que hacer este no sirve ya que no puede tomar el foco
                                        }
                                        else if(c(instanceOf cABMProperty.setToolbar())) {
                                            // Nada que hacer este no sirve ya que no puede tomar el foco
                                        }
                                        else {
                                            if(c.TabIndex < tabIndex) {
                                                tabIndex = c.TabIndex;
                                                return c;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
                else {

                    for (int _i = 0; _i < w_frm.Controls.size(); _i++) {
                        c = .Controls.getItem(_i);
                        if(c(instanceOf cButton && c.Name.indexOf("cbTab", 1))) {

                            // Es un inner tab, no tengo que hacer nada con esto

                        }
                        else if(LenB(c.Tag.trim())) {

                            bVisible = pGetControlVisible(c, pGetCtrlVisibleInTab(c, index));
                            //Val(c.Tag) = Index Or Val(c.Tag) = csETabIdxT_All)

                            if(bVisible) {

                                if(c(instanceOf Label)) {
                                    // Nada que hacer este no sirve ya que no puede tomar el foco
                                }
                                else if(c(instanceOf cABMProperty.setToolbar())) {
                                    // Nada que hacer este no sirve ya que no puede tomar el foco
                                }
                                else if(c(instanceOf Image)) {
                                    // Nada que hacer este no sirve ya que no puede tomar el foco
                                }
                                else {
                                    if(c.TabIndex < tabIndex) {
                                        tabIndex = c.TabIndex;
                                        return c;
                                    }
                                }
                            }

                        }
                    }
                }
            // {end with: w_frm}
        }

        public Object docTabGetFirstCtrl(int index, String tag) {

            switch (tag) {

                    // Para documentos los tag de los controles tienen
                    // la palabra Items o Footers o "" (null string)
                    // para identificar a que grupo pertenecen
                case  c_Items:
                    if(m_isItems) {
                        return pDocTabGetFirstCtrl(c_Items, index);
                    }
                    break;
                case  c_Footer:
                    if(m_isFooter) {
                        return pDocTabGetFirstCtrl(c_Footer, index);
                    }
                break;
                default:
                    if(m_isItems || m_isFooter) { return null; }
                    return pDocTabGetFirstCtrl(c_Header, index);
                    break;
            }

        }

        public Object docTabClick(int index, String tag) {
            cLockUpdateWindow oLock = null;
            oLock = new cLockUpdateWindow();
            oLock.lockW(getView().hWnd);

            switch (tag) {

                    // Para documentos los tag de los controles tienen
                    // la palabra Items o Footers o "" (null string)
                    // para identificar a que grupo pertenecen
                case  c_Items:
                    if(m_isItems) {
                        pDocTabClickEx(c_Items, index);
                    }
                    break;
                case  c_Footer:
                    if(m_isFooter) {
                        pDocTabClickEx(c_Footer, index);
                    }
                break;
                default:
                    if(m_isItems || m_isFooter) { return null; }
                    pDocTabClickEx(c_Header, index);
                    break;
            }

            oLock.unLockW();
        }

        private Control pDocTabGetFirstCtrl(String strTag, int index) {
            Control c = null;
            boolean bVisible = false;
            int tabIndex = 0;

            tabIndex = 999;

            Object w_frm = getView();
                for (int _i = 0; _i < w_frm.Controls.size(); _i++) {
                    c = .Controls.getItem(_i);
                    if(c.Tag.substring(0, strTag.length()) === strTag  && c.Tag != ""  && !(c.Name.equals("cbTab"))) {

                        bVisible = pGetControlVisible(c, mUtil.val(c.Tag.substring(strTag.length() + 1)) + m_firstTab === index);

                        if(bVisible) {

                            if(c(instanceOf Label)) {
                                // Nada que hacer este no sirve ya que no puede tomar el foco
                            }
                            else if(c(instanceOf cABMProperty.setToolbar())) {
                                // Nada que hacer este no sirve ya que no puede tomar el foco
                            }
                            else if(c(instanceOf Image)) {
                                // Nada que hacer este no sirve ya que no puede tomar el foco
                            }
                            else {
                                if(c.TabIndex < tabIndex) {
                                    tabIndex = c.TabIndex;
                                    return c;
                                }
                            }
                        }
                    }
                }
            // {end with: w_frm}
        }

        private void pDocTabClickEx(String strTag, int index) {
            Control c = null;

            m_currentTab = index;

            Object w_frm = getView();
                for (int _i = 0; _i < w_frm.Controls.size(); _i++) {
                    c = .Controls.getItem(_i);
                    if(c.Tag.substring(0, strTag.length()) === strTag  && c.Tag != ""  && !(c.Name.equals("cbTab"))) {

                        c.Visible = pGetControlVisible(c, mUtil.val(c.Tag.substring(strTag.length() + 1)) + m_firstTab === index);

                        if(c(instanceOf Label)) {
                            if(c.BackColor === vbButtonFace) {
                                c.BackColor = w_frm.ShTab.cABMGridRow.getBackColor();
                            }
                            c.ZOrder;
                            if(c.Name.toLowerCase().equals("lb")) {
                                if(LenB(c.text.trim()).equals(0)) {
                                    c.Visible = false;
                                }
                            }
                        }
                        else if(c(instanceOf cABMCSGrid.getCheckBox())) {
                            c.BackColor = w_frm.ShTab.cABMGridRow.getBackColor();
                        }
                        if(c(instanceOf cABMProperty.setToolbar() && c.Visible)) {
                            w_frm.SetToolbar(c);
                        }
                    }
                }
            // {end with: w_frm}
        }

        var pGetControlVisible(Object ctl, boolean bVisible) { // TODO: Use of ByRef founded Private Function pGetControlVisible(ByRef ctl As Object, ByVal bVisible As Boolean) As Boolean
            boolean _rtn = false;
            cABMProperty oProperty = null;
            cIABMProperty iProp = null;
            cIABMProperties iProperties = null;

            _rtn = bVisible;

            iProperties = m_properties;

            for (int _i = 0; _i < iProperties.size(); _i++) {
                oProperty = iProperties.getItem(_i);
                if(oProperty.getCtl(Is ctl)) {
                    iProp = oProperty;
                    if(!iProp.Visible) {
                        _rtn = false;
                    }
                    return _rtn;

                }
                else if(ctl(instanceOf Label)) {

                    if(!(ctl.Name.substring(0, 3).equals("LB2"))) {
                        if(oProperty.getLabelIndex() === ctl.Index) {
                            iProp = oProperty;
                            if(!iProp.Visible) {
                                _rtn = false;
                            }
                            return _rtn;
                        }
                    }
                }
            }
            return _rtn;
        }

        public Object tabClick(int index) {
            Control c = null;
            int childIndex = 0;
            int fatherIndex = 0;
            cLockUpdateWindow oLock = null;
            Object firstTab = null;
            boolean bVisible = false;

            m_currentInnerTab = 0;

            Object w_frm = getView();

                oLock = new cLockUpdateWindow();
                oLock.lockW(w_frm.hWnd);

                if(w_frm.cbTab(index).Tag.indexOf(c_InerTab, 1)) {

                    childIndex = mUtil.getTagChildIndex(w_frm.cbTab(index).Tag);
                    fatherIndex = mUtil.getTagFatherIndex(w_frm.cbTab(index).Tag);

                    for (int _i = 0; _i < w_frm.Controls.size(); _i++) {
                        c = .Controls.getItem(_i);
                        if(!CBool(TypeOf c Is cButton && c.Name.indexOf("cbTab", 1))) {
                            if(LenB(c.Tag.trim())) {
                                if(mUtil.val(c.Tag) != fatherIndex) {
                                    pSetVisible(c, childIndex);
                                }
                            }
                        }
                    }

                    CSButton.cButton cmdTab = null;
                    cmdTab = w_frm.cbTab(index);
                    cmdTab.VirtualPush;

                    m_currentInnerTab = childIndex;

                }
                else {
                    m_currentTab = index;

                    for (int _i = 0; _i < w_frm.Controls.size(); _i++) {
                        c = .Controls.getItem(_i);
                        if(c(instanceOf cButton && c.Name.indexOf("cbTab", 1))) {
                            if(c.Tag.indexOf(c_InerTab, 1)) {
                                bVisible = mUtil.getTagFatherIndex(c.Tag) === index;
                                c.Visible = bVisible;
                                if(bVisible) {
                                    if(firstTab === null) { firstTab = c; }
                                }
                            }
                        }
                        else if(LenB(c.Tag.trim())) {
                            pSetVisible(c, index);
                        }
                    }

                }

                if(firstTab != null) {
                    tabClick(firstTab.Index);
                    m_currentInnerTab = mUtil.getTagChildIndex(firstTab.Tag);
                }

                oLock.unLockW();
            // {end with: w_frm}
        }

        private void pSetVisible(Object c, int index) { // TODO: Use of ByRef founded Private Sub pSetVisible(ByRef c As Object, ByVal Index As Long)

            Object w_frm = getView();

                c.Visible = pGetControlVisible(c, pGetCtrlVisibleInTab(c, index));
                if(c(instanceOf Label)) {
                    if(c.BackColor === vbButtonFace) {
                        c.BackColor = w_frm.ShTab.cABMGridRow.getBackColor();
                    }
                    c.ZOrder;
                    if(c.Name.toLowerCase().equals("lb")) {
                        if(LenB(c.text.trim()).equals(0)) {
                            c.Visible = false;
                        }
                    }
                }
                else if(c(instanceOf cABMCSGrid.getCheckBox())) {
                    c.BackColor = w_frm.ShTab.cABMGridRow.getBackColor();
                }
                if(c(instanceOf cABMProperty.setToolbar() && c.Visible)) {
                    w_frm.SetToolbar(c);
                }
            // {end with: w_frm}
        }

        self.showEx(CSInterfacesABM.cIABMClient obj, int indexTag, boolean bAddProp) {
            return pShow(obj, indexTag, !bAddProp);
        }

        self.show(CSInterfacesABM.cIABMClient obj, int indexTag) {
            boolean _rtn = false;
            try {

                cMouseWait mouse = null;
                mouse = new cMouseWait();

                _rtn = pShow(obj, indexTag, true);

                / * *TODO:** goto found: GoTo ExitProc* /
            } catch (Exception ex) {
                MngError(VBA.ex, "Show", C_MODULE, "");
                if(VBA.ex.Number) { / * *TODO:** resume found: Resume(ExitProc)* /  }
                / * *TODO:** label found: ExitProc:* /

            }
            return _rtn;
        }

        self.setIconFormDoc(int iconIndex) {
            if(m_documentView === null) { return; }
            if(m_documentView.imIcon.ListImages.cABMDocPropertiesCols.count() < iconIndex) { return; }
            m_documentView.Icon = m_documentView.imIcon.ListImages.cABMGridRow.item(iconIndex).Picture;
        }

        self.setIconFormABM(int iconIndex) {
            if(m_masterView === null) { return; }
            if(m_masterView.imIcon.ListImages.cABMDocPropertiesCols.count() < iconIndex) { return; }
            m_masterView.Icon = m_masterView.imIcon.ListImages.cABMGridRow.item(iconIndex).Picture;
        }

        // Presenta el menu popup del boton doc_aux de documentos
        //
        public Object showPopMenu(String strMenuDef) {
            Object vMenus = null;
            Object vMenu = null;

            "|"
    .equals(Const c_menu_sep);
            "~"
    .equals(Const c_menu_sep2);

            vMenus = Split(strMenuDef, c_menu_sep);

            int iPTop = 0;
            int iP = 0;
            int iP2 = 0;
            int iP3 = 0;
            int i = 0;

            if(m_menu === null) {
                m_menu = new cPopupMenu();
                m_menu.addListener(new cPopupMenuEventA() {
                      self.Click(int itemNumber) {
                        m_Menu_Click(itemNumber,);
                      }

                  };);
            }

            m_menu.Clear;

            // Creating a Menu:
            // With m_menu;
                // Initial set up:
                m_menu.hWndOwner = getView().hWnd;
                m_menu.OfficeXpStyle = true;
            // {end with: m_menu}

            for (i = 0; i <= vMenus.length; i++) {
                vMenu = Split(vMenus(i), c_menu_sep2);
                iP = m_menu.AddItem(vMenu(0), , vMenu(1), iPTop);
            }

            int left = 0;
            int top = 0;

            mUtil.getMousePosition(left, top);

            left = (left * Screen.TwipsPerPixelX) - getView().Left;
            top = (top * Screen.TwipsPerPixelY) - getView().Top - 200;

            m_menu.ShowPopupMenu(left, top);

        }

        var pShow(CSInterfacesABM.cIABMClient obj, int indexTag) {
            boolean _rtn = false;
            cMouse mouse = null;
            cIABMClientGrid tmpObj = null;

            if(obj === null) { return _rtn; }

            m_client = obj;

            if(m_isDocument || m_isWizard) {
                m_loadHelp = true;
                m_loadNumeric = true;
                m_loadText = true;
            }

            Object w_frm = getView();

                m_clientManageGrid = mUtil.implementsInterface(m_client, tmpObj);
                w_frm.ShTab.cABMGridRow.setBackColor(vb3DHighlight);

                if(m_mustCompleteLoading) {
                    m_mustCompleteLoading = false;

                    if(m_owner === null) {
                        if(m_minHeight < w_frm.Height) { m_minHeight = w_frm.Height; }
                        if(m_minWidth < w_frm.Width) { m_minWidth = w_frm.Width; }
                    }

                    if(getView(instanceOf fABM)) {
                        getView().DontMoveGenericButton = m_noMoveGenericButton;
                        getView().PopMenuClient = m_popMenuClient;
                    }

                    if(getView(instanceOf fWizard)) {
                        //' Aproposito para que no cambie el tamaño inicial del form
                        CSKernelClient2.LoadForm(getView(), "wiz");
                    }
                    else {
                        CSKernelClient2.LoadForm(getView(), "ABM_"+ m_client.Title);
                    }

                    if(getView(instanceOf fABM || getView() instanceOf fWizard)) {
                        if(w_frm.Height < m_minHeight) { w_frm.Height = m_minHeight; }
                        if(w_frm.Width < m_minWidth) { w_frm.Width = m_minWidth; }
                    }
                }

                if(!showForm(indexTag)) { return _rtn; }

                w_frm.text = pGetFormText();

                if(m_hideTitle) {
                    w_frm.lbTitle.cABMGridRow.setVisible(false);
                }
                else {
                    w_frm.lbTitle.cABMDocPropertiesCol.setText(m_client.Title);
                }

                if(getView(instanceOf fABM)) {
                    w_frm.cmdDocs.cABMGridRow.setVisible(m_client.CanAddDocDigital);
                    w_frm.cmdNew.cABMGridRow.setVisible(m_client.CanNew);
                    w_frm.cmdCopy.cABMGridRow.setVisible(m_client.CanCopy);
                }

                refreshTitle();

                if(w_frm.Visible) {
                    w_frm.ZOrder;
                }
                else {
                    if(m_isDocument) {
                        if(m_isFooter) {
                            w_frm.Loading = false;
                            if(m_inModalWindow) {
                                if(!m_formShowed) {
                                    m_formShowed = true;
                                    mouse = new cMouse();
                                    mouse.MouseDefault;
                                    w_frm.Show(vbModal);
                                }
                            }
                            else {
                                w_frm.Show;
                            }
                        }
                    }
                    else {
                        w_frm.Loading = false;
                        if(m_inModalWindow) {
                            if(!m_formShowed) {
                                m_formShowed = true;
                                mouse = new cMouse();
                                mouse.MouseDefault;
                                if(getView(instanceOf fABM || getView() instanceOf fWizard)) {
                                    w_frm.ShowForm;
                                    pSetDontResize();
                                    w_frm.FirstResize;

                                    if(getView(instanceOf fWizard)) {
                                        CSKernelClient2.GetConfigForm(getView(), "ABM_"+ mUtil.gEmpNombre+ " - "+ m_client.Title);
                                    }
                                }
                                if(m_sendAutoSave) {
                                    if(getView(instanceOf fABM)) {
                                        getView().SendAutoSave;
                                    }
                                }
                                if(getView(Is m_masterView)) {
                                    m_masterView.raiseAfterLoadEvent();
                                }
                                w_frm.Show(vbModal, m_owner);
                            }
                        }
                        else {
                            if(getView(instanceOf fABM || getView() instanceOf fWizard)) {
                                w_frm.ShowForm;
                                pSetDontResize();
                                w_frm.FirstResize;

                                if(getView(instanceOf fWizard)) {
                                    CSKernelClient2.GetConfigForm(getView(), "ABM_"+ mUtil.gEmpNombre+ " - "+ m_client.Title);
                                }
                            }
                            w_frm.Show(, m_owner);
                        }
                    }
                }

                _rtn = true;
            // {end with: w_frm}
            return _rtn;
        }
        // funciones privadas

        private void setCIABMGeneric_HideTitle = function(rhs) {
            m_hideTitle = rhs;
        }

        private void setCIABMGeneric_InModalWindow = function(rhs) {
            m_inModalWindow = rhs;
        }

        var getCIABMGeneric_InModalWindow() {
            return m_inModalWindow;
        }

        private void setCIABMGeneric_IsDocument = function(rhs) {
            m_isDocument = rhs;
        }

        private void setCIABMGeneric_IsFooter = function(rhs) {
            m_isFooter = rhs;
        }

        private void setCIABMGeneric_IsItems = function(rhs) {
            m_isItems = rhs;
        }

        private void setCIABMGeneric_Left(float rhs) {
            getView().Left = rhs;
        }

        var getCIABMGeneric_Left() {
            return getView().Left;
        }

        private void setCIABMGeneric_ObjForm(Object rhs) {
            m_documentView = rhs;

            initCtrlPosition();
            initVectorsPosition();
        }

        private Object getCIABMGeneric_ObjForm() {
            return getView();
        }

        private Object getCIABMGeneric_PicMain() {
            return getView().Image1;
        }

        // Implementacion de Interface
        private CSInterfacesABM.cIABMProperties getCIABMGeneric_Properties() {
            return m_properties;
        }

        private void cIABMGeneric_RefreshControls(Object noGrids) {

            if(m_unloading) { return; }

            cLockUpdateWindow lockwnd = null;
            lockwnd = new cLockUpdateWindow();
            lockwnd.lockW(getView().hWnd);

            showForm() -1, noGrids, false;



                CSButton.cButton cmdTab = null;
                cmdTab = getView().cbTab(m_currentTab);
                cmdTab.VirtualPush;

            }
        }

        private Object getCIABMGeneric_ShapeMain() {
            return getView().ShTab;
        }

        var cIABMGeneric_Show(CSInterfacesABM.cIABMClient obj) {
            cMouseWait mouse = null;
            mouse = new cMouseWait();

            return show(obj, 0);
        }

        private void cIABMGeneric_ShowValue(CSInterfacesABM.cIABMProperty iProp) {
            String strTag = "";
            if(m_isDocument) {
                strTag = pGetStrTag(iProp);
            }
            showValue(iProp, , strTag);
        }

        var pGetStrTag(cABMProperty oProp) { // TODO: Use of ByRef founded Private Function pGetStrTag(ByRef oProp As cABMProperty) As String
            String _rtn = "";

                if(oProp.getCtl() === null) { return _rtn; }
                Object w_ctl = oProp.getCtl();
                    _rtn = w_ctl.Tag.substring(1, w_ctl.Tag.length() - 1);
                // {end with: w_ctl}
            }
            return _rtn;
        }

        private CSInterfacesABM.cIABMTabs getCIABMGeneric_Tabs() {
            if(m_tabs === null) { m_tabs = new cABMTabs(); }
            return m_tabs;
        }

        var cIABMGeneric_Terminate() {

        }

        private void setCIABMGeneric_Title2 = function(rhs) {
            m_title2 = rhs;
        }

        private void setCIABMGeneric_Top(float rhs) {
            getView().Top = rhs;
        }

        var getCIABMGeneric_Top() {
            return getView().Top;
        }

        private void masterHandlerViewKeyDown(int keyCode, int shift) {

                m_client.MessageEx(ABM_MSG.MSG_KEY_DOWN, keyCode);
            }
        }

        private void masterHandlerAfterShowModal() {

                m_client.MessageEx(ABM_MSG.MSG_FORM_AFTER_SHOW_MODAL, null);
            }
        }

        private void masterHandlerPopItemClick(int index) {

                m_client.MessageEx(ABM_MSG.MSG_POP_MENU_ITEM, index);
            }
        }

        private void masterHandlerSetResizeGrid() {
            pSetDontResize();
        }

        private void masterHandlerTabGetFirstCtrl(int index, Control ctrl) {
            ctrl = tabGetFirstCtrl(index);
        }

        private void docHandlerCommandClick(int index) {
            changeProperty(cspButton, index, getView().CMD(index));
        }

        private void docHandlerGridDblClick(int index, int rowIndex, int colIndex) {

            if(!m_isItems) { return; }

            if(m_clientManageGrid) {
                cIABMClientGrid clientGrid = null;
                cIABMProperty iProperty = null;

                clientGrid = m_client;
                iProperty = getProperty(cspGrid, index, 0);
                clientGrid.DblClick(iProperty.Key, rowIndex, colIndex);
            }
        }

        private void docHandlerSelectKeyDown(int index, int keyCode, int shift) {
            cIABMProperty iProperty = null;
            iProperty = getProperty(cspHelp, index, 0);
            if(iProperty === null) { return; }

            if(keyCode === vbKeyF2) {
                m_client.MessageEx(ABM_MSG.MSG_ABM_KEY_F2, iProperty);
            }
            else if(keyCode === vbKeyF3) {
                m_client.MessageEx(ABM_MSG.MSG_ABM_KEY_F3, iProperty);
            }

        }

        private void wizHandlerGridDblClick(int index, int rowIndex, int colIndex) {
            if(m_clientManageGrid) {
                cIABMClientGrid clientGrid = null;
                cIABMProperty iProperty = null;

                clientGrid = m_client;
                iProperty = getProperty(cspGrid, index, 0);
                clientGrid.DblClick(iProperty.Key, rowIndex, colIndex);
            }
        }

        private void wizHandlerTabGetFirstCtrl(int index, Control ctrl) {
            ctrl = tabGetFirstCtrl(index);
        }

        ///////////////////////////////////////////////////////////////////////////////////////////
        // Eventos de la interfaz

        //-----------
        // Menu
        //
        private void m_Menu_Click(int itemNumber) { // TODO: Use of ByRef founded Private Sub m_Menu_Click(ByRef ItemNumber As Long)
            try {

                int itemData = 0;

                itemData = m_menu.ItemData(itemNumber);

                m_client.MessageEx(ABM_MSG.MSG_MENU_AUX, itemData);

                / * *TODO:** goto found: GoTo ExitProc* /
            } catch (Exception ex) {
                MngError(VBA.ex, "m_Menu_Click", C_MODULE, "");
                if(VBA.ex.Number) { / * *TODO:** resume found: Resume(ExitProc)* /  }
                / * *TODO:** label found: ExitProc:* /

            }
        }

        //------------
        // Abms
        //
        private void masterHandlerComboChange(int index) {
            pComboChange(index);
        }

        //Private Sub masterHandlerCBhockChange(ByVal Index As Integer)
        //  pCBHockChange Index
        //End Sub

        private void masterHandlerTabClick(int index) {
            tabClick(index);
        }

        private void masterHandlerCheckBoxClick(int index) {
            pCheckBoxClick(index);
        }

        private void masterHandlerCancelClick() {
            try {

                if(m_showOkCancel) {
                    masterHandlerCloseClick();
                    m_okCancelResult = false;
                }
                else {

                    if(m_bSendRefresh) {
                        m_client.MessageEx(ABM_MSG.MSG_DOC_REFRESH, null);
                        refreshTitle();
                        setChanged(false);
                    }
                    else {
                        pDiscardChanges();
                    }
                }

                / * *TODO:** goto found: GoTo ExitProc* /
            } catch (Exception ex) {
                MngError(VBA.ex, "masterHandlerCancelClick", C_MODULE, "");
                if(VBA.ex.Number) { / * *TODO:** resume found: Resume(ExitProc)* /  }
                / * *TODO:** label found: ExitProc:* /

            }
        }

        private void masterHandlerCommandClick(int index) {
            changeProperty(cspButton, index, getView().CMD(index));
        }

        private void masterHandlerCloseClick() {
            if(m_masterView === null) { return; }
            Unload(m_masterView);
        }

        private void masterHandlerCopyClick() {
            m_client.Copy;

                m_masterView.ZOrder;
                VBA.ex.Clear;
            }
        }

        private void masterHandlerDocumentsClick() {
            m_client.ShowDocDigital;
        }

        private void masterHandlerNewClick() {
            try {
                if(m_client.CanNew) {

                    doNew(m_masterView);

                // * TODO:** the error label ControlError: couldn't be found

                    m_masterView.ZOrder;
                    VBA.ex.Clear;
                }

                / * *TODO:** goto found: GoTo ExitProc* /
                / * *TODO:** label found: ControlError:* /
                MngError(VBA.ex, "masterHandlerNewClick", C_MODULE, "");
                if(VBA.ex.Number) { / * *TODO:** resume found: Resume(ExitProc)* /  }
                / * *TODO:** label found: ExitProc:* /

            }
        }

        private void doNew(Form frm) {
            cMouseWait mouse = null;
            mouse = new cMouseWait();

            cLockUpdateWindow lockwnd = null;

            // Solo en headers y en abm's
            if(m_isDocument) {
                if(m_isItems) { return; }
                if(m_isFooter) { return; }
            }

            if(!pSaveChanges(false, false)) { return; }

            // With frm;

                m_title2 = "";

                if(!m_isDocument && !m_bSendRefresh) {
                    pDiscardChanges(true);
                }

                lockwnd = new cLockUpdateWindow();
                lockwnd.lockW(frm.hWnd);

                m_client.EditNew;

                if(m_bSendRefresh) {
                    refreshTitle();
                }

                if(m_isDocument) {
                    if(!pNewWithWizard()) {
                        pMoveFocus();
                    }
                }

                setChanged(false);

                if(m_newKeyPropFocus != "") {
                    pSetFocusFromKeyProp(m_newKeyPropFocus);
                }
                else {

                    if(m_isDocument) {
                        if(!pNewWithWizard()) {
                            frm.SetFocusFirstControl;
                        }
                    }
                }
            // {end with: frm}
        }

        private void pMoveFocus() {
            Object c = null;

            if(m_documentView != null) {

                    c = m_documentView.ActiveControl;
                    m_documentView.MEFE.cABMGridRow.item(0).SetFocus;
                    VBA.ex.Clear;
                    DoEvents:(DoEvents: DoEvents);
                    c.SetFocus;
                    DoEvents:(DoEvents: DoEvents);
                    VBA.ex.Clear;
                }
            }
        }

        private void pSetFocusFromKeyProp(String keyProp) {


                cIABMProperties iPropeties = null;
                cABMProperty oProp = null;

                iPropeties = m_properties;

                oProp = iPropeties.Item(keyProp);
                oProp.getCtl().SetFocus;

            }
        }

        private void masterHandlerPrintClick() {

                Object rtnVar = null;

                rtnVar = m_client.MessageEx(ABM_MSG.MSG_ABM_PRINT, null);
                if(VarType(rtnVar) != vbBoolean) {
                    MsgInfo("Esta interfaz no posee impresión");
                }
            }
        }

        private void setCanPrint() {

                Object rtnVar = null;

                rtnVar = m_client.MessageEx(ABM_MSG.MSG_ABM_CAN_PRINT, null);
                if(mUtil.val(rtnVar) != ABM_MSG.MSG_ABM_CAN_PRINT) {
                    getView().cmdPrint.cABMGridRow.setVisible(false);
                }
                else {
                    getView().cmdPrint.cABMGridRow.setVisible(true);
                }
            }
        }

        private void masterHandlerPermissionsClick() {

                Object rtnVar = null;

                rtnVar = m_client.MessageEx(ABM_MSG.MSG_EDIT_Permissions, null);
                if(VarType(rtnVar) != vbBoolean) {
                    MsgInfo("Esta interfaz no permite editar Permissions");
                }
            }
        }

        private void setShowPermissions() {

                Object rtnVar = null;

                rtnVar = m_client.MessageEx(ABM_MSG.MSG_SHOW_EDIT_Permissions, null);
                if(mUtil.val(rtnVar) != ABM_MSG.MSG_SHOW_EDIT_Permissions) {
                    getView().cmdPermissions.cABMGridRow.setVisible(false);
                }
                else {
                    getView().cmdPermissions.cABMGridRow.setVisible(true);
                }
            }
        }

        private void pshowSelect() {

                Object rtnVar = null;

                rtnVar = m_client.MessageEx(ABM_MSG.MSG_DOC_INFO, null);

                if(VarType(rtnVar) != vbBoolean) {
                    if(G.isNumeric(rtnVar)) {
                        if(mUtil.val(rtnVar) != ABM_MSG.MSG_DOC_INFO_HANDLED) {
                            pshowSelectAux();
                        }
                    }
                    else {
                        pshowSelectAux();
                    }
                }
                else {
                    pshowSelectAux();
                }
            }
        }

        private void pshowSelectAux() {

                CSKernelClient2.EditFile(CSKernelClient2.GetValidPath(mUtil.gAppPath)+ "cairo.chm", getHWnd());
            }
        }

        private void masterHandlerSaveClick() {
            if(!pSave(false, false)) { return; }

            if(m_showOkCancel) {
                m_okCancelResult = true;

                if(m_masterView != null) {
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

        private void masterHandlerViewLoad() {
            resetChanged();
        }

        private void masterHandlerViewBeforeDestroy(int cancel, int unloadMode) {
            if(m_client != null) {
                pSaveChanges(cancel, true);
            }
        }

        private void masterHandlerViewDestroy(int cancel) {
            if(m_client != null) {

                saveColumnsGrids();

                mUtil.destroyGrids(getView());

                m_unloading = true;

                m_client.Terminate;
                m_client = null;
            }
            m_masterView = null;
        }

        var pSaveChanges(int cancel, boolean bUnloading) { // TODO: Use of ByRef founded Private Function pSaveChanges(ByRef Cancel As Integer, ByVal bUnloading As Boolean) As Boolean
            boolean _rtn = false;
            if(m_isDocument) {
                if(m_isFooter || m_isItems) {
                    _rtn = true;
                    return _rtn;
                }
            }

            if(getChanged() && !m_noAskForSave) {
                VbMsgBoxResult rslt = null;

                getView().ZOrder;
                rslt = MsgBox("Ud. ha realizado cambios que no ha guardado."+ "\\r\\n"+ "\\r\\n"+ "¿Desea guardarlos?", vbQuestion + vbYesNoCancel, "Guardar");

                if(rslt === vbYes) {

                    if(!pSave(bUnloading, false)) {
                        cancel = true;
                        return _rtn;
                    }
                    setChanged(false);

                }
                else if(rslt === vbNo) {
                    setChanged(false);

                }
                else if(rslt === vbCancel) {
                    cancel = true;
                    return _rtn;
                }
            }

            _rtn = true;
            return _rtn;
        }

        private void masterHandlerGridColumnAfterEdit(int index, int lRow, int lCol, Object newValue, int newValueID, boolean bCancel) {
            pGridColumnEdit(true, index, lRow, lCol, 0, newValue, newValueID, bCancel);
        }

        private void masterHandlerGridColumnAfterUpdate(int index, int lRow, int lCol, Object newValue, int newValueID) {
            pGridColumnAfterUpdate(index, lRow, lCol, 0, newValue, newValueID);
        }

        private void masterHandlerGridColumnBeforeEdit(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
            pGridColumnEdit(false, index, lRow, lCol, iKeyAscii, 0, 0, bCancel);
        }

        private void masterHandlerGridColumnButtonClick(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
            pGridColumnButtonClick(index, lRow, lCol, iKeyAscii, bCancel);
        }

        private void masterHandlerGridDblClick(int index, int rowIndex, int colIndex) {
            if(m_clientManageGrid) {
                cIABMClientGrid clientGrid = null;
                cIABMProperty iProperty = null;

                clientGrid = m_client;
                iProperty = getProperty(cspGrid, index, 0);
                clientGrid.DblClick(iProperty.Key, rowIndex, colIndex);
            }
        }

        private void masterHandlerGridDeleteRow(int index, int lRow, boolean bCancel) {
            pGridDeleteRow(index, lRow, bCancel);
        }

        private void masterHandlerGridNewRow(int index, int rowIndex) {
            pGridNewRow(index, rowIndex);
        }

        private void masterHandlerGridAfterDeleteRow(int index, int rowIndex) {
            pgridAfterDeleteRow(index, rowIndex);
        }

        private void masterHandlerGridSelectionChange(int index, int lRow, int lCol) {
            pGridSelectionChange(index, lRow, lCol, GridSelectChangeType.GRID_SELECTION_CHANGE);
        }

        private void masterHandlerGridSelectionRowChange(int index, int lRow, int lCol) {
            pGridSelectionChange(index, lRow, lCol, GridSelectChangeType.GRID_ROW_CHANGE);
        }

        private void masterHandlerGridValidateRow(int index, int rowIndex, boolean bCancel) {
            pGridValidateRow(index, rowIndex, bCancel, true, false);
        }

        private void masterHandlerSelectChange(int index) {
            pSelectChange(index);
        }

        private void masterHandlerMaskEditChange(int index) {
            pMaskEditChange(index);
        }

        private void masterHandlerDateChange(int index) {
            pDateChange(index);
        }

        private void masterHandlerOptionButtonClick(int index) {
            pOptionButtonClick(index);
        }

        private void masterHandlerShowSelect() {
            pshowSelect();
        }

        private void masterHandlerToolBarButtonClick(MSComctlLib.Button button) {
            pToolBarButtonClik(button);
        }

        private void masterHandlerTextButtonClick(int index, boolean cancel) {
            pTextButtonClick(index, cancel);
        }

        private void masterHandlerTextChange(int index) {
            pTextChange(index);
        }

        private void masterHandlerTextAreaChange(int index) {
            pTextAreaChange(index);
        }

        private void masterHandlerTextPasswordChange(int index) {
            pTextPasswordChange(index);
        }

        private void docHandlerTabClick(int index, String tag) {
            docTabClick(index, tag);
        }

        // Esta funcion tiene este codigo tan raro
        // por que el evento se dispara tres veces
        // una por hedaer, una por items y una por
        // footers, y por lo tanto no debemos modificar
        // la variable de retorno ctrl si no tenemos
        // un control ya que la recibimos en nothing
        // en la primera llamada y en las siguientes
        // llamadas puede o no estar en nothing dependiendo
        // de donde se activo el tab (Header, Items, Footers)
        //
        private void docHandlerTabGetFirstCtrl(int index, String tag, Control ctrl) { // TODO: Use of ByRef founded Private Sub docHandlerTabGetFirstCtrl(ByVal Index As Integer, ByVal Tag As String, ByRef ctrl As Control)
            Control ctrlAux = null;
            ctrlAux = docTabGetFirstCtrl(index, tag);
            if(ctrlAux != null) {
                ctrl = ctrlAux;
            }
        }

        private void docHandlerViewLoad() {
            resetChanged();
        }

        private void docHandlerGridAfterDeleteRow(int index, int rowIndex) {
            pgridAfterDeleteRow(index, rowIndex);
        }

        private void docHandlerToolBarClick(MSComctlLib.Button button) {
            try {

                if(m_isItems) { return; }
                if(m_isFooter) { return; }

                if(button === null) { return; }

                switch (button.Key) {
                    case  c_KeyTbNew:

                        pToolBarClickNew();

                        if(m_sendNewDoc) {

                            // El comportamiento generico es poner el foco
                            // en segunda columna de la grilla
                            //
                            if(m_setFocusFirstCtrlInNew) {

                                // Nada que hacer

                            }
                            else {

                                SetFocusControl(m_documentView.getGrid(0));
                                mUtil.sendKeys("{ENTER}");
                            }

                        }

                        m_client.MessageEx(ABM_MSG.MSG_DOC_NEW_EVENT_COMPLETE, null);

                        break;
                    case  c_KeyTbSave:

                        showMsg("Guardando el comprobante ...");

                        if(pSave(false, false)) {

                            if(m_sendNewDoc) {

                                pToolBarClickNew();

                                // El comportamiento generico es poner el foco
                                // en segunda columna de la grilla
                                //
                                if(m_setFocusFirstCtrlInNew) {

                                    // Nada que hacer

                                }
                                else {

                                    SetFocusControl(m_documentView.getGrid(0));
                                    mUtil.sendKeys("{ENTER}");
                                }

                            }

                        }

                        hideMsg();

                        break;
                    case  c_KeyTbSaveAs:

                        showMsg("Guardando el comprobante ...");

                        m_savingAs = true;

                        if(pSave(false, true)) {

                            if(m_sendNewDoc) {

                                pToolBarClickNew();

                                // El comportamiento generico es poner el foco
                                // en segunda columna de la grilla
                                //
                                if(m_setFocusFirstCtrlInNew) {

                                    // Nada que hacer

                                }
                                else {

                                    SetFocusControl(m_documentView.getGrid(0));
                                    mUtil.sendKeys("{ENTER}");
                                }

                            }

                        }

                        m_savingAs = false;

                        hideMsg();

                        break;
                    case  c_KeyTbAnular:

                        showMsg("Anulando el comprobante ...");
                        m_client.MessageEx(ABM_MSG.MSG_DOC_ANULAR, null);
                        hideMsg();

                        break;
                    case  c_KeyTbReload:

                        pReloadDocument();

                        break;
                    case  c_KeyTbCopy:

                        masterHandlerCopyClick();

                        break;
                    case  c_KeyTbEditState:
                        m_client.MessageEx(ABM_MSG.MSG_DOC_EDIT_STATE, null);

                        break;
                    case  c_KeyTbDocAux:
                        m_client.MessageEx(ABM_MSG.MSG_DOC_DOC_AUX, null);

                        break;
                    case  c_KeyTbDocAction:
                        m_client.MessageEx(ABM_MSG.MSG_DOC_DOC_ACTION, null);

                        break;
                    case  c_KeyTbDocEdit:
                        m_client.MessageEx(ABM_MSG.MSG_DOC_DOC_EDIT, null);

                        break;
                    case  c_KeyTbDelete:

                        showMsg("Borrando el comprobante ...");
                        if(pAskDelete("Confirma que desea borrar el comprobante")) {
                            if(mMsgConstantes.varToBool(m_client.MessageEx(ABM_MSG.MSG_DOC_DELETE, null))) {
                                resetChanged();
                            }
                        }
                        hideMsg();

                        break;
                    case  c_KeyTbSearch:

                        m_client.MessageEx(ABM_MSG.MSG_DOC_SEARCH, getChanged());

                        break;
                    case  c_KeyTbPrint:
                        pPrint(false);

                        break;
                    case  c_KeyTbDocMail:
                        pPrint(true);

                        break;
                    case  c_KeyTbSignature:
                        m_client.MessageEx(ABM_MSG.MSG_DOC_SIGNATURE, null);

                        break;
                    case  c_KeyTbApply:

                        showMsg("Cargando las aplicaciones del comprobante ...");
                        m_client.MessageEx(ABM_MSG.MSG_DOC_APPLY, null);
                        hideMsg();

                        break;
                    case  c_KeyTbAttach:
                        masterHandlerDocumentsClick();

                        break;
                    case  c_KeyTbHistory:
                        m_client.MessageEx(ABM_MSG.MSG_DOC_HISTORY, null);

                        break;
                    case  c_KeyTbFirst:

                        showMsg("Cargando el primer comprobante ...");
                        pMove(ABM_MSG.MSG_DOC_FIRST);
                        hideMsg();

                        break;
                    case  c_KeyTbPrevious:

                        showMsg("Cargando el comprobante anterior ...");
                        pMove(ABM_MSG.MSG_DOC_PREVIOUS);
                        hideMsg();

                        break;
                    case  c_KeyTbNext:

                        showMsg("Cargando el siguiente comprobante ...");
                        pMove(ABM_MSG.MSG_DOC_NEXT);
                        hideMsg();

                        break;
                    case  c_KeyTbLast:

                        showMsg("Cargando el último comprobante ...");
                        pMove(ABM_MSG.MSG_DOC_LAST);
                        hideMsg();

                        break;
                    case  c_KeyTbHelp:
                        pshowSelect();

                        break;
                    case  c_KeyTbDocMerge:
                        showMsg("Ejecutando el proceso de compensación ...");
                        m_client.MessageEx(ABM_MSG.MSG_DOC_MERGE, null);
                        hideMsg();

                        break;
                    case  c_KeyTbDocAlert:
                        showMsg("Cargando alertas para este comprobante...");
                        m_client.MessageEx(ABM_MSG.MSG_DOC_ALERT, null);
                        hideMsg();

                        break;
                    case  c_KeyTbDocTip:
                        CSKernelClient2.SendEmailToCrowSoft("Sugerencia para CrowSoft Cairo", "Documento: "+ m_title2);

                        break;
                    case  c_KeyTbClose:
                        pFormDocClose();

                    break;
                    default:
                        m_client.MessageEx(ABM_MSG.MSG_TOOLBAR_BUTTON_CLICK, button.Key);

                        break;
                }

                / * *TODO:** goto found: GoTo ExitProc* /
            } catch (Exception ex) {
                MngError(VBA.ex, "docHandlerToolBarClick", C_MODULE, "");
                if(VBA.ex.Number) { / * *TODO:** resume found: Resume(ExitProc)* /  }
                / * *TODO:** label found: ExitProc:* /

                hideMsg();
                m_savingAs = false;

            }
        }

        self.raiseNewDocEven() {

            pToolBarClickNew();

            if(m_sendNewDoc) {

                // El comportamiento generico es poner el foco
                // en segunda columna de la grilla
                //
                if(m_setFocusFirstCtrlInNew) {

                    // Nada que hacer

                }
                else {

                    SetFocusControl(m_documentView.getGrid(0));
                    mUtil.sendKeys("{ENTER}");
                }

            }

        }

        self.setFocusInGridForDocs() {

            SetFocusControl(m_documentView.getGrid(0));
            mUtil.sendKeys("{ENTER}");

        }

        // Actualiza la coleccion rows del objeto grid de iProp
        // con los valores select del objeto row de la coleccion
        // rows del control cGrid.
        //
        // Siempre hay al menos una fila seleccionada ya que la
        // que tiene el foco esta siempre seleccionada
        //
        self.refreshSelectedInGrid(cIABMProperty iProp) { // TODO: Use of ByRef founded Public Sub RefreshSelectedInGrid(ByRef iProp As cIABMProperty)
            m_gridManager.refreshSelectedInGrid(iProp);
        }

        // Solo acepta filas seleccionadas si el foco esta en la primera
        // columna
        //
        // Esto es para diferenciar entre una fila seleccionada explicitamente
        // de una fila seleccionada por que el foco esta en ella
        //
        self.refreshSelectedInGrid2(cIABMProperty iProp) { // TODO: Use of ByRef founded Public Sub RefreshSelectedInGrid2(ByRef iProp As cIABMProperty)
            m_gridManager.refreshSelectedInGrid2(iProp);
        }

        private void pToolBarClickNew() {
            showMsg("Cargando nuevo comprobante ...");
            doNew(m_documentView);
            hideMsg();
        }

        self.showMsg = function(msg, changeTop) {

                Object w_frm = getView();
                    w_frm.picMsg.cABMProperty.setLeft((w_frm.ScaleWidth - w_frm.picMsg.cABMProperty.getWidth()) * 0.5);
                    if(changeTop) {
                        w_frm.picMsg.cABMProperty.setTop((w_frm.ScaleHeight - w_frm.picMsg.cABMProperty.getHeight()) * 0.25);
                    }
                    w_frm.lbMsg.cABMDocPropertiesCol.setText(msg);
                    w_frm.picMsg.ZOrder;
                    w_frm.picMsg.cABMGridRow.setVisible(true);
                    DoEvents;
                // {end with: w_frm}
            }
        }

        private void hideMsg() {

                getView().picMsg.cABMGridRow.setVisible(false);
            }
        }

        private void pMove(ABM_MSG moveTo) {
            if(m_client != null) {

                if(!pSaveChanges(false, false)) { return; }

                m_client.MessageEx(moveTo, null);

                if(m_isDocument) {

                    pMoveFocus();
                }

                setChanged(false);

            }
        }

        //------------
        // Wizard
        private void wizHandlerComboChange(int index) {
            pComboChange(index);
        }

        //Private Sub wizHandlerCBhockChange(ByVal Index As Integer)
        //  pCBHockChange Index
        //End Sub

        private void wizHandlerTabClick(int index) {
            tabClick(index);
        }

        private void wizHandlerCheckBoxClick(int index) {
            pCheckBoxClick(index);
        }

        private void wizHandlerCancelClick() {

                if(m_inProcess) { return; }
                pWizDisableButtons();
                if(!m_client.PropertyChange(K_W_CANCEL)) {
                    pWizEnableButtons();
                    return;
                }

                pWizEnableButtons();
                setChanged(false);
                Unload(m_wizardView);
                VBA.ex.Clear;
            }
        }

        private void wizHandlerBackClick() {

                if(m_inProcess) { return; }
                pWizDisableButtons();
                moveBack();
                pWizEnableButtons();
                VBA.ex.Clear;
            }
        }

        private void wizHandlerCommandClick(int index) {
            changeProperty(cspButton, index, getView().CMD(index));
        }

        private void wizHandlerNextClick() {

                if(m_inProcess) { return; }
                pWizDisableButtons();
                moveNext();
                pWizEnableButtons();
                VBA.ex.Clear;
            }
        }

        private void wizHandlerViewLoad() {
            resetChanged();
        }

        private void wizHandlerViewBeforeDestroy(int cancel, int unloadMode) {
            if(m_client != null) {
                pSaveChanges(cancel, true);
            }
        }

        private void wizHandlerViewDestroy(int cancel) {
            if(m_client != null) {

                saveColumnsGrids();

                mUtil.destroyGrids(getView());

                m_unloading = true;

                m_client.Terminate;
                m_client = null;
            }
            m_wizardView = null;
        }

        private void wizHandlerGridColumnAfterEdit(int index, int lRow, int lCol, Object newValue, int newValueID, boolean bCancel) {
            pGridColumnEdit(true, index, lRow, lCol, 0, newValue, newValueID, bCancel);
        }

        private void wizHandlerGridColumnAfterUpdate(int index, int lRow, int lCol, Object newValue, int newValueID) {
            pGridColumnAfterUpdate(index, lRow, lCol, 0, newValue, newValueID);
        }

        private void wizHandlerGridColumnBeforeEdit(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
            pGridColumnEdit(false, index, lRow, lCol, iKeyAscii, 0, 0, bCancel);
        }

        private void wizHandlerGridColumnButtonClick(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
            pGridColumnButtonClick(index, lRow, lCol, iKeyAscii, bCancel);
        }

        //Private Sub wizHandlerGridDblClick(ByVal Index As Integer, ByVal RowIndex As Long, ByVal ColIndex As Long)
        // Ya veremos que hacemos
        //End Sub

        private void wizHandlerGridDeleteRow(int index, int lRow, boolean bCancel) {
            pGridDeleteRow(index, lRow, bCancel);
        }

        private void wizHandlerGridNewRow(int index, int rowIndex) {
            pGridNewRow(index, rowIndex);
        }

        private void wizHandlerGridAfterDeleteRow(int index, int rowIndex) {
            pgridAfterDeleteRow(index, rowIndex);
        }

        private void wizHandlerGridSelectionChange(int index, int lRow, int lCol) {
            pGridSelectionChange(index, lRow, lCol, GridSelectChangeType.GRID_SELECTION_CHANGE);
        }

        private void wizHandlerGridSelectionRowChange(int index, int lRow, int lCol) {
            pGridSelectionChange(index, lRow, lCol, GridSelectChangeType.GRID_ROW_CHANGE);
        }

        private void wizHandlerGridValidateRow(int index, int rowIndex, boolean bCancel) {
            pGridValidateRow(index, rowIndex, bCancel, true, false);
        }

        private void wizHandlerSelectChange(int index) {
            pSelectChange(index);
        }

        private void wizHandlerMaskEditChange(int index) {
            pMaskEditChange(index);
        }

        private void wizHandlerDateChange(int index) {
            pDateChange(index);
        }

        private void wizHandlerOptionButtonClick(int index) {
            pOptionButtonClick(index);
        }

        private void wizHandlerToolBarButtonClick(MSComctlLib.Button button) {
            pToolBarButtonClik(button);
        }

        private void wizHandlerTextChange(int index) {
            try {

                pTextChange(index);

                return;
            } catch (Exception ex) {
                MngError(VBA.ex, "wizHandlerTextChange", C_MODULE, "");
            }
        }

        private void wizHandlerTextAreaChange(int index) {
            try {

                pTextAreaChange(index);

                return;
            } catch (Exception ex) {
                MngError(VBA.ex, "wizHandlerTextAreaChange", C_MODULE, "");
            }
        }

        private void wizHandlerTextPasswordChange(int index) {
            pTextPasswordChange(index);
        }

        //------------
        // Documentos
        private void docHandlerComboChange(int index) {
            pComboChange(index);
        }

        private void docHandlerCheckBoxClick(int index) {
            pCheckBoxClick(index);
        }

        private void pFormDocClose() {
            if(m_documentView === null) { return; }
            Unload(m_documentView);
        }

        private void docHandlerViewBeforeDestroy(int cancel, int unloadMode) {
            if(m_isFooter || m_isItems) { return; }

            if(m_client != null) {

                Object w_frm = getView();

                    w_frm.CancelUnload = false;
                    if(!pSaveChanges(cancel, true)) {
                        w_frm.CancelUnload = true;
                    }
                // {end with: w_frm}
            }
        }

        private void docHandlerViewDestroy(int cancel) {

            getView().UnloadCount = getView().UnloadCount + 1;

            Object w_frm = getView();

                if(m_isFooter || m_isItems) {

                    // Solo si el usuario no desidio cancelar el cierre del form
                    if(w_frm.CancelUnload) { return; }

                    saveColumnsGrids();
                    m_unloading = true;

                    m_client = null;

                }
                else {

                    if(m_client != null) {

                        w_frm.CancelUnload = false;

                        saveColumnsGrids();
                        m_unloading = true;

                        m_client.Terminate;
                        m_client = null;
                    }

                }

                // Solo destruyo las grillas en el footer que
                // es el ultimo en recibir el evento unload
                //
                if(getView().UnloadCount === 3) { mUtil.destroyGrids(getView()); }

                m_documentView = null;
            // {end with: w_frm}
        }

        private void docHandlerGridColumnButtonClick(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
            pGridColumnButtonClick(index, lRow, lCol, iKeyAscii, bCancel);
        }

        private void docHandlerGridColumnAfterEdit(int index, int lRow, int lCol, Object newValue, int newValueID, boolean bCancel) {
            pGridColumnEdit(true, index, lRow, lCol, 0, newValue, newValueID, bCancel);
        }

        private void docHandlerGridColumnAfterUpdate(int index, int lRow, int lCol, Object newValue, int newValueID) {
            pGridColumnAfterUpdate(index, lRow, lCol, 0, newValue, newValueID);
        }

        private void docHandlerGridColumnBeforeEdit(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
            pGridColumnBeforeEdit(index, lRow, lCol, iKeyAscii, bCancel);
            if(bCancel) { return; }
            pGridColumnEdit(false, index, lRow, lCol, iKeyAscii, 0, 0, bCancel);
        }

        private void docHandlerGridDeleteRow(int index, int lRow, boolean bCancel) {
            pGridDeleteRow(index, lRow, bCancel);
        }

        private void docHandlerGridNewRow(int index, int rowIndex) {
            pGridNewRow(index, rowIndex);
        }

        private void docHandlerGridValidateRow(int index, int rowIndex, boolean bCancel) {
            pGridValidateRow(index, rowIndex, bCancel, true, false);
        }

        private void docHandlerGridSelectionChange(int index, int lRow, int lCol) {
            pGridSelectionChange(index, lRow, lCol, GridSelectChangeType.GRID_SELECTION_CHANGE);
        }

        private void docHandlerGridSelectionRowChange(int index, int lRow, int lCol) {
            pGridSelectionChange(index, lRow, lCol, GridSelectChangeType.GRID_ROW_CHANGE);
        }

        private void docHandlerSelectChange(int index) {
            pSelectChange(index);
        }

        private void docHandlerMaskEditChange(int index) {
            pMaskEditChange(index);
        }

        private void docHandlerDateChange(int index) {
            pDateChange(index);
        }

        private void docHandlerOptionButtonClick(int index) {
            pOptionButtonClick(index);
        }

        private void docHandlerTextChange(int index) {
            pTextChange(index);
        }

        private void docHandlerTextAreaChange(int index) {
            pTextAreaChange(index);
        }

        private void docHandlerTextPasswordChange(int index) {
            pTextPasswordChange(index);
        }

        // funciones del objeto
        private void pComboChange(int index) {
            changeProperty(cspList, index, getView().CB(index));
            //ReLoadListAdHock
        }

        private void pCheckBoxClick(int index) {
            changeProperty(cspCheck, index, getView().CHK(index));
            //ReLoadListAdHock
        }

        private void pGridDeleteRow(int index, int lRow, boolean bCancel) {
            if(!m_clientManageGrid) { return; }

            cABMProperty oProperty = null;
            oProperty = getProperty(cspGrid, index, 0);

            if(oProperty === null) { return; }

            cIABMClientGrid clientGrid = null;
            clientGrid = m_client;

            if(clientGrid.DeleteRow(pGetPropertyKey(oProperty), pCreateRow(index, oProperty, lRow), lRow)) {
                cIABMProperty iProperty = null;
                iProperty = oProperty;
                iProperty.Grid.cABMCSGrid.getRows().Remove(lRow);
                bCancel = false;
                m_client.MessageEx(ABM_MSG.MSG_GRID_ROW_DELETED, iProperty.Key);


                    Object grid = null;
                    grid = getView().getGrid(oProperty.getIndex());
                    if(grid.Rows <= 1) {
                        grid.Rows = 2;
                    }
                }
                else {
                    bCancel = true;
                }
            }
        }

        private void pgridAfterDeleteRow(int index, int lRow) {
            cIABMProperty iProperty = null;
            iProperty = getProperty(cspGrid, index, 0);

            pRefreshRowsIndex(iProperty, lRow);


                Object grid = null;
                grid = getView().getGrid(index);
                if(grid.Rows < 1) {
                    grid.Rows = 1;
                }
            }
        }

        private void pRefreshRowsIndex(cIABMProperty iProperty, int lRow) { // TODO: Use of ByRef founded Private Sub pRefreshRowsIndex(ByRef iProperty As cIABMProperty, ByVal lRow As Long)
            try {

                for (lRow = lRow; lRow <= iProperty.Grid.cABMCSGrid.getRows().Count; lRow++) {
                    showCellValue(iProperty, lRow, 1);
                }

                cGridAdvanced grid = null;
                cABMProperty oProperty = null;

                oProperty = iProperty;
                grid = oProperty.getCtl();
                if(lRow <= grid.Rows) {
                    grid.Cell(lRow, 1).text === lRow;
                }

            } catch (Exception ex) {
            }
        }

        private void pSetRowBackground(int index, cIABMProperty iProperty, int lRow, int lCol) { // TODO: Use of ByRef founded Private Sub pSetRowBackground(ByVal Index As Long, ByRef iProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long)
            try {

                cGridAdvanced grid = null;
                grid = getView().getGrid(index);

                if(iProperty.Grid.cABMDocProperties.getColumns(lCol).PropertyType === cspGrid) {
                    grid.SelectRow(lRow);
                }
                else {
                    grid.UnSelectRow;
                }
            } catch (Exception ex) {
            }
        }

        private void pGridSelectionChange(int index, int lRow, int lCol, csEGridSelectChangeType what) {

            cIABMProperty iProperty = null;
            iProperty = getProperty(cspGrid, index, 0);

            if(iProperty != null) {
                iProperty.SelectedIndex = lRow;

                if(what === GridSelectChangeType.GRID_SELECTION_CHANGE) {

                    pSetRowBackground(index, iProperty, lRow, lCol);

                }
                else if(what === GridSelectChangeType.GRID_ROW_CHANGE) {

                    if(m_client === null) { return; }
                    m_client.MessageEx(ABM_MSG.MSG_GRID_ROW_CHANGE, iProperty);
                }
            }
        }

        private void pGridNewRow(int index, int rowIndex) {
            if(m_clientManageGrid) {

                cABMProperty oProperty = null;
                oProperty = getProperty(cspGrid, index, 0);

                if(oProperty != null) {

                    cIABMClientGrid clientGrid = null;
                    clientGrid = m_client;

                    clientGrid.NewRow(pGetPropertyKey(oProperty), rowIndex);

                    pSetDefaults(oProperty, rowIndex);
                }
            }
        }

        private void pSetDefaults(cABMProperty oProperty, int rowIndex) { // TODO: Use of ByRef founded Private Sub pSetDefaults(ByRef oProperty As cABMProperty, ByVal RowIndex As Long)
            Object grid = null;
            cIABMProperty iProp = null;
            cIABMGridRow iRow = null;
            cIABMGridColumn col = null;
            int colIndex = 0;

            iProp = oProperty;
            iRow = pCreateRow(oProperty.getIndex(), oProperty, rowIndex);

            iProp = oProperty;
            iRow.Item(1).Value = iProp.Grid.cABMCSGrid.getRows().Count + 1;

            for (int _i = 0; _i < iProp.Grid.cABMDocProperties.getColumns().size(); _i++) {
                Col = iProp.Grid.Columns.getItem(_i);
                colIndex = colIndex + 1;
                if(!col.DefaultValue === null) {
                    // * TODO:** can't found type for with block
                    // * With iRow.Item(colIndex)
                    __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = iRow.Item(colIndex);
                        w___TYPE_NOT_FOUND.Id = col.DefaultValue.cABMCSGrid.getId();
                        w___TYPE_NOT_FOUND.Value = col.DefaultValue.Value;
                    // {end with: w___TYPE_NOT_FOUND}
                }
            }

            if(iRow === null) { return; }

            grid = getView().getGrid(oProperty.getIndex());
            getMngGrid().loadFromRow(grid, iRow, rowIndex, iProp.Grid.cABMDocProperties.getColumns());
        }

        private void pGridColumnAfterUpdate(int index, int lRow, int lCol, int iKeyAscii, Object newValue, int newValueID) {
            try {

                if(m_clientManageGrid) {

                    cABMProperty oProperty = null;
                    cIABMProperty iProperty = null;

                    oProperty = getProperty(cspGrid, index, 0);

                    if(oProperty != null) {

                        cIABMClientGrid clientGrid = null;
                        String keyProp = "";

                        keyProp = pGetPropertyKey(oProperty);

                        clientGrid = m_client;

                        // If the row not exists we have to create it because the client need it to hold
                        // calculated data
                        pCreateRowIfNotExists(oProperty, index, lRow);

                        pSetColumnValueInProperty(oProperty, index, lRow, lCol, newValue, newValueID);

                        // Multi
                        // Si no se generaron filas virtuales con esta llamada
                        // actualizo los valores en la grilla
                        //
                        if(!pProcessVirtualRow(oProperty, index, lRow, lCol, keyProp, clientGrid)) {

                            // Let client one chance to calculate columns
                            clientGrid.ColumnAfterUpdate(keyProp, lRow, lCol);

                            iProperty = oProperty;
                            pSetRowValueInGrid(index, oProperty, lRow, iProperty.Grid.cABMCSGrid.getRows(lRow));

                        }

                        if(pIsEditColumn(oProperty, lCol)) {

                            setChanged(true);

                        }
                    }
                }

                return;
            } catch (Exception ex) {
                MngError(VBA.ex, "pGridColumnAfterUpdate", C_MODULE, "");
            }
        }

        var pIsEditColumn(cIABMProperty iProperty, int lCol) {
            cABMGridColumn oCol = null;
            oCol = iProperty.Grid.cABMDocProperties.getColumns(lCol);
            return oCol.getIsEditColumn();
        }

        var pProcessVirtualRow(cABMProperty oProperty, int index, int lRow, int lCol, String keyProp, cIABMClientGrid clientGrid) { // TODO: Use of ByRef founded Private Function pProcessVirtualRow(ByRef oProperty As cABMProperty, ByVal Index As Integer, ByVal lRow As Long, ByVal lCol As Long, ByVal KeyProp As String, ByRef ClientGrid As cIABMClientGrid) As Boolean
            boolean _rtn = false;

            // Manejo de Filas Virtuales
            //
            int iAddRows = 0;
            int i = 0;
            int q = 0;
            cVirtualRowInfo vrInfo = null;
            vrInfo = new cVirtualRowInfo();

            if(pAddVirtualRows(pGetPropertyKey(oProperty), lRow, lCol, iAddRows, vrInfo)) {

                _rtn = true;

                cIABMProperty iProperty = null;
                iProperty = oProperty;

                int n = 0;
                n = iProperty.Grid.cABMCSGrid.getRows().Count;

                oProperty.getCtl().Rows = n + iAddRows;

                iAddRows = n + iAddRows;

                int lColAmount = 0;
                lColAmount = pGetColIndexFromKey(oProperty, vrInfo.getLColAmount());

                for (i = n; i <= iAddRows; i++) {
                    q = q + 1;
                    pGridNewRow(index, i);
                    pCreateRowIfNotExists(oProperty, index, i);

                    if(i < iAddRows) {
                        pSetColumnValueInProperty(oProperty, index, i, lCol, vrInfo.getNewValue(q), mUtil.val(vrInfo.getNewId(q)));

                        clientGrid.ColumnAfterEdit(keyProp, i, lCol, vrInfo.getNewValue(q), mUtil.val(vrInfo.getNewId(q)));

                        // Let client one chance to calculate columns
                        clientGrid.ColumnAfterUpdate(keyProp, i, lCol);

                        if(lColAmount > 0) {
                            pSetColumnValueInProperty(oProperty, index, i, lColAmount, vrInfo.getNewAmount(q), 0);

                            clientGrid.ColumnAfterEdit(keyProp, i, lColAmount, vrInfo.getNewAmount(q), 0);

                            // Let client one chance to calculate columns
                            clientGrid.ColumnAfterUpdate(keyProp, i, lColAmount);
                        }
                    }

                    pSetRowValueInGrid(index, oProperty, i, iProperty.Grid.cABMCSGrid.getRows(i));
                }

            }

            return _rtn;
        }

        // Multi
        var pAddVirtualRows(String key, int lRow, int lCol, int iAddRows, cVirtualRowInfo vrInfo) { // TODO: Use of ByRef founded Private Function pAddVirtualRows(ByVal Key As String, ByVal lRow As Long, ByVal lCol As Long, ByRef iAddRows As Long, ByRef vrInfo As cVirtualRowInfo) As Boolean
            boolean _rtn = false;
            if(m_client === null) { return _rtn; }

            vrInfo.setKey(key);
            vrInfo.setLRow(lRow);
            vrInfo.setLCol(lCol);

            if(m_client.MessageEx(ABM_MSG.MSG_GRID_VIRTUAL_ROW, vrInfo)) {

                if(vrInfo.getBAddRows()) {

                    iAddRows = vrInfo.getIAddRows();
                    _rtn = true;

                }
            }

            return _rtn;
        }

        private void pGridColumnBeforeEdit(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) { // TODO: Use of ByRef founded Private Sub pGridColumnBeforeEdit(ByVal Index As Integer, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer, ByRef bCancel As Boolean)
            try {

                if(!m_clientManageGrid) { return; }

                bCancel = false;

                cABMProperty oProperty = null;
                cIABMProperty iProperty = null;
                cGridAdvanced oGrid = null;
                cIABMGridColumn column = null;
                cGridColumn c = null;

                iProperty = getProperty(cspGrid, index, 0);

                if(iProperty === null) { return; }
                if(lRow > iProperty.Grid.cABMCSGrid.getRows().Count) { return; }

                oProperty = iProperty;

                oGrid = getView().getGrid(oProperty.getIndex());
                column = iProperty.Grid.cABMDocProperties.getColumns(lCol);
                c = oGrid.Columns(lCol);

                CSInterfacesABM.cIABMGridCellValue w_item = iProperty.Grid.cABMCSGrid.getRows().Item(lRow).cABMGridRow.item(lRow).Item(lCol);
                    if(w_item.Format === null) {

                        // With c;

                            c.EditType = column.PropertyType;
                            c.EditSubType = column.SubType;
                            c.Table = column.Table;
                            c.AllowEdit = column.Enabled;
                            c.Enabled = column.Enabled;
                            bCancel = !column.Enabled;
                            c.HelpFilter = column.HelpFilter;
                            c.HelpSPFilter = column.HelpSPFilter;
                            c.HelpSPInfoFilter = column.HelpSPInfoFilter;

                            c.Size = column.Size;
                            c.Format = column.Format;

                            if(column.PropertyType === cspList) {
                                c.List = column.List;
                            }
                            else {
                                c.List = null;
                            }

                            if(column.SubType === cspPercent) {
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
                        c.AllowEdit = w_item.Format.Enabled;
                        c.Enabled = w_item.Format.Enabled;
                        bCancel = !w_item.Format.Enabled;
                        c.HelpFilter = w_item.Format.HelpFilter;
                        c.Size = w_item.Format.Size;
                        c.Format = w_item.Format.Format;

                        if(w_item.Format.PropertyType === cspList) {
                            c.List = w_item.Format.List;
                        }
                        else {
                            c.List = null;
                        }

                        if(w_item.Format.SubType === cspPercent) {
                            if(w_item.Format.Format === "") {
                                c.Format = "0.00 %";
                            }
                        }
                    }
                // {end with: w_item}

                return;
            } catch (Exception ex) {
                MngError(VBA.ex, "pGridColumnBeforeEdit", C_MODULE, "");
            }
        }

        private void pGridColumnEdit(boolean after, int index, int lRow, int lCol, int iKeyAscii, Object newValue, int newValueID, boolean bCancel) {
            try {

                if(m_clientManageGrid) {

                    cABMProperty oProperty = null;
                    cIABMProperty iProperty = null;
                    int keyProp = 0;
                    cIABMClientGrid clientGrid = null;

                    oProperty = getProperty(cspGrid, index, 0);
                    bCancel = false;

                    if(oProperty != null) {

                        keyProp = pGetPropertyKey(oProperty);
                        clientGrid = m_client;

                        if(after) {

                            // If the row not exists we have to create it because the client need it to hold
                            // calculated data
                            pCreateRowIfNotExists(oProperty, index, lRow);

                            if(!clientGrid.ColumnAfterEdit(keyProp, lRow, lCol, newValue, newValueID)) {
                                bCancel = true;
                            }

                        }
                        else {

                            if(m_createRowInBeforeEdit) {
                                // If the row not exists we have to create it because the client need it to hold
                                // calculated data
                                pCreateRowIfNotExists(oProperty, index, lRow);
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
            } catch (Exception ex) {
                MngError(VBA.ex, "pGridColumnEdit", C_MODULE, "");
            }
        }

        private void pGridColumnButtonClick(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
            try {

                if(m_clientManageGrid) {

                    cABMProperty oProperty = null;
                    cIABMProperty iProperty = null;
                    int keyProp = 0;
                    cIABMClientGrid clientGrid = null;

                    oProperty = getProperty(cspGrid, index, 0);
                    bCancel = false;

                    if(oProperty != null) {

                        keyProp = pGetPropertyKey(oProperty);
                        clientGrid = m_client;


                        // If the row not exists we have to create it because the client need it to hold
                        // calculated data
                        pCreateRowIfNotExists(oProperty, index, lRow);

                        if(!clientGrid.ColumnButtonClick(keyProp, lRow, lCol, iKeyAscii)) {
                            bCancel = true;
                        }

                        iProperty = oProperty;

                        // Si se trata de una columna de tipo TextButtonEx
                        //
                        // * TODO:** can't found type for with block
                        // * With iProperty.Grid
                        __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = iProperty.Grid;
                            if(w___TYPE_NOT_FOUND.Columns(lCol).SubType === cspTextButtonEx) {
                                String rtn = "";
                                // * TODO:** can't found type for with block
                                // * With .cABMCSGrid.getRows().Item(lRow).cABMGridRow.item(lCol)
                                __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Rows.cABMGridRow.item(lRow).Item(lCol);
                                    rtn = w___TYPE_NOT_FOUND.Value;
                                    if(GetInputEx(rtn)) {
                                        w___TYPE_NOT_FOUND.Value = rtn;
                                    }
                                // {end with: w___TYPE_NOT_FOUND}
                            }
                        // {end with: w___TYPE_NOT_FOUND}

                        //
                        // bCancel es para informarle a la grilla que el button click se manejo por la clase
                        // ya sea true o false el codigo que sigue siempre se ejecuta
                        //
                        pSetRowValueInGrid(index, oProperty, lRow, iProperty.Grid.cABMCSGrid.getRows(lRow));

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
            } catch (Exception ex) {
                MngError(VBA.ex, "pGridColumnEdit", C_MODULE, "");
            }
        }

        private void pCreateRowIfNotExists(cIABMProperty iProperty, int index, int lRow) { // TODO: Use of ByRef founded Private Sub pCreateRowIfNotExists(ByRef iProperty As cIABMProperty, ByVal Index As Integer, ByVal lRow As Long)
            cIABMGridRow row = null;

            int w_rows = iProperty.Grid.cABMCSGrid.getRows();
                row = w_rows.Item(lRow);
                if(row === null) {
                    row = pCreateRow(index, iProperty, lRow);
                    w_rows.Add(row);
                }
            // {end with: w_rows}
        }

        var pGetColIndexFromKey(cIABMProperty iProperty, int lKey) {
            int _rtn = 0;
            if(lKey === -1) {
                _rtn = -1;
            }
            else {
                cIABMGridRow row = null;
                row = iProperty.Grid.cABMCSGrid.getRows().Item(1);
                if(row === null) {
                    return _rtn;
                }
                cIABMGridCellValue iCell = null;
                int i = 0;
                for (i = 1; i <= row.Count; i++) {
                    iCell = row.Item(i);
                    if(iCell.Key === lKey) {
                        _rtn = i;
                        return _rtn;
                    }
                }
            }
            return _rtn;
        }

        private void pSetColumnValueInProperty(cIABMProperty iProperty, int index, int lRow, int lCol, Object newValue, int newValueID) { // TODO: Use of ByRef founded Private Sub pSetColumnValueInProperty(ByRef iProperty As cIABMProperty, ByVal Index As Integer, ByVal lRow As Long, ByVal lCol As Long, ByVal NewValue As Variant, ByVal NewValueID As Long)
            cIABMGridRow row = null;
            cIABMGridCellValue iCell = null;
            cABMGridRowValue oCell = null;
            cABMProperty oProp = null;
            cGridAdvanced grd = null;

            int w_rows = iProperty.Grid.cABMCSGrid.getRows();

                row = w_rows.Item(lRow);
                if(row === null) {
                    row = pCreateRow(index, iProperty, lRow);
                    w_rows.Add(row);
                }

                iCell = row.Item(lCol);
                oCell = iCell;

                // With iCell;
                    iCell.Id = newValueID;
                    iCell.Value = newValue;
                // {end with: iCell}

                // Si esto no funca mala leche :P
                //


                    oProp = iProperty;
                    grd = oProp.getCtl();
                    oCell.setHelpValueProcess(grd.Cell(lRow, lCol).Tag);
                // {end with: w_rows}
            }
        }

        var pGridValidateRow(int index, int rowIndex, boolean bCancel, boolean bAddRow, boolean bIsEmpty) { // TODO: Use of ByRef founded Private Function pGridValidateRow(ByVal Index As Integer, ByVal RowIndex As Long, ByRef bCancel As Boolean, ByVal bAddRow As Boolean, ByRef bIsEmpty As Boolean) As Boolean
            boolean rtn = false;

            if(m_clientManageGrid) {

                cIABMProperty iProperty = null;
                cABMProperty oProperty = null;

                oProperty = getProperty(cspGrid, index, 0);
                bCancel = false;

                if(oProperty != null) {

                    cIABMClientGrid clientGrid = null;
                    cIABMGridRow iRow = null;
                    cABMGridRow oRow = null;
                    String keyProp = "";

                    clientGrid = m_client;
                    keyProp = pGetPropertyKey(oProperty);

                    iRow = pCreateRow(index, oProperty, rowIndex);

                    if(clientGrid.IsEmptyRow(keyProp, iRow, rowIndex)) {
                        mUtil.sendKeys("{TAB}");
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
                        pSetRowValueInGrid(index, oProperty, rowIndex, iRow);

                        if(bAddRow) {

                            // Keep updated the rows collection
                            iProperty = oProperty;

                            cABMGridRows oRows = null;

                            oRows = iProperty.Grid.cABMCSGrid.getRows();

                            // With oRows;

                                oRows.remove(rowIndex, false);

                                oRow = iRow;
                                oRow.setIndex(rowIndex);

                                oRows.add(iRow);

                                if(!iRow.Item(c_keyRowItem) === null) {
                                    iRow.Item(c_keyRowItem).Value = rowIndex;
                                }

                            // {end with: oRows}

                            bCancel = !iProperty.GridAdd;
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

        private void pSelectChange(int index) {
            changeProperty(cspHelp, index, getView().HL(index));
            //ReLoadListAdHock
        }

        private void pMaskEditChange(int index) {
            changeProperty(cspNumeric, index, getView().ME(index));
            //ReLoadListAdHock
        }

        private void pDateChange(int index) {
            cMaskEdit c = null;

            c = getView().MEFE(index);

            if(c.csType === csMkTime) {
                changeProperty(cspTime, index, c);
            }
            else {
                changeProperty(cspDate, index, c);
            }

            //ReLoadListAdHock
        }

        private void pOptionButtonClick(int index) {
            changeProperty(cspOption, index, getView().OP(index));
            //ReLoadListAdHock
        }

        private void pTextButtonClick(int index, boolean cancel) {
            cIABMProperty iProp = null;

            iProp = getProperty(cspText, index, 0);

            if(iProp === null) { return; }

            m_client.MessageEx(ABM_MSG.MSG_BUTTON_TEXT_CLICK, iProp);

            if(iProp.SubType === cspTextButtonEx) {
                String rtn = "";
                // * TODO:** can't found type for with block
                // * With getView().TX(index)
                __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = getView().TX(index);
                    rtn = w___TYPE_NOT_FOUND.text;
                    if(GetInputEx(rtn)) {
                        w___TYPE_NOT_FOUND.text = rtn;
                    }
                // {end with: w___TYPE_NOT_FOUND}
            }

        }

        private void pToolBarButtonClik(MSComctlLib.Button button) {
            changeProperty(cspToolBar, 0, button);
        }

        private void pTextChange(int index) {
            changeProperty(cspText, index, getView().TX(index));
            //ReLoadListAdHock
        }

        private void pTextAreaChange(int index) {
            changeProperty(cspText, index, getView().TXM(index), false, cspMemo);
            //ReLoadListAdHock
        }

        private void pTextPasswordChange(int index) {
            changeProperty(cspPassword, index, getView().txPassword(index));
            //ReLoadListAdHock
        }

        var pGetPropertyKey(cABMProperty oProperty) {
            cIABMProperty iProperty = null;
            iProperty = oProperty;
            return iProperty.Key;
        }

        var pGetKeyFromRowValue(cIABMGridRows rows, int rowIndex, int iCol) {

            if(rows.Count < rowIndex) { return ""; }
            if(rows.Item(rowIndex).cABMDocPropertiesCols.count() < iCol) { return ""; }

            cABMGridRowValue rowValue = null;
            rowValue = rows.Item(rowIndex).cABMGridRow.item(iCol);
            if(rowValue === null) { return ""; }
            return rowValue.getStrKey();
        }

        private cIABMGridRow pCreateRow(int index, cIABMProperty iProperty, int rowIndex) {
            cIABMGridRow row = null;
            cIABMGridColumn col = null;
            cIABMGridCellValue cell = null;
            cABMGridRowValue oCell = null;
            int colIndex = 0;
            String sKey = "";

            row = new cABMGridRow();

            for (int _i = 0; _i < iProperty.Grid.cABMDocProperties.getColumns().size(); _i++) {
                Col = iProperty.Grid.Columns.getItem(_i);
                colIndex = colIndex + 1;
                if(colIndex === 1) {
                    cell = row.Add(null, c_keyRowItem);
                }
                else {
                    sKey = pGetKeyFromRowValue(iProperty.Grid.cABMCSGrid.getRows(), rowIndex, colIndex);
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
                    oCell.setHelpValueProcess(getView().GR.Tag);

                    if(col.PropertyType === cspDate) {
                        cell.Value = mUtil.getDateValueForGridClient(getView().GR.text);

                    }
                    else if(col.SubType === cspPercent) {
                        cell.Value = mUtil.val(getView().GR.text) * 100;

                    }
                    else {
                        cell.Value = getView().GR.text;
                    }

                    cell.Key = col.Key;
                // {end with: getView().GR}
            }

            return row;
        }

        private void pSetRowValueInGrid(int index, cIABMProperty iProperty, int rowIndex, cIABMGridRow row) { // TODO: Use of ByRef founded Private Sub pSetRowValueInGrid(ByVal Index As Integer, ByVal iProperty As cIABMProperty, ByVal RowIndex As Long, ByRef Row As cIABMGridRow)

            cIABMGridColumn col = null;
            cIABMGridCellValue cell = null;
            int colIndex = 0;
            cGridAdvanced oGrid = null;
            cABMGridRow oRow = null;

            cABMGridCellFormat oFormat = null;
            cIABMGridCellFormat iFormat = null;
            StdFont oFont = null;

            oGrid = getView().getGrid(index);

            oRow = row;
            oGrid.RowBackColor(rowIndex) = oRow.getBackColor();
            oGrid.RowForeColor(rowIndex) = oRow.getForeColor();

            for (int _i = 0; _i < iProperty.Grid.cABMDocProperties.getColumns().size(); _i++) {
                Col = iProperty.Grid.Columns.getItem(_i);
                colIndex = colIndex + 1;
                cell = row.Item(colIndex);

                // * TODO:** can't found type for with block
                // * With oGrid.Cell(rowIndex, colIndex)
                __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = oGrid.Cell(rowIndex, colIndex);
                    oGrid.CellItemdata(rowIndex, colIndex) === cell.Id;

                    if(col.PropertyType === cspDate) {
                        w___TYPE_NOT_FOUND.text = mUtil.getDateValueForGrid(cell.Value);

                    }
                    else if(col.SubType === cspPercent) {
                        w___TYPE_NOT_FOUND.text = mUtil.val(cell.Value) / 100;

                    }
                    else {
                        w___TYPE_NOT_FOUND.text = cell.Value;
                    }

                    // Formato de cada celda
                    //
                    iFormat = cell.Format;
                    if(iFormat != null) {

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

        var showForm(int tabIndex, boolean noGrids, boolean bSetFocus) {
            cABMProperty oProperty = null;
            cIABMProperties iProperties = null;
            cIABMProperty iProperty = null;
            int tabs = 0;
            int count = 0;

            iProperties = m_properties;
            m_labelLeft = C_OFFSET_H;

            for (int _i = 0; _i < iProperties.size(); _i++) {
                iProperty = iProperties.getItem(_i);
                if(pGetTabIndex(iProperty) > tabs) { tabs = pGetTabIndex(iProperty); }
            }

            showTabs(tabs);

            m_showingForm = true;
            m_tabIndex = 0;

            for (int _i = 0; _i < iProperties.size(); _i++) {
                oProperty = iProperties.getItem(_i);
                loadControlEx(oProperty, noGrids);
            }

            m_showingForm = false;

            Object w_frm = getView();

                count = w_frm.Controls.count;

                if(!m_isDocument) {
                    if(m_isWizard) {
                        w_frm.cmdNext.tabIndex = count;
                        w_frm.cmdCancel.tabIndex = count;
                        w_frm.cmdBack.tabIndex = count;
                    }
                    else {
                        w_frm.cmdSave.tabIndex = count;
                        w_frm.cmdCancel.tabIndex = count;
                        w_frm.cmdClose.tabIndex = count;
                    }
                }

                if(tabIndex != -1) {
                    if(m_isDocument) {
                        pDocTabClickEx(c_Items, tabIndex);
                        pDocTabClickEx(c_Footer, tabIndex);
                        pDocTabClickEx(c_Header, tabIndex);
                        w_frm.cbTab(tabIndex + m_firstTab).TabSelected === true;
                    }
                    else {
                        tabClick(tabIndex);
                        w_frm.cbTab(tabIndex).TabSelected = true;
                    }
                }

                if(bSetFocus) { w_frm.SetFocusFirstControl; }
            // {end with: w_frm}

            return true;
        }

        var loadControl(cABMProperty oProperty) { // TODO: Use of ByRef founded Private Function LoadControl(ByRef oProperty As cABMProperty) As Boolean
            Control c = null;
            Control f = null;
            cIABMProperty iProperty = null;

            cIABMProperties iProperties = null;
            cABMProperty oProp = null;
            cABMGrid oGrid = null;

            iProperty = oProperty;

            int nTabIndex = 0;
            nTabIndex = pGetTabIndex(iProperty);

            Object w_frm = getView();
                switch (iProperty.PropertyType) {
                        //      Case csTypeABMProperty.cspAdHock
                        //        If m_loadAdHock Then
                        //          Load .CBhock(.CBhock.UBound + 1)
                        //        Else
                        //          m_loadAdHock = True
                        //        End If
                        //
                        //        Set c = .CBhock(.CBhock.UBound)
                        //        pSetFont c, iProperty

                    case  csTypeABMProperty.cspList:
                        if(m_loadList) {
                            Load(w_frm.CB(w_frm.CB.UBound + 1));
                        }
                        else {
                            m_loadList = true;
                        }

                        c = w_frm.CB(w_frm.CB.UBound);
                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspHelp:
                        if(m_loadHelp) {
                            Load(w_frm.HL(w_frm.HL.UBound + 1));
                        }
                        else {
                            m_loadHelp = true;
                        }

                        c = w_frm.HL(w_frm.HL.UBound);
                        c.HelpType = oProperty.getHelpType();
                        c.ForAbm = oProperty.IsForAbm;
                        c.Table = iProperty.Table;
                        c.ButtonStyle = cHelpButtonSingle;
                        c.SPFilter = iProperty.HelpSPFilter;
                        c.SPInfoFilter = iProperty.HelpSPInfoFilter;
                        c.Reset;
                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspNumeric:
                        if(m_loadNumeric) {
                            Load(w_frm.ME(w_frm.ME.UBound + 1));
                        }
                        else {
                            m_loadNumeric = true;
                        }

                        c = w_frm.ME(w_frm.ME.UBound);
                        c.csType = iProperty.SubType;
                        if(iProperty.SubType === 0) {
                            VBA.ex.Raise(csErrores.CSERRORABMLOADCONTROLSUBTYPENOTDEFINED, "CSABMInterface.LoadControl", "Error al cargar controles en ABM Generico. No se ha indicado un subnType para la propiedad numerica: "+ iProperty.Name);
                        }

                        if(m_isFooter) {
                            c.Width = 1100;
                            c.BackColor = w_frm.shTabFooter.cABMGridRow.getBackColor();
                            c.EnabledNoChngBkColor = true;
                        }
                        pSetFont(c, iProperty);
                        c.FormatNumber = iProperty.Format;

                        break;
                    case  csTypeABMProperty.cspDate:
                    case  csTypeABMProperty.cspTime:
                        if(m_loadDate) {
                            Load(w_frm.MEFE(w_frm.MEFE.UBound + 1));
                        }
                        else {
                            m_loadDate = true;
                        }

                        c = w_frm.MEFE(w_frm.MEFE.UBound);
                        if(iProperty.PropertyType === csTypeABMProperty.cspDate) {
                            c.csType = csMkDate;
                        //'csTypeABMProperty.cspTime
                        }
                        else {
                            c.csType = csMkTime;
                        }
                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspOption:
                        f = w_frm.FR(iProperty.OptionGroup);

                        // With f;
                            if(!f.Tag != "") {
                                f.Top = m_nextTop[nTabIndex];
                                f.Left = m_left[nTabIndex];
                                f.Visible = true;
                                f.Tag = iProperty.TabIndex;
                            }
                        // {end with: f}

                        Load(w_frm.OP(w_frm.OP.UBound + 1));
                        c = w_frm.OP(w_frm.OP.UBound);


                        break;
                    case  csTypeABMProperty.cspLabel:
                        if(m_loadLabel) {
                            Load(w_frm.LB2(w_frm.LB2.UBound + 1));
                        }
                        else {
                            m_loadLabel = true;
                        }

                        c = w_frm.LB2(w_frm.LB2.UBound);
                        pSetFont(c, iProperty);
                        if(iProperty.BackColor != -1) {
                            c.BackStyle = 1;
                        }
                        else {
                            c.BackStyle = 0;
                        }
                        c.Alignment = iProperty.textAlign;

                        break;
                    case  csTypeABMProperty.cspTitle:
                        if(m_loadTitle) {
                            Load(w_frm.lbTitle2(w_frm.lbTitle2.UBound + 1));
                        }
                        else {
                            m_loadTitle = true;
                        }

                        c = w_frm.lbTitle2(w_frm.lbTitle2.UBound);
                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspProgressBar:
                        if(m_loadProgressBar) {
                            Load(w_frm.prgBar(w_frm.prgBar.UBound + 1));
                        }
                        else {
                            m_loadProgressBar = true;
                        }

                        c = w_frm.prgBar(w_frm.prgBar.UBound);

                        break;
                    case  csTypeABMProperty.cspDescriptiontion:
                        if(m_loadDescriptiontion) {
                            Load(w_frm.LBDescription(w_frm.LBDescription.UBound + 1));
                        }
                        else {
                            m_loadDescriptiontion = true;
                        }

                        c = w_frm.LBDescription(w_frm.LBDescription.UBound);
                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspImage:
                        if(m_loadImage) {
                            Load(w_frm.Img(w_frm.Img.UBound + 1));
                        }
                        else {
                            m_loadImage = true;
                        }

                        c = w_frm.Img(w_frm.Img.UBound);

                        break;
                    case  csTypeABMProperty.cspText:

                        if(iProperty.SubType === CSConstantes.cspMemo) {
                            if(m_loadTextM) {
                                Load(w_frm.TXM(w_frm.TXM.UBound + 1));
                            }
                            else {
                                m_loadTextM = true;
                            }

                            c = w_frm.TXM(w_frm.TXM.UBound);

                        }
                        else {
                            if(m_loadText) {
                                Load(w_frm.TX(w_frm.TX.UBound + 1));
                                w_frm.TX(w_frm.TX.UBound).cABMProperty.setWidth(m_textOrigWidth);
                            }
                            else {
                                m_loadText = true;
                            }

                            c = w_frm.TX(w_frm.TX.UBound);
                            if(c(instanceOf cMaskEdit)) {
                                c.ButtonStyle = (iProperty.SubType === cspTextButton  || iProperty.SubType === cspTextButtonEx) ? cButtonSingle : cButtonNone);
                                c.Mask = iProperty.textMask;
                                c.csType = csMkText;
                            }
                            c.PasswordChar = "";
                        }

                        c.MaxLength = iProperty.Size;
                        c.Alignment = iProperty.textAlign;

                        // Para soportar cajas multinline
                        // que permiten desplazarce con las flechas
                        // entre renglones, pero no aceptan edicion
                        //
                        c.InputDisabled = oProperty.getInputDisabled();

                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspFile:
                        if(m_loadText) {
                            Load(w_frm.TX(w_frm.TX.UBound + 1));
                        }
                        else {
                            m_loadText = true;
                        }

                        c = w_frm.TX(w_frm.TX.UBound);
                        // With c;
                            c.MaxLength = iProperty.Size;
                            c.csType = CSMaskEdit2.csMkFile;
                            c.FileFilter = iProperty.HelpFilter;
                            c.PasswordChar = "";
                        // {end with: c}
                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspFolder:
                        if(m_loadText) {
                            Load(w_frm.TX(w_frm.TX.UBound + 1));
                        }
                        else {
                            m_loadText = true;
                        }

                        c = w_frm.TX(w_frm.TX.UBound);
                        // With c;
                            c.MaxLength = iProperty.Size;
                            c.csType = CSMaskEdit2.csMkFolder;
                            c.PasswordChar = "";
                        // {end with: c}
                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspPassword:
                        if(m_loadPassword) {
                            Load(w_frm.txPassword(w_frm.txPassword.UBound + 1));
                        }
                        else {
                            m_loadPassword = true;
                        }

                        c = w_frm.txPassword(w_frm.txPassword.UBound);
                        c.ButtonStyle = cButtonNone;
                        c.PasswordChar = "*";
                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspCheck:
                        if(m_loadCheck) {
                            Load(w_frm.CHK(w_frm.CHK.UBound + 1));
                        }
                        else {
                            m_loadCheck = true;
                        }

                        c = w_frm.CHK(w_frm.CHK.UBound);
                        c.text = "  ";
                        c.Width = 400;

                        break;
                    case  csTypeABMProperty.cspGrid:
                        if(m_loadGrid) {
                            Load(w_frm.getGrid(w_frm.GR.UBound + 1));
                        }
                        else {
                            m_loadGrid = true;
                        }

                        c = w_frm.getGrid(w_frm.GR.UBound);
                        c.Editable = iProperty.GridEdit;
                        getMngGrid().setPropertys(c);

                        oGrid = iProperty.Grid;
                        c.DontSelectInGotFocus = oGrid.getDontSelectInGotFocus();

                        // Formatos adicionales a la interfaz cIABMGrid
                        c.RowMode = oGrid.getRowSelect();

                        break;
                    case  csTypeABMProperty.cspButton:
                        if(m_loadButton) {
                            Load(w_frm.CMD(w_frm.CMD.UBound + 1));
                        }
                        else {
                            m_loadButton = true;
                        }

                        c = w_frm.CMD(w_frm.CMD.UBound);
                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspToolBar:
                        Frame frameToolBar = null;
                        c = pLoadToolBar(oProperty, frameToolBar);

                        // With frameToolBar;
                            frameToolBar.BorderStyle = 0;
                        // {end with: frameToolBar}

                        // With c;
                            c.Top = 0;
                            c.Left = 0;
                            c.Appearance = ccFlat;
                        // {end with: c}

                        oProperty.setToolbar(c);
                        break;
                }

                if(iProperty.PropertyType != csTypeABMProperty.cspToolBar) {
                    oProperty.setIndex(c.Index);
                }
            // {end with: w_frm}

            pSetTabIndex(c);
            m_tabIndex = m_tabIndex + 1;

            oProperty.setCtl(c);

            // Aplico formateos personalizados
            if(iProperty.Height > 0) {
                c.Height = iProperty.Height;
            }

            if(iProperty.Width > 0) {
                c.Width = iProperty.Width;
            }

            // Si se indica un top en funcion de una propiedad
            if(iProperty.TopFromProperty != "") {
                iProperties = m_properties;
                oProp = iProperties(iProperty.TopFromProperty);
                iProperty.Top = oProp.getTop();

                // Modificamos m_LastTop para poder indicar un top en funcion
                // de una propiedad. Es decir combinar TopFromProperty y TopToPrevious
                m_lastTop = oProp.getTop();
            }

            // Si se indico un top en funcion del control anterior
            if(iProperty.TopToPrevious != 0) {

                if(iProperty.PropertyType === cspOption) {
                    m_lastTop = m_lastTopOp;
                }

                // Si se indica -1 significa el mismo top que el control anterior
                if(iProperty.TopToPrevious === -1) {
                    iProperty.Top = m_lastTop;
                }
                else {
                    iProperty.Top = m_lastTop + iProperty.TopToPrevious;
                }
            }

            if(iProperty.Top != -1) {
                c.Top = iProperty.Top;
            }

            // Si se indica un left en funcion de una propiedad
            if(iProperty.LeftFromProperty != "") {
                iProperties = m_properties;
                oProp = iProperties(iProperty.LeftFromProperty);
                iProperty.Left = oProp.getLeft();

                // Modificamos m_LastLeft para poder indicar un left en funcion
                // de una propiedad. Es decir combinar LeftFromProperty y LeftToPrevious
                m_lastLeft = oProp.getLeft();

                // Si hay left personalizado, pero no se indico un left para el label
                // le ponemos el default
                if(iProperty.LeftLabel === 0) { iProperty.LeftLabel = -C_OFFSET_H; }
            }

            // Si se indico un left en funcion del control anterior
            if(iProperty.LeftToPrevious != 0) {

                if(iProperty.PropertyType === cspOption) {
                    m_lastLeft = m_lastLeftOp;
                }

                // Si se indica -1 significa el mismo left que el control anterior
                if(iProperty.LeftToPrevious === -1) {
                    iProperty.Left = m_lastLeft;
                }
                else {
                    iProperty.Left = m_lastLeft + iProperty.LeftToPrevious;
                }
            }

            if(iProperty.Left != -1) {
                // Si hay left personalizado, pero no se indico un left para el label
                // le ponemos el default
                if(iProperty.LeftLabel === 0) { iProperty.LeftLabel = -C_OFFSET_H; }

                c.Left = iProperty.Left;
            }

            //
            // Si el control va a quedar sobre la linea lo corro a la derecha y empiezo desde arriba otra vez
            //

            Object w_frm = getView();

                if(m_isItems) {

                    // * TODO:** can't found type for with block
                    // * With .getTabItems
                    __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = w_frm.getTabItems;
                        if(m_nextTop[nTabIndex] + c.Height > w___TYPE_NOT_FOUND.Top + w___TYPE_NOT_FOUND.Height - 50) {
                            setNewTopAndLeft(iProperty);
                        }
                    // {end with: w___TYPE_NOT_FOUND}

                }
                else if(m_isFooter) {

                    // * TODO:** can't found type for with block
                    // * With .shTabFooter
                    __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = w_frm.shTabFooter;
                        if(m_nextTop[nTabIndex] + c.Height > w___TYPE_NOT_FOUND.Top + w___TYPE_NOT_FOUND.Height) {
                            setNewTopAndLeft(iProperty);
                        }
                    // {end with: w___TYPE_NOT_FOUND}

                }
                else {
                    if(m_nextTop[nTabIndex] + c.Height + C_LINE_LIGHT + 50 > w_frm.Line1.Y1) {
                        setNewTopAndLeft(iProperty);
                    }
                }
            // {end with: w_frm}

            // With c;
                if(m_isDocument) {
                    if(m_isItems) {
                        c.Tag = c_Items+ iProperty.TabIndex;
                    }
                    else if(m_isFooter) {
                        c.Tag = c_Footer+ iProperty.TabIndex;
                    }
                    else {
                        c.Tag = c_Header+ iProperty.TabIndex;
                    }
                }
                else {
                    if(oProperty.getTabIndex()) {
                        c.Tag = oProperty.getTabIndex();
                    }
                    else {
                        c.Tag = iProperty.TabIndex;
                    }
                }

                c.Enabled = iProperty.Enabled;
                pSetBackColor(c, iProperty);
                pSetButton(c, oProperty);
            // {end with: c}

            // With iProperty;
                if(iProperty.PropertyType === cspOption) {
                    int r = 0;
                    int q = 0;
                    if(iProperty.OptionGroup - 1 > m_leftOp.length) {
                        r = m_leftOp.length;
                        G.redimPreserve(m_leftOp, iProperty.OptionGroup);
                        Object w_frm = getView();
                            for (q = r; q <= m_leftOp.length; q++) {
                                m_leftOp[q] = w_frm.OP(0).cABMProperty.getLeft();
                            }
                        // {end with: w_frm}
                    }
                    if(iProperty.OptionGroup - 1 > m_nextTopOp.length) {
                        r = m_nextTopOp.length;
                        G.redimPreserve(m_nextTopOp, iProperty.OptionGroup);
                        Object w_frm = getView();
                            for (q = r; q <= m_nextTopOp.length; q++) {
                                m_nextTopOp[q] = w_frm.OP(0).cABMProperty.getTop();
                            }
                        // {end with: w_frm}
                    }

                    if(iProperty.Left === -1) {
                        c.Left = m_leftOp[iProperty.OptionGroup];
                    }
                    if(iProperty.Top === -1) {
                        c.Top = m_nextTopOp[iProperty.OptionGroup];
                    }
                    if(iProperty.Width === 0) {
                        c.Width = 1500;
                    }
                    c.text = iProperty.Name;

                    // Agrando el Frame
                    if(c.Top + c.Height > f.Height) { f.Height = c.Top + c.Height + 50; }

                    if(f.Height + f.Top > getView().Line1.Y1) {
                        f.Top = m_nextTop[nTabIndex] - 100;
                        f.Left = m_left[nTabIndex];
                    }

                    if(c.Left + c.Width > f.Width) { f.Width = c.Left + c.Width + 20; }

                    if(iProperty.TopFrame != 0) { f.Top = iProperty.TopFrame; }
                    if(iProperty.LeftFrame != 0) { f.Left = iProperty.LeftFrame; }

                    m_nextTopOp[iProperty.OptionGroup] = m_nextTopOp[iProperty.OptionGroup] + C_LINE_HEIGHT;

                }
                else if(iProperty.PropertyType === cspToolBar) {

                    // With frameToolBar;
                        frameToolBar.Width = iProperty.Width;
                        frameToolBar.Top = iProperty.TopFrame;
                        frameToolBar.Left = iProperty.LeftFrame;
                        if(iProperty.Height > 0) {
                            frameToolBar.Height = iProperty.Height;
                        }
                        else {
                            frameToolBar.Height = c.Height;
                        }
                        frameToolBar.Tag = iProperty.TabIndex;
                        frameToolBar.BackColor = getView().ShTab.cABMGridRow.getBackColor();
                    // {end with: frameToolBar}

                    Toolbar tbl = null;

                    tbl = c;
                    // With tbl;
                        tbl.Appearance = cc3D;
                        tbl.BorderStyle = ccFixedSingle;
                    // {end with: tbl}

                    CSKernelClient2.fABM.setToolbar(tbl, iProperty.Buttons);

                    iProperty.LeftNotChange = true;
                    iProperty.TopNotChange = true;

                }
                else if(iProperty.PropertyType === cspLabel  || iProperty.PropertyType === cspTitle  || iProperty.PropertyType === cspDescriptiontion) {

                    if(iProperty.Top === -1) {
                        c.Top = m_nextTop[nTabIndex];
                    }

                    if(iProperty.Left === -1) {
                        c.Left = m_left[nTabIndex] + m_labelLeft;
                    }

                }
                else {

                    Label lB = null;

                    Object w_frm = getView();
                        Load(w_frm.LB(w_frm.LB.UBound + 1));
                        lB = w_frm.LB(w_frm.LB.UBound);
                    // {end with: w_frm}

                    // With lB;
                        oProperty.setLabelIndex(lB.Index);
                        lB.text = iProperty.Name;
                        lB.Left = m_left[nTabIndex];
                        lB.BackStyle = 0;
                        lB.Tag = c.Tag;
                        lB.ZOrder;
                        if(iProperty.PropertyType === cspButton) {
                            lB.Visible = false;
                        }
                    // {end with: lB}

                    // Etiquetas invisibles
                    // para Grillas, Botones e Imagenes
                    //
                    if(iProperty.LeftLabel === -1) {
                        // With lB;
                            lB.Visible = false;
                            //' Si una etiqueta tiene tag=-1
                            lB.Tag = "-1";
                            // no se modifica su propiedad
                            // visible en el ShowValue
                        // {end with: lB}
                    }

                    // Formateo especial para Grids
                    if(iProperty.PropertyType === cspGrid) {
                        if(iProperty.Left === -1) {
                            c.Left = m_left[nTabIndex];
                        }

                        if(m_isItems) {
                            c.Top = m_nextTop[nTabIndex];
                            // With lB;
                                lB.Visible = false;
                                //' Si una etiqueta tiene tag=-1
                                lB.Tag = "-1";
                                // no se modifica su propiedad
                                // visible en el ShowValue
                            // {end with: lB}
                        }
                        else {
                            if(iProperty.Top === 0) {
                                c.Top = m_nextTop[nTabIndex] + 300;
                                // With lB;
                                    lB.Top = m_nextTop[nTabIndex];
                                    lB.Width = c.Width;
                                // {end with: lB}
                            }
                        }
                        if(iProperty.Width === -1  || iProperty.Width === 0) {
                            c.Width = getView().ScaleWidth - c.Left - 300;
                        }

                    }
                    else if(m_isDocument && iProperty.Table === Cairo.Tables.DOCUMENTO) {

                        // With c;
                            c.Left = 3600;
                            c.Top = 80;
                            c.Width = 3500;
                            c.FontSize = 11;
                            c.FontBold = true;
                            c.Height = 330;
                            c.Tag = "";
                            c.BorderColor = vbButtonFace;
                        // {end with: c}

                        // With lB;
                            lB.Visible = false;
                            lB.Tag = -1;
                        // {end with: lB}

                    }
                    else if(m_isDocument && (oProperty.getKeyCol().equals(csNumberID) || oProperty.getKeyCol().equals(csStateID))) {

                        if(oProperty.getKeyCol().equals(csNumberID)) {
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
                        lB.Visible = false;
                        lB.Tag = -1;
                        c.Tag = "";

                    }
                    else {

                        if(iProperty.Top != -1) {

                            lB.Top = iProperty.Top;
                        }
                        else {
                            // OptionGroup la uso para indicar un offset cuando la
                            // oProperty no es de nType Option sirve para permitir un
                            // posicionamiento mas fino de los controles. Solo se usa en
                            // cuenta.
                            lB.Top = m_nextTop[nTabIndex] + iProperty.OptionGroup;

                            // OptionGroup la uso para indicar un offset cuando la
                            // oProperty no es de nType Option sirve para permitir un
                            // posicionamiento mas fino de los controles. Solo se usa en
                            // cuenta.
                            c.Top = m_nextTop[nTabIndex] + iProperty.OptionGroup;
                        }

                        switch (iProperty.PropertyType) {
                            case  csTypeABMProperty.cspDate:
                                c.Width = 1400;
                                break;
                            case  csTypeABMProperty.cspTime:
                                c.Width = 800;
                                break;
                        }

                        if(m_isFooter) {
                            if(iProperty.Left === -1) {
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
                            if(iProperty.Left != -1) {
                                lB.Left = c.Left + iProperty.LeftLabel;
                                lB.Width = Abs(iProperty.LeftLabel);
                            }
                            else {
                                c.Left = m_left[nTabIndex] + m_labelLeft;
                                if(iProperty.LeftLabel != 0) {
                                    lB.Left = c.Left + iProperty.LeftLabel;
                                    lB.Width = Abs(iProperty.LeftLabel);
                                }
                            }
                        }

                    }
                }

                // Me guardo el Top y el Left de esta propiedad
                // With oProperty;
                    oProperty.setTop(c.Top);
                    oProperty.setLeft(c.Left);
                    oProperty.setWidth(c.Width);
                    oProperty.setHeight(c.Height);
                // {end with: oProperty}

                // Si el control modifica el Left de los que vienen detras
                if(!iProperty.LeftNotChange) {

                    // Si fue un option button hay que fijarce en el contenedor
                    if(iProperty.PropertyType === cspOption) {
                        if(iProperty.LeftFrame != 0  && !iProperty.LeftNotChange) {
                            m_left[nTabIndex] = f.Left;
                        }
                    }
                    else {
                        // Si el control indico un left fijo, los demas se alinean con el
                        if(iProperty.Left != -1  && iProperty.LeftToPrevious === 0) {
                            m_left[nTabIndex] = iProperty.Left + iProperty.LeftLabel;
                            m_labelLeft = Abs(iProperty.LeftLabel);
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
                if(!iProperty.TopNotChange) {
                    // Si el control tiene un top personalizado entonces
                    // parto de dicho top para el calculo. Siempre y cuando no sea un OptionButton
                    if(iProperty.Top != -1  && iProperty.PropertyType != cspOption  && !iProperty.TopNotChange) {

                        m_lastTop = iProperty.Top;

                        // Si el control inidica un alto personalizado
                        if(iProperty.Height > 0) {
                            m_nextTop[nTabIndex] = iProperty.Top + c.Height + C_LINE_LIGHT;
                        }
                        else {
                            m_nextTop[nTabIndex] = iProperty.Top + C_LINE_HEIGHT;
                        }
                    }
                    else {
                        // Si el control inidica un alto personalizado. Siempre y cuando no sea un OptionButton
                        if(iProperty.Height > 0 && iProperty.PropertyType != cspOption) {
                            m_nextTop[nTabIndex] = m_nextTop[nTabIndex] + c.Height + C_LINE_LIGHT;

                            // Si se uso el alto standar (C_LINE_Height)
                        }
                        else {
                            //
                            // Siempre incremento el NextTop general incluso si es una oProperty de nType option o Grid
                            // ya que por cada option que exista se agrega un renglo de C_LINE_Height y eso es correcto.
                            // En el caso de las Grids no trabaja bien, pero como por ahora solo hay una Grid por tab,
                            // no trae ningun problema.
                            //
                            // Aunque hay una excepcion: Cuando se trata de documentos el help de documento va en la barra de titulo
                            if(!(m_isDocument && (iProperty.Table === Cairo.Tables.DOCUMENTO  || oProperty.getKeyCol().equals(csNumberID) || oProperty.getKeyCol().equals(csStateID)))) {
                                m_nextTop[nTabIndex] = m_nextTop[nTabIndex] + C_LINE_HEIGHT;
                            }
                        }
                    }
                }

                // Finalmente valido el ancho del form
                if(iProperty.PropertyType === cspOption) {
                    setNewWidthForm(iProperty, f.Width + f.Left);
                }
                else {
                    setNewWidthForm(iProperty, 0);
                }
            // {end with: iProperty}

            return true;
        }

        private void setNewTopAndLeft(cIABMProperty iProperty) { // TODO: Use of ByRef founded Private Sub SetNewTopAndLeft(ByRef iProperty As cIABMProperty)
            int nTabIndex = 0;

            nTabIndex = pGetTabIndex(iProperty);

            Object w_frm = getView();
                if(m_isItems) {
                    m_nextTop[nTabIndex] = w_frm.getTabItems().getTop() + 100;
                    m_left[nTabIndex] = m_left[nTabIndex] + C_OFFSET_H2;

                }
                else if(m_isFooter) {
                    m_nextTop[nTabIndex] = w_frm.shTabFooter.cABMProperty.getTop() + C_OFFSET_V1;
                    m_left[nTabIndex] = m_left[nTabIndex] + C_OFFSET_H3;

                }
                else {
                    m_nextTop[nTabIndex] = m_constTop;
                    m_left[nTabIndex] = m_left[nTabIndex] + C_OFFSET_H2;
                }
            // {end with: w_frm}

        }

        private void pSetTabIndex(Object c) { // TODO: Use of ByRef founded Private Sub pSetTabIndex(ByRef c As Object)

                c.TabIndex = m_tabIndex;
            }
        }

        private void setNewWidthForm(cABMProperty oProp, int frameSize) { // TODO: Use of ByRef founded Private Sub SetNewWidthForm(ByRef oProp As cABMProperty, ByVal FrameSize As Integer)



                int offsetH = 0;
                cIABMProperty iProp = null;

                iProp = oProp;

                Object w_frm = getView();
                    if(w_frm.ShTab.cABMProperty.getLeft() === 0) {
                        offsetH = 120;
                    }
                    else {
                        offsetH = 400;
                    }

                    if(frameSize > 0) {
                        if(w_frm.Width < frameSize + offsetH) {
                            w_frm.Width = frameSize + offsetH;
                            w_frm.ShTab.cABMProperty.setWidth(w_frm.ScaleWidth - w_frm.ShTab.cABMProperty.getLeft() * 2);
                        }
                    }
                    else {
                        if(w_frm.Width < oProp.getWidth() + oProp.getLeft() + offsetH) {
                            w_frm.Width = oProp.getWidth() + oProp.getLeft() + offsetH;
                        }
                        w_frm.ShTab.cABMProperty.setWidth(w_frm.ScaleWidth - w_frm.ShTab.cABMProperty.getLeft() * 2);
                    }
                // {end with: w_frm}
            }
        }

        private cABMProperty getProperty(csTypeABMProperty nType, int index, csSubTypeABMProperty subType) {
            cIABMProperty iProperty = null;
            cABMProperty oProperty = null;
            cIABMProperties iProperties = null;
            boolean found = false;

            if(m_properties === null) { return; }

            iProperties = m_properties;

            // Para Toolbars no hay indice
            if(nType === cspToolBar) {
                Toolbar tbl = null;

                tbl = getView().GetToolBar;
                for (int _i = 0; _i < iProperties.size(); _i++) {
                    iProperty = iProperties.getItem(_i);
                    oProperty = iProperty;
                    if(iProperty.PropertyType === nType) {
                        if(oProperty.setToolbar(Is tbl)) {
                            return oProperty;
                            break;
                        }
                    }
                }

            }
            else {
                for (int _i = 0; _i < iProperties.size(); _i++) {
                    iProperty = iProperties.getItem(_i);

                    // With iProperty;

                        found = false;

                        // Tratamiento especial para textos que
                        // tambien pueden ser carpetas o archivos
                        if(nType === cspText) {

                            if(iProperty.PropertyType === cspText  && subType === cspMemo) {
                                if(iProperty.SubType === subType) {
                                    found = true;
                                }
                            }
                            else {

                                // Los textbox y los cspFile y cspFolder estan dentro
                                // del mismo arreglo de controles ( TX )
                                //
                                if((iProperty.PropertyType === cspText  || iProperty.PropertyType === cspFile  || iProperty.PropertyType === cspFolder) && iProperty.SubType != cspMemo  && iProperty.SubType === subType) {

                                    found = true;

                                    // Finalmente puede tratarse de una caja de texto
                                    // con boton asi que SubType es cspTextButton o cspTextButtonEx
                                    // pero cuando me llaman desde TextButtonClick me pasan 0 en
                                    // SubType ya que puede ser un cspFile, cspFolder o cspText
                                    // asi que este ultimo if captura los textbox que tienen boton
                                    // normalmente Descriptionciones en controles de una linea
                                    // o cajas de texto con boton que se resuelve por la clase
                                    // cliente que maneja las reglas de negocio de esta edicion.
                                    //
                                }
                                else if((iProperty.PropertyType === cspText  && (iProperty.SubType === cspTextButton  || iProperty.SubType === cspTextButtonEx))) {

                                    found = true;

                                }
                            }
                        }
                        else {
                            if(iProperty.PropertyType === nType) {
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
                            oProperty = iProperty;

                            if(oProperty.getIndex() === index) {
                                return oProperty;
                                break;
                            }
                        }
                    // {end with: iProperty}
                }
            }
        }

        var changeProperty(csTypeABMProperty nType, int index, Object c, boolean bNoRefresh, csSubTypeABMProperty subType) { // TODO: Use of ByRef founded Private Function ChangeProperty(ByVal nType As csTypeABMProperty, ByVal Index As Integer, ByRef c As Object, Optional ByVal bNoRefresh As Boolean, Optional ByVal SubType As csSubTypeABMProperty = 0) As Boolean
            boolean _rtn = false;
            try {

                cIABMProperty iProperty = null;
                cIABMProperty iProperty2 = null;
                cABMProperty oProperty = null;
                cIABMProperties iProperties = null;

                Static(Refreshing As Boolean);

                if(Refreshing || m_showingForm) {
                    Refreshing = false;
                    _rtn = true;
                    return _rtn;
                }

                oProperty = getProperty(nType, index, subType);

                iProperties = m_properties;

                if(oProperty != null) {

                    iProperty = oProperty;

                    // With iProperty;
                        switch (nType) {
                                //Case csTypeABMProperty.cspAdHock, csTypeABMProperty.cspList
                            case  csTypeABMProperty.cspList:
                                iProperty.ListListIndex = c.ListIndex;
                                iProperty.ListText = c.text;
                                if(c.ListIndex >= 0) {
                                    iProperty.ListItemData = c.ItemData(c.ListIndex);
                                }
                                else {
                                    iProperty.ListItemData = 0;
                                }
                                break;
                            case  csTypeABMProperty.cspText:
                            case  csTypeABMProperty.cspPassword:
                            case  csTypeABMProperty.cspFile:
                            case  csTypeABMProperty.cspFolder:
                                iProperty.Value = c.text;
                                break;
                            case  csTypeABMProperty.cspNumeric:
                                iProperty.Value = c.csValue;
                                break;
                            case  csTypeABMProperty.cspDate:
                            case  csTypeABMProperty.cspTime:
                                iProperty.Value = c.csValue;
                                break;
                            case  csTypeABMProperty.cspOption:

                                if(c.Value) {
                                    // Aca hay que cambiar al resto de las Properties de este Group de
                                    // option buttons
                                    for (int _i = 0; _i < iProperties.size(); _i++) {
                                        iProperty2 = iProperties.getItem(_i);
                                        if(!iProperty2(Is iProperty)) {
                                            if(iProperty2.PropertyType === cspOption  && iProperty2.OptionGroup === iProperty.OptionGroup) {
                                                iProperty2.Value = 0;
                                            }
                                        }
                                    }
                                }

                                iProperty.Value = c.Value;
                                break;
                            case  csTypeABMProperty.cspHelp:
                                iProperty.Value = c.ValueUser;
                                iProperty.HelpId = mUtil.val(c.Id);
                                iProperty.HelpValueProcess = c.Id;
                                break;
                            case  csTypeABMProperty.cspCheck:
                                iProperty.Value = c.Value;
                                break;
                            case  csTypeABMProperty.cspToolBar:
                                iProperty.Value = c.Key;
                                break;
                        }

                        if(m_client.PropertyChange(iProperty.Key) && !bNoRefresh) {
                            Refreshing = true;
                            for (int _i = 0; _i < iProperties.size(); _i++) {
                                iProperty = iProperties.getItem(_i);
                                showValue(iProperty, m_noChangeColsInRefresh);
                            }
                        }
                    // {end with: iProperty}
                }

                if(!pIsButton(iProperty) && pIsEditProperty(iProperty)) {

                    if(m_isDocument) {
                        if(iProperty != null) {
                            if(iProperty.Table != Cairo.Tables.DOCUMENTO) {
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
                if(m_masterView != null) {
                    if(m_sendSave) {
                        m_masterView.ctrlKeySave();
                    }
                    else if(m_sendClose) {
                        m_masterView.ctrlKeyClose();
                    }
                }

                return _rtn;
            } catch (Exception ex) {
                MngError(VBA.ex, "ChangeProperty", C_MODULE, "");
            }
            return _rtn;
        }

        var pIsButton(cIABMProperty iProp) { // TODO: Use of ByRef founded Private Function pIsButton(ByRef iProp As cIABMProperty) As Boolean
            if(iProp === null) { return false; }
            return iProp.PropertyType === cspButton;
        }

        var pIsEditProperty(cABMProperty iProp) { // TODO: Use of ByRef founded Private Function pIsEditProperty(ByRef iProp As cABMProperty) As Boolean
            if(iProp === null) { return false; }
            return iProp.getIsEditProperty();
        }

        self.validateEx() {
            if(!pFillGrids()) { return false; }
            if(!pValidate()) { return false; }
            return true;
        }

        self.validateProp(cIABMProperty iProp, String strKey) { // TODO: Use of ByRef founded Public Sub ValidateProp(ByRef iProp As cIABMProperty, ByVal strKey As String)
            cABMProperty oProp = null;
            cIABMProperties iProps = null;

            if(iProp === null) {
                iProps = m_properties;
                oProp = iProps.Item(strKey);
            }
            else {
                oProp = iProp;
            }

            if(!TypeOf(oProp.getCtl() Is cshelp2.cHelp)) { return; }

            cshelp2.cHelp hL = null;
            hL = oProp.getCtl();
            hL.Validate;
        }

        var pValidateItemsAndFooter() {
            boolean _rtn = false;
            cABMGeneric genDocEx = null;

            if(m_isDocument) {

                genDocEx = m_client.MessageEx(ABM_MSG.MSG_DOC_EX_GET_ITEMS, null);
                if(!genDocEx.validateEx()) { return _rtn; }

                genDocEx = m_client.MessageEx(ABM_MSG.MSG_DOC_EX_GET_FOOTERS, null);
                _rtn = genDocEx.validateEx();

            }
            else {
                _rtn = true;
            }
            return _rtn;
        }

        // Solo guarda si hubo cambios y el usuario los quiere guardar
        //
        self.saveChanges() {
            return pSaveChanges(false, false);
        }

        self.save() {
            boolean _rtn = false;
            _rtn = pSave(false, false);
            if(m_showOkCancel) {
                m_okCancelResult = true;
                if(getView(instanceOf fABM)) {
                    masterHandlerCloseClick();
                }
                else if(getView(instanceOf fABMDoc)) {
                    pFormDocClose();
                }
                else if(getView(instanceOf fWizard)) {
                    wizHandlerCancelClick();
                }
            }
            return _rtn;
        }

        var pSave(boolean bUnloading, boolean bSaveAs) {
            boolean _rtn = false;
            try {

                if(m_isItems) { return _rtn; }
                if(m_isFooter) { return _rtn; }

                m_inSave = true;

                cMouseWait mouse = null;
                mouse = new cMouseWait();

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

                //Set row = iProperties.Item("Items").grid.Rows.Item(1)
                //
                // Comentar despues de depurar

                // Para informarle al documento que comienza
                // la serie de llamadas de validacion
                // Esto es necesario en OrdenDeServicio para no
                // preguntar tres veces por cada Validate, si
                // se el usuario acepta el reingreso o no
                //
                if(m_isDocument) {
                    m_client.MessageEx(ABM_MSG.MSG_DOC_EX_PRE_VALIDATE, null);
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
                    if(!m_client.MessageEx(ABM_MSG.MSG_SAVE_AS, null)) {
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

                        pDiscardChanges(false);
                    }
                    else {
                        m_client.MessageEx(ABM_MSG.MSG_DOC_REFRESH, null);
                        if(!m_isDocument) {
                            refreshTitle();
                        }
                        getView().SetFocusFirstControl;
                    }
                }

                setChanged(false);
                _rtn = true;

                / * *TODO:** goto found: GoTo ExitProc* /
            } catch (Exception ex) {
                MngError(VBA.ex, "pSave", C_MODULE, "");

                / * *TODO:** label found: ExitProc:* /
                m_inSave = false;
            }
            return _rtn;
        }

        private void pFillList() {
            cIABMProperty iProperty = null;
            cABMProperty oProperty = null;
            cIABMProperties iProperties = null;
            int index = 0;

            iProperties = m_properties;

            for (Index = 1; Index <= getView().CB.UBound; Index++) {
                for (int _j = 0; _j < iProperties.size(); _j++) {
                    iProperty = iProperties.getItem(_j);
                    if(iProperty.PropertyType === cspList) {
                        oProperty = iProperty;
                        if(oProperty.getIndex() === index) {

                            Object w_frm = getView();
                                iProperty.ListItemData = ListID(w_frm.CB(index));
                                iProperty.ListListIndex = w_frm.CB(index).ListIndex;
                                iProperty.ListText = w_frm.CB(index).text;
                            // {end with: w_frm}
                        }
                    }
                }
            }

            //  For Index = 1 To Frm.CBhock.UBound
            //    For Each iProperty In iProperties
            //      If iProperty.PropertyType = cspList Then
            //        Set oProperty = iProperty
            //        If oProperty.Index = Index Then
            //
            //          With Frm
            //            iProperty.ListItemData = ListID(.CBhock(Index))
            //            iProperty.ListListIndex = .CBhock(Index).ListIndex
            //            iProperty.ListText = .CBhock(Index).text
            //          End With
            //        End If
            //      End If
            //    Next
            //  Next
        }

        var pFillGrids() {
            cIABMProperty iProperty = null;
            cABMProperty oProperty = null;
            cIABMProperties iProperties = null;
            int index = 0;

            iProperties = m_properties;

            Object w_frm = getView();

                for (Index = 0; Index <= w_frm.GR.UBound; Index++) {
                    for (int _j = 0; _j < iProperties.size(); _j++) {
                        iProperty = iProperties.getItem(_j);
                        if(iProperty.PropertyType === cspGrid) {
                            oProperty = iProperty;
                            if(oProperty.getIndex() === index) {

                                if(!pFillRows(iProperty.Grid, w_frm.getGrid(index))) { return false; }

                            }
                        }
                    }
                }
            // {end with: w_frm}

            return true;
        }

        var pFillRows(cIABMGrid grid, cGridAdvanced grCtrl) { // TODO: Use of ByRef founded Private Function pFillRows(ByRef Grid As cIABMGrid, ByRef grCtrl As cGridAdvanced) As Boolean
            cIABMGridColumn col = null;
            int colIndex = 0;
            int rowIndex = 0;
            cIABMGridCellValue cell = null;
            cIABMGridRow row = null;
            boolean bIsEmpty = false;

            boolean bHaveKey = false;
            String[] vKeys() = null;
            cABMGridRows oRows = null;
            cABMGridRowValue oCell = null;

            oRows = grid.Rows;

            if(oRows.getHaveKey()) {

                bHaveKey = true;
                G.redim(vKeys, grid.Rows.cABMDocPropertiesCols.count(), grid.Columns.cABMDocPropertiesCols.count());

                cABMGridRow oRow = null;

                for (RowIndex = 1; RowIndex <= grid.Rows.cABMDocPropertiesCols.count(); RowIndex++) {
                    oRow = grid.Rows(rowIndex);
                    vKeys[rowIndex, 1].equals(oRow.getKey());

                    for (ColIndex = 2; ColIndex <= grid.Columns.cABMDocPropertiesCols.count(); ColIndex++) {
                        row = oRow;
                        if(colIndex <= row.Count) {
                            oCell = row.Item(colIndex);
                            vKeys[rowIndex, colIndex].equals(oCell.getStrKey());
                        }
                    }
                }
            }

            grid.Rows.cABMDocPropertiesCols.clear();

            // Clear borra m_HaveKey
            //
            if(bHaveKey) {
                oRows.setHaveKey(bHaveKey);
            }

            // With grCtrl;
                for (RowIndex = 1; RowIndex <= grCtrl.Rows; RowIndex++) {

                    // The last row can be empty because it is for new items
                    // so if no columns with values exists don't add to grid.rows
                    if(rowIndex === grCtrl.Rows) {

                        // Only for grid that allow add new rows
                        cIABMProperty iProperty = null;
                        iProperty = getProperty(cspGrid, grCtrl.Index, 0);
                        if(iProperty.GridAdd) {
                            if(!pGridValidateRow(grCtrl.Index, rowIndex, false, false, bIsEmpty)) {
                                return null;
                            }
                        }
                    }

                    if(!bIsEmpty) {

                        if(bHaveKey) {
                            if(rowIndex <= (vKeys, 1).length) {
                                if(vKeys[rowIndex, 1] != "") {
                                    row = grid.Rows.cABMGridRows.add(null, vKeys[rowIndex, 1]);
                                }
                                else {
                                    row = grid.Rows.cABMGridRows.add(null);
                                }
                            }
                            else {
                                row = grid.Rows.cABMGridRows.add(null);
                            }
                        }
                        else {
                            row = grid.Rows.cABMGridRows.add(null);
                        }

                        for (ColIndex = 2; ColIndex <= grid.Columns.cABMDocPropertiesCols.count(); ColIndex++) {

                            col = grid.Columns(colIndex);

                            // * TODO:** can't found type for with block
                            // * With .cell(rowIndex, colIndex)
                            __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = grCtrl.Cell(rowIndex, colIndex);

                                if(bHaveKey) {
                                    if(rowIndex <= (vKeys, 1).length && colIndex <= (vKeys, 1vKeys, 2).length) {
                                        if(vKeys[rowIndex, colIndex] != "") {
                                            if(vKeys[rowIndex, colIndex] === c_keyRowItem) {
                                                if(row.Item(c_keyRowItem) === null) {
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
                                oCell.setHelpValueProcess(w___TYPE_NOT_FOUND.Tag);

                                if(col.PropertyType === cspCheck) {
                                    cell.Id = w___TYPE_NOT_FOUND.ItemData;

                                }
                                else if(col.PropertyType === cspDate) {
                                    cell.Value = mUtil.getDateValueForGridClient(w___TYPE_NOT_FOUND.text);

                                }
                                else if(col.SubType === cspPercent) {
                                    cell.Value = mUtil.val(w___TYPE_NOT_FOUND.text) * 100;

                                }
                                else {
                                    cell.Value = w___TYPE_NOT_FOUND.text;
                                }
                            // {end with: w___TYPE_NOT_FOUND}

                            cell.Key = col.Key;
                        }
                    }
                }
            // {end with: grCtrl}

            return true;
        }

        private void saveColumnsGrids() {
            int i = 0;
            cIABMProperty iProperty = null;

            Object w_frm = getView();

                for (i = 0; i <= w_frm.GR.UBound; i++) {

                    iProperty = getProperty(cspGrid, i, 0);

                    if(iProperty != null) {
                        getMngGrid().saveColumnWidth(w_frm.getGrid(i), pGetNameGrid(iProperty));
                        getMngGrid().saveColumnOrder(w_frm.getGrid(i), pGetNameGrid(iProperty));
                    }
                }
            // {end with: w_frm}
        }

        private void pDiscardChanges(boolean dontCallClient) {
            try {

                cLockUpdateWindow oLock = null;

                cMouseWait mouse = null;
                mouse = new cMouseWait();

                cABMProperty oProperty = null;
                cIABMProperties iProperties = null;

                iProperties = m_properties;

                for (int _i = 0; _i < iProperties.size(); _i++) {
                    oProperty = iProperties.getItem(_i);
                    oProperty.setCtl(null);
                }

                Object w_frm = getView();

                    oLock = new cLockUpdateWindow();
                    oLock.lockW(w_frm.hWnd);

                    int q = 0;

                    saveColumnsGrids();

                    initVectorsPosition();

                // * TODO:** the error label ControlError: couldn't be found

                    int i = 0;

                    w_frm.ME(0).cABMGridRow.setVisible(false);
                    for (i = 1; i <= w_frm.ME.UBound; i++) {
                        Unload(w_frm.ME(i));
                    }

                    w_frm.MEFE(0).cABMGridRow.setVisible(false);
                    for (i = 1; i <= w_frm.MEFE.UBound; i++) {
                        Unload(w_frm.MEFE(i));
                    }

                    w_frm.HL(0).cABMGridRow.setVisible(false);
                    for (i = 1; i <= w_frm.HL.UBound; i++) {
                        Unload(w_frm.HL(i));
                    }

                    for (i = 1; i <= w_frm.OP.UBound; i++) {
                        Unload(w_frm.OP(i));
                    }

                    for (i = 1; i <= w_frm.FR.UBound; i++) {
                        Unload(w_frm.FR(i));
                    }

                    w_frm.CHK(0).cABMGridRow.setVisible(false);
                    for (i = 1; i <= w_frm.CHK.UBound; i++) {
                        Unload(w_frm.CHK(i));
                    }

                    w_frm.CMD(0).cABMGridRow.setVisible(false);
                    for (i = 1; i <= w_frm.CMD.UBound; i++) {
                        Unload(w_frm.CMD(i));
                    }

                    w_frm.CB(0).cABMGridRow.setVisible(false);
                    for (i = 1; i <= w_frm.CB.UBound; i++) {
                        Unload(w_frm.CB(i));
                    }

                    //    .CBhock(0).Visible = False
                    //    For i = 1 To .CBhock.UBound
                    //      Unload .CBhock(i)
                    //    Next

                    w_frm.TX(0).cABMGridRow.setVisible(false);
                    for (i = 1; i <= w_frm.TX.UBound; i++) {
                        Unload(w_frm.TX(i));
                    }

                    w_frm.TXM(0).cABMGridRow.setVisible(false);
                    for (i = 1; i <= w_frm.TXM.UBound; i++) {
                        Unload(w_frm.TXM(i));
                    }

                    w_frm.txPassword(0).cABMGridRow.setVisible(false);
                    for (i = 1; i <= w_frm.txPassword.UBound; i++) {
                        Unload(w_frm.txPassword(i));
                    }

                    w_frm.LB(0).cABMGridRow.setVisible(false);
                    for (i = 1; i <= w_frm.LB.UBound; i++) {
                        Unload(w_frm.LB(i));
                    }

                    mUtil.destroyGrids(getView());

                    if(getView(instanceOf fWizard || getView() instanceOf fABM)) {
                        for (i = 1; i <= w_frm.LB2.UBound; i++) {
                            Unload(w_frm.LB2(i));
                        }
                    }

                    if(getView(instanceOf fWizard)) {
                        for (i = 1; i <= w_frm.prgBar.UBound; i++) {
                            Unload(w_frm.prgBar(i));
                        }
                        for (i = 1; i <= w_frm.LBDescription.UBound; i++) {
                            Unload(w_frm.LBDescription(i));
                        }
                    }

                    if(getView(instanceOf fWizard || getView() instanceOf fABM)) {

                        for (i = 1; i <= w_frm.lbTitle2.UBound; i++) {
                            Unload(w_frm.lbTitle2(i));
                        }

                        for (i = 1; i <= w_frm.Img.UBound; i++) {
                            Unload(w_frm.Img(i));
                        }
                    }

                    w_frm.UnLoadToolbar;

                    initLoadMembers();

                // {end with: w_frm}

                / * *TODO:** label found: seguir:* /
            }
            try {

                if(!dontCallClient) { m_client.DiscardChanges; }

                return;
            } catch (Exception ex) {
                MngError(VBA.ex, "DiscardChanges", C_MODULE, "");
            }
        }

        var pValidate() {
            boolean _rtn = false;
            if(!m_client.Validate()) { return _rtn; }

            if(m_clientManageGrid) {

                cABMProperty oProp = null;
                int rowIndex = 0;
                cIABMProperty iProp = null;
                cIABMProperties iProperties = null;
                boolean oldRedraw = false;

                iProperties = m_properties;

                for (int _i = 0; _i < iProperties.size(); _i++) {
                    iProp = iProperties.getItem(_i);
                    oProp = iProp;

                    if(iProp.PropertyType === cspGrid) {

                        //' oProp.ctl.Redraw cuando recompile cGridAdvanced voy
                        oldRedraw = true;
                        // a agregar el get a Redraw
                        oProp.getCtl().Redraw = false;

                        for (RowIndex = 1; RowIndex <= iProp.Grid.cABMCSGrid.getRows().Count; RowIndex++) {
                            if(!pGridValidateRow(oProp.getIndex(), rowIndex, false, true, false)) {
                                oProp.getCtl().Redraw = oldRedraw;
                                return _rtn;
                            }
                        }

                        oProp.getCtl().Redraw = oldRedraw;
                    }
                }
            }

            _rtn = true;
            / * *TODO:** label found: ExitProc:* /
            return _rtn;
        }

        self.setTabCtlIndex() {

            cIABMTabs iTabs = null;
            cIABMTabItem iTab = null;
            cABMTabItem oTab = null;
            int index = 0;

            iTabs = m_tabs;
            for (int _i = 0; _i < iTabs.size(); _i++) {
                iTab = iTabs.getItem(_i);
                oTab = iTab;
                oTab.setCtlIndex(index);
                index = index + 1;
            }

            cIABMProperties iProperties = null;
            iProperties = m_properties;

            cIABMProperty iProp = null;
            cABMProperty oProp = null;

            for (int _i = 0; _i < iProperties.size(); _i++) {
                iProp = iProperties.getItem(_i);

                if(iProp.TabIndex < 0) {

                    iTab = pGetTabFather(iProp.TabIndex);

                    oProp = iProp;
                    // With oProp;
                        oProp.setTabIndex(iProp.TabIndex);
                        iProp.TabIndex = iTab.Index;
                    // {end with: oProp}

                }
            }

        }

        private cIABMTabItem pGetTabFather(int index) {
            cIABMTabs iTabs = null;
            cIABMTabItem iTab = null;
            cABMTabItem oTab = null;

            iTabs = m_tabs;
            for (int _i = 0; _i < iTabs.size(); _i++) {
                iTab = iTabs.getItem(_i);
                if(iTab.Index === index) {
                    oTab = iTab;
                    if(!(oTab.getFatherTab().equals(""))) {
                        return iTabs(oTab.getFatherTab());
                    }
                }
            }

        }

        private void showTabs(int tabs) {
            int i = 0;
            float left = 0;
            float top = 0;
            int topItems = 0;
            cIABMTabItem iTab = null;
            cIABMTabItem iTab2 = null;
            boolean bDontResize = false;
            int tabTopHeight = 0;

            left = 90;

            if(m_tabTopHeight === 0) {
                tabTopHeight = 540;
            }
            else {
                tabTopHeight = m_tabTopHeight;
                getView().ShTab.top = m_tabTopHeight + getView().cbTab.cABMGridRow.item(0).Height - 10;
                m_constTop = getView().ShTab.top + 200;
            }

            Object w_frm = getView();

                if(m_isItems) {
                    top = w_frm.getTabItems().top - w_frm.cbTab(0).cABMProperty.getHeight();
                    topItems = 10;
                }
                else if(m_isFooter) {
                    top = w_frm.shTabFooter.top - w_frm.cbTab(0).cABMProperty.getHeight();
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

                for (i = 1; i <= w_frm.cbTab.UBound; i++) {
                    if(m_isItems) {
                        if(w_frm.cbTab(i).Tag === c_Footer  || w_frm.cbTab(i).Tag === c_Items) {
                            Unload(w_frm.cbTab(i));
                        }
                    }
                    else if(m_isFooter) {
                        if(w_frm.cbTab(i).Tag === c_Footer) {
                            Unload(w_frm.cbTab(i));
                        }
                    }
                    else {
                        Unload(w_frm.cbTab(i));
                    }
                }

                cIABMTabs iTabs = null;
                cABMTabItem oTab = null;
                int k = 0;

                if(m_tabs != null) {

                    iTabs = m_tabs;
                    tabs = (iTabs.Count - 1 > tabs) ? iTabs.Count - 1 : tabs);
                }

                if(tabs === 0) { return; }

                // * TODO:** can't found type for with block
                // * With .cbTab
                __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = w_frm.cbTab;
                    if(w___TYPE_NOT_FOUND.Count === 1) {
                        m_firstTab = 0;
                    }
                    else {
                        m_firstTab = w___TYPE_NOT_FOUND.Count;
                    }
                // {end with: w___TYPE_NOT_FOUND}

                for (i = m_firstTab; i <= tabs + m_firstTab; i++) {
                    if(i > 0) { Load(w_frm.cbTab(i)); }

                    // * TODO:** can't found type for with block
                    // * With .cbTab(i)
                    __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = w_frm.cbTab(i);
                        if(m_isDocument) {
                            if(m_isItems) {
                                w___TYPE_NOT_FOUND.Tag = c_Items;
                                w___TYPE_NOT_FOUND.TabGroup = 1;
                            }
                            else if(m_isFooter) {
                                w___TYPE_NOT_FOUND.Tag = c_Footer;
                                w___TYPE_NOT_FOUND.TabGroup = 2;
                            }
                            else {
                                w___TYPE_NOT_FOUND.Tag = c_Header;
                                w___TYPE_NOT_FOUND.TabGroup = 3;
                            }
                        }

                        k = k + 1;

                        oTab = iTabs(k);
                        if(!(oTab.getFatherTab().equals(""))) {
                            iTab = iTabs(oTab.getFatherTab());
                            iTab2 = oTab;
                            w___TYPE_NOT_FOUND.Tag = w___TYPE_NOT_FOUND.Tag+ c_InerTab+ String.valueOf((iTab.Index * 100) + Abs(iTab2.Index));

                            if(oTab.getLeft() != 0) {
                                bDontResize = true;
                                left = oTab.getLeft();
                            }
                            if(oTab.getTop() != 0) {
                                bDontResize = true;
                                top = oTab.getTop();
                            }
                        }

                        w___TYPE_NOT_FOUND.text = "Tab"+ ((Integer) i).toString();
                        w___TYPE_NOT_FOUND.TabStop = false;
                        w___TYPE_NOT_FOUND.Visible = !m_hideTabButtons;
                        if(left + w___TYPE_NOT_FOUND.Width > getView().Width) {
                            left = 90;
                            top = top + w___TYPE_NOT_FOUND.Height - 20;
                        }
                        w___TYPE_NOT_FOUND.Top = top + topItems;
                        w___TYPE_NOT_FOUND.Left = left;
                        w___TYPE_NOT_FOUND.ZOrder;
                        w___TYPE_NOT_FOUND.BackColorPressed = vb3DHighlight;
                        left = left + w___TYPE_NOT_FOUND.Width - 20;
                    // {end with: w___TYPE_NOT_FOUND}
                }

                int q = 0;

                G.redim(m_left, tabs);
                G.redim(m_nextTop, tabs);

                for (q = 0; q <= m_nextTop.length; q++) {
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
                    top = w_frm.getTabItems().top - w_frm.cbTab(0).cABMProperty.getHeight();
                    topItems = 10;
                }
                else if(m_isFooter) {
                    top = w_frm.shTabFooter.top - w_frm.cbTab(0).cABMProperty.getHeight();
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

                for (int _i = 0; _i < iTabs.size(); _i++) {
                    iTab = iTabs.getItem(_i);
                    if(iTab.Index < 0) {
                        oTab = iTab;
                        cbTab = w_frm.cbTab(oTab.getCtlIndex() + m_firstTab);
                        cbTab.text = "&"+ Abs(iTab.Index)+ "-"+ iTab.Name;
                    }
                    else {
                        cbTab = w_frm.cbTab(iTab.Index + m_firstTab);
                        cbTab.text = "&"+ iTab.Index + m_firstTab + 1+ "-"+ iTab.Name;
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

                w_frm.ShTab.ZOrder(1);
            // {end with: w_frm}
        }

        private void pSetButton(Control control, cABMProperty oProperty) { // TODO: Use of ByRef founded Private Sub pSetButton(ByRef Control As Control, ByRef oProperty As cABMProperty)

            if(control(instanceOf cMaskEdit)) {
                // With control;
                    if(control.csType != csMkText  && control.csType != csMkTime) {
                        if(control.Enabled) {

                            if(oProperty.getNoShowButton()) {
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

        private Toolbar pLoadToolBar(cABMProperty prop, Frame f) { // TODO: Use of ByRef founded Private Function pLoadToolBar(ByVal Prop As cABMProperty, ByRef f As Frame) As Toolbar
            return m_masterView.loadToolbar(f);
        }

        private void moveNext() {
            try {

                cWizardGeneric wizardClient = null;
                wizardClient = m_client;
                wizardClient.moveNext();

                return;
            } catch (Exception ex) {
                MngError(VBA.ex, "MoveNext", C_MODULE, "");
            }
        }

        private void moveBack() {
            cWizardGeneric wizardClient = null;
            wizardClient = m_client;
            wizardClient.moveBack();
        }

        self.refreshFont(cIABMProperty iProperty) { // TODO: Use of ByRef founded Public Sub RefreshFont(ByRef iProperty As cIABMProperty)
            cABMProperty oProp = null;
            oProp = iProperty;

            if(oProp.getCtl() === null) { return; }
            pSetFont(oProp.getCtl(), iProperty);
        }

        self.refreshPosition(cIABMProperty iProperty) { // TODO: Use of ByRef founded Public Sub RefreshPosition(ByRef iProperty As cIABMProperty)
            cABMProperty oProp = null;
            oProp = iProperty;

            if(oProp.getCtl() === null) { return; }


                oProp.getCtl().Left = iProperty.Left;
                oProp.getCtl().Top = iProperty.Top;
                oProp.getCtl().Width = iProperty.Width;
                oProp.getCtl().Height = iProperty.Height;
            }
        }

        private void pSetFont(Control c, cIABMProperty iProperty) { // TODO: Use of ByRef founded Private Sub pSetFont(ByRef c As Control, ByRef iProperty As cIABMProperty)


                // With iProperty;
                    if(iProperty.FontName != "") {
                        c.FontName = iProperty.FontName;
                    }
                    if(iProperty.FontSize > 0) {
                        c.FontSize = iProperty.FontSize;
                    }
                    c.FontUnderline = iProperty.FontUnderline;
                    c.FontBold = iProperty.FontBold;
                    c.FontItalic = iProperty.FontItalic;
                    if(iProperty.ForeColor != -1) {
                        c.ForeColor = iProperty.ForeColor;
                    }
                // {end with: iProperty}
            }
        }

        private void pSetBackColor(Control c, cIABMProperty iProperty) { // TODO: Use of ByRef founded Private Sub pSetBackColor(ByRef c As Control, ByRef iProperty As cIABMProperty)

                // With iProperty;
                    if(iProperty.BackColor != -1) {
                        c.BackColor = iProperty.BackColor;
                    }
                // {end with: iProperty}
            }
        }

        private void pSetTabIndexDescription() {
            cIABMProperty iProperty = null;
            cABMProperty oProperty = null;
            cIABMProperties iProperties = null;

            if(m_isDocument) {

                iProperties = m_properties;

                Object w_frm = getView();

                    for (int _i = 0; _i < iProperties.size(); _i++) {
                        iProperty = iProperties.getItem(_i);
                        if(iProperty.SubType === cspMemo) {
                            oProperty = iProperty;
                            w_frm.TXM(oProperty.getIndex()).cABMProperty.setTabIndex(w_frm.Controls.cABMDocPropertiesCols.count());
                        }
                    }
                // {end with: w_frm}
            }
        }

        private void pRefreshAux() {
            int index = 0;
            cABMProperty oProperty = null;
            cIABMProperties iProperties = null;
            int i = 0;

            iProperties = m_properties;

            Object w_frm = getView();

                for (i = 1; i <= iProperties.Count; i++) {

                    oProperty = iProperties(i);
                    index = oProperty.getIndex();

                    switch (iProperties(i).PropertyType) {
                            //        Case csTypeABMProperty.cspAdHock
                            //          ChangeProperty cspAdHock, Index, .CBhock.Item(Index), True

                        case  csTypeABMProperty.cspCheck:
                            changeProperty(cspCheck, index, w_frm.CHK.cABMGridRow.item(index), true);

                            break;
                        case  csTypeABMProperty.cspDate:
                        case  csTypeABMProperty.cspTime:
                            changeProperty(cspDate, index, w_frm.MEFE.cABMGridRow.item(index), true);

                            break;
                        case  csTypeABMProperty.cspHelp:
                            changeProperty(cspHelp, index, w_frm.HL.cABMGridRow.item(index), true);

                            break;
                        case  csTypeABMProperty.cspList:
                            changeProperty(cspList, index, w_frm.CB.cABMGridRow.item(index), true);

                            break;
                        case  csTypeABMProperty.cspNumeric:
                            changeProperty(cspNumeric, index, w_frm.ME.cABMGridRow.item(index), true);

                            break;
                        case  csTypeABMProperty.cspOption:
                            changeProperty(cspOption, index, w_frm.OP.cABMGridRow.item(index), true);

                            break;
                        case  csTypeABMProperty.cspPassword:
                            changeProperty(cspPassword, index, w_frm.txPassword.cABMGridRow.item(index), true);

                            break;
                        case  csTypeABMProperty.cspText:
                        case  csTypeABMProperty.cspFile:
                        case  csTypeABMProperty.cspFolder:
                            if(iProperties(i).SubType === cspMemo) {
                                changeProperty(cspText, index, w_frm.TXM.cABMGridRow.item(index), true, cspMemo);
                            }
                            else {
                                changeProperty(cspText, index, w_frm.TX.cABMGridRow.item(index), true);
                            }

                            break;
                    }
                }
            // {end with: w_frm}
        }

        self.resetChanged = function() {
          setChanged(false);
          m_unloading = false;
        };

        var pAskDelete(String msg) {
            return Ask(msg, vbYes, "Borrar");
        }

        private void pReloadDocument() {


                if(m_unloading) { return; }

                showMsg("Descartando los cambios hechos al documento ...");
                m_client.MessageEx(ABM_MSG.MSG_DOC_REFRESH, null);
                setChanged(false);
                hideMsg();
            }
        }

        self.printDocumento() {
            pPrint(false);
        }

        self.printDocEx(int id) {
            pPrint(false, id);
        }

        self.printDocumentoCobranzaCdo(CSInterfacesABM.cIABMClient obj) { // TODO: Use of ByRef founded Public Sub PrintDocumentoCobranzaCdo(ByRef Obj As CSInterfacesABM.cIABMClient)

                CSInterfacesABM.cIABMClient oldClient = null;
                oldClient = m_client;
                m_client = obj;
                pPrint(false);
                m_client = oldClient;
            }
        }

        self.printDocWithResult(CSInterfacesABM.cIABMClient obj, int id, int docId) { // TODO: Use of ByRef founded Public Function PrintDocWithResult(ByRef Obj As CSInterfacesABM.cIABMClient, ByVal Id As Long, ByVal DocId As Long) As Boolean
            boolean _rtn = false;


                CSInterfacesABM.cIABMClient oldClient = null;
                oldClient = m_client;
                m_client = obj;

                _rtn = pPrintDocWithResult(id, docId);

                m_client = oldClient;

            }
            return _rtn;
        }

        self.pPrintDocWithResult(int id, int docId) {
            boolean _rtn = false;

            if(id === csNO_ID) {
                return _rtn;
            }

            //'CSPrintManager.cPrintManager
            Object printManager = null;

            printManager = CSKernelClient2.CreateObject("CSPrintManager2.cPrintManager");

            // With printManager;

                printManager.IsForEmail = false;
                printManager.EmailAddress = pGetEmailAddress();
                printManager.Path = GetValidPath(mMngIni.iniGetEx(C_RPT_KEY, C_RPT_PATH_REPORTS, mUtil.gAppPath));
                printManager.CommandTimeout = mUtil.val(mMngIni.iniGetEx(C_RPT_KEY, C_RPT_COMMAND_TIMEOUT, 0));
                printManager.ConnectionTimeout = mUtil.val(mMngIni.iniGetEx(C_RPT_KEY, C_RPT_CONNECTION_TIMEOUT, 0));

                printManager.DescriptionUser = pGetDescriptionUser();
                printManager.Title = pGetPrintTitle();

                printManager.ShowPrint(id, csNO_ID, docId);

                _rtn = printManager.DocImpreso;

            // {end with: printManager}

            return _rtn;
        }

        private void pPrint(boolean byEmail, int id) {

            try {

                //'CSPrintManager.cPrintManager
                Object printManager = null;
                CSIDocumento.cIDocumento iDoc = null;

                if(!TypeOf(m_client Is CSIDocumento.cIDocumento)) { / * *TODO:** goto found: GoTo ExitProc* /  }
                iDoc = m_client;

                if(id === csNO_ID) {
                    id = iDoc.Id;
                }

                if(id === csNO_ID) {
                    MsgInfo("Debe grabar el documento para poder imprimirlo", "Imprimir");
                    / * *TODO:** goto found: GoTo ExitProc* /
                }

                printManager = CSKernelClient2.CreateObject("CSPrintManager2.cPrintManager");

                // OJO: Esto es nuevo y puede traer problemas
                //      es para que no se impriman formularios
                //      con cambios sin guardar
                //
                if(!m_inSave) {

                    if(!pSaveChanges(false, false)) { / * *TODO:** goto found: GoTo ExitProc* /  }

                }

                // With printManager;

                    printManager.IsForEmail = byEmail;
                    printManager.EmailAddress = pGetEmailAddress();
                    printManager.Path = GetValidPath(mMngIni.iniGetEx(C_RPT_KEY, C_RPT_PATH_REPORTS, mUtil.gAppPath));
                    printManager.CommandTimeout = mUtil.val(mMngIni.iniGetEx(C_RPT_KEY, C_RPT_COMMAND_TIMEOUT, 0));
                    printManager.ConnectionTimeout = mUtil.val(mMngIni.iniGetEx(C_RPT_KEY, C_RPT_CONNECTION_TIMEOUT, 0));

                    printManager.DescriptionUser = pGetDescriptionUser();
                    printManager.AutoPrint = m_autoPrint;

                    printManager.ShowPrint(id, csNO_ID, iDoc.DocId);

                    if(printManager.DocImpreso) {
                        pReloadDocument();
                    }
                // {end with: printManager}

                / * *TODO:** goto found: GoTo ExitProc* /
            } catch (Exception ex) {
                MngError(VBA.ex, "pPrint", C_MODULE, "");
                if(VBA.ex.Number) { / * *TODO:** resume found: Resume(ExitProc)* /  }
                / * *TODO:** label found: ExitProc:* /

            }
        }

        var pGetDescriptionUser() {
            String rtn = "";

            rtn = m_client.MessageEx(ABM_MSG.MSG_EXPORT_GET_FILE_NAME_POSTFIX, null);

            return rtn;
        }

        var pGetPrintTitle() {
            String rtn = "";

            rtn = m_client.MessageEx(ABM_MSG.MSG_PRINT_GET_TITLE, null);

            return rtn;
        }

        var pGetEmailAddress() {


                String emailAddress = "";

                emailAddress = m_client.MessageEx(ABM_MSG.MSG_EXPORT_GET_EMAIL, null).trim();

                return emailAddress;
            }
        }

        var pNewWithWizard() {

                return mMsgConstantes.varToBool(m_client.MessageEx(ABM_MSG.MSG_DOC_NEW_WITH_WIZARD, null));
            }
        }

        var pGetTabIndex(cIABMProperty iProperty) { // TODO: Use of ByRef founded Private Function pGetTabIndex(ByRef iProperty As cIABMProperty) As Long
            int _rtn = 0;
            // With iProperty;
                if(iProperty.TabIndex === TabIndexType.TAB_ID_XT_ALL  || iProperty.TabIndex === TabIndexType.TAB_ID_XT_ALL2) {
                    _rtn = 0;
                }
                else {
                    _rtn = iProperty.TabIndex;
                }
            // {end with: iProperty}
            return _rtn;
        }

        private void initVectorsPosition() {
            m_left[0] = m_constLeft;
            m_leftOp[0] = m_constLeftOp;
            m_nextTop[0] = m_constTop;
            m_nextTopOp[0] = m_constTopOp;
        }

        private void initCtrlPosition() {
            m_constLeft = getView().LB(0).cABMProperty.getLeft();
            m_constLeftOp = getView().OP(0).cABMProperty.getLeft();
            m_textOrigWidth = getView().TX(0).cABMProperty.getWidth();

            if(m_isItems) {
                m_constTop = getView().getTabItems().getTop() + 100;

            }
            else if(m_isFooter) {
                m_constTop = getView().shTabFooter.cABMProperty.getTop() + C_OFFSET_V1;
                m_constLeft = getView().shTabFooter.cABMProperty.getLeft() + 200;
            }
            else {
                m_constTop = getView().HL(0).cABMProperty.getTop();
            }

            m_constTopOp = getView().OP(0).cABMProperty.getTop();
        }

        self.initButtons() {
            if(getView(instanceOf fABMDoc)) {
                m_documentView.setNoButtons1(m_noButtons1);
                m_documentView.setNoButtons2(m_noButtons2);
                m_documentView.setNoButtons3(m_noButtons3);
                m_documentView.setButtonsEx2(m_buttonsEx2);
                m_documentView.setButtonsEx3(m_buttonsEx3);
                m_documentView.setToolbarButtons();
            }
        }

        // construccion - destruccion
        private void class_Initialize() {
                m_isDocument = false;
                m_isFooter = false;
                m_isItems = false;
                m_formShowed = false;
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

        private void class_Terminate() {


                m_menu = null;

                G.redim(m_nextTop, 0);
                G.redim(m_nextTopOp, 0);
                G.redim(m_left, 0);
                G.redim(m_leftOp, 0);

                m_properties = null;
                m_client = null;
                m_tabs = null;
                m_gridManager = null;

                if(m_masterView != null) {
                    Unload(m_masterView);
                }
                if(m_documentView != null) {
                    Unload(m_documentView);
                }
                if(m_wizardView != null) {
                    Unload(m_wizardView);
                }

                m_masterView = null;
                m_documentView = null;
                m_wizardView = null;

                #If PREPROC_DEBUG Then;
                gdbTerminateInstance(C_MODULE);
                #End If;
            }
        }

        var pGetNameGrid(cIABMProperty iProp) { // TODO: Use of ByRef founded Private Function pGetNameGrid(ByRef iProp As cIABMProperty) As String
            String _rtn = "";
            if(iProp.Name != "") {
                _rtn = m_client.Title+ "_"+ iProp.Name;
            }
            else {
                _rtn = m_client.Title+ "_"+ iProp.Key;
            }
            return _rtn;
        }

        private void pSetDontResize() {
            cIABMProperty iProp = null;
            cABMProperty oProp = null;
            cABMGrid grid = null;
            int i = 0;
            int indexGrid = 0;
            cIABMProperties iProperties = null;

            iProperties = m_properties;

            for (int _i = 0; _i < iProperties.size(); _i++) {
                iProp = iProperties.getItem(_i);

                if(iProp.PropertyType === cspGrid) {
                    i = i + 1;
                    grid = iProp.Grid;

                    oProp = iProp;

                    if(!oProp.getCtl() === null && getView() Is m_masterView) {
                        indexGrid = getView().GetIndexGrid(oProp.getCtl());
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

                        if(!oProp.getCtl() === null) {
                            pSetGridHeight(oProp.getCtl(), iProp.Height);
                        }
                    }
                }
            }
        }

        private void pSetGridHeight(Object ctl, int height) {

                if(height > 0) {
                    ctl.Height = height;
                }
            }
        }

        private void pSetEnabled(boolean bEnabled) {


                Object ctl = null;
                int i = 0;

                if(bEnabled) {
                    for (int _i = 0; _i < getView().Controls.size(); _i++) {
                        ctl = Frm.Controls.getItem(_i);
                        if(ctl(instanceOf cGridAdvanced)) {
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

                    for (int _i = 0; _i < getView().Controls.size(); _i++) {
                        ctl = Frm.Controls.getItem(_i);
                        if(ctl(instanceOf cGridAdvanced)) {
                            i = i + 1;
                            G.redimPreserve(m_enabledState, i);
                            m_enabledState[i] = ctl.Enabled;
                            ctl.Enabled = false;
                        }
                    }
                }
            }
        }

        self.refreshTitle = function() {
          view = getView();
          if(!valEmpty(m_title2, csText)) {
              w_frm.lbTitleEx2.cABMDocPropertiesCol.setText(" - "+ m_title2);
              w_frm.lbTitleEx2.cABMProperty.setLeft(w_frm.lbTitle.cABMProperty.getLeft() + w_frm.lbTitle.cABMProperty.getWidth() + 50);
          }
          else {
              w_frm.lbTitleEx2.cABMDocPropertiesCol.setText("");
          }
        }

        self.refreshFormText() {

                getView().text = pGetFormText();
            }
        }

        var pGetFormText() {
            return m_formText+ mUtil.gEmpNombre+ " - "+ m_client.Title+ " || Presione F12 para ver las teclas de acceso rapido";
        }

        private void pSetBackgroundColor() {
            if(mUtil.gBackgroundColor != 0) {

                setBackColorTagMainEx(mUtil.gBackgroundColor);

            }
        }

        self.setBackColorTagMainEx(int color) {
            mUtil.gBackgroundColor = color;
            if(m_masterView != null) {
                m_masterView.ShTab.cABMGridRow.setBackColor(color);
            }
            else if(m_documentView != null) {
                m_documentView.ShTab.cABMGridRow.setBackColor(color);
                m_documentView.shTabFooter.cABMGridRow.setBackColor(color);
                m_documentView.getTabItems().cABMGridRow.setBackColor(color);
            }
            else if(m_wizardView != null) {
                m_wizardView.ShTab.cABMGridRow.setBackColor(color);
                m_wizardView.shBack.cABMGridRow.setBackColor(color);
                m_wizardView.shTitle.cABMGridRow.setBackColor(vbWhite);
            }
        }

        var pGetCtrlVisibleInTab(Object c, int index) { // TODO: Use of ByRef founded Private Function pGetCtrlVisibleInTab(ByRef c As Object, ByVal Index As Long) As Boolean
            return mUtil.val(c.Tag) === index  || (mUtil.val(c.Tag) === TabIndexType.TAB_ID_XT_ALL  && index != m_tabHideControlsInAllTab) || mUtil.val(c.Tag) === TabIndexType.TAB_ID_XT_ALL2;
        }

        private void pWizDisableButtons() {

                if(m_wizardView === null) { return; }
                //m_wizardView.Enabled = False
                //m_wizardView.cmdNext.Enabled = False
                m_inProcess = true;
                VBA.ex.Clear;
            }
        }

        private void pWizEnableButtons() {

                if(m_wizardView === null) { return; }
                //m_wizardView.Enabled = True
                //m_wizardView.cmdNext.Enabled = True
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

        */
      }
    };

  });

}());