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

  });

  ///////////////
  // Controller
  ///////////////

  Cairo.module("Dialogs.Actions", function(Actions, Cairo, Backbone, Marionette, $, _) {

  });

  Cairo.module("Controller", function(Controller, Cairo, Backbone, Marionette, $, _) {

    Controller = {

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

        // Tabs
        //
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

        // grid manager
        //
        var m_mngGrid = new Cairo.Entities.Dialogs.Grids.Manager();

        // minimum size of the view
        //
        var m_minHeight = 0;
        var m_minWidth = 0;

        /*
        // Contiene el ancho de los textbox
        //
        var m_textOrigWidth = 0;

        // Flag para evitar un refresh recursivo
        //
        private boolean m_showingForm = false;

        // Indica si el cliente implementa la interfaz
        // cIABMClientGrid
        //
        private boolean m_implementsClientGrid = false;

        // Indica que esta instancia edita un documento
        //
        private boolean m_isDocument = false;

        // Flag que indican si esta instancia se
        // encarga de implementar los items del
        // documento
        //
        private boolean m_isItems = false;

        // Flag que indican si esta instancia se
        // encarga de implementar el footer del
        // documento
        //
        private boolean m_isFooter = false;

        // Flag que indica si se trata de un wizard
        //
        private boolean m_isWizard = false;

        // Usada para ocultar el titulo en el
        // ABM de maestros
        //
        private boolean m_hideTitle = false;
        private String m_title2 = "";
        private String m_formCaption = "";

        // Flag que indica que estoy descargando
        // la ventana de edicion
        //
        private boolean m_unloading = false;

        // Flag que indica que se deben ocultar los
        // botones de los tabs. Usado para asistentes
        //
        private boolean m_hideTabButtons = false;

        // Flag que indica que se trata de una edicion
        // modal
        //
        private boolean m_inModalWindow = false;

        // Flag que le indica a pShow que debe invocar
        // el load del form
        //
        private boolean m_loadForm = false;

        // Flag para evitar la pregunta "¿desea guardar los
        // cambios?" aun cuando hay hubo cambios en la
        // edicion
        //
        private boolean m_bDontAskForSave = false;

        // Flag que indica si hubo cambios
        //
        private boolean m_wasChanged2 = false;

        // Flag que indica que el form se ha
        // mostrado. Solo se usa para ".Show vbModal"
        //
        private boolean m_formShowed = false;

        // Contiene el indice del primer tab
        //
        private int m_firstTab = 0;

        // Indica que en lugar de mostrar "guardar cancelar"
        // hay que mostrar "aceptar cancelar"
        //
        private boolean m_bOkCancelDialog = false;

        // Flag que contiene la respuesta del usuario
        //
        // True:  si el usuario acepto
        // False: si cancelo
        //
        private boolean m_bOkCancelDialogRslt = false;

        // Flags que indican que se ha cargado el control
        //
        //Private m_bLoadAdHock           As Boolean
        private boolean m_bLoadList = false;
        private boolean m_bLoadHelp = false;
        private boolean m_bLoadNumeric = false;
        private boolean m_bLoadDate = false;
        private boolean m_bLoadOption = false;
        private boolean m_bLoadLabel = false;
        private boolean m_bLoadTitle = false;
        private boolean m_bLoadProgressBar = false;
        private boolean m_bLoadDescription = false;
        private boolean m_bLoadImage = false;
        private boolean m_bLoadText = false;
        private boolean m_bLoadTextM = false;
        private boolean m_bLoadFile = false;
        private boolean m_bLoadFolder = false;
        private boolean m_bLoadPassword = false;
        private boolean m_bLoadCheck = false;
        private boolean m_bLoadGrid = false;
        private boolean m_bLoadButton = false;

        // Indice del Tab
        //
        private int m_tabIndex = 0;

        // Posicion de los controles
        //
        var m_constLeft = 0;
        var m_constLeftOp = 0;
        var m_constTop = 0;
        var m_constTopOp = 0;

        // Permite evitar el form fABM modifique
        // la posicion de los botones "save y cancel"
        // en el resize
        //
        private boolean m_dontMoveGenericButton = false;

        private String m_cancelCaption = "";
        private String m_saveCaption = "";
        private int m_saveWidth = 0;
        private int m_saveTop = 0;
        private int m_saveLeft = 0;
        private int m_cancelTop = 0;
        private int m_cancelLeft = 0;

        // Identifica la clave de la propiedad que
        // debe recibir el foco cuando se hace nuevo
        //
        private String m_newKeyPropFocus = "";

        private boolean m_bNotLockWnd = false;

        private boolean m_bUseHelpValueProcess = false;

        // Para evitar re-cargar los controles
        // despues de grabar en algunos maestros
        // muy pesados como Cliente, Proveedor
        // y Articulo
        //
        private boolean m_bSendRefresh = false;


        // Permite contemplar un caso especial
        // de edicion en grilla que se utiliza para
        // la produccio de Kit
        //
        private boolean m_bCreateRowInBeforeEdit = false;


        // Permite indicar que no se deben modificar
        // las columnas de la grilla cuando ser refrezcan
        // las propiedades del form por que cambio alguna
        // propiedad (evento propertychange)
        //
        private boolean m_bNoChangeColsInRefresh = false;

        // Permite indicar que luego de terminar de procesar
        // un property change, se envie el comando save
        //
        private boolean m_bSendSave = false;
        private boolean m_bSendClose = false;
        private boolean m_sendNewDoc = false;
        private boolean m_sendNewABM = false;

        // Auto save para dialogos modales
        //
        private boolean m_bSendAutoSave = false;

        private boolean m_setFocusFirstCtrlInNew = false;
        private boolean m_bSavingAs = false;
        private boolean m_inSave = false;

        private int m_noButtons1 = 0;
        private int m_noButtons2 = 0;
        private int m_noButtons3 = 0;

        private int m_buttonsEx2 = 0;
        private int m_buttonsEx3 = 0;

        private boolean m_bNoChangeBackColorCell = false;

        private Object m_owner = null;

        private boolean m_autoPrint = false;

        private int m_tabTopHeight = 0;

        private int m_tabHideCtrlsInAllTab = 0;

        // eventos
        // propiedades publicas
        public void setTabHideCtrlsInAllTab(int rhs) {
            m_tabHideCtrlsInAllTab = rhs;
        }

        public void setOwner(Object rhs) {
            m_owner = rhs;
        }

        public void setBNoChangeBackColorCell(boolean rhs) {
            m_bNoChangeBackColorCell = rhs;
        }

        public void setFormCaption(String rhs) {
            m_formCaption = rhs;
        }

        public void setPopMenuClient(String rhs) {
            m_popMenuClient = rhs;
        }

        public boolean getSetFocusFirstCtrlInNew() {
            return m_setFocusFirstCtrlInNew;
        }

        public void setSetFocusFirstCtrlInNew(boolean rhs) {
            m_setFocusFirstCtrlInNew = rhs;
        }

        public void setNoButtons1(int rhs) {
            m_noButtons1 = rhs;
        }

        public void setNoButtons2(int rhs) {
            m_noButtons2 = rhs;
        }

        public void setNoButtons3(int rhs) {
            m_noButtons3 = rhs;
        }

        public void setButtonsEx2(int rhs) {
            m_buttonsEx2 = rhs;
        }

        public void setButtonsEx3(int rhs) {
            m_buttonsEx3 = rhs;
        }

        public void setBSendSave(boolean rhs) {
            m_bSendSave = rhs;
        }

        public void setBSendClose(boolean rhs) {
            m_bSendClose = rhs;
        }

        public void setBSendAutoSave(boolean rhs) {
            m_bSendAutoSave = rhs;
        }

        public void setSendNewDoc(boolean rhs) {
            m_sendNewDoc = rhs;
        }

        public void setSendNewABM(boolean rhs) {
            m_sendNewABM = rhs;
        }

        public boolean getInSave() {
            return m_inSave;
        }

        public boolean getBSavingAs() {
            return m_bSavingAs;
        }

        // Indica si se trata de un wizard
        //
        public void setIsWizard(boolean rhs) {
            m_isWizard = rhs;
        }

        public void setBDontAskForSave(boolean rhs) {
            m_bDontAskForSave = rhs;
        }

        // Permite evitar el form fABM modifique
        // la posicion de los botones "save y cancel"
        // en el resize
        //
        public void setDontMoveGenericButton(boolean rhs) {
            m_dontMoveGenericButton = rhs;
        }

        public void setSaveCaption(String rhs) {
            m_saveCaption = rhs;
        }

        public void setSaveWidth(int rhs) {
            m_saveWidth = rhs;
        }

        public void setCancelCaption(String rhs) {
            m_cancelCaption = rhs;
        }

        public void setSaveTop(int rhs) {
            m_saveTop = rhs;
        }

        public void setSaveLeft(int rhs) {
            m_saveLeft = rhs;
        }

        public void setCancelTop(int rhs) {
            m_cancelTop = rhs;
        }

        public void setCancelLeft(int rhs) {
            m_cancelLeft = rhs;
        }


        // Devuelve un formulario de tipo
        //
        //  - fABM
        //  - fABMDoc
        //  - fWizad
        //
        public Object getFrm() {
            boolean bInit = false;

            // Documentos
            //
            if (m_isDocument) {
                if (m_formDoc == null) {
                    m_formDoc = new fABMDoc();
                    m_formDoc.addListener(new fABMDocEventA() {
                      public void CMDClick(int index) {
                        m_FormDoc_CMDClick(index,);
                      }
                      public void GRDblClick(int index, int rowIndex, int colIndex) {
                        m_FormDoc_GRDblClick(index, rowIndex, colIndex,);
                      }
                      public void HLKeyDown(int index, int keyCode, int shift) {
                        m_FormDoc_HLKeyDown(index, keyCode, shift,);
                      }
                      public void cbTabClick(int index, String tag) {
                        m_FormDoc_cbTabClick(index, tag,);
                      }
                      public void TabGetFirstCtrl(int index, String tag, Control ctrl) {
                        m_FormDoc_TabGetFirstCtrl(index, tag, ctrl,);
                      }
                      public void FormLoad() {
                        m_FormDoc_FormLoad();
                      }
                      public void GRRowWasDeleted(int index, int rowIndex) {
                        m_FormDoc_GRRowWasDeleted(index, rowIndex,);
                      }
                      public void ToolBarClick(MSComctlLib.Button button) {
                        m_FormDoc_ToolBarClick(button,);
                      }
                      public void CBChange(int index) {
                        m_FormDoc_CBChange(index,);
                      }
                      public void CHKClick(int index) {
                        m_FormDoc_CHKClick(index,);
                      }
                      public void FormQueryUnload(int cancel, int unloadMode) {
                        m_FormDoc_FormQueryUnload(cancel, unloadMode,);
                      }
                      public void FormUnload(int cancel) {
                        m_FormDoc_FormUnload(cancel,);
                      }
                      public void GRColumnButtonClick(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
                        m_FormDoc_GRColumnButtonClick(index, lRow, lCol, iKeyAscii, bCancel,);
                      }
                      public void GRColumnAfterEdit(int index, int lRow, int lCol, Object newValue, int newValueID, boolean bCancel) {
                        m_FormDoc_GRColumnAfterEdit(index, lRow, lCol, newValue, newValueID, bCancel,);
                      }
                      public void GRColumnAfterUpdate(int index, int lRow, int lCol, Object newValue, int newValueID) {
                        m_FormDoc_GRColumnAfterUpdate(index, lRow, lCol, newValue, newValueID,);
                      }
                      public void GRColumnBeforeEdit(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
                        m_FormDoc_GRColumnBeforeEdit(index, lRow, lCol, iKeyAscii, bCancel,);
                      }
                      public void GRDeleteRow(int index, int lRow, boolean bCancel) {
                        m_FormDoc_GRDeleteRow(index, lRow, bCancel,);
                      }
                      public void GRNewRow(int index, int rowIndex) {
                        m_FormDoc_GRNewRow(index, rowIndex,);
                      }
                      public void GRValidateRow(int index, int rowIndex, boolean bCancel) {
                        m_FormDoc_GRValidateRow(index, rowIndex, bCancel,);
                      }
                      public void GRSelectionChange(int index, int lRow, int lCol) {
                        m_FormDoc_GRSelectionChange(index, lRow, lCol,);
                      }
                      public void GRSelectionRowChange(int index, int lRow, int lCol) {
                        m_FormDoc_GRSelectionRowChange(index, lRow, lCol,);
                      }
                      public void HLChange(int index) {
                        m_FormDoc_HLChange(index,);
                      }
                      public void MEChange(int index) {
                        m_FormDoc_MEChange(index,);
                      }
                      public void MEDateChange(int index) {
                        m_FormDoc_MEDateChange(index,);
                      }
                      public void OPClick(int index) {
                        m_FormDoc_OPClick(index,);
                      }
                      public void TXChange(int index) {
                        m_FormDoc_TXChange(index,);
                      }
                      public void TXMChange(int index) {
                        m_FormDoc_TXMChange(index,);
                      }
                      public void TXPasswordChange(int index) {
                        m_FormDoc_TXPasswordChange(index,);
                      }

                  };);
                    Load(m_formDoc);
                    m_loadForm = true;
                    bInit = true;
                }
                return m_formDoc;

                // Asistentes
                //
            }
            else if (m_isWizard) {
                if (m_formWizard == null) {
                    m_formWizard = new fWizard();
                    m_formWizard.addListener(new fWizardEventA() {
                      public void GRDblClick(int index, int rowIndex, int colIndex) {
                        m_FormWizard_GRDblClick(index, rowIndex, colIndex,);
                      }
                      public void TabGetFirstCtrl(int index, Control ctrl) {
                        m_FormWizard_TabGetFirstCtrl(index, ctrl,);
                      }
                      public void CBChange(int index) {
                        m_FormWizard_CBChange(index,);
                      }
                      public void cbTabClick(int index) {
                        m_FormWizard_cbTabClick(index,);
                      }
                      public void CHKClick(int index) {
                        m_FormWizard_CHKClick(index,);
                      }
                      public void cmdCancelClick() {
                        m_FormWizard_cmdCancelClick();
                      }
                      public void cmdBackClick() {
                        m_FormWizard_cmdBackClick();
                      }
                      public void CMDClick(int index) {
                        m_FormWizard_CMDClick(index,);
                      }
                      public void cmdNextClick() {
                        m_FormWizard_cmdNextClick();
                      }
                      public void FormLoad() {
                        m_FormWizard_FormLoad();
                      }
                      public void FormQueryUnload(int cancel, int unloadMode) {
                        m_FormWizard_FormQueryUnload(cancel, unloadMode,);
                      }
                      public void FormUnload(int cancel) {
                        m_FormWizard_FormUnload(cancel,);
                      }
                      public void GRColumnAfterEdit(int index, int lRow, int lCol, Object newValue, int newValueID, boolean bCancel) {
                        m_FormWizard_GRColumnAfterEdit(index, lRow, lCol, newValue, newValueID, bCancel,);
                      }
                      public void GRColumnAfterUpdate(int index, int lRow, int lCol, Object newValue, int newValueID) {
                        m_FormWizard_GRColumnAfterUpdate(index, lRow, lCol, newValue, newValueID,);
                      }
                      public void GRColumnBeforeEdit(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
                        m_FormWizard_GRColumnBeforeEdit(index, lRow, lCol, iKeyAscii, bCancel,);
                      }
                      public void GRColumnButtonClick(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
                        m_FormWizard_GRColumnButtonClick(index, lRow, lCol, iKeyAscii, bCancel,);
                      }
                      public void GRDeleteRow(int index, int lRow, boolean bCancel) {
                        m_FormWizard_GRDeleteRow(index, lRow, bCancel,);
                      }
                      public void GRNewRow(int index, int rowIndex) {
                        m_FormWizard_GRNewRow(index, rowIndex,);
                      }
                      public void GRRowWasDeleted(int index, int rowIndex) {
                        m_FormWizard_GRRowWasDeleted(index, rowIndex,);
                      }
                      public void GRSelectionChange(int index, int lRow, int lCol) {
                        m_FormWizard_GRSelectionChange(index, lRow, lCol,);
                      }
                      public void GRSelectionRowChange(int index, int lRow, int lCol) {
                        m_FormWizard_GRSelectionRowChange(index, lRow, lCol,);
                      }
                      public void GRValidateRow(int index, int rowIndex, boolean bCancel) {
                        m_FormWizard_GRValidateRow(index, rowIndex, bCancel,);
                      }
                      public void HLChange(int index) {
                        m_FormWizard_HLChange(index,);
                      }
                      public void MEChange(int index) {
                        m_FormWizard_MEChange(index,);
                      }
                      public void MEDateChange(int index) {
                        m_FormWizard_MEDateChange(index,);
                      }
                      public void OPClick(int index) {
                        m_FormWizard_OPClick(index,);
                      }
                      public void ToolBarButtonClick(MSComctlLib.Button button) {
                        m_FormWizard_ToolBarButtonClick(button,);
                      }
                      public void TXChange(int index) {
                        m_FormWizard_TXChange(index,);
                      }
                      public void TXMChange(int index) {
                        m_FormWizard_TXMChange(index,);
                      }
                      public void TXPasswordChange(int index) {
                        m_FormWizard_TXPasswordChange(index,);
                      }

                  };);
                    Load(m_formWizard);
                    m_loadForm = true;
                    bInit = true;
                }
                return m_formWizard;

                // ABM
                //
            }
            else {
                if (m_formABM == null) {
                    m_formABM = new fABM();
                    m_formABM.addListener(new fABMEventA() {
                      public void AbmKeyDown(int keyCode, int shift) {
                        m_FormABM_AbmKeyDown(keyCode, shift,);
                      }
                      public void AfterShowModal() {
                        m_FormABM_AfterShowModal();
                      }
                      public void PopItemClick(int index) {
                        m_FormABM_PopItemClick(index,);
                      }
                      public void SetResizeGrid() {
                        m_FormABM_SetResizeGrid();
                      }
                      public void TabGetFirstCtrl(int index, Control ctrl) {
                        m_FormABM_TabGetFirstCtrl(index, ctrl,);
                      }
                      public void CBChange(int index) {
                        m_FormABM_CBChange(index,);
                      }
                      public void cbTabClick(int index) {
                        m_FormABM_cbTabClick(index,);
                      }
                      public void CHKClick(int index) {
                        m_FormABM_CHKClick(index,);
                      }
                      public void cmdCancelClick() {
                        m_FormABM_cmdCancelClick();
                      }
                      public void CMDClick(int index) {
                        m_FormABM_CMDClick(index,);
                      }
                      public void cmdCloseClick() {
                        m_FormABM_cmdCloseClick();
                      }
                      public void cmdCopyClick() {
                        m_FormABM_cmdCopyClick();
                      }
                      public void cmdDocsClick() {
                        m_FormABM_cmdDocsClick();
                      }
                      public void cmdNewClick() {
                        m_FormABM_cmdNewClick();
                      }
                      public void cmdPrintClick() {
                        m_FormABM_cmdPrintClick();
                      }
                      public void cmdPermisosClick() {
                        m_FormABM_cmdPermisosClick();
                      }
                      public void cmdSaveClick() {
                        m_FormABM_cmdSaveClick();
                      }
                      public void FormLoad() {
                        m_FormABM_FormLoad();
                      }
                      public void FormQueryUnload(int cancel, int unloadMode) {
                        m_FormABM_FormQueryUnload(cancel, unloadMode,);
                      }
                      public void FormUnload(int cancel) {
                        m_FormABM_FormUnload(cancel,);
                      }
                      public void GRColumnAfterEdit(int index, int lRow, int lCol, Object newValue, int newValueID, boolean bCancel) {
                        m_FormABM_GRColumnAfterEdit(index, lRow, lCol, newValue, newValueID, bCancel,);
                      }
                      public void GRColumnAfterUpdate(int index, int lRow, int lCol, Object newValue, int newValueID) {
                        m_FormABM_GRColumnAfterUpdate(index, lRow, lCol, newValue, newValueID,);
                      }
                      public void GRColumnBeforeEdit(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
                        m_FormABM_GRColumnBeforeEdit(index, lRow, lCol, iKeyAscii, bCancel,);
                      }
                      public void GRColumnButtonClick(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
                        m_FormABM_GRColumnButtonClick(index, lRow, lCol, iKeyAscii, bCancel,);
                      }
                      public void GRDblClick(int index, int rowIndex, int colIndex) {
                        m_FormABM_GRDblClick(index, rowIndex, colIndex,);
                      }
                      public void GRDeleteRow(int index, int lRow, boolean bCancel) {
                        m_FormABM_GRDeleteRow(index, lRow, bCancel,);
                      }
                      public void GRNewRow(int index, int rowIndex) {
                        m_FormABM_GRNewRow(index, rowIndex,);
                      }
                      public void GRRowWasDeleted(int index, int rowIndex) {
                        m_FormABM_GRRowWasDeleted(index, rowIndex,);
                      }
                      public void GRSelectionChange(int index, int lRow, int lCol) {
                        m_FormABM_GRSelectionChange(index, lRow, lCol,);
                      }
                      public void GRSelectionRowChange(int index, int lRow, int lCol) {
                        m_FormABM_GRSelectionRowChange(index, lRow, lCol,);
                      }
                      public void GRValidateRow(int index, int rowIndex, boolean bCancel) {
                        m_FormABM_GRValidateRow(index, rowIndex, bCancel,);
                      }
                      public void HLChange(int index) {
                        m_FormABM_HLChange(index,);
                      }
                      public void MEChange(int index) {
                        m_FormABM_MEChange(index,);
                      }
                      public void MEDateChange(int index) {
                        m_FormABM_MEDateChange(index,);
                      }
                      public void OPClick(int index) {
                        m_FormABM_OPClick(index,);
                      }
                      public void ShowHelp() {
                        m_FormABM_ShowHelp();
                      }
                      public void ToolBarButtonClick(MSComctlLib.Button button) {
                        m_FormABM_ToolBarButtonClick(button,);
                      }
                      public void TXButtonClick(int index, boolean cancel) {
                        m_FormABM_TXButtonClick(index, cancel,);
                      }
                      public void TXChange(int index) {
                        m_FormABM_TXChange(index,);
                      }
                      public void TXMChange(int index) {
                        m_FormABM_TXMChange(index,);
                      }
                      public void TXPasswordChange(int index) {
                        m_FormABM_TXPasswordChange(index,);
                      }

                  };);
                    Load(m_formABM);
                    m_loadForm = true;
                    bInit = true;
                    pSetABMCanPrint();
                    pSetABMShowPermisos();

                    // Solo los ABM pueden ser
                    // de tipo CancelDialog
                    //
                    if (m_bOkCancelDialog) {
                        // With m_formABM;
                            // * TODO:** can't found type for with block
                            // * With .cmdCancel
                            __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = m_formABM.cmdCancel;
                                w___TYPE_NOT_FOUND.Caption = "&Cancelar";
                                w___TYPE_NOT_FOUND.Cancel = true;
                            // {end with: w___TYPE_NOT_FOUND}
                            // * TODO:** can't found type for with block
                            // * With .cmdSave
                            __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = m_formABM.cmdSave;
                                w___TYPE_NOT_FOUND.Caption = "&Aceptar";
                                m_formABM.cmdCancel.cABMProperty.setWidth(w___TYPE_NOT_FOUND.Width);
                            // {end with: w___TYPE_NOT_FOUND}
                            m_formABM.cmdClose.cABMGridRow.setVisible(false);
                        // {end with: m_formABM}
                    }

                    // * TODO:** can't found type for with block
                    // * With m_formABM.cmdSave
                    __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = m_formABM.cmdSave;
                        if (LenB(m_saveCaption)) { w___TYPE_NOT_FOUND.Caption = m_saveCaption; }
                        if (m_saveWidth) { w___TYPE_NOT_FOUND.Width = m_saveWidth; }
                        if (m_saveTop) { w___TYPE_NOT_FOUND.Top = m_saveTop; }
                        if (m_saveLeft) { w___TYPE_NOT_FOUND.Left = m_saveLeft; }
                    // {end with: w___TYPE_NOT_FOUND}

                    // * TODO:** can't found type for with block
                    // * With m_formABM.cmdCancel
                    __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = m_formABM.cmdCancel;
                        if (LenB(m_cancelCaption)) { w___TYPE_NOT_FOUND.Caption = m_cancelCaption; }
                        if (m_cancelTop) { w___TYPE_NOT_FOUND.Top = m_cancelTop; }
                        if (m_cancelLeft) { w___TYPE_NOT_FOUND.Left = m_cancelLeft; }
                    // {end with: w___TYPE_NOT_FOUND}
                }

                return m_formABM;

            }

            // Si invoque a Load inicializo el form
            //
            if (bInit) {
                initCtrlPosition();
                initVectorsPosition();
            }
        }

        // Flag que indica que se deben ocultar los
        // botones de los tabs. Usado para asistentes
        //
        public void setHideTabButtons(boolean rhs) {
            m_hideTabButtons = rhs;
        }

        // Tamaño minimos de la ventana
        //
        public void setMinHeight(int rhs) {
            m_minHeight = rhs;
        }

        public void setMinWidth(int rhs) {
            m_minWidth = rhs;
        }

        // Indica que en lugar de mostrar "guardar cancelar"
        // hay que mostrar "aceptar cancelar"
        //
        public void setOkCancelDialog(boolean rhs) {
            m_bOkCancelDialog = rhs;
        }

        public boolean getOkCancelDialogRslt() {
            return m_bOkCancelDialogRslt;
        }

        public void setTabs(cIABMTabs rhs) { // TODO: Use of ByRef founded Public Property Set Tabs(ByRef rhs As cIABMTabs)
            m_tabs = rhs;
        }

        public void setNewKeyPropFocus(String rhs) {
            m_newKeyPropFocus = rhs;
        }

        public String getNewKeyPropFocus() {
            return m_newKeyPropFocus;
        }

        public void setNotLockWnd(boolean rhs) {
            m_bNotLockWnd = rhs;
        }

        public boolean getBNotLockWnd() {
            setNotLockWnd(m_bNotLockWnd);
        }

        public int getHWnd() {
            int _rtn = 0;
            if (getFrm() == null) {
                _rtn = 0;
            }
            else {
                _rtn = getFrm().hWnd;
            }
            return _rtn;
        }

        public void setUseHelpValueProcess(boolean rhs) {
            m_bUseHelpValueProcess = rhs;
        }

        public void setRowSelected(cIABMProperty iProperty, int lRow) { // TODO: Use of ByRef founded Public Sub SetRowSelected(ByRef iProperty As cIABMProperty, ByVal lRow As Long)
            try {

                cABMProperty oProp = null;
                oProp = iProperty;
                if (oProp.getCtl() == null) { return; }

                cGridAdvanced grid = null;
                grid = oProp.getCtl();

                grid.SelectRow(lRow);
                iProperty.SelectedIndex = lRow;
            } catch (Exception ex) {
            }
        }

        // propiedades friend

        // propiedades privadas

        // Manejador para la grilla avanzada
        //
        private cABMCSGrid getMngGrid() {
            if (m_mngGrid == null) { m_mngGrid = new cABMCSGrid(); }
            return m_mngGrid;
        }

        public boolean getBWasChanged() {
            return getWasChanged();
        }

        public void setTabTopHeight(int rhs) {
            m_tabTopHeight = rhs;
        }

        // Flag que indica si hubo cambios
        //
        private boolean getWasChanged() {
            boolean _rtn = false;

            // Para documentos es el form el que indica
            // si hubo cambios
            //
            if (m_isDocument) {
                if (getFrm() == null) { Exit Property; }
                _rtn = getFrm().WasChanged;
            }
            else {
                _rtn = m_wasChanged2;
            }
            return _rtn;
        }

        private void setWasChanged(boolean rhs) {
            boolean _rtn = ;

            // Para documentos es el form el que indica
            // si hubo cambios
            //
            if (m_isDocument) {
                if (getFrm() == null) { Exit Property; }
                DoEvents:(DoEvents: DoEvents);
                getFrm().WasChanged = rhs;
            }
            else {
                m_wasChanged2 = rhs;
            }

            return _rtn;
        }

        // Esta funcion es necesaria para aquellos casos
        // en los que necesito conocer el valor de una
        // celda de la fila para responder al evento
        // BeforeEdit. Puntualmente esto se dio en la
        // edicion de Kits con alternativas y numeros de serie
        // con cantidad variable. En este caso fue necesario
        // conocer el pr_id de la alternativa antes de permitir
        // la edicion de la celda numero de serie, para poder
        // preparar el filtro SQL.
        //
        public void setCreateRowInBeforeEdit(boolean rhs) {
            m_bCreateRowInBeforeEdit = rhs;
        }

        // Se explica en la declaracion de m_bNoChangeColsInRefresh
        //
        public void setNoChangeColsInRefresh(boolean rhs) {
            m_bNoChangeColsInRefresh = rhs;
        }

        // Para evitar re-carga de controles en maestros
        //
        public void setBSendRefresh(boolean rhs) {
            m_bSendRefresh = rhs;
        }

        public String getAutoPrint() {
            return m_autoPrint;
        }

        public void setAutoPrint(String rhs) {
            m_autoPrint = rhs;
        }

        // funciones publicas
        public void setBakcColorTagMain(int color) {
            if (m_formDoc == null) { return; }
            m_formDoc.ShTab.cABMGridRow.setBackColor(color);
            m_formDoc.shTabFooter.cABMGridRow.setBackColor(color);
            m_formDoc.shTabItems.cABMGridRow.setBackColor(color);
        }

        public void setHeightToDocWithDescrip() {
            if (m_formDoc == null) { return; }
            if (m_isDocument && !m_isItems) {
                m_formDoc.setHeightToDocWithDescrip();
            }

            if (m_isItems) {

                m_constTop = m_formDoc.shTabItems.cABMProperty.getTop() + 100;

                int q = 0;
                for (q = 0; q <= m_nextTop.length; q++) {
                    m_nextTop[q] = m_constTop;
                    m_left[q] = m_constLeft;
                }
            }
        }

        public void refreshTitle() {
            pRefreshTitle();
        }

        public void refreshSelStartToEnd(cIABMProperty iProperty) { // TODO: Use of ByRef founded Public Sub RefreshSelStartToEnd(ByRef iProperty As cIABMProperty)

                cABMProperty oProp = null;
                oProp = iProperty;
                Object w_ctl = oProp.getCtl();
                    w_ctl.SelStart = w_ctl.Text.length();
                // {end with: w_ctl}
            }
        }

        public void resetChanged() {
            pResetChanged();
        }

        public void showMessage(String msg) {
            pShowMsg(msg, true);
        }

        public void hideMessage() {
            pHideMsg();
        }

        public void setFocusCtrl(cIABMProperty iProperty) { // TODO: Use of ByRef founded Public Sub SetFocusCtrl(ByRef iProperty As cIABMProperty)

                cABMProperty oProp = null;
                oProp = iProperty;
                oProp.getCtl().SetFocus;
                VBA.ex.Clear;
            }
        }

        public void setFocusInGridItems() {

                SetFocusControl(m_formDoc.GR(0));
                mUtil.sendKeys("{ENTER}");
                VBA.ex.Clear;
            }
        }

        public void printABM(int id, int tblId) {

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
        public void autoWidthColumn(cIABMProperty iProperty, String keyCol) { // TODO: Use of ByRef founded Public Sub AutoWidthColumn(ByRef iProperty As cIABMProperty, Optional ByVal KeyCol As String)

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
            if (keyCol.length()) {

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
        public void groupGrid(cIABMProperty iProperty, String keyCol, String keyColSort) { // TODO: Use of ByRef founded Public Sub GroupGrid(ByRef iProperty As cIABMProperty, ByVal KeyCol As String, ByVal KeyColSort As String)

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

        public void groupGridEx(cIABMProperty iProperty, String keyCol, String keyColSort, int offSetColSort) { // TODO: Use of ByRef founded Public Sub GroupGridEx(ByRef iProperty As cIABMProperty, ByVal KeyCol As String, ByVal KeyColSort As String, Optional ByVal offSetColSort As Integer = 3)




                cMouseWait mouse = null;
                mouse = new cMouseWait();

                cABMProperty oProp = null;
                oProp = iProperty;

                if (oProp.getCtl() == null) { return; }

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
                    if (row.getIsGroup()) {
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

                    if (grid.RowIsGroup(j)) {
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

                    if (grid.RowIsGroup(j)) {
                        sortedRows.add(rows(j));
                    }
                    else {

                        for (i = 1; i <= rows.Count; i++) {
                            row = rows.Item(i);
                            if (!row.getIsGroup()) {
                                if (index == row.getIndex()) {

                                    // El indice debe estar en 0 para
                                    // que lo inserte al final
                                    //
                                    row.setIndex(0);
                                    if (LenB(row.getKey())) {
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
                    if (!grid.RowIsGroup(j)) {
                        k = k + 1;
                        grid.CellText(j, 3) == k;
                    }
                }

                // Selecciono la primer columna
                //
                if (grid.Rows) {
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
                    if (!row.getIsGroup()) {
                        k = k + 1;
                        row.setIndex(k);
                        row.item(1).Value = k;
                    }
                }

                pAddAuxCol(iProperty);

                / * *TODO:** goto found: GoTo ExitProc* /
                / * *TODO:** label found: ControlError:* /

                MngError(VBA.ex, "GroupGrid", C_MODULE, "Linea: "+ Erl+ "\\r\\n"+ "\\r\\n"+ "Descrip: "+ VBA.ex.Description);
                if (VBA.ex.Number) { / * *TODO:** resume found: Resume(ExitProc)* /  }

                / * *TODO:** label found: ExitProc:* /
                if (oProp == null) { return; }
                if (oProp.getCtl() == null) { return; }

                oProp.getCtl().GridCtrl.Redraw = true;
                oProp.getCtl().Visible = bVisible;

                iProperty.GridRemove = bCanRemove;

                VBA.ex.Clear;
            }
        }

        public void refreshButtonsStyle(cIABMProperty iProp) {


                cABMProperty oProp = null;
                oProp = iProp;

                if (oProp.getCtl() == null) { return; }

                if (iProp.ForeColor != -1) {
                    oProp.getCtl().ForeColor = iProp.ForeColor;
                }

                if (iProp.BackColor != -1) {
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
            if (iProperty.Grid.cABMDocProperties.getColumns().item(c_col_aux_group1) == null) {
                CSInterfacesABM.cIABMGridColumn w_add = cols.add(null, c_col_aux_group1, 1);
                    w_add.Visible = false;
                // {end with: w_add}
            }

            if (iProperty.Grid.cABMDocProperties.getColumns().item(c_col_aux_group2) == null) {
                CSInterfacesABM.cIABMGridColumn w_add = cols.add(null, c_col_aux_group2, 1);
                    w_add.Visible = false;
                // {end with: w_add}
            }

            // Celdas
            //
            cABMGridRow row = null;

            for (int _i = 0; _i < iProperty.Grid.cABMCSGrid.getRows().size(); _i++) {
                Row = iProperty.Grid.Rows.getItem(_i);
                if (row.item(c_col_aux_group1) == null) {
                    row.add(, null, c_col_aux_group1, 1);
                }
                if (row.item(c_col_aux_group2) == null) {
                    row.add(, null, c_col_aux_group2, 1);
                }
            }

            cABMProperty oProp = null;
            oProp = iProperty;

            cGridAdvanced gridAd = null;
            gridAd = oProp.getCtl();

            if (gridAd.Columns(c_col_aux_group1) == null) {
                gridAd.Columns.cABMGridRows.add(, null, c_col_aux_group1);
            }

            if (gridAd.Columns(c_col_aux_group2) == null) {
                gridAd.Columns.cABMGridRows.add(, null, c_col_aux_group2);
            }

            VBA.ex.Clear;

        }

        public void drawGrid(cIABMProperty iProperty, boolean bRedraw) { // TODO: Use of ByRef founded Public Sub DrawGrid(ByRef iProperty As cIABMProperty, ByVal bRedraw As Boolean)

            cABMProperty oProperty = null;
            cGridAdvanced oGrid = null;

            // Obtengo punteros a las interfaces
            // especificas
            //
            oProperty = iProperty;
            oGrid = getFrm().GR(oProperty.getIndex());

            if (oGrid == null) { return; }

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
            oGrid = getFrm().GR(oProperty.getIndex());

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
        public void refreshEnabledState(cIABMProperties iProperties) { // TODO: Use of ByRef founded Public Sub RefreshEnabledState(ByRef iProperties As cIABMProperties)
            cIABMProperty iProperty = null;

            for (int _i = 0; _i < iProperties.size(); _i++) {
                iProperty = iProperties.getItem(_i);
                setEnabled(iProperty);
            }

            pSetTabIndexDescrip();
        }

        // Modifica los valores de todas las propiedades
        //
        public void showValues(cIABMProperties iProperties) { // TODO: Use of ByRef founded Public Sub ShowValues(ByRef iProperties As cIABMProperties)
            cIABMProperty iProperty = null;

            // Tratamiento especial para documentos
            //
            if (m_isDocument) {

                // Los documentos se dividen en tres objetos
                // cABMGeneric
                //
                for (int _i = 0; _i < iProperties.size(); _i++) {
                    iProperty = iProperties.getItem(_i);

                    if (m_isFooter) {
                        showValue(iProperty, true, c_Footer);

                    }
                    else if (m_isItems) {
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
        public void refreshGridRows(cIABMProperty iProperty, int cols_to_refresh) {

            if (iProperty.PropertyType != cspGrid) { return; }

            cABMProperty oProp = null;
            oProp = iProperty;

            if (oProp.getCtl() == null) { return; }

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

            if (cols_to_refresh > columns.Count) {
                cols_to_refresh = columns.Count;
            }

            if (cols_to_refresh <= 0) {
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

                            if (col.PropertyType == cspDate) {
                                w___TYPE_NOT_FOUND.Text = mUtil.getDateValueForGrid(cell.Value);

                            }
                            else if (col.SubType == cspPercent) {
                                w___TYPE_NOT_FOUND.Text = mUtil.val(cell.Value) / 100;

                            }
                            else {
                                w___TYPE_NOT_FOUND.Text = cell.Value;
                            }

                            // Formato de cada celda
                            //
                            iFormat = cell.Format;
                            if (iFormat != null) {

                                oFormat = cell.Format;
                                w___TYPE_NOT_FOUND.ForeColor = iFormat.Color;
                                w___TYPE_NOT_FOUND.BackColor = iFormat.BackColor;

                                w___TYPE_NOT_FOUND.TextAlign = oFormat.getAlign();
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

        public void refreshRowColor(cIABMProperty iProperty, int rowIndex, cIABMGridRow row) { // TODO: Use of ByRef founded Public Sub RefreshRowColor(ByVal iProperty As cIABMProperty, ByVal RowIndex As Long, ByRef Row As cIABMGridRow)

            cABMProperty oProp = null;
            cGridAdvanced oGrid = null;
            cABMGridRow oRow = null;

            oProp = iProperty;
            oGrid = oProp.getCtl();

            if (oGrid == null) { return; }

            oRow = row;
            oGrid.RowBackColor(rowIndex) = oRow.getBackColor();
            oGrid.RowForeColor(rowIndex) = oRow.getForeColor();
        }
        // Inicializa las variables auxiliares
        //
        public void resetLayoutMembers() {
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
        public void resetTabLeftTop(int tabIndex) {
            m_nextTop[tabIndex] = m_constTop;
            m_left[tabIndex] = 2500;
            m_labelLeft = C_OFFSET_H;
        }

        // Modifica el contenido de una celda
        //
        public boolean showCellValue(cIABMProperty iProperty, int lRow, int lCol) { // TODO: Use of ByRef founded Public Function ShowCellValue(ByRef iProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean

            cABMProperty oProperty = null;

            oProperty = iProperty;

            getMngGrid().showCellValue(getFrm().GR(oProperty.getIndex()), iProperty.Grid, lRow, lCol);
        }

        // Modifica el valor de una propiedad
        //
        public boolean showValue(cABMProperty oProperty, boolean noChangeColumns, String strTag) { // TODO: Use of ByRef founded Public Function ShowValue(ByRef oProperty As cABMProperty, Optional ByVal NoChangeColumns As Boolean, Optional ByVal strTag As String) As Boolean

            cIABMProperty iProperty = null;
            cIABMListItem item = null;
            Control c = null;
            Label lbl = null;

            iProperty = oProperty;

            Object w_frm = getFrm();

                switch (iProperty.PropertyType) {

                        //        Case csTypeABMProperty.cspAdHock
                        //
                        //            Set c = .CBhock(oProperty.Index)
                        //            c.Clear
                        //
                        //            For Each Item In iProperty.List
                        //              c.AddItem Item.Value
                        //              ListSetListIndexForId c, Item.Id
                        //            Next
                        //
                        //            c.ListIndex = iProperty.Value
                        //            c.Enabled = iProperty.Enabled
                        //
                        //            ' Esto es por que necesito una propiedad para el ItemData
                        //            ' y uso el HelpId para ello. Cuando el usuario no
                        //            ' modifica este control se devuelve el mismo ItemData que
                        //            ' se mostro.
                        //            '
                        //            iProperty.HelpId = iProperty.Value

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

                        if (c.ListIndex == -1  && c.ListCount > 0) { c.ListIndex = 0; }
                        c.Enabled = iProperty.Enabled;

                        break;
                    case  csTypeABMProperty.cspHelp:
                        c = w_frm.HL(oProperty.getIndex());

                        // With c;
                            c.Id = iProperty.HelpId;

                            if (m_bUseHelpValueProcess) {
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

                        if (iProperty.SubType == cspMemo) {

                            c = w_frm.TXM(oProperty.getIndex());
                        }
                        else {

                            c = w_frm.TX(oProperty.getIndex());
                            if (c(instanceOf cMaskEdit)) {
                                c.Mask = iProperty.TextMask;
                            }
                        }

                        // With c;
                            c.Text = iProperty.Value;
                            c.Enabled = iProperty.Enabled;
                        // {end with: c}

                        // Si el control tiene mascara
                        // actualizo en iProperty.value
                        // con el texto formateado
                        //
                        if (c(instanceOf cMaskEdit)) {
                            if (c.Mask != "") {
                                iProperty.Value = c.Text;
                            }
                        }

                        break;
                    case  csTypeABMProperty.cspPassword:

                        c = w_frm.txPassword(oProperty.getIndex());

                        // With c;
                            c.Text = iProperty.Value;
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
                            c.Caption = iProperty.Name;
                            c.Enabled = iProperty.Enabled;
                        // {end with: c}

                        break;
                    case  csTypeABMProperty.cspLabel:

                        c = w_frm.LB2(oProperty.getIndex());
                        c.Caption = iProperty.Value;
                        if (iProperty.BackColor >= 0) {
                            c.BackColor = iProperty.BackColor;
                        }

                        break;
                    case  csTypeABMProperty.cspImage:

                        c = w_frm.Img(oProperty.getIndex());

                        // With c;
                            if (getFrm(instanceOf fWizard)) {
                                switch (mUtil.val(iProperty.Value)) {
                                    case  1:
                                        c.Picture = m_formWizard.ImgWiz1.Picture;
                                        break;
                                    case  3:
                                        c.Picture = m_formWizard.ImgWiz3.Picture;
                                        break;
                                    case  5:
                                        c.Picture = m_formWizard.ImgWiz5.Picture;
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
                        c.Caption = iProperty.Value;

                        break;
                    case  csTypeABMProperty.cspDescription:
                        c = w_frm.LBDescrip(oProperty.getIndex());
                        c.Caption = iProperty.Value;

                        break;
                    case  csTypeABMProperty.cspGrid:

                        Object grid = null;

                        grid = w_frm.GR(oProperty.getIndex());
                        c = grid;
                        grid.Enabled = iProperty.Enabled;

                        cABMGrid oGrid = null;
                        oGrid = iProperty.Grid;
                        grid.MultiSelect = oGrid.getMultiSelect();

                        cABMCSGrid w_mngGrid = getMngGrid();

                            w_mngGrid.setAllowAddNew(grid, iProperty.GridAdd);
                            w_mngGrid.setAllowEdit(grid, iProperty.GridEdit);
                            w_mngGrid.setAllowDelete(grid, iProperty.GridRemove);

                            if (!w_mngGrid.loadFromRows(grid, iProperty.Grid, noChangeColumns, pGetNameGrid(iProperty))) {
                                return null;
                            }

                            if (iProperty.GridAdd) {
                                pSetDefaults(iProperty, grid.Rows);
                            }
                        // {end with: w_mngGrid}

                        break;
                    case  csTypeABMProperty.cspProgressBar:
                        c = getFrm().prgBar(oProperty.getIndex());
                        double iVal = 0;
                        iVal = mUtil.val(iProperty.Value);
                        c.Value = (iVal <= 100) ? iVal : 100);
                        break;
                }

                // Obtengo la etiqueta asociada al control
                //
                if (oProperty.getLabelIndex() != 0) {
                    lbl = w_frm.LB(oProperty.getLabelIndex());
                }

            // {end with: w_frm}

            if (c != null) {

                boolean bInCurrenTag = false;
                int lenStrTag = 0;

                lenStrTag = strTag.length();

                // With c;

                    // Si es un documento
                    //
                    if (m_isDocument) {

                        if (m_currentTab < m_firstTab) {
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
                        if (valTag < 0 && valTag > TabIndexType.TAB_ID_XT_ALL) {
                            bInCurrenTag = (valTag == m_currentInnerTab) || (valTag == TabIndexType.TAB_ID_XT_ALL  && m_currentInnerTab != m_tabHideCtrlsInAllTab) || (valTag == TabIndexType.TAB_ID_XT_ALL2);
                        }
                        else {
                            bInCurrenTag = (valTag == m_currentTab) || (valTag == TabIndexType.TAB_ID_XT_ALL  && m_currentTab != m_tabHideCtrlsInAllTab) || (valTag == TabIndexType.TAB_ID_XT_ALL2);
                        }
                    }

                    if (bInCurrenTag) {

                        c.Visible = iProperty.Visible;
                        if (lbl != null) {
                            if (mUtil.val(lbl.Tag) != -1) {
                                lbl.Visible = iProperty.Visible;
                            }
                        }

                    }
                    else {
                        if (!(oProperty.getKeyCol().equals(csNumberID) || oProperty.getKeyCol().equals(csStateID) || (iProperty.Table == Cairo.Tables.DOCUMENTO  && m_isDocument))) {
                            c.Visible = false;
                            if (lbl != null) {
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
        public void setEnabled(cABMProperty oProperty) { // TODO: Use of ByRef founded Public Sub SetEnabled(ByRef oProperty As cABMProperty)
            cIABMProperty iProperty = null;
            cIABMListItem item = null;
            int nIndex = 0;
            boolean bEnabled = false;

            iProperty = oProperty;

            nIndex = oProperty.getIndex();
            bEnabled = iProperty.Enabled;

            Object w_frm = getFrm();

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
                        if (iProperty.SubType == cspMemo) {
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
                        grid = w_frm.GR(nIndex);
                        grid.Enabled = bEnabled;
                        break;
                }
            // {end with: w_frm}

            DoEvents;
        }

        // Carga los controles asociados a las propiedades
        //
        public boolean loadControlEx(cABMProperty oProperty, boolean noGrids) { // TODO: Use of ByRef founded Public Function LoadControlEx(ByRef oProperty As cABMProperty, Optional ByVal NoGrids As Boolean) As Boolean

            cIABMProperty iProperty = null;

            if (!oProperty.getControlLoaded()) {

                if (!loadControl(oProperty)) {
                    return null;
                }

                oProperty.setControlLoaded(true);
            }

            iProperty = oProperty;

            if (iProperty.PropertyType != cspGrid  || !noGrids) {

                showValue(oProperty);
            }

            pSetTabIndexDescrip();

            pSetBackgroundColor();

            return true;
        }

        // Descarga los controles
        //
        public void unloadControl(cABMProperty oProperty) { // TODO: Use of ByRef founded Public Sub UnloadControl(ByRef oProperty As cABMProperty)

            cIABMProperty iProperty = null;

            if (oProperty.getControlLoaded()) {

                oProperty.setCtl(null);

                iProperty = oProperty;

                int nIndex = 0;
                nIndex = oProperty.getIndex();

                Object w_frm = getFrm();
                    switch (iProperty.PropertyType) {

                            //        Case csTypeABMProperty.cspAdHock
                            //
                            //          If nIndex = 0 Then
                            //            .CBhock(0).Visible = 0
                            //          Else
                            //            Unload .CBhock(nIndex)
                            //          End If

                        case  csTypeABMProperty.cspList:

                            if (nIndex == 0) {
                                w_frm.CB(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.CB(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspHelp:

                            if (nIndex == 0) {
                                w_frm.HL(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.HL(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspNumeric:

                            if (nIndex == 0) {
                                w_frm.ME(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.ME(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspDate:
                        case  csTypeABMProperty.cspTime:

                            if (nIndex == 0) {
                                w_frm.MEFE(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.MEFE(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspLabel:

                            if (nIndex == 0) {
                                w_frm.LB2(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.LB2(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspTitle:

                            if (nIndex == 0) {
                                w_frm.lbTitle2(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.lbTitle2(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspProgressBar:

                            if (nIndex == 0) {
                                w_frm.prgBar(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.prgBar(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspDescription:

                            if (nIndex == 0) {
                                w_frm.LBDescrip(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.LBDescrip(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspImage:

                            if (nIndex == 0) {
                                w_frm.Img(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.Img(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspText:
                        case  csTypeABMProperty.cspFile:
                        case  csTypeABMProperty.cspFolder:

                            if (iProperty.SubType == cspMemo) {
                                if (nIndex == 0) {
                                    w_frm.TXM(0).cABMGridRow.setVisible(0);
                                }
                                else {
                                    Unload(w_frm.TXM(nIndex));
                                }
                            }
                            else {
                                if (nIndex == 0) {
                                    w_frm.TX(0).cABMGridRow.setVisible(0);
                                }
                                else {
                                    Unload(w_frm.TX(nIndex));
                                }
                            }

                            break;
                        case  csTypeABMProperty.cspPassword:

                            if (nIndex == 0) {
                                w_frm.txPassword(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.txPassword(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspCheck:

                            if (nIndex == 0) {
                                w_frm.CHK(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.CHK(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspGrid:

                            if (nIndex == 0) {
                                w_frm.GR(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.GR(nIndex));
                            }

                            break;
                        case  csTypeABMProperty.cspButton:

                            if (nIndex == 0) {
                                w_frm.CMD(0).cABMGridRow.setVisible(0);
                            }
                            else {
                                Unload(w_frm.CMD(nIndex));
                            }
                            break;
                    }
                // {end with: w_frm}

                nIndex = oProperty.getLabelIndex();
                if (nIndex > 0) {
                    Unload(getFrm().LB(nIndex));
                }
            }
        }

        public void closeWizard() {
            setWasChanged(false);
            Unload(m_formWizard);
        }

        public Object tabGetFirstCtrl(int index) {
            Control c = null;
            int childIndex = 0;
            int fatherIndex = 0;
            boolean bVisible = false;
            int tabIndex = 0;

            tabIndex = 999;

            Object w_frm = getFrm();

                if (w_frm.cbTab(index).Tag.indexOf(c_InerTab, 1)) {

                    childIndex = mUtil.getTagChildIndex(w_frm.cbTab(index).Tag);
                    fatherIndex = mUtil.getTagFatherIndex(w_frm.cbTab(index).Tag);

                    for (int _i = 0; _i < w_frm.Controls.size(); _i++) {
                        c = .Controls.getItem(_i);
                        if (!CBool(TypeOf c Is cButton && c.Name.indexOf("cbTab", 1))) {
                            if (LenB(c.Tag.trim())) {
                                if (mUtil.val(c.Tag) != fatherIndex) {

                                    bVisible = pGetControlVisible(c, pGetCtrlVisibleInTab(c, childIndex));
                                    //Val(c.Tag) = ChildIndex Or Val(c.Tag) = csETabIdxT_All)

                                    if (bVisible) {

                                        if (c(instanceOf Label)) {
                                            // Nada que hacer este no sirve ya que no puede tomar el foco
                                        }
                                        else if (c(instanceOf cABMProperty.setToolbar())) {
                                            // Nada que hacer este no sirve ya que no puede tomar el foco
                                        }
                                        else {
                                            if (c.TabIndex < tabIndex) {
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
                        if (c(instanceOf cButton && c.Name.indexOf("cbTab", 1))) {

                            // Es un inner tab, no tengo que hacer nada con esto

                        }
                        else if (LenB(c.Tag.trim())) {

                            bVisible = pGetControlVisible(c, pGetCtrlVisibleInTab(c, index));
                            //Val(c.Tag) = Index Or Val(c.Tag) = csETabIdxT_All)

                            if (bVisible) {

                                if (c(instanceOf Label)) {
                                    // Nada que hacer este no sirve ya que no puede tomar el foco
                                }
                                else if (c(instanceOf cABMProperty.setToolbar())) {
                                    // Nada que hacer este no sirve ya que no puede tomar el foco
                                }
                                else if (c(instanceOf Image)) {
                                    // Nada que hacer este no sirve ya que no puede tomar el foco
                                }
                                else {
                                    if (c.TabIndex < tabIndex) {
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
                    if (m_isItems) {
                        return pDocTabGetFirstCtrl(c_Items, index);
                    }
                    break;
                case  c_Footer:
                    if (m_isFooter) {
                        return pDocTabGetFirstCtrl(c_Footer, index);
                    }
                break;
                default:
                    if (m_isItems || m_isFooter) { return null; }
                    return pDocTabGetFirstCtrl(c_Header, index);
                    break;
            }

        }

        public Object docTabClick(int index, String tag) {
            cLockUpdateWindow oLock = null;
            oLock = new cLockUpdateWindow();
            oLock.lockW(getFrm().hWnd);

            switch (tag) {

                    // Para documentos los tag de los controles tienen
                    // la palabra Items o Footers o "" (null string)
                    // para identificar a que grupo pertenecen
                case  c_Items:
                    if (m_isItems) {
                        pDocTabClickEx(c_Items, index);
                    }
                    break;
                case  c_Footer:
                    if (m_isFooter) {
                        pDocTabClickEx(c_Footer, index);
                    }
                break;
                default:
                    if (m_isItems || m_isFooter) { return null; }
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

            Object w_frm = getFrm();
                for (int _i = 0; _i < w_frm.Controls.size(); _i++) {
                    c = .Controls.getItem(_i);
                    if (c.Tag.substring(0, strTag.length()) == strTag  && c.Tag != ""  && !(c.Name.equals("cbTab"))) {

                        bVisible = pGetControlVisible(c, mUtil.val(c.Tag.substring(strTag.length() + 1)) + m_firstTab == index);

                        if (bVisible) {

                            if (c(instanceOf Label)) {
                                // Nada que hacer este no sirve ya que no puede tomar el foco
                            }
                            else if (c(instanceOf cABMProperty.setToolbar())) {
                                // Nada que hacer este no sirve ya que no puede tomar el foco
                            }
                            else if (c(instanceOf Image)) {
                                // Nada que hacer este no sirve ya que no puede tomar el foco
                            }
                            else {
                                if (c.TabIndex < tabIndex) {
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

            Object w_frm = getFrm();
                for (int _i = 0; _i < w_frm.Controls.size(); _i++) {
                    c = .Controls.getItem(_i);
                    if (c.Tag.substring(0, strTag.length()) == strTag  && c.Tag != ""  && !(c.Name.equals("cbTab"))) {

                        c.Visible = pGetControlVisible(c, mUtil.val(c.Tag.substring(strTag.length() + 1)) + m_firstTab == index);

                        if (c(instanceOf Label)) {
                            if (c.BackColor == vbButtonFace) {
                                c.BackColor = w_frm.ShTab.cABMGridRow.getBackColor();
                            }
                            c.ZOrder;
                            if (c.Name.toLowerCase().equals("lb")) {
                                if (LenB(c.Caption.trim()).equals(0)) {
                                    c.Visible = false;
                                }
                            }
                        }
                        else if (c(instanceOf cABMCSGrid.getCheckBox())) {
                            c.BackColor = w_frm.ShTab.cABMGridRow.getBackColor();
                        }
                        if (c(instanceOf cABMProperty.setToolbar() && c.Visible)) {
                            w_frm.SetToolbar(c);
                        }
                    }
                }
            // {end with: w_frm}
        }

        private boolean pGetControlVisible(Object ctl, boolean bVisible) { // TODO: Use of ByRef founded Private Function pGetControlVisible(ByRef ctl As Object, ByVal bVisible As Boolean) As Boolean
            boolean _rtn = false;
            cABMProperty oProperty = null;
            cIABMProperty iProp = null;
            cIABMProperties iProperties = null;

            _rtn = bVisible;

            iProperties = m_properties;

            for (int _i = 0; _i < iProperties.size(); _i++) {
                oProperty = iProperties.getItem(_i);
                if (oProperty.getCtl(Is ctl)) {
                    iProp = oProperty;
                    if (!iProp.Visible) {
                        _rtn = false;
                    }
                    return _rtn;

                }
                else if (ctl(instanceOf Label)) {

                    if (!(ctl.Name.substring(0, 3).equals("LB2"))) {
                        if (oProperty.getLabelIndex() == ctl.Index) {
                            iProp = oProperty;
                            if (!iProp.Visible) {
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

            Object w_frm = getFrm();

                oLock = new cLockUpdateWindow();
                oLock.lockW(w_frm.hWnd);

                if (w_frm.cbTab(index).Tag.indexOf(c_InerTab, 1)) {

                    childIndex = mUtil.getTagChildIndex(w_frm.cbTab(index).Tag);
                    fatherIndex = mUtil.getTagFatherIndex(w_frm.cbTab(index).Tag);

                    for (int _i = 0; _i < w_frm.Controls.size(); _i++) {
                        c = .Controls.getItem(_i);
                        if (!CBool(TypeOf c Is cButton && c.Name.indexOf("cbTab", 1))) {
                            if (LenB(c.Tag.trim())) {
                                if (mUtil.val(c.Tag) != fatherIndex) {
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
                        if (c(instanceOf cButton && c.Name.indexOf("cbTab", 1))) {
                            if (c.Tag.indexOf(c_InerTab, 1)) {
                                bVisible = mUtil.getTagFatherIndex(c.Tag) == index;
                                c.Visible = bVisible;
                                if (bVisible) {
                                    if (firstTab == null) { firstTab = c; }
                                }
                            }
                        }
                        else if (LenB(c.Tag.trim())) {
                            pSetVisible(c, index);
                        }
                    }

                }

                if (firstTab != null) {
                    tabClick(firstTab.Index);
                    m_currentInnerTab = mUtil.getTagChildIndex(firstTab.Tag);
                }

                oLock.unLockW();
            // {end with: w_frm}
        }

        private void pSetVisible(Object c, int index) { // TODO: Use of ByRef founded Private Sub pSetVisible(ByRef c As Object, ByVal Index As Long)

            Object w_frm = getFrm();

                c.Visible = pGetControlVisible(c, pGetCtrlVisibleInTab(c, index));
                if (c(instanceOf Label)) {
                    if (c.BackColor == vbButtonFace) {
                        c.BackColor = w_frm.ShTab.cABMGridRow.getBackColor();
                    }
                    c.ZOrder;
                    if (c.Name.toLowerCase().equals("lb")) {
                        if (LenB(c.Caption.trim()).equals(0)) {
                            c.Visible = false;
                        }
                    }
                }
                else if (c(instanceOf cABMCSGrid.getCheckBox())) {
                    c.BackColor = w_frm.ShTab.cABMGridRow.getBackColor();
                }
                if (c(instanceOf cABMProperty.setToolbar() && c.Visible)) {
                    w_frm.SetToolbar(c);
                }
            // {end with: w_frm}
        }

        public boolean showEx(CSInterfacesABM.cIABMClient obj, int indexTag, boolean bAddProp) {
            return pShow(obj, indexTag, !bAddProp);
        }

        public boolean show(CSInterfacesABM.cIABMClient obj, int indexTag) {
            boolean _rtn = false;
            try {

                cMouseWait mouse = null;
                mouse = new cMouseWait();

                _rtn = pShow(obj, indexTag, true);

                / * *TODO:** goto found: GoTo ExitProc* /
            } catch (Exception ex) {
                MngError(VBA.ex, "Show", C_MODULE, "");
                if (VBA.ex.Number) { / * *TODO:** resume found: Resume(ExitProc)* /  }
                / * *TODO:** label found: ExitProc:* /

            }
            return _rtn;
        }

        public void setIconFormDoc(int iconIndex) {
            if (m_formDoc == null) { return; }
            if (m_formDoc.imIcon.ListImages.cABMDocPropertiesCols.count() < iconIndex) { return; }
            m_formDoc.Icon = m_formDoc.imIcon.ListImages.cABMGridRow.item(iconIndex).Picture;
        }

        public void setIconFormABM(int iconIndex) {
            if (m_formABM == null) { return; }
            if (m_formABM.imIcon.ListImages.cABMDocPropertiesCols.count() < iconIndex) { return; }
            m_formABM.Icon = m_formABM.imIcon.ListImages.cABMGridRow.item(iconIndex).Picture;
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

            if (m_menu == null) {
                m_menu = new cPopupMenu();
                m_menu.addListener(new cPopupMenuEventA() {
                      public void Click(int itemNumber) {
                        m_Menu_Click(itemNumber,);
                      }

                  };);
            }

            m_menu.Clear;

            // Creating a Menu:
            // With m_menu;
                // Initial set up:
                m_menu.hWndOwner = getFrm().hWnd;
                m_menu.OfficeXpStyle = true;
            // {end with: m_menu}

            for (i = 0; i <= vMenus.length; i++) {
                vMenu = Split(vMenus(i), c_menu_sep2);
                iP = m_menu.AddItem(vMenu(0), , vMenu(1), iPTop);
            }

            int left = 0;
            int top = 0;

            mUtil.getMousePosition(left, top);

            left = (left * Screen.TwipsPerPixelX) - getFrm().Left;
            top = (top * Screen.TwipsPerPixelY) - getFrm().Top - 200;

            m_menu.ShowPopupMenu(left, top);

        }

        private boolean pShow(CSInterfacesABM.cIABMClient obj, int indexTag, boolean bInitMemebers) {
            boolean _rtn = false;
            cMouse mouse = null;
            cIABMClientGrid tmpObj = null;

            if (obj == null) { return _rtn; }

            m_client = obj;

            if (bInitMemebers) { initLoadMembers(); }

            if (m_isDocument || m_isWizard) {
                m_bLoadHelp = true;
                m_bLoadNumeric = true;
                m_bLoadText = true;
            }

            Object w_frm = getFrm();

                m_implementsClientGrid = mUtil.implementsInterface(m_client, tmpObj);
                w_frm.ShTab.cABMGridRow.setBackColor(vb3DHighlight);

                if (m_loadForm) {
                    m_loadForm = false;

                    if (m_owner == null) {
                        if (m_minHeight < w_frm.Height) { m_minHeight = w_frm.Height; }
                        if (m_minWidth < w_frm.Width) { m_minWidth = w_frm.Width; }
                    }

                    if (getFrm(instanceOf fABM)) {
                        getFrm().DontMoveGenericButton = m_dontMoveGenericButton;
                        getFrm().PopMenuClient = m_popMenuClient;
                    }

                    if (getFrm(instanceOf fWizard)) {
                        //' Aproposito para que no cambie el tamaño inicial del form
                        CSKernelClient2.LoadForm(getFrm(), "wiz");
                    }
                    else {
                        CSKernelClient2.LoadForm(getFrm(), "ABM_"+ m_client.Title);
                    }

                    if (getFrm(instanceOf fABM || getFrm() instanceOf fWizard)) {
                        if (w_frm.Height < m_minHeight) { w_frm.Height = m_minHeight; }
                        if (w_frm.Width < m_minWidth) { w_frm.Width = m_minWidth; }
                    }
                }

                if (!showForm(indexTag)) { return _rtn; }

                w_frm.Caption = pGetFormCaption();

                if (m_hideTitle) {
                    w_frm.lbTitle.cABMGridRow.setVisible(false);
                }
                else {
                    w_frm.lbTitle.cABMDocPropertiesCol.setCaption(m_client.Title);
                }

                if (getFrm(instanceOf fABM)) {
                    w_frm.cmdDocs.cABMGridRow.setVisible(m_client.CanAddDocDigital);
                    w_frm.cmdNew.cABMGridRow.setVisible(m_client.CanNew);
                    w_frm.cmdCopy.cABMGridRow.setVisible(m_client.CanCopy);
                }

                pRefreshTitle();

                if (w_frm.Visible) {
                    w_frm.ZOrder;
                }
                else {
                    if (m_isDocument) {
                        if (m_isFooter) {
                            w_frm.Loading = false;
                            if (m_inModalWindow) {
                                if (!m_formShowed) {
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
                        if (m_inModalWindow) {
                            if (!m_formShowed) {
                                m_formShowed = true;
                                mouse = new cMouse();
                                mouse.MouseDefault;
                                if (getFrm(instanceOf fABM || getFrm() instanceOf fWizard)) {
                                    w_frm.ShowForm;
                                    pSetDontResize();
                                    w_frm.FirstResize;

                                    if (getFrm(instanceOf fWizard)) {
                                        CSKernelClient2.GetConfigForm(getFrm(), "ABM_"+ mUtil.gEmpNombre+ " - "+ m_client.Title);
                                    }
                                }
                                if (m_bSendAutoSave) {
                                    if (getFrm(instanceOf fABM)) {
                                        getFrm().SendAutoSave;
                                    }
                                }
                                if (getFrm(Is m_formABM)) {
                                    m_formABM.raiseAfterLoadEvent();
                                }
                                w_frm.Show(vbModal, m_owner);
                            }
                        }
                        else {
                            if (getFrm(instanceOf fABM || getFrm() instanceOf fWizard)) {
                                w_frm.ShowForm;
                                pSetDontResize();
                                w_frm.FirstResize;

                                if (getFrm(instanceOf fWizard)) {
                                    CSKernelClient2.GetConfigForm(getFrm(), "ABM_"+ mUtil.gEmpNombre+ " - "+ m_client.Title);
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

        private void setCIABMGeneric_HideTitle(boolean rhs) {
            m_hideTitle = rhs;
        }

        private void setCIABMGeneric_InModalWindow(boolean rhs) {
            m_inModalWindow = rhs;
        }

        private boolean getCIABMGeneric_InModalWindow() {
            return m_inModalWindow;
        }

        private void setCIABMGeneric_IsDocument(boolean rhs) {
            m_isDocument = rhs;
        }

        private void setCIABMGeneric_IsFooter(boolean rhs) {
            m_isFooter = rhs;
        }

        private void setCIABMGeneric_IsItems(boolean rhs) {
            m_isItems = rhs;
        }

        private void setCIABMGeneric_Left(float rhs) {
            getFrm().Left = rhs;
        }

        var getCIABMGeneric_Left() {
            return getFrm().Left;
        }

        private void setCIABMGeneric_ObjForm(Object rhs) {
            m_formDoc = rhs;

            initCtrlPosition();
            initVectorsPosition();
        }

        private Object getCIABMGeneric_ObjForm() {
            return getFrm();
        }

        private Object getCIABMGeneric_PicMain() {
            return getFrm().Image1;
        }

        // Implementacion de Interface
        private CSInterfacesABM.cIABMProperties getCIABMGeneric_Properties() {
            return m_properties;
        }

        private void cIABMGeneric_RefreshControls(Object noGrids) {

            if (m_unloading) { return; }

            cLockUpdateWindow lockwnd = null;
            lockwnd = new cLockUpdateWindow();
            lockwnd.lockW(getFrm().hWnd);

            showForm() -1, noGrids, false;



                CSButton.cButton cmdTab = null;
                cmdTab = getFrm().cbTab(m_currentTab);
                cmdTab.VirtualPush;

            }
        }

        private Object getCIABMGeneric_ShapeMain() {
            return getFrm().ShTab;
        }

        private boolean cIABMGeneric_Show(CSInterfacesABM.cIABMClient obj) {
            cMouseWait mouse = null;
            mouse = new cMouseWait();

            return show(obj, 0);
        }

        private void cIABMGeneric_ShowValue(CSInterfacesABM.cIABMProperty iProp) {
            String strTag = "";
            if (m_isDocument) {
                strTag = pGetStrTag(iProp);
            }
            showValue(iProp, , strTag);
        }

        private String pGetStrTag(cABMProperty oProp) { // TODO: Use of ByRef founded Private Function pGetStrTag(ByRef oProp As cABMProperty) As String
            String _rtn = "";

                if (oProp.getCtl() == null) { return _rtn; }
                Object w_ctl = oProp.getCtl();
                    _rtn = w_ctl.Tag.substring(1, w_ctl.Tag.length() - 1);
                // {end with: w_ctl}
            }
            return _rtn;
        }

        private CSInterfacesABM.cIABMTabs getCIABMGeneric_Tabs() {
            if (m_tabs == null) { m_tabs = new cABMTabs(); }
            return m_tabs;
        }

        private boolean cIABMGeneric_Terminate() {

        }

        private void setCIABMGeneric_Title2(String rhs) {
            m_title2 = rhs;
        }

        private void setCIABMGeneric_Top(float rhs) {
            getFrm().Top = rhs;
        }

        var getCIABMGeneric_Top() {
            return getFrm().Top;
        }

        private void m_FormABM_AbmKeyDown(int keyCode, int shift) {

                m_client.MessageEx(ABM_MSG.MSG_KEY_DOWN, keyCode);
            }
        }

        private void m_FormABM_AfterShowModal() {

                m_client.MessageEx(ABM_MSG.MSG_FORM_AFTER_SHOW_MODAL, null);
            }
        }

        private void m_FormABM_PopItemClick(int index) {

                m_client.MessageEx(ABM_MSG.MSG_POP_MENU_ITEM, index);
            }
        }

        private void m_FormABM_SetResizeGrid() {
            pSetDontResize();
        }

        private void m_FormABM_TabGetFirstCtrl(int index, Control ctrl) {
            ctrl = tabGetFirstCtrl(index);
        }

        private void m_FormDoc_CMDClick(int index) {
            changeProperty(cspButton, index, getFrm().CMD(index));
        }

        private void m_FormDoc_GRDblClick(int index, int rowIndex, int colIndex) {

            if (!m_isItems) { return; }

            if (m_implementsClientGrid) {
                cIABMClientGrid clientGrid = null;
                cIABMProperty iProperty = null;

                clientGrid = m_client;
                iProperty = getProperty(cspGrid, index, 0);
                clientGrid.DblClick(iProperty.Key, rowIndex, colIndex);
            }
        }

        private void m_FormDoc_HLKeyDown(int index, int keyCode, int shift) {
            cIABMProperty iProperty = null;
            iProperty = getProperty(cspHelp, index, 0);
            if (iProperty == null) { return; }

            if (keyCode == vbKeyF2) {
                m_client.MessageEx(ABM_MSG.MSG_ABM_KEY_F2, iProperty);
            }
            else if (keyCode == vbKeyF3) {
                m_client.MessageEx(ABM_MSG.MSG_ABM_KEY_F3, iProperty);
            }

        }

        private void m_FormWizard_GRDblClick(int index, int rowIndex, int colIndex) {
            if (m_implementsClientGrid) {
                cIABMClientGrid clientGrid = null;
                cIABMProperty iProperty = null;

                clientGrid = m_client;
                iProperty = getProperty(cspGrid, index, 0);
                clientGrid.DblClick(iProperty.Key, rowIndex, colIndex);
            }
        }

        private void m_FormWizard_TabGetFirstCtrl(int index, Control ctrl) {
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
                if (VBA.ex.Number) { / * *TODO:** resume found: Resume(ExitProc)* /  }
                / * *TODO:** label found: ExitProc:* /

            }
        }

        //------------
        // Abms
        //
        private void m_FormABM_CBChange(int index) {
            pCBChange(index);
        }

        //Private Sub m_FormABM_CBhockChange(ByVal Index As Integer)
        //  pCBHockChange Index
        //End Sub

        private void m_FormABM_cbTabClick(int index) {
            tabClick(index);
        }

        private void m_FormABM_CHKClick(int index) {
            pCHKClick(index);
        }

        private void m_FormABM_cmdCancelClick() {
            try {

                if (m_bOkCancelDialog) {
                    m_FormABM_cmdCloseClick();
                    m_bOkCancelDialogRslt = false;
                }
                else {

                    if (m_bSendRefresh) {
                        m_client.MessageEx(ABM_MSG.MSG_DOC_REFRESH, null);
                        pRefreshTitle();
                        setWasChanged(false);
                    }
                    else {
                        pDiscardChanges();
                    }
                }

                / * *TODO:** goto found: GoTo ExitProc* /
            } catch (Exception ex) {
                MngError(VBA.ex, "m_FormABM_cmdCancelClick", C_MODULE, "");
                if (VBA.ex.Number) { / * *TODO:** resume found: Resume(ExitProc)* /  }
                / * *TODO:** label found: ExitProc:* /

            }
        }

        private void m_FormABM_CMDClick(int index) {
            changeProperty(cspButton, index, getFrm().CMD(index));
        }

        private void m_FormABM_cmdCloseClick() {
            if (m_formABM == null) { return; }
            Unload(m_formABM);
        }

        private void m_FormABM_cmdCopyClick() {
            m_client.Copy;

                m_formABM.ZOrder;
                VBA.ex.Clear;
            }
        }

        private void m_FormABM_cmdDocsClick() {
            m_client.ShowDocDigital;
        }

        private void m_FormABM_cmdNewClick() {
            try {
                if (m_client.CanNew) {

                    doNew(m_formABM);

                // * TODO:** the error label ControlError: couldn't be found

                    m_formABM.ZOrder;
                    VBA.ex.Clear;
                }

                / * *TODO:** goto found: GoTo ExitProc* /
                / * *TODO:** label found: ControlError:* /
                MngError(VBA.ex, "m_FormABM_cmdNewClick", C_MODULE, "");
                if (VBA.ex.Number) { / * *TODO:** resume found: Resume(ExitProc)* /  }
                / * *TODO:** label found: ExitProc:* /

            }
        }

        private void doNew(Form frm) {
            cMouseWait mouse = null;
            mouse = new cMouseWait();

            cLockUpdateWindow lockwnd = null;

            // Solo en headers y en abm's
            if (m_isDocument) {
                if (m_isItems) { return; }
                if (m_isFooter) { return; }
            }

            if (!pSaveChanges(false, false)) { return; }

            // With frm;

                m_title2 = "";

                if (!m_isDocument && !m_bSendRefresh) {
                    pDiscardChanges(true);
                }

                lockwnd = new cLockUpdateWindow();
                lockwnd.lockW(frm.hWnd);

                m_client.EditNew;

                if (m_bSendRefresh) {
                    pRefreshTitle();
                }

                if (m_isDocument) {
                    if (!pNewWithWizard()) {
                        pMoveFocus();
                    }
                }

                setWasChanged(false);

                if (m_newKeyPropFocus != "") {
                    pSetFocusFromKeyProp(m_newKeyPropFocus);
                }
                else {

                    if (m_isDocument) {
                        if (!pNewWithWizard()) {
                            frm.SetFocusFirstControl;
                        }
                    }
                }
            // {end with: frm}
        }

        private void pMoveFocus() {
            Object c = null;

            if (m_formDoc != null) {

                    c = m_formDoc.ActiveControl;
                    m_formDoc.MEFE.cABMGridRow.item(0).SetFocus;
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

        private void m_FormABM_cmdPrintClick() {

                Object rtnVar = null;

                rtnVar = m_client.MessageEx(ABM_MSG.MSG_ABM_PRINT, null);
                if (VarType(rtnVar) != vbBoolean) {
                    MsgInfo("Esta interfaz no posee impresión");
                }
            }
        }

        private void pSetABMCanPrint() {

                Object rtnVar = null;

                rtnVar = m_client.MessageEx(ABM_MSG.MSG_ABM_CAN_PRINT, null);
                if (mUtil.val(rtnVar) != ABM_MSG.MSG_ABM_CAN_PRINT) {
                    getFrm().cmdPrint.cABMGridRow.setVisible(false);
                }
                else {
                    getFrm().cmdPrint.cABMGridRow.setVisible(true);
                }
            }
        }

        private void m_FormABM_cmdPermisosClick() {

                Object rtnVar = null;

                rtnVar = m_client.MessageEx(ABM_MSG.MSG_EDIT_PERMISOS, null);
                if (VarType(rtnVar) != vbBoolean) {
                    MsgInfo("Esta interfaz no permite editar permisos");
                }
            }
        }

        private void pSetABMShowPermisos() {

                Object rtnVar = null;

                rtnVar = m_client.MessageEx(ABM_MSG.MSG_SHOW_EDIT_PERMISOS, null);
                if (mUtil.val(rtnVar) != ABM_MSG.MSG_SHOW_EDIT_PERMISOS) {
                    getFrm().cmdPermisos.cABMGridRow.setVisible(false);
                }
                else {
                    getFrm().cmdPermisos.cABMGridRow.setVisible(true);
                }
            }
        }

        private void pShowHelp() {

                Object rtnVar = null;

                rtnVar = m_client.MessageEx(ABM_MSG.MSG_DOC_INFO, null);

                if (VarType(rtnVar) != vbBoolean) {
                    if (G.isNumeric(rtnVar)) {
                        if (mUtil.val(rtnVar) != ABM_MSG.MSG_DOC_INFO_HANDLED) {
                            pShowHelpAux();
                        }
                    }
                    else {
                        pShowHelpAux();
                    }
                }
                else {
                    pShowHelpAux();
                }
            }
        }

        private void pShowHelpAux() {

                CSKernelClient2.EditFile(CSKernelClient2.GetValidPath(mUtil.gAppPath)+ "cairo.chm", getHWnd());
            }
        }

        private void m_FormABM_cmdSaveClick() {
            if (!pSave(false, false)) { return; }

            if (m_bOkCancelDialog) {
                m_bOkCancelDialogRslt = true;

                if (m_formABM != null) {
                    m_formABM.setSaved();
                    m_FormABM_cmdCloseClick();
                }

            }
            else {

                if (m_sendNewABM) {
                    m_FormABM_cmdNewClick();
                }
            }
        }

        private void m_FormABM_FormLoad() {
            pResetChanged();
        }

        private void m_FormABM_FormQueryUnload(int cancel, int unloadMode) {
            if (m_client != null) {
                pSaveChanges(cancel, true);
            }
        }

        private void m_FormABM_FormUnload(int cancel) {
            if (m_client != null) {

                saveColumnsGrids();

                mUtil.destroyGrids(getFrm());

                m_unloading = true;

                m_client.Terminate;
                m_client = null;
            }
            m_formABM = null;
        }

        private boolean pSaveChanges(int cancel, boolean bUnloading) { // TODO: Use of ByRef founded Private Function pSaveChanges(ByRef Cancel As Integer, ByVal bUnloading As Boolean) As Boolean
            boolean _rtn = false;
            if (m_isDocument) {
                if (m_isFooter || m_isItems) {
                    _rtn = true;
                    return _rtn;
                }
            }

            if (getWasChanged() && !m_bDontAskForSave) {
                VbMsgBoxResult rslt = null;

                getFrm().ZOrder;
                rslt = MsgBox("Ud. ha realizado cambios que no ha guardado."+ "\\r\\n"+ "\\r\\n"+ "¿Desea guardarlos?", vbQuestion + vbYesNoCancel, "Guardar");

                if (rslt == vbYes) {

                    if (!pSave(bUnloading, false)) {
                        cancel = true;
                        return _rtn;
                    }
                    setWasChanged(false);

                }
                else if (rslt == vbNo) {
                    setWasChanged(false);

                }
                else if (rslt == vbCancel) {
                    cancel = true;
                    return _rtn;
                }
            }

            _rtn = true;
            return _rtn;
        }

        private void m_FormABM_GRColumnAfterEdit(int index, int lRow, int lCol, Object newValue, int newValueID, boolean bCancel) {
            pGRColumnEdit(true, index, lRow, lCol, 0, newValue, newValueID, bCancel);
        }

        private void m_FormABM_GRColumnAfterUpdate(int index, int lRow, int lCol, Object newValue, int newValueID) {
            pGRColumnAfterUpdate(index, lRow, lCol, 0, newValue, newValueID);
        }

        private void m_FormABM_GRColumnBeforeEdit(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
            pGRColumnEdit(false, index, lRow, lCol, iKeyAscii, 0, 0, bCancel);
        }

        private void m_FormABM_GRColumnButtonClick(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
            pGRColumnButtonClick(index, lRow, lCol, iKeyAscii, bCancel);
        }

        private void m_FormABM_GRDblClick(int index, int rowIndex, int colIndex) {
            if (m_implementsClientGrid) {
                cIABMClientGrid clientGrid = null;
                cIABMProperty iProperty = null;

                clientGrid = m_client;
                iProperty = getProperty(cspGrid, index, 0);
                clientGrid.DblClick(iProperty.Key, rowIndex, colIndex);
            }
        }

        private void m_FormABM_GRDeleteRow(int index, int lRow, boolean bCancel) {
            pGRDeleteRow(index, lRow, bCancel);
        }

        private void m_FormABM_GRNewRow(int index, int rowIndex) {
            pGRNewRow(index, rowIndex);
        }

        private void m_FormABM_GRRowWasDeleted(int index, int rowIndex) {
            pGRRowWasDeleted(index, rowIndex);
        }

        private void m_FormABM_GRSelectionChange(int index, int lRow, int lCol) {
            pGRSelectionChange(index, lRow, lCol, GridSelectChangeType.GRID_SELECTION_CHANGE);
        }

        private void m_FormABM_GRSelectionRowChange(int index, int lRow, int lCol) {
            pGRSelectionChange(index, lRow, lCol, GridSelectChangeType.GRID_ROW_CHANGE);
        }

        private void m_FormABM_GRValidateRow(int index, int rowIndex, boolean bCancel) {
            pGRValidateRow(index, rowIndex, bCancel, true, false);
        }

        private void m_FormABM_HLChange(int index) {
            pHLChange(index);
        }

        private void m_FormABM_MEChange(int index) {
            pMEChange(index);
        }

        private void m_FormABM_MEDateChange(int index) {
            pMEDateChange(index);
        }

        private void m_FormABM_OPClick(int index) {
            pOPClick(index);
        }

        private void m_FormABM_ShowHelp() {
            pShowHelp();
        }

        private void m_FormABM_ToolBarButtonClick(MSComctlLib.Button button) {
            pToolBarButtonClik(button);
        }

        private void m_FormABM_TXButtonClick(int index, boolean cancel) {
            pTXButtonClick(index, cancel);
        }

        private void m_FormABM_TXChange(int index) {
            pTXChange(index);
        }

        private void m_FormABM_TXMChange(int index) {
            pTXMChange(index);
        }

        private void m_FormABM_TXPasswordChange(int index) {
            pTXPasswordChange(index);
        }

        private void m_FormDoc_cbTabClick(int index, String tag) {
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
        private void m_FormDoc_TabGetFirstCtrl(int index, String tag, Control ctrl) { // TODO: Use of ByRef founded Private Sub m_FormDoc_TabGetFirstCtrl(ByVal Index As Integer, ByVal Tag As String, ByRef ctrl As Control)
            Control ctrlAux = null;
            ctrlAux = docTabGetFirstCtrl(index, tag);
            if (ctrlAux != null) {
                ctrl = ctrlAux;
            }
        }

        private void m_FormDoc_FormLoad() {
            pResetChanged();
        }

        private void m_FormDoc_GRRowWasDeleted(int index, int rowIndex) {
            pGRRowWasDeleted(index, rowIndex);
        }

        private void m_FormDoc_ToolBarClick(MSComctlLib.Button button) {
            try {

                if (m_isItems) { return; }
                if (m_isFooter) { return; }

                if (button == null) { return; }

                switch (button.Key) {
                    case  c_KeyTbNew:

                        pToolBarClickNew();

                        if (m_sendNewDoc) {

                            // El comportamiento generico es poner el foco
                            // en segunda columna de la grilla
                            //
                            if (m_setFocusFirstCtrlInNew) {

                                // Nada que hacer

                            }
                            else {

                                SetFocusControl(m_formDoc.GR(0));
                                mUtil.sendKeys("{ENTER}");
                            }

                        }

                        m_client.MessageEx(ABM_MSG.MSG_DOC_NEW_EVENT_COMPLETE, null);

                        break;
                    case  c_KeyTbSave:

                        pShowMsg("Guardando el comprobante ...");

                        if (pSave(false, false)) {

                            if (m_sendNewDoc) {

                                pToolBarClickNew();

                                // El comportamiento generico es poner el foco
                                // en segunda columna de la grilla
                                //
                                if (m_setFocusFirstCtrlInNew) {

                                    // Nada que hacer

                                }
                                else {

                                    SetFocusControl(m_formDoc.GR(0));
                                    mUtil.sendKeys("{ENTER}");
                                }

                            }

                        }

                        pHideMsg();

                        break;
                    case  c_KeyTbSaveAs:

                        pShowMsg("Guardando el comprobante ...");

                        m_bSavingAs = true;

                        if (pSave(false, true)) {

                            if (m_sendNewDoc) {

                                pToolBarClickNew();

                                // El comportamiento generico es poner el foco
                                // en segunda columna de la grilla
                                //
                                if (m_setFocusFirstCtrlInNew) {

                                    // Nada que hacer

                                }
                                else {

                                    SetFocusControl(m_formDoc.GR(0));
                                    mUtil.sendKeys("{ENTER}");
                                }

                            }

                        }

                        m_bSavingAs = false;

                        pHideMsg();

                        break;
                    case  c_KeyTbAnular:

                        pShowMsg("Anulando el comprobante ...");
                        m_client.MessageEx(ABM_MSG.MSG_DOC_ANULAR, null);
                        pHideMsg();

                        break;
                    case  c_KeyTbReload:

                        pReloadDocument();

                        break;
                    case  c_KeyTbCopy:

                        m_FormABM_cmdCopyClick();

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

                        pShowMsg("Borrando el comprobante ...");
                        if (pAskDelete("Confirma que desea borrar el comprobante")) {
                            if (mMsgConstantes.varToBool(m_client.MessageEx(ABM_MSG.MSG_DOC_DELETE, null))) {
                                pResetChanged();
                            }
                        }
                        pHideMsg();

                        break;
                    case  c_KeyTbSearch:

                        m_client.MessageEx(ABM_MSG.MSG_DOC_SEARCH, getWasChanged());

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

                        pShowMsg("Cargando las aplicaciones del comprobante ...");
                        m_client.MessageEx(ABM_MSG.MSG_DOC_APPLY, null);
                        pHideMsg();

                        break;
                    case  c_KeyTbAttach:
                        m_FormABM_cmdDocsClick();

                        break;
                    case  c_KeyTbHistory:
                        m_client.MessageEx(ABM_MSG.MSG_DOC_HISTORY, null);

                        break;
                    case  c_KeyTbFirst:

                        pShowMsg("Cargando el primer comprobante ...");
                        pMove(ABM_MSG.MSG_DOC_FIRST);
                        pHideMsg();

                        break;
                    case  c_KeyTbPrevious:

                        pShowMsg("Cargando el comprobante anterior ...");
                        pMove(ABM_MSG.MSG_DOC_PREVIOUS);
                        pHideMsg();

                        break;
                    case  c_KeyTbNext:

                        pShowMsg("Cargando el siguiente comprobante ...");
                        pMove(ABM_MSG.MSG_DOC_NEXT);
                        pHideMsg();

                        break;
                    case  c_KeyTbLast:

                        pShowMsg("Cargando el último comprobante ...");
                        pMove(ABM_MSG.MSG_DOC_LAST);
                        pHideMsg();

                        break;
                    case  c_KeyTbHelp:
                        pShowHelp();

                        break;
                    case  c_KeyTbDocMerge:
                        pShowMsg("Ejecutando el proceso de compensación ...");
                        m_client.MessageEx(ABM_MSG.MSG_DOC_MERGE, null);
                        pHideMsg();

                        break;
                    case  c_KeyTbDocAlert:
                        pShowMsg("Cargando alertas para este comprobante...");
                        m_client.MessageEx(ABM_MSG.MSG_DOC_ALERT, null);
                        pHideMsg();

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
                MngError(VBA.ex, "m_FormDoc_ToolBarClick", C_MODULE, "");
                if (VBA.ex.Number) { / * *TODO:** resume found: Resume(ExitProc)* /  }
                / * *TODO:** label found: ExitProc:* /

                pHideMsg();
                m_bSavingAs = false;

            }
        }

        public void raiseNewDocEven() {

            pToolBarClickNew();

            if (m_sendNewDoc) {

                // El comportamiento generico es poner el foco
                // en segunda columna de la grilla
                //
                if (m_setFocusFirstCtrlInNew) {

                    // Nada que hacer

                }
                else {

                    SetFocusControl(m_formDoc.GR(0));
                    mUtil.sendKeys("{ENTER}");
                }

            }

        }

        public void setFocusInGridForDocs() {

            SetFocusControl(m_formDoc.GR(0));
            mUtil.sendKeys("{ENTER}");

        }

        // Actualiza la coleccion rows del objeto grid de iProp
        // con los valores select del objeto row de la coleccion
        // rows del control cGrid.
        //
        // Siempre hay al menos una fila seleccionada ya que la
        // que tiene el foco esta siempre seleccionada
        //
        public void refreshSelectedInGrid(cIABMProperty iProp) { // TODO: Use of ByRef founded Public Sub RefreshSelectedInGrid(ByRef iProp As cIABMProperty)
            m_mngGrid.refreshSelectedInGrid(iProp);
        }

        // Solo acepta filas seleccionadas si el foco esta en la primera
        // columna
        //
        // Esto es para diferenciar entre una fila seleccionada explicitamente
        // de una fila seleccionada por que el foco esta en ella
        //
        public void refreshSelectedInGrid2(cIABMProperty iProp) { // TODO: Use of ByRef founded Public Sub RefreshSelectedInGrid2(ByRef iProp As cIABMProperty)
            m_mngGrid.refreshSelectedInGrid2(iProp);
        }

        private void pToolBarClickNew() {
            pShowMsg("Cargando nuevo comprobante ...");
            doNew(m_formDoc);
            pHideMsg();
        }

        private void pShowMsg(String msg, boolean changeTop) {

                Object w_frm = getFrm();
                    w_frm.picMsg.cABMProperty.setLeft((w_frm.ScaleWidth - w_frm.picMsg.cABMProperty.getWidth()) * 0.5);
                    if (changeTop) {
                        w_frm.picMsg.cABMProperty.setTop((w_frm.ScaleHeight - w_frm.picMsg.cABMProperty.getHeight()) * 0.25);
                    }
                    w_frm.lbMsg.cABMDocPropertiesCol.setCaption(msg);
                    w_frm.picMsg.ZOrder;
                    w_frm.picMsg.cABMGridRow.setVisible(true);
                    DoEvents;
                // {end with: w_frm}
            }
        }

        private void pHideMsg() {

                getFrm().picMsg.cABMGridRow.setVisible(false);
            }
        }

        private void pMove(ABM_MSG moveTo) {
            if (m_client != null) {

                if (!pSaveChanges(false, false)) { return; }

                m_client.MessageEx(moveTo, null);

                if (m_isDocument) {

                    pMoveFocus();
                }

                setWasChanged(false);

            }
        }

        //------------
        // Wizard
        private void m_FormWizard_CBChange(int index) {
            pCBChange(index);
        }

        //Private Sub m_FormWizard_CBhockChange(ByVal Index As Integer)
        //  pCBHockChange Index
        //End Sub

        private void m_FormWizard_cbTabClick(int index) {
            tabClick(index);
        }

        private void m_FormWizard_CHKClick(int index) {
            pCHKClick(index);
        }

        private void m_FormWizard_cmdCancelClick() {

                if (m_inProcess) { return; }
                pWizDisableButtons();
                if (!m_client.PropertyChange(K_W_CANCEL)) {
                    pWizEnableButtons();
                    return;
                }

                pWizEnableButtons();
                setWasChanged(false);
                Unload(m_formWizard);
                VBA.ex.Clear;
            }
        }

        private void m_FormWizard_cmdBackClick() {

                if (m_inProcess) { return; }
                pWizDisableButtons();
                moveBack();
                pWizEnableButtons();
                VBA.ex.Clear;
            }
        }

        private void m_FormWizard_CMDClick(int index) {
            changeProperty(cspButton, index, getFrm().CMD(index));
        }

        private void m_FormWizard_cmdNextClick() {

                if (m_inProcess) { return; }
                pWizDisableButtons();
                moveNext();
                pWizEnableButtons();
                VBA.ex.Clear;
            }
        }

        private void m_FormWizard_FormLoad() {
            pResetChanged();
        }

        private void m_FormWizard_FormQueryUnload(int cancel, int unloadMode) {
            if (m_client != null) {
                pSaveChanges(cancel, true);
            }
        }

        private void m_FormWizard_FormUnload(int cancel) {
            if (m_client != null) {

                saveColumnsGrids();

                mUtil.destroyGrids(getFrm());

                m_unloading = true;

                m_client.Terminate;
                m_client = null;
            }
            m_formWizard = null;
        }

        private void m_FormWizard_GRColumnAfterEdit(int index, int lRow, int lCol, Object newValue, int newValueID, boolean bCancel) {
            pGRColumnEdit(true, index, lRow, lCol, 0, newValue, newValueID, bCancel);
        }

        private void m_FormWizard_GRColumnAfterUpdate(int index, int lRow, int lCol, Object newValue, int newValueID) {
            pGRColumnAfterUpdate(index, lRow, lCol, 0, newValue, newValueID);
        }

        private void m_FormWizard_GRColumnBeforeEdit(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
            pGRColumnEdit(false, index, lRow, lCol, iKeyAscii, 0, 0, bCancel);
        }

        private void m_FormWizard_GRColumnButtonClick(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
            pGRColumnButtonClick(index, lRow, lCol, iKeyAscii, bCancel);
        }

        //Private Sub m_FormWizard_GRDblClick(ByVal Index As Integer, ByVal RowIndex As Long, ByVal ColIndex As Long)
        // Ya veremos que hacemos
        //End Sub

        private void m_FormWizard_GRDeleteRow(int index, int lRow, boolean bCancel) {
            pGRDeleteRow(index, lRow, bCancel);
        }

        private void m_FormWizard_GRNewRow(int index, int rowIndex) {
            pGRNewRow(index, rowIndex);
        }

        private void m_FormWizard_GRRowWasDeleted(int index, int rowIndex) {
            pGRRowWasDeleted(index, rowIndex);
        }

        private void m_FormWizard_GRSelectionChange(int index, int lRow, int lCol) {
            pGRSelectionChange(index, lRow, lCol, GridSelectChangeType.GRID_SELECTION_CHANGE);
        }

        private void m_FormWizard_GRSelectionRowChange(int index, int lRow, int lCol) {
            pGRSelectionChange(index, lRow, lCol, GridSelectChangeType.GRID_ROW_CHANGE);
        }

        private void m_FormWizard_GRValidateRow(int index, int rowIndex, boolean bCancel) {
            pGRValidateRow(index, rowIndex, bCancel, true, false);
        }

        private void m_FormWizard_HLChange(int index) {
            pHLChange(index);
        }

        private void m_FormWizard_MEChange(int index) {
            pMEChange(index);
        }

        private void m_FormWizard_MEDateChange(int index) {
            pMEDateChange(index);
        }

        private void m_FormWizard_OPClick(int index) {
            pOPClick(index);
        }

        private void m_FormWizard_ToolBarButtonClick(MSComctlLib.Button button) {
            pToolBarButtonClik(button);
        }

        private void m_FormWizard_TXChange(int index) {
            try {

                pTXChange(index);

                return;
            } catch (Exception ex) {
                MngError(VBA.ex, "m_FormWizard_TXChange", C_MODULE, "");
            }
        }

        private void m_FormWizard_TXMChange(int index) {
            try {

                pTXMChange(index);

                return;
            } catch (Exception ex) {
                MngError(VBA.ex, "m_FormWizard_TXMChange", C_MODULE, "");
            }
        }

        private void m_FormWizard_TXPasswordChange(int index) {
            pTXPasswordChange(index);
        }

        //------------
        // Documentos
        private void m_FormDoc_CBChange(int index) {
            pCBChange(index);
        }

        private void m_FormDoc_CHKClick(int index) {
            pCHKClick(index);
        }

        private void pFormDocClose() {
            if (m_formDoc == null) { return; }
            Unload(m_formDoc);
        }

        private void m_FormDoc_FormQueryUnload(int cancel, int unloadMode) {
            if (m_isFooter || m_isItems) { return; }

            if (m_client != null) {

                Object w_frm = getFrm();

                    w_frm.CancelUnload = false;
                    if (!pSaveChanges(cancel, true)) {
                        w_frm.CancelUnload = true;
                    }
                // {end with: w_frm}
            }
        }

        private void m_FormDoc_FormUnload(int cancel) {

            getFrm().UnloadCount = getFrm().UnloadCount + 1;

            Object w_frm = getFrm();

                if (m_isFooter || m_isItems) {

                    // Solo si el usuario no desidio cancelar el cierre del form
                    if (w_frm.CancelUnload) { return; }

                    saveColumnsGrids();
                    m_unloading = true;

                    m_client = null;

                }
                else {

                    if (m_client != null) {

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
                if (getFrm().UnloadCount == 3) { mUtil.destroyGrids(getFrm()); }

                m_formDoc = null;
            // {end with: w_frm}
        }

        private void m_FormDoc_GRColumnButtonClick(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
            pGRColumnButtonClick(index, lRow, lCol, iKeyAscii, bCancel);
        }

        private void m_FormDoc_GRColumnAfterEdit(int index, int lRow, int lCol, Object newValue, int newValueID, boolean bCancel) {
            pGRColumnEdit(true, index, lRow, lCol, 0, newValue, newValueID, bCancel);
        }

        private void m_FormDoc_GRColumnAfterUpdate(int index, int lRow, int lCol, Object newValue, int newValueID) {
            pGRColumnAfterUpdate(index, lRow, lCol, 0, newValue, newValueID);
        }

        private void m_FormDoc_GRColumnBeforeEdit(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
            pGRColumnBeforeEdit(index, lRow, lCol, iKeyAscii, bCancel);
            if (bCancel) { return; }
            pGRColumnEdit(false, index, lRow, lCol, iKeyAscii, 0, 0, bCancel);
        }

        private void m_FormDoc_GRDeleteRow(int index, int lRow, boolean bCancel) {
            pGRDeleteRow(index, lRow, bCancel);
        }

        private void m_FormDoc_GRNewRow(int index, int rowIndex) {
            pGRNewRow(index, rowIndex);
        }

        private void m_FormDoc_GRValidateRow(int index, int rowIndex, boolean bCancel) {
            pGRValidateRow(index, rowIndex, bCancel, true, false);
        }

        private void m_FormDoc_GRSelectionChange(int index, int lRow, int lCol) {
            pGRSelectionChange(index, lRow, lCol, GridSelectChangeType.GRID_SELECTION_CHANGE);
        }

        private void m_FormDoc_GRSelectionRowChange(int index, int lRow, int lCol) {
            pGRSelectionChange(index, lRow, lCol, GridSelectChangeType.GRID_ROW_CHANGE);
        }

        private void m_FormDoc_HLChange(int index) {
            pHLChange(index);
        }

        private void m_FormDoc_MEChange(int index) {
            pMEChange(index);
        }

        private void m_FormDoc_MEDateChange(int index) {
            pMEDateChange(index);
        }

        private void m_FormDoc_OPClick(int index) {
            pOPClick(index);
        }

        private void m_FormDoc_TXChange(int index) {
            pTXChange(index);
        }

        private void m_FormDoc_TXMChange(int index) {
            pTXMChange(index);
        }

        private void m_FormDoc_TXPasswordChange(int index) {
            pTXPasswordChange(index);
        }

        // funciones del objeto
        private void pCBChange(int index) {
            changeProperty(cspList, index, getFrm().CB(index));
            //ReLoadListAdHock
        }

        private void pCHKClick(int index) {
            changeProperty(cspCheck, index, getFrm().CHK(index));
            //ReLoadListAdHock
        }

        private void pGRDeleteRow(int index, int lRow, boolean bCancel) {
            if (!m_implementsClientGrid) { return; }

            cABMProperty oProperty = null;
            oProperty = getProperty(cspGrid, index, 0);

            if (oProperty == null) { return; }

            cIABMClientGrid clientGrid = null;
            clientGrid = m_client;

            if (clientGrid.DeleteRow(pGetPropertyKey(oProperty), pCreateRow(index, oProperty, lRow), lRow)) {
                cIABMProperty iProperty = null;
                iProperty = oProperty;
                iProperty.Grid.cABMCSGrid.getRows().Remove(lRow);
                bCancel = false;
                m_client.MessageEx(ABM_MSG.MSG_GRID_ROW_DELETED, iProperty.Key);


                    Object grid = null;
                    grid = getFrm().GR(oProperty.getIndex());
                    if (grid.Rows <= 1) {
                        grid.Rows = 2;
                    }
                }
                else {
                    bCancel = true;
                }
            }
        }

        private void pGRRowWasDeleted(int index, int lRow) {
            cIABMProperty iProperty = null;
            iProperty = getProperty(cspGrid, index, 0);

            pRefreshRowsIndex(iProperty, lRow);


                Object grid = null;
                grid = getFrm().GR(index);
                if (grid.Rows < 1) {
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
                if (lRow <= grid.Rows) {
                    grid.Cell(lRow, 1).Text == lRow;
                }

            } catch (Exception ex) {
            }
        }

        private void pSetRowBackground(int index, cIABMProperty iProperty, int lRow, int lCol) { // TODO: Use of ByRef founded Private Sub pSetRowBackground(ByVal Index As Long, ByRef iProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long)
            try {

                cGridAdvanced grid = null;
                grid = getFrm().GR(index);

                if (iProperty.Grid.cABMDocProperties.getColumns(lCol).PropertyType == cspGrid) {
                    grid.SelectRow(lRow);
                }
                else {
                    grid.UnSelectRow;
                }
            } catch (Exception ex) {
            }
        }

        private void pGRSelectionChange(int index, int lRow, int lCol, csEGridSelectChangeType what) {

            cIABMProperty iProperty = null;
            iProperty = getProperty(cspGrid, index, 0);

            if (iProperty != null) {
                iProperty.SelectedIndex = lRow;

                if (what == GridSelectChangeType.GRID_SELECTION_CHANGE) {

                    pSetRowBackground(index, iProperty, lRow, lCol);

                }
                else if (what == GridSelectChangeType.GRID_ROW_CHANGE) {

                    if (m_client == null) { return; }
                    m_client.MessageEx(ABM_MSG.MSG_GRID_ROW_CHANGE, iProperty);
                }
            }
        }

        private void pGRNewRow(int index, int rowIndex) {
            if (m_implementsClientGrid) {

                cABMProperty oProperty = null;
                oProperty = getProperty(cspGrid, index, 0);

                if (oProperty != null) {

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
                if (!col.DefaultValue == null) {
                    // * TODO:** can't found type for with block
                    // * With iRow.Item(colIndex)
                    __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = iRow.Item(colIndex);
                        w___TYPE_NOT_FOUND.Id = col.DefaultValue.cABMCSGrid.getId();
                        w___TYPE_NOT_FOUND.Value = col.DefaultValue.Value;
                    // {end with: w___TYPE_NOT_FOUND}
                }
            }

            if (iRow == null) { return; }

            grid = getFrm().GR(oProperty.getIndex());
            getMngGrid().loadFromRow(grid, iRow, rowIndex, iProp.Grid.cABMDocProperties.getColumns());
        }

        private void pGRColumnAfterUpdate(int index, int lRow, int lCol, int iKeyAscii, Object newValue, int newValueID) {
            try {

                if (m_implementsClientGrid) {

                    cABMProperty oProperty = null;
                    cIABMProperty iProperty = null;

                    oProperty = getProperty(cspGrid, index, 0);

                    if (oProperty != null) {

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
                        if (!pProcessVirtualRow(oProperty, index, lRow, lCol, keyProp, clientGrid)) {

                            // Let client one chance to calculate columns
                            clientGrid.ColumnAfterUpdate(keyProp, lRow, lCol);

                            iProperty = oProperty;
                            pSetRowValueInGrid(index, oProperty, lRow, iProperty.Grid.cABMCSGrid.getRows(lRow));

                        }

                        if (pIsEditColumn(oProperty, lCol)) {

                            setWasChanged(true);

                        }
                    }
                }

                return;
            } catch (Exception ex) {
                MngError(VBA.ex, "pGRColumnAfterUpdate", C_MODULE, "");
            }
        }

        private boolean pIsEditColumn(cIABMProperty iProperty, int lCol) {
            cABMGridColumn oCol = null;
            oCol = iProperty.Grid.cABMDocProperties.getColumns(lCol);
            return oCol.getIsEditColumn();
        }

        private boolean pProcessVirtualRow(cABMProperty oProperty, int index, int lRow, int lCol, String keyProp, cIABMClientGrid clientGrid) { // TODO: Use of ByRef founded Private Function pProcessVirtualRow(ByRef oProperty As cABMProperty, ByVal Index As Integer, ByVal lRow As Long, ByVal lCol As Long, ByVal KeyProp As String, ByRef ClientGrid As cIABMClientGrid) As Boolean
            boolean _rtn = false;

            // Manejo de Filas Virtuales
            //
            int iAddRows = 0;
            int i = 0;
            int q = 0;
            cVirtualRowInfo vrInfo = null;
            vrInfo = new cVirtualRowInfo();

            if (pAddVirtualRows(pGetPropertyKey(oProperty), lRow, lCol, iAddRows, vrInfo)) {

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
                    pGRNewRow(index, i);
                    pCreateRowIfNotExists(oProperty, index, i);

                    if (i < iAddRows) {
                        pSetColumnValueInProperty(oProperty, index, i, lCol, vrInfo.getNewValue(q), mUtil.val(vrInfo.getNewId(q)));

                        clientGrid.ColumnAfterEdit(keyProp, i, lCol, vrInfo.getNewValue(q), mUtil.val(vrInfo.getNewId(q)));

                        // Let client one chance to calculate columns
                        clientGrid.ColumnAfterUpdate(keyProp, i, lCol);

                        if (lColAmount > 0) {
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
        private boolean pAddVirtualRows(String key, int lRow, int lCol, int iAddRows, cVirtualRowInfo vrInfo) { // TODO: Use of ByRef founded Private Function pAddVirtualRows(ByVal Key As String, ByVal lRow As Long, ByVal lCol As Long, ByRef iAddRows As Long, ByRef vrInfo As cVirtualRowInfo) As Boolean
            boolean _rtn = false;
            if (m_client == null) { return _rtn; }

            vrInfo.setKey(key);
            vrInfo.setLRow(lRow);
            vrInfo.setLCol(lCol);

            if (m_client.MessageEx(ABM_MSG.MSG_GRID_VIRTUAL_ROW, vrInfo)) {

                if (vrInfo.getBAddRows()) {

                    iAddRows = vrInfo.getIAddRows();
                    _rtn = true;

                }
            }

            return _rtn;
        }

        private void pGRColumnBeforeEdit(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) { // TODO: Use of ByRef founded Private Sub pGRColumnBeforeEdit(ByVal Index As Integer, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer, ByRef bCancel As Boolean)
            try {

                if (!m_implementsClientGrid) { return; }

                bCancel = false;

                cABMProperty oProperty = null;
                cIABMProperty iProperty = null;
                cGridAdvanced oGrid = null;
                cIABMGridColumn column = null;
                cGridColumn c = null;

                iProperty = getProperty(cspGrid, index, 0);

                if (iProperty == null) { return; }
                if (lRow > iProperty.Grid.cABMCSGrid.getRows().Count) { return; }

                oProperty = iProperty;

                oGrid = getFrm().GR(oProperty.getIndex());
                column = iProperty.Grid.cABMDocProperties.getColumns(lCol);
                c = oGrid.Columns(lCol);

                CSInterfacesABM.cIABMGridCellValue w_item = iProperty.Grid.cABMCSGrid.getRows().Item(lRow).cABMGridRow.item(lRow).Item(lCol);
                    if (w_item.Format == null) {

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

                            if (column.PropertyType == cspList) {
                                c.List = column.List;
                            }
                            else {
                                c.List = null;
                            }

                            if (column.SubType == cspPercent) {
                                if (column.Format == "") {
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

                        if (w_item.Format.PropertyType == cspList) {
                            c.List = w_item.Format.List;
                        }
                        else {
                            c.List = null;
                        }

                        if (w_item.Format.SubType == cspPercent) {
                            if (w_item.Format.Format == "") {
                                c.Format = "0.00 %";
                            }
                        }
                    }
                // {end with: w_item}

                return;
            } catch (Exception ex) {
                MngError(VBA.ex, "pGRColumnBeforeEdit", C_MODULE, "");
            }
        }

        private void pGRColumnEdit(boolean after, int index, int lRow, int lCol, int iKeyAscii, Object newValue, int newValueID, boolean bCancel) {
            try {

                if (m_implementsClientGrid) {

                    cABMProperty oProperty = null;
                    cIABMProperty iProperty = null;
                    int keyProp = 0;
                    cIABMClientGrid clientGrid = null;

                    oProperty = getProperty(cspGrid, index, 0);
                    bCancel = false;

                    if (oProperty != null) {

                        keyProp = pGetPropertyKey(oProperty);
                        clientGrid = m_client;

                        if (after) {

                            // If the row not exists we have to create it because the client need it to hold
                            // calculated data
                            pCreateRowIfNotExists(oProperty, index, lRow);

                            if (!clientGrid.ColumnAfterEdit(keyProp, lRow, lCol, newValue, newValueID)) {
                                bCancel = true;
                            }

                        }
                        else {

                            if (m_bCreateRowInBeforeEdit) {
                                // If the row not exists we have to create it because the client need it to hold
                                // calculated data
                                pCreateRowIfNotExists(oProperty, index, lRow);
                            }

                            if (!clientGrid.ColumnBeforeEdit(keyProp, lRow, lCol, iKeyAscii)) {
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
                MngError(VBA.ex, "pGRColumnEdit", C_MODULE, "");
            }
        }

        private void pGRColumnButtonClick(int index, int lRow, int lCol, int iKeyAscii, boolean bCancel) {
            try {

                if (m_implementsClientGrid) {

                    cABMProperty oProperty = null;
                    cIABMProperty iProperty = null;
                    int keyProp = 0;
                    cIABMClientGrid clientGrid = null;

                    oProperty = getProperty(cspGrid, index, 0);
                    bCancel = false;

                    if (oProperty != null) {

                        keyProp = pGetPropertyKey(oProperty);
                        clientGrid = m_client;


                        // If the row not exists we have to create it because the client need it to hold
                        // calculated data
                        pCreateRowIfNotExists(oProperty, index, lRow);

                        if (!clientGrid.ColumnButtonClick(keyProp, lRow, lCol, iKeyAscii)) {
                            bCancel = true;
                        }

                        iProperty = oProperty;

                        // Si se trata de una columna de tipo TextButtonEx
                        //
                        // * TODO:** can't found type for with block
                        // * With iProperty.Grid
                        __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = iProperty.Grid;
                            if (w___TYPE_NOT_FOUND.Columns(lCol).SubType == cspTextButtonEx) {
                                String rtn = "";
                                // * TODO:** can't found type for with block
                                // * With .cABMCSGrid.getRows().Item(lRow).cABMGridRow.item(lCol)
                                __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Rows.cABMGridRow.item(lRow).Item(lCol);
                                    rtn = w___TYPE_NOT_FOUND.Value;
                                    if (GetInputEx(rtn)) {
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

                        setWasChanged(true);

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
                MngError(VBA.ex, "pGRColumnEdit", C_MODULE, "");
            }
        }

        private void pCreateRowIfNotExists(cIABMProperty iProperty, int index, int lRow) { // TODO: Use of ByRef founded Private Sub pCreateRowIfNotExists(ByRef iProperty As cIABMProperty, ByVal Index As Integer, ByVal lRow As Long)
            cIABMGridRow row = null;

            int w_rows = iProperty.Grid.cABMCSGrid.getRows();
                row = w_rows.Item(lRow);
                if (row == null) {
                    row = pCreateRow(index, iProperty, lRow);
                    w_rows.Add(row);
                }
            // {end with: w_rows}
        }

        private int pGetColIndexFromKey(cIABMProperty iProperty, int lKey) {
            int _rtn = 0;
            if (lKey == -1) {
                _rtn = -1;
            }
            else {
                cIABMGridRow row = null;
                row = iProperty.Grid.cABMCSGrid.getRows().Item(1);
                if (row == null) {
                    return _rtn;
                }
                cIABMGridCellValue iCell = null;
                int i = 0;
                for (i = 1; i <= row.Count; i++) {
                    iCell = row.Item(i);
                    if (iCell.Key == lKey) {
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
                if (row == null) {
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

        private boolean pGRValidateRow(int index, int rowIndex, boolean bCancel, boolean bAddRow, boolean bIsEmpty) { // TODO: Use of ByRef founded Private Function pGRValidateRow(ByVal Index As Integer, ByVal RowIndex As Long, ByRef bCancel As Boolean, ByVal bAddRow As Boolean, ByRef bIsEmpty As Boolean) As Boolean
            boolean rtn = false;

            if (m_implementsClientGrid) {

                cIABMProperty iProperty = null;
                cABMProperty oProperty = null;

                oProperty = getProperty(cspGrid, index, 0);
                bCancel = false;

                if (oProperty != null) {

                    cIABMClientGrid clientGrid = null;
                    cIABMGridRow iRow = null;
                    cABMGridRow oRow = null;
                    String keyProp = "";

                    clientGrid = m_client;
                    keyProp = pGetPropertyKey(oProperty);

                    iRow = pCreateRow(index, oProperty, rowIndex);

                    if (clientGrid.IsEmptyRow(keyProp, iRow, rowIndex)) {
                        mUtil.sendKeys("{TAB}");
                        bCancel = true;
                        bIsEmpty = true;

                        // La fila esta vacia asi que es valida
                        rtn = true;

                        // Let Client one chance to validate and modify row values
                    }
                    else if (!clientGrid.ValidateRow(keyProp, iRow, rowIndex)) {
                        bCancel = true;

                        // El cliente no valido la fila
                        rtn = false;
                    }
                    else {

                        // La fila es valida
                        rtn = true;

                        // Put Client's values to Grid
                        pSetRowValueInGrid(index, oProperty, rowIndex, iRow);

                        if (bAddRow) {

                            // Keep updated the rows collection
                            iProperty = oProperty;

                            cABMGridRows oRows = null;

                            oRows = iProperty.Grid.cABMCSGrid.getRows();

                            // With oRows;

                                oRows.remove(rowIndex, false);

                                oRow = iRow;
                                oRow.setIndex(rowIndex);

                                oRows.add(iRow);

                                if (!iRow.Item(c_keyRowItem) == null) {
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

        private void pHLChange(int index) {
            changeProperty(cspHelp, index, getFrm().HL(index));
            //ReLoadListAdHock
        }

        private void pMEChange(int index) {
            changeProperty(cspNumeric, index, getFrm().ME(index));
            //ReLoadListAdHock
        }

        private void pMEDateChange(int index) {
            cMaskEdit c = null;

            c = getFrm().MEFE(index);

            if (c.csType == csMkTime) {
                changeProperty(cspTime, index, c);
            }
            else {
                changeProperty(cspDate, index, c);
            }

            //ReLoadListAdHock
        }

        private void pOPClick(int index) {
            changeProperty(cspOption, index, getFrm().OP(index));
            //ReLoadListAdHock
        }

        private void pTXButtonClick(int index, boolean cancel) {
            cIABMProperty iProp = null;

            iProp = getProperty(cspText, index, 0);

            if (iProp == null) { return; }

            m_client.MessageEx(ABM_MSG.MSG_BUTTON_TEXT_CLICK, iProp);

            if (iProp.SubType == cspTextButtonEx) {
                String rtn = "";
                // * TODO:** can't found type for with block
                // * With getFrm().TX(index)
                __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = getFrm().TX(index);
                    rtn = w___TYPE_NOT_FOUND.Text;
                    if (GetInputEx(rtn)) {
                        w___TYPE_NOT_FOUND.Text = rtn;
                    }
                // {end with: w___TYPE_NOT_FOUND}
            }

        }

        private void pToolBarButtonClik(MSComctlLib.Button button) {
            changeProperty(cspToolBar, 0, button);
        }

        private void pTXChange(int index) {
            changeProperty(cspText, index, getFrm().TX(index));
            //ReLoadListAdHock
        }

        private void pTXMChange(int index) {
            changeProperty(cspText, index, getFrm().TXM(index), false, cspMemo);
            //ReLoadListAdHock
        }

        private void pTXPasswordChange(int index) {
            changeProperty(cspPassword, index, getFrm().txPassword(index));
            //ReLoadListAdHock
        }

        private int pGetPropertyKey(cABMProperty oProperty) {
            cIABMProperty iProperty = null;
            iProperty = oProperty;
            return iProperty.Key;
        }

        private String pGetKeyFromRowValue(cIABMGridRows rows, int rowIndex, int iCol) {

            if (rows.Count < rowIndex) { return ""; }
            if (rows.Item(rowIndex).cABMDocPropertiesCols.count() < iCol) { return ""; }

            cABMGridRowValue rowValue = null;
            rowValue = rows.Item(rowIndex).cABMGridRow.item(iCol);
            if (rowValue == null) { return ""; }
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
                if (colIndex == 1) {
                    cell = row.Add(null, c_keyRowItem);
                }
                else {
                    sKey = pGetKeyFromRowValue(iProperty.Grid.cABMCSGrid.getRows(), rowIndex, colIndex);
                    if (LenB(sKey)) {
                        cell = row.Add(null, sKey);
                    }
                    else {
                        cell = row.Add(null);
                    }
                }

                // With getFrm().GR(index).cell(rowIndex, colIndex);
                    cell.Id = getFrm().GR.ItemData;
                    oCell = cell;
                    oCell.setHelpValueProcess(getFrm().GR.Tag);

                    if (col.PropertyType == cspDate) {
                        cell.Value = mUtil.getDateValueForGridClient(getFrm().GR.Text);

                    }
                    else if (col.SubType == cspPercent) {
                        cell.Value = mUtil.val(getFrm().GR.Text) * 100;

                    }
                    else {
                        cell.Value = getFrm().GR.Text;
                    }

                    cell.Key = col.Key;
                // {end with: getFrm().GR}
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

            oGrid = getFrm().GR(index);

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
                    oGrid.CellItemdata(rowIndex, colIndex) == cell.Id;

                    if (col.PropertyType == cspDate) {
                        w___TYPE_NOT_FOUND.Text = mUtil.getDateValueForGrid(cell.Value);

                    }
                    else if (col.SubType == cspPercent) {
                        w___TYPE_NOT_FOUND.Text = mUtil.val(cell.Value) / 100;

                    }
                    else {
                        w___TYPE_NOT_FOUND.Text = cell.Value;
                    }

                    // Formato de cada celda
                    //
                    iFormat = cell.Format;
                    if (iFormat != null) {

                        oFormat = cell.Format;

                        if (!iFormat.Enabled || !col.Enabled) {
                            w___TYPE_NOT_FOUND.BackColor = vbButtonFace;
                            oFormat.setBold(true);
                        }
                        else {
                            w___TYPE_NOT_FOUND.BackColor = iFormat.BackColor;
                        }

                        w___TYPE_NOT_FOUND.ForeColor = iFormat.Color;

                        w___TYPE_NOT_FOUND.TextAlign = oFormat.getAlign();
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

                        if (!col.Enabled && !m_bNoChangeBackColorCell) {
                            w___TYPE_NOT_FOUND.BackColor = vbButtonFace;
                        }

                    }

                // {end with: w___TYPE_NOT_FOUND}
            }

        }

        private boolean showForm(int tabIndex, boolean noGrids, boolean bSetFocus) {
            cABMProperty oProperty = null;
            cIABMProperties iProperties = null;
            cIABMProperty iProperty = null;
            int tabs = 0;
            int count = 0;

            iProperties = m_properties;
            m_labelLeft = C_OFFSET_H;

            for (int _i = 0; _i < iProperties.size(); _i++) {
                iProperty = iProperties.getItem(_i);
                if (pGetTabIndex(iProperty) > tabs) { tabs = pGetTabIndex(iProperty); }
            }

            showTabs(tabs);

            m_showingForm = true;
            m_tabIndex = 0;

            for (int _i = 0; _i < iProperties.size(); _i++) {
                oProperty = iProperties.getItem(_i);
                loadControlEx(oProperty, noGrids);
            }

            m_showingForm = false;

            Object w_frm = getFrm();

                count = w_frm.Controls.count;

                if (!m_isDocument) {
                    if (m_isWizard) {
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

                if (tabIndex != -1) {
                    if (m_isDocument) {
                        pDocTabClickEx(c_Items, tabIndex);
                        pDocTabClickEx(c_Footer, tabIndex);
                        pDocTabClickEx(c_Header, tabIndex);
                        w_frm.cbTab(tabIndex + m_firstTab).TabSelected == true;
                    }
                    else {
                        tabClick(tabIndex);
                        w_frm.cbTab(tabIndex).TabSelected = true;
                    }
                }

                if (bSetFocus) { w_frm.SetFocusFirstControl; }
            // {end with: w_frm}

            return true;
        }

        private boolean loadControl(cABMProperty oProperty) { // TODO: Use of ByRef founded Private Function LoadControl(ByRef oProperty As cABMProperty) As Boolean
            Control c = null;
            Control f = null;
            cIABMProperty iProperty = null;

            cIABMProperties iProperties = null;
            cABMProperty oProp = null;
            cABMGrid oGrid = null;

            iProperty = oProperty;

            int nTabIndex = 0;
            nTabIndex = pGetTabIndex(iProperty);

            Object w_frm = getFrm();
                switch (iProperty.PropertyType) {
                        //      Case csTypeABMProperty.cspAdHock
                        //        If m_bLoadAdHock Then
                        //          Load .CBhock(.CBhock.UBound + 1)
                        //        Else
                        //          m_bLoadAdHock = True
                        //        End If
                        //
                        //        Set c = .CBhock(.CBhock.UBound)
                        //        pSetFont c, iProperty

                    case  csTypeABMProperty.cspList:
                        if (m_bLoadList) {
                            Load(w_frm.CB(w_frm.CB.UBound + 1));
                        }
                        else {
                            m_bLoadList = true;
                        }

                        c = w_frm.CB(w_frm.CB.UBound);
                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspHelp:
                        if (m_bLoadHelp) {
                            Load(w_frm.HL(w_frm.HL.UBound + 1));
                        }
                        else {
                            m_bLoadHelp = true;
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
                        if (m_bLoadNumeric) {
                            Load(w_frm.ME(w_frm.ME.UBound + 1));
                        }
                        else {
                            m_bLoadNumeric = true;
                        }

                        c = w_frm.ME(w_frm.ME.UBound);
                        c.csType = iProperty.SubType;
                        if (iProperty.SubType == 0) {
                            VBA.ex.Raise(csErrores.CSERRORABMLOADCONTROLSUBTYPENOTDEFINED, "CSABMInterface.LoadControl", "Error al cargar controles en ABM Generico. No se ha indicado un subnType para la propiedad numerica: "+ iProperty.Name);
                        }

                        if (m_isFooter) {
                            c.Width = 1100;
                            c.BackColor = w_frm.shTabFooter.cABMGridRow.getBackColor();
                            c.EnabledNoChngBkColor = true;
                        }
                        pSetFont(c, iProperty);
                        c.FormatNumber = iProperty.Format;

                        break;
                    case  csTypeABMProperty.cspDate:
                    case  csTypeABMProperty.cspTime:
                        if (m_bLoadDate) {
                            Load(w_frm.MEFE(w_frm.MEFE.UBound + 1));
                        }
                        else {
                            m_bLoadDate = true;
                        }

                        c = w_frm.MEFE(w_frm.MEFE.UBound);
                        if (iProperty.PropertyType == csTypeABMProperty.cspDate) {
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
                            if (!f.Tag != "") {
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
                        if (m_bLoadLabel) {
                            Load(w_frm.LB2(w_frm.LB2.UBound + 1));
                        }
                        else {
                            m_bLoadLabel = true;
                        }

                        c = w_frm.LB2(w_frm.LB2.UBound);
                        pSetFont(c, iProperty);
                        if (iProperty.BackColor != -1) {
                            c.BackStyle = 1;
                        }
                        else {
                            c.BackStyle = 0;
                        }
                        c.Alignment = iProperty.TextAlign;

                        break;
                    case  csTypeABMProperty.cspTitle:
                        if (m_bLoadTitle) {
                            Load(w_frm.lbTitle2(w_frm.lbTitle2.UBound + 1));
                        }
                        else {
                            m_bLoadTitle = true;
                        }

                        c = w_frm.lbTitle2(w_frm.lbTitle2.UBound);
                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspProgressBar:
                        if (m_bLoadProgressBar) {
                            Load(w_frm.prgBar(w_frm.prgBar.UBound + 1));
                        }
                        else {
                            m_bLoadProgressBar = true;
                        }

                        c = w_frm.prgBar(w_frm.prgBar.UBound);

                        break;
                    case  csTypeABMProperty.cspDescription:
                        if (m_bLoadDescription) {
                            Load(w_frm.LBDescrip(w_frm.LBDescrip.UBound + 1));
                        }
                        else {
                            m_bLoadDescription = true;
                        }

                        c = w_frm.LBDescrip(w_frm.LBDescrip.UBound);
                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspImage:
                        if (m_bLoadImage) {
                            Load(w_frm.Img(w_frm.Img.UBound + 1));
                        }
                        else {
                            m_bLoadImage = true;
                        }

                        c = w_frm.Img(w_frm.Img.UBound);

                        break;
                    case  csTypeABMProperty.cspText:

                        if (iProperty.SubType == CSConstantes.cspMemo) {
                            if (m_bLoadTextM) {
                                Load(w_frm.TXM(w_frm.TXM.UBound + 1));
                            }
                            else {
                                m_bLoadTextM = true;
                            }

                            c = w_frm.TXM(w_frm.TXM.UBound);

                        }
                        else {
                            if (m_bLoadText) {
                                Load(w_frm.TX(w_frm.TX.UBound + 1));
                                w_frm.TX(w_frm.TX.UBound).cABMProperty.setWidth(m_textOrigWidth);
                            }
                            else {
                                m_bLoadText = true;
                            }

                            c = w_frm.TX(w_frm.TX.UBound);
                            if (c(instanceOf cMaskEdit)) {
                                c.ButtonStyle = (iProperty.SubType == cspTextButton  || iProperty.SubType == cspTextButtonEx) ? cButtonSingle : cButtonNone);
                                c.Mask = iProperty.TextMask;
                                c.csType = csMkText;
                            }
                            c.PasswordChar = "";
                        }

                        c.MaxLength = iProperty.Size;
                        c.Alignment = iProperty.TextAlign;

                        // Para soportar cajas multinline
                        // que permiten desplazarce con las flechas
                        // entre renglones, pero no aceptan edicion
                        //
                        c.InputDisabled = oProperty.getInputDisabled();

                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspFile:
                        if (m_bLoadText) {
                            Load(w_frm.TX(w_frm.TX.UBound + 1));
                        }
                        else {
                            m_bLoadText = true;
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
                        if (m_bLoadText) {
                            Load(w_frm.TX(w_frm.TX.UBound + 1));
                        }
                        else {
                            m_bLoadText = true;
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
                        if (m_bLoadPassword) {
                            Load(w_frm.txPassword(w_frm.txPassword.UBound + 1));
                        }
                        else {
                            m_bLoadPassword = true;
                        }

                        c = w_frm.txPassword(w_frm.txPassword.UBound);
                        c.ButtonStyle = cButtonNone;
                        c.PasswordChar = "*";
                        pSetFont(c, iProperty);

                        break;
                    case  csTypeABMProperty.cspCheck:
                        if (m_bLoadCheck) {
                            Load(w_frm.CHK(w_frm.CHK.UBound + 1));
                        }
                        else {
                            m_bLoadCheck = true;
                        }

                        c = w_frm.CHK(w_frm.CHK.UBound);
                        c.Caption = "  ";
                        c.Width = 400;

                        break;
                    case  csTypeABMProperty.cspGrid:
                        if (m_bLoadGrid) {
                            Load(w_frm.GR(w_frm.GR.UBound + 1));
                        }
                        else {
                            m_bLoadGrid = true;
                        }

                        c = w_frm.GR(w_frm.GR.UBound);
                        c.Editable = iProperty.GridEdit;
                        getMngGrid().setPropertys(c);

                        oGrid = iProperty.Grid;
                        c.DontSelectInGotFocus = oGrid.getDontSelectInGotFocus();

                        // Formatos adicionales a la interfaz cIABMGrid
                        c.RowMode = oGrid.getRowSelect();

                        break;
                    case  csTypeABMProperty.cspButton:
                        if (m_bLoadButton) {
                            Load(w_frm.CMD(w_frm.CMD.UBound + 1));
                        }
                        else {
                            m_bLoadButton = true;
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

                if (iProperty.PropertyType != csTypeABMProperty.cspToolBar) {
                    oProperty.setIndex(c.Index);
                }
            // {end with: w_frm}

            pSetTabIndex(c);
            m_tabIndex = m_tabIndex + 1;

            oProperty.setCtl(c);

            // Aplico formateos personalizados
            if (iProperty.Height > 0) {
                c.Height = iProperty.Height;
            }

            if (iProperty.Width > 0) {
                c.Width = iProperty.Width;
            }

            // Si se indica un top en funcion de una propiedad
            if (iProperty.TopFromProperty != "") {
                iProperties = m_properties;
                oProp = iProperties(iProperty.TopFromProperty);
                iProperty.Top = oProp.getTop();

                // Modificamos m_LastTop para poder indicar un top en funcion
                // de una propiedad. Es decir combinar TopFromProperty y TopToPrevious
                m_lastTop = oProp.getTop();
            }

            // Si se indico un top en funcion del control anterior
            if (iProperty.TopToPrevious != 0) {

                if (iProperty.PropertyType == cspOption) {
                    m_lastTop = m_lastTopOp;
                }

                // Si se indica -1 significa el mismo top que el control anterior
                if (iProperty.TopToPrevious == -1) {
                    iProperty.Top = m_lastTop;
                }
                else {
                    iProperty.Top = m_lastTop + iProperty.TopToPrevious;
                }
            }

            if (iProperty.Top != -1) {
                c.Top = iProperty.Top;
            }

            // Si se indica un left en funcion de una propiedad
            if (iProperty.LeftFromProperty != "") {
                iProperties = m_properties;
                oProp = iProperties(iProperty.LeftFromProperty);
                iProperty.Left = oProp.getLeft();

                // Modificamos m_LastLeft para poder indicar un left en funcion
                // de una propiedad. Es decir combinar LeftFromProperty y LeftToPrevious
                m_lastLeft = oProp.getLeft();

                // Si hay left personalizado, pero no se indico un left para el label
                // le ponemos el default
                if (iProperty.LeftLabel == 0) { iProperty.LeftLabel = -C_OFFSET_H; }
            }

            // Si se indico un left en funcion del control anterior
            if (iProperty.LeftToPrevious != 0) {

                if (iProperty.PropertyType == cspOption) {
                    m_lastLeft = m_lastLeftOp;
                }

                // Si se indica -1 significa el mismo left que el control anterior
                if (iProperty.LeftToPrevious == -1) {
                    iProperty.Left = m_lastLeft;
                }
                else {
                    iProperty.Left = m_lastLeft + iProperty.LeftToPrevious;
                }
            }

            if (iProperty.Left != -1) {
                // Si hay left personalizado, pero no se indico un left para el label
                // le ponemos el default
                if (iProperty.LeftLabel == 0) { iProperty.LeftLabel = -C_OFFSET_H; }

                c.Left = iProperty.Left;
            }

            //
            // Si el control va a quedar sobre la linea lo corro a la derecha y empiezo desde arriba otra vez
            //

            Object w_frm = getFrm();

                if (m_isItems) {

                    // * TODO:** can't found type for with block
                    // * With .shTabItems
                    __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = w_frm.shTabItems;
                        if (m_nextTop[nTabIndex] + c.Height > w___TYPE_NOT_FOUND.Top + w___TYPE_NOT_FOUND.Height - 50) {
                            setNewTopAndLeft(iProperty);
                        }
                    // {end with: w___TYPE_NOT_FOUND}

                }
                else if (m_isFooter) {

                    // * TODO:** can't found type for with block
                    // * With .shTabFooter
                    __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = w_frm.shTabFooter;
                        if (m_nextTop[nTabIndex] + c.Height > w___TYPE_NOT_FOUND.Top + w___TYPE_NOT_FOUND.Height) {
                            setNewTopAndLeft(iProperty);
                        }
                    // {end with: w___TYPE_NOT_FOUND}

                }
                else {
                    if (m_nextTop[nTabIndex] + c.Height + C_LINE_LIGHT + 50 > w_frm.Line1.Y1) {
                        setNewTopAndLeft(iProperty);
                    }
                }
            // {end with: w_frm}

            // With c;
                if (m_isDocument) {
                    if (m_isItems) {
                        c.Tag = c_Items+ iProperty.TabIndex;
                    }
                    else if (m_isFooter) {
                        c.Tag = c_Footer+ iProperty.TabIndex;
                    }
                    else {
                        c.Tag = c_Header+ iProperty.TabIndex;
                    }
                }
                else {
                    if (oProperty.getTabIndex()) {
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
                if (iProperty.PropertyType == cspOption) {
                    int r = 0;
                    int q = 0;
                    if (iProperty.OptionGroup - 1 > m_leftOp.length) {
                        r = m_leftOp.length;
                        G.redimPreserve(m_leftOp, iProperty.OptionGroup);
                        Object w_frm = getFrm();
                            for (q = r; q <= m_leftOp.length; q++) {
                                m_leftOp[q] = w_frm.OP(0).cABMProperty.getLeft();
                            }
                        // {end with: w_frm}
                    }
                    if (iProperty.OptionGroup - 1 > m_nextTopOp.length) {
                        r = m_nextTopOp.length;
                        G.redimPreserve(m_nextTopOp, iProperty.OptionGroup);
                        Object w_frm = getFrm();
                            for (q = r; q <= m_nextTopOp.length; q++) {
                                m_nextTopOp[q] = w_frm.OP(0).cABMProperty.getTop();
                            }
                        // {end with: w_frm}
                    }

                    if (iProperty.Left == -1) {
                        c.Left = m_leftOp[iProperty.OptionGroup];
                    }
                    if (iProperty.Top == -1) {
                        c.Top = m_nextTopOp[iProperty.OptionGroup];
                    }
                    if (iProperty.Width == 0) {
                        c.Width = 1500;
                    }
                    c.Caption = iProperty.Name;

                    // Agrando el Frame
                    if (c.Top + c.Height > f.Height) { f.Height = c.Top + c.Height + 50; }

                    if (f.Height + f.Top > getFrm().Line1.Y1) {
                        f.Top = m_nextTop[nTabIndex] - 100;
                        f.Left = m_left[nTabIndex];
                    }

                    if (c.Left + c.Width > f.Width) { f.Width = c.Left + c.Width + 20; }

                    if (iProperty.TopFrame != 0) { f.Top = iProperty.TopFrame; }
                    if (iProperty.LeftFrame != 0) { f.Left = iProperty.LeftFrame; }

                    m_nextTopOp[iProperty.OptionGroup] = m_nextTopOp[iProperty.OptionGroup] + C_LINE_HEIGHT;

                }
                else if (iProperty.PropertyType == cspToolBar) {

                    // With frameToolBar;
                        frameToolBar.Width = iProperty.Width;
                        frameToolBar.Top = iProperty.TopFrame;
                        frameToolBar.Left = iProperty.LeftFrame;
                        if (iProperty.Height > 0) {
                            frameToolBar.Height = iProperty.Height;
                        }
                        else {
                            frameToolBar.Height = c.Height;
                        }
                        frameToolBar.Tag = iProperty.TabIndex;
                        frameToolBar.BackColor = getFrm().ShTab.cABMGridRow.getBackColor();
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
                else if (iProperty.PropertyType == cspLabel  || iProperty.PropertyType == cspTitle  || iProperty.PropertyType == cspDescription) {

                    if (iProperty.Top == -1) {
                        c.Top = m_nextTop[nTabIndex];
                    }

                    if (iProperty.Left == -1) {
                        c.Left = m_left[nTabIndex] + m_labelLeft;
                    }

                }
                else {

                    Label lB = null;

                    Object w_frm = getFrm();
                        Load(w_frm.LB(w_frm.LB.UBound + 1));
                        lB = w_frm.LB(w_frm.LB.UBound);
                    // {end with: w_frm}

                    // With lB;
                        oProperty.setLabelIndex(lB.Index);
                        lB.Caption = iProperty.Name;
                        lB.Left = m_left[nTabIndex];
                        lB.BackStyle = 0;
                        lB.Tag = c.Tag;
                        lB.ZOrder;
                        if (iProperty.PropertyType == cspButton) {
                            lB.Visible = false;
                        }
                    // {end with: lB}

                    // Etiquetas invisibles
                    // para Grillas, Botones e Imagenes
                    //
                    if (iProperty.LeftLabel == -1) {
                        // With lB;
                            lB.Visible = false;
                            //' Si una etiqueta tiene tag=-1
                            lB.Tag = "-1";
                            // no se modifica su propiedad
                            // visible en el ShowValue
                        // {end with: lB}
                    }

                    // Formateo especial para Grids
                    if (iProperty.PropertyType == cspGrid) {
                        if (iProperty.Left == -1) {
                            c.Left = m_left[nTabIndex];
                        }

                        if (m_isItems) {
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
                            if (iProperty.Top == 0) {
                                c.Top = m_nextTop[nTabIndex] + 300;
                                // With lB;
                                    lB.Top = m_nextTop[nTabIndex];
                                    lB.Width = c.Width;
                                // {end with: lB}
                            }
                        }
                        if (iProperty.Width == -1  || iProperty.Width == 0) {
                            c.Width = getFrm().ScaleWidth - c.Left - 300;
                        }

                    }
                    else if (m_isDocument && iProperty.Table == Cairo.Tables.DOCUMENTO) {

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
                    else if (m_isDocument && (oProperty.getKeyCol().equals(csNumberID) || oProperty.getKeyCol().equals(csStateID))) {

                        if (oProperty.getKeyCol().equals(csNumberID)) {
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

                        if (iProperty.Top != -1) {

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

                        if (m_isFooter) {
                            if (iProperty.Left == -1) {
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
                            if (iProperty.Left != -1) {
                                lB.Left = c.Left + iProperty.LeftLabel;
                                lB.Width = Abs(iProperty.LeftLabel);
                            }
                            else {
                                c.Left = m_left[nTabIndex] + m_labelLeft;
                                if (iProperty.LeftLabel != 0) {
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
                if (!iProperty.LeftNotChange) {

                    // Si fue un option button hay que fijarce en el contenedor
                    if (iProperty.PropertyType == cspOption) {
                        if (iProperty.LeftFrame != 0  && !iProperty.LeftNotChange) {
                            m_left[nTabIndex] = f.Left;
                        }
                    }
                    else {
                        // Si el control indico un left fijo, los demas se alinean con el
                        if (iProperty.Left != -1  && iProperty.LeftToPrevious == 0) {
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
                if (!iProperty.TopNotChange) {
                    // Si el control tiene un top personalizado entonces
                    // parto de dicho top para el calculo. Siempre y cuando no sea un OptionButton
                    if (iProperty.Top != -1  && iProperty.PropertyType != cspOption  && !iProperty.TopNotChange) {

                        m_lastTop = iProperty.Top;

                        // Si el control inidica un alto personalizado
                        if (iProperty.Height > 0) {
                            m_nextTop[nTabIndex] = iProperty.Top + c.Height + C_LINE_LIGHT;
                        }
                        else {
                            m_nextTop[nTabIndex] = iProperty.Top + C_LINE_HEIGHT;
                        }
                    }
                    else {
                        // Si el control inidica un alto personalizado. Siempre y cuando no sea un OptionButton
                        if (iProperty.Height > 0 && iProperty.PropertyType != cspOption) {
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
                            if (!(m_isDocument && (iProperty.Table == Cairo.Tables.DOCUMENTO  || oProperty.getKeyCol().equals(csNumberID) || oProperty.getKeyCol().equals(csStateID)))) {
                                m_nextTop[nTabIndex] = m_nextTop[nTabIndex] + C_LINE_HEIGHT;
                            }
                        }
                    }
                }

                // Finalmente valido el ancho del form
                if (iProperty.PropertyType == cspOption) {
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

            Object w_frm = getFrm();
                if (m_isItems) {
                    m_nextTop[nTabIndex] = w_frm.shTabItems.cABMProperty.getTop() + 100;
                    m_left[nTabIndex] = m_left[nTabIndex] + C_OFFSET_H2;

                }
                else if (m_isFooter) {
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

                Object w_frm = getFrm();
                    if (w_frm.ShTab.cABMProperty.getLeft() == 0) {
                        offsetH = 120;
                    }
                    else {
                        offsetH = 400;
                    }

                    if (frameSize > 0) {
                        if (w_frm.Width < frameSize + offsetH) {
                            w_frm.Width = frameSize + offsetH;
                            w_frm.ShTab.cABMProperty.setWidth(w_frm.ScaleWidth - w_frm.ShTab.cABMProperty.getLeft() * 2);
                        }
                    }
                    else {
                        if (w_frm.Width < oProp.getWidth() + oProp.getLeft() + offsetH) {
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

            if (m_properties == null) { return; }

            iProperties = m_properties;

            // Para Toolbars no hay indice
            if (nType == cspToolBar) {
                Toolbar tbl = null;

                tbl = getFrm().GetToolBar;
                for (int _i = 0; _i < iProperties.size(); _i++) {
                    iProperty = iProperties.getItem(_i);
                    oProperty = iProperty;
                    if (iProperty.PropertyType == nType) {
                        if (oProperty.setToolbar(Is tbl)) {
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
                        if (nType == cspText) {

                            if (iProperty.PropertyType == cspText  && subType == cspMemo) {
                                if (iProperty.SubType == subType) {
                                    found = true;
                                }
                            }
                            else {

                                // Los textbox y los cspFile y cspFolder estan dentro
                                // del mismo arreglo de controles ( TX )
                                //
                                if ((iProperty.PropertyType == cspText  || iProperty.PropertyType == cspFile  || iProperty.PropertyType == cspFolder) && iProperty.SubType != cspMemo  && iProperty.SubType == subType) {

                                    found = true;

                                    // Finalmente puede tratarse de una caja de texto
                                    // con boton asi que SubType es cspTextButton o cspTextButtonEx
                                    // pero cuando me llaman desde TxButtonClick me pasan 0 en
                                    // SubType ya que puede ser un cspFile, cspFolder o cspText
                                    // asi que este ultimo if captura los textbox que tienen boton
                                    // normalmente descripciones en controles de una linea
                                    // o cajas de texto con boton que se resuelve por la clase
                                    // cliente que maneja las reglas de negocio de esta edicion.
                                    //
                                }
                                else if ((iProperty.PropertyType == cspText  && (iProperty.SubType == cspTextButton  || iProperty.SubType == cspTextButtonEx))) {

                                    found = true;

                                }
                            }
                        }
                        else {
                            if (iProperty.PropertyType == nType) {
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
                        if (found) {
                            oProperty = iProperty;

                            if (oProperty.getIndex() == index) {
                                return oProperty;
                                break;
                            }
                        }
                    // {end with: iProperty}
                }
            }
        }

        private boolean changeProperty(csTypeABMProperty nType, int index, Object c, boolean bNoRefresh, csSubTypeABMProperty subType) { // TODO: Use of ByRef founded Private Function ChangeProperty(ByVal nType As csTypeABMProperty, ByVal Index As Integer, ByRef c As Object, Optional ByVal bNoRefresh As Boolean, Optional ByVal SubType As csSubTypeABMProperty = 0) As Boolean
            boolean _rtn = false;
            try {

                cIABMProperty iProperty = null;
                cIABMProperty iProperty2 = null;
                cABMProperty oProperty = null;
                cIABMProperties iProperties = null;

                Static(Refreshing As Boolean);

                if (Refreshing || m_showingForm) {
                    Refreshing = false;
                    _rtn = true;
                    return _rtn;
                }

                oProperty = getProperty(nType, index, subType);

                iProperties = m_properties;

                if (oProperty != null) {

                    iProperty = oProperty;

                    // With iProperty;
                        switch (nType) {
                                //Case csTypeABMProperty.cspAdHock, csTypeABMProperty.cspList
                            case  csTypeABMProperty.cspList:
                                iProperty.ListListIndex = c.ListIndex;
                                iProperty.ListText = c.Text;
                                if (c.ListIndex >= 0) {
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
                                iProperty.Value = c.Text;
                                break;
                            case  csTypeABMProperty.cspNumeric:
                                iProperty.Value = c.csValue;
                                break;
                            case  csTypeABMProperty.cspDate:
                            case  csTypeABMProperty.cspTime:
                                iProperty.Value = c.csValue;
                                break;
                            case  csTypeABMProperty.cspOption:

                                if (c.Value) {
                                    // Aca hay que cambiar al resto de las Properties de este Group de
                                    // option buttons
                                    for (int _i = 0; _i < iProperties.size(); _i++) {
                                        iProperty2 = iProperties.getItem(_i);
                                        if (!iProperty2(Is iProperty)) {
                                            if (iProperty2.PropertyType == cspOption  && iProperty2.OptionGroup == iProperty.OptionGroup) {
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

                        if (m_client.PropertyChange(iProperty.Key) && !bNoRefresh) {
                            Refreshing = true;
                            for (int _i = 0; _i < iProperties.size(); _i++) {
                                iProperty = iProperties.getItem(_i);
                                showValue(iProperty, m_bNoChangeColsInRefresh);
                            }
                        }
                    // {end with: iProperty}
                }

                if (!pIsButton(iProperty) && pIsEditProperty(iProperty)) {

                    if (m_isDocument) {
                        if (iProperty != null) {
                            if (iProperty.Table != Cairo.Tables.DOCUMENTO) {
                                setWasChanged(true);
                            }
                        }
                    }
                    else {
                        setWasChanged(true);
                    }
                }

                Refreshing = false;
                _rtn = true;

                // Si es un ABM de maestros
                // permitimos al objeto de negocios
                // que indique se debe cerrar el form
                //
                if (m_formABM != null) {
                    if (m_bSendSave) {
                        m_formABM.ctrlKeySave();
                    }
                    else if (m_bSendClose) {
                        m_formABM.ctrlKeyClose();
                    }
                }

                return _rtn;
            } catch (Exception ex) {
                MngError(VBA.ex, "ChangeProperty", C_MODULE, "");
            }
            return _rtn;
        }

        private boolean pIsButton(cIABMProperty iProp) { // TODO: Use of ByRef founded Private Function pIsButton(ByRef iProp As cIABMProperty) As Boolean
            if (iProp == null) { return false; }
            return iProp.PropertyType == cspButton;
        }

        private boolean pIsEditProperty(cABMProperty iProp) { // TODO: Use of ByRef founded Private Function pIsEditProperty(ByRef iProp As cABMProperty) As Boolean
            if (iProp == null) { return false; }
            return iProp.getIsEditProperty();
        }

        public boolean validateEx() {
            if (!pFillGrids()) { return false; }
            if (!pValidate()) { return false; }
            return true;
        }

        public void validateProp(cIABMProperty iProp, String strKey) { // TODO: Use of ByRef founded Public Sub ValidateProp(ByRef iProp As cIABMProperty, ByVal strKey As String)
            cABMProperty oProp = null;
            cIABMProperties iProps = null;

            if (iProp == null) {
                iProps = m_properties;
                oProp = iProps.Item(strKey);
            }
            else {
                oProp = iProp;
            }

            if (!TypeOf(oProp.getCtl() Is cshelp2.cHelp)) { return; }

            cshelp2.cHelp hL = null;
            hL = oProp.getCtl();
            hL.Validate;
        }

        private boolean pValidateItemsAndFooter() {
            boolean _rtn = false;
            cABMGeneric genDocEx = null;

            if (m_isDocument) {

                genDocEx = m_client.MessageEx(ABM_MSG.MSG_DOC_EX_GET_ITEMS, null);
                if (!genDocEx.validateEx()) { return _rtn; }

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
        public boolean saveChanges() {
            return pSaveChanges(false, false);
        }

        public boolean save() {
            boolean _rtn = false;
            _rtn = pSave(false, false);
            if (m_bOkCancelDialog) {
                m_bOkCancelDialogRslt = true;
                if (getFrm(instanceOf fABM)) {
                    m_FormABM_cmdCloseClick();
                }
                else if (getFrm(instanceOf fABMDoc)) {
                    pFormDocClose();
                }
                else if (getFrm(instanceOf fWizard)) {
                    m_FormWizard_cmdCancelClick();
                }
            }
            return _rtn;
        }

        private boolean pSave(boolean bUnloading, boolean bSaveAs) {
            boolean _rtn = false;
            try {

                if (!m_isDocument) {

                    cLockUpdateWindow lockwnd = null;

                    if (!m_bNotLockWnd) {
                        lockwnd = new cLockUpdateWindow();
                        lockwnd.lockW(getFrm().hWnd);
                    }
                }

                if (m_isItems) { return _rtn; }
                if (m_isFooter) { return _rtn; }

                m_inSave = true;

                cMouseWait mouse = null;
                mouse = new cMouseWait();

                pRefreshAux();
                pFillList();

                if (!pFillGrids()) { / * *TODO:** goto found: GoTo ExitProc* /  }

                // OJO: Esto se cambio de lugar y se puso antes
                //      de los validate para que no se de el bug
                //      de click en los checkbox de las grillas
                //      que afectaba los abm de cliente y proveedor
                //
                //      Si notamos que hay algun bug nuevo este es
                //      nuestro sospechoso de siempre!!!
                //
                if (!m_isDocument) {
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
                if (m_isDocument) {
                    m_client.MessageEx(ABM_MSG.MSG_DOC_EX_PRE_VALIDATE, null);
                }

                if (!pValidate()) {
                    if (!m_isDocument) {
                        pSetEnabled(true);
                    }
                    / * *TODO:** goto found: GoTo ExitProc* /
                }

                if (!pValidateItemsAndFooter()) {
                    if (!m_isDocument) {
                        pSetEnabled(true);
                    }
                    / * *TODO:** goto found: GoTo ExitProc* /
                }

                // Grabacion normal de un documento
                //
                if (!bSaveAs) {

                    if (!m_client.Save()) {
                        if (!m_isDocument) {
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
                    if (!m_client.MessageEx(ABM_MSG.MSG_SAVE_AS, null)) {
                        if (!m_isDocument) {
                            pSetEnabled(true);
                        }
                        / * *TODO:** goto found: GoTo ExitProc* /
                    }

                }

                if (!m_isDocument) {
                    pSetEnabled(true);
                }

                if (!bUnloading) {

                    if (!m_isDocument && !m_bSendRefresh && !m_bOkCancelDialog) {

                        pDiscardChanges(false);
                    }
                    else {
                        m_client.MessageEx(ABM_MSG.MSG_DOC_REFRESH, null);
                        if (!m_isDocument) {
                            pRefreshTitle();
                        }
                        getFrm().SetFocusFirstControl;
                    }
                }

                setWasChanged(false);
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

            for (Index = 1; Index <= getFrm().CB.UBound; Index++) {
                for (int _j = 0; _j < iProperties.size(); _j++) {
                    iProperty = iProperties.getItem(_j);
                    if (iProperty.PropertyType == cspList) {
                        oProperty = iProperty;
                        if (oProperty.getIndex() == index) {

                            Object w_frm = getFrm();
                                iProperty.ListItemData = ListID(w_frm.CB(index));
                                iProperty.ListListIndex = w_frm.CB(index).ListIndex;
                                iProperty.ListText = w_frm.CB(index).Text;
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
            //            iProperty.ListText = .CBhock(Index).Text
            //          End With
            //        End If
            //      End If
            //    Next
            //  Next
        }

        private boolean pFillGrids() {
            cIABMProperty iProperty = null;
            cABMProperty oProperty = null;
            cIABMProperties iProperties = null;
            int index = 0;

            iProperties = m_properties;

            Object w_frm = getFrm();

                for (Index = 0; Index <= w_frm.GR.UBound; Index++) {
                    for (int _j = 0; _j < iProperties.size(); _j++) {
                        iProperty = iProperties.getItem(_j);
                        if (iProperty.PropertyType == cspGrid) {
                            oProperty = iProperty;
                            if (oProperty.getIndex() == index) {

                                if (!pFillRows(iProperty.Grid, w_frm.GR(index))) { return false; }

                            }
                        }
                    }
                }
            // {end with: w_frm}

            return true;
        }

        private boolean pFillRows(cIABMGrid grid, cGridAdvanced grCtrl) { // TODO: Use of ByRef founded Private Function pFillRows(ByRef Grid As cIABMGrid, ByRef grCtrl As cGridAdvanced) As Boolean
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

            if (oRows.getHaveKey()) {

                bHaveKey = true;
                G.redim(vKeys, grid.Rows.cABMDocPropertiesCols.count(), grid.Columns.cABMDocPropertiesCols.count());

                cABMGridRow oRow = null;

                for (RowIndex = 1; RowIndex <= grid.Rows.cABMDocPropertiesCols.count(); RowIndex++) {
                    oRow = grid.Rows(rowIndex);
                    vKeys[rowIndex, 1].equals(oRow.getKey());

                    for (ColIndex = 2; ColIndex <= grid.Columns.cABMDocPropertiesCols.count(); ColIndex++) {
                        row = oRow;
                        if (colIndex <= row.Count) {
                            oCell = row.Item(colIndex);
                            vKeys[rowIndex, colIndex].equals(oCell.getStrKey());
                        }
                    }
                }
            }

            grid.Rows.cABMDocPropertiesCols.clear();

            // Clear borra m_HaveKey
            //
            if (bHaveKey) {
                oRows.setHaveKey(bHaveKey);
            }

            // With grCtrl;
                for (RowIndex = 1; RowIndex <= grCtrl.Rows; RowIndex++) {

                    // The last row can be empty because it is for new items
                    // so if no columns with values exists don't add to grid.rows
                    if (rowIndex == grCtrl.Rows) {

                        // Only for grid that allow add new rows
                        cIABMProperty iProperty = null;
                        iProperty = getProperty(cspGrid, grCtrl.Index, 0);
                        if (iProperty.GridAdd) {
                            if (!pGRValidateRow(grCtrl.Index, rowIndex, false, false, bIsEmpty)) {
                                return null;
                            }
                        }
                    }

                    if (!bIsEmpty) {

                        if (bHaveKey) {
                            if (rowIndex <= (vKeys, 1).length) {
                                if (vKeys[rowIndex, 1] != "") {
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

                                if (bHaveKey) {
                                    if (rowIndex <= (vKeys, 1).length && colIndex <= (vKeys, 1vKeys, 2).length) {
                                        if (vKeys[rowIndex, colIndex] != "") {
                                            if (vKeys[rowIndex, colIndex] == c_keyRowItem) {
                                                if (row.Item(c_keyRowItem) == null) {
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

                                if (col.PropertyType == cspCheck) {
                                    cell.Id = w___TYPE_NOT_FOUND.ItemData;

                                }
                                else if (col.PropertyType == cspDate) {
                                    cell.Value = mUtil.getDateValueForGridClient(w___TYPE_NOT_FOUND.Text);

                                }
                                else if (col.SubType == cspPercent) {
                                    cell.Value = mUtil.val(w___TYPE_NOT_FOUND.Text) * 100;

                                }
                                else {
                                    cell.Value = w___TYPE_NOT_FOUND.Text;
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

            Object w_frm = getFrm();

                for (i = 0; i <= w_frm.GR.UBound; i++) {

                    iProperty = getProperty(cspGrid, i, 0);

                    if (iProperty != null) {
                        getMngGrid().saveColumnWidth(w_frm.GR(i), pGetNameGrid(iProperty));
                        getMngGrid().saveColumnOrder(w_frm.GR(i), pGetNameGrid(iProperty));
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

                Object w_frm = getFrm();

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

                    mUtil.destroyGrids(getFrm());

                    if (getFrm(instanceOf fWizard || getFrm() instanceOf fABM)) {
                        for (i = 1; i <= w_frm.LB2.UBound; i++) {
                            Unload(w_frm.LB2(i));
                        }
                    }

                    if (getFrm(instanceOf fWizard)) {
                        for (i = 1; i <= w_frm.prgBar.UBound; i++) {
                            Unload(w_frm.prgBar(i));
                        }
                        for (i = 1; i <= w_frm.LBDescrip.UBound; i++) {
                            Unload(w_frm.LBDescrip(i));
                        }
                    }

                    if (getFrm(instanceOf fWizard || getFrm() instanceOf fABM)) {

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

                if (!dontCallClient) { m_client.DiscardChanges; }

                return;
            } catch (Exception ex) {
                MngError(VBA.ex, "DiscardChanges", C_MODULE, "");
            }
        }

        private boolean pValidate() {
            boolean _rtn = false;
            if (!m_client.Validate()) { return _rtn; }

            if (m_implementsClientGrid) {

                cABMProperty oProp = null;
                int rowIndex = 0;
                cIABMProperty iProp = null;
                cIABMProperties iProperties = null;
                boolean oldRedraw = false;

                iProperties = m_properties;

                for (int _i = 0; _i < iProperties.size(); _i++) {
                    iProp = iProperties.getItem(_i);
                    oProp = iProp;

                    if (iProp.PropertyType == cspGrid) {

                        //' oProp.ctl.Redraw cuando recompile cGridAdvanced voy
                        oldRedraw = true;
                        // a agregar el get a Redraw
                        oProp.getCtl().Redraw = false;

                        for (RowIndex = 1; RowIndex <= iProp.Grid.cABMCSGrid.getRows().Count; RowIndex++) {
                            if (!pGRValidateRow(oProp.getIndex(), rowIndex, false, true, false)) {
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

        public void setTabCtlIndex() {

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

                if (iProp.TabIndex < 0) {

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
                if (iTab.Index == index) {
                    oTab = iTab;
                    if (!(oTab.getFatherTab().equals(""))) {
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

            if (m_tabTopHeight == 0) {
                tabTopHeight = 540;
            }
            else {
                tabTopHeight = m_tabTopHeight;
                getFrm().ShTab.top = m_tabTopHeight + getFrm().cbTab.cABMGridRow.item(0).Height - 10;
                m_constTop = getFrm().ShTab.top + 200;
            }

            Object w_frm = getFrm();

                if (m_isItems) {
                    top = w_frm.shTabItems.top - w_frm.cbTab(0).cABMProperty.getHeight();
                    topItems = 10;
                }
                else if (m_isFooter) {
                    top = w_frm.shTabFooter.top - w_frm.cbTab(0).cABMProperty.getHeight();
                }
                else {
                    if (m_isDocument) {
                        top = 1080;
                    }
                    else {
                        //' 540
                        top = tabTopHeight;
                    }
                }

                for (i = 1; i <= w_frm.cbTab.UBound; i++) {
                    if (m_isItems) {
                        if (w_frm.cbTab(i).Tag == c_Footer  || w_frm.cbTab(i).Tag == c_Items) {
                            Unload(w_frm.cbTab(i));
                        }
                    }
                    else if (m_isFooter) {
                        if (w_frm.cbTab(i).Tag == c_Footer) {
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

                if (m_tabs != null) {

                    iTabs = m_tabs;
                    tabs = (iTabs.Count - 1 > tabs) ? iTabs.Count - 1 : tabs);
                }

                if (tabs == 0) { return; }

                // * TODO:** can't found type for with block
                // * With .cbTab
                __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = w_frm.cbTab;
                    if (w___TYPE_NOT_FOUND.Count == 1) {
                        m_firstTab = 0;
                    }
                    else {
                        m_firstTab = w___TYPE_NOT_FOUND.Count;
                    }
                // {end with: w___TYPE_NOT_FOUND}

                for (i = m_firstTab; i <= tabs + m_firstTab; i++) {
                    if (i > 0) { Load(w_frm.cbTab(i)); }

                    // * TODO:** can't found type for with block
                    // * With .cbTab(i)
                    __TYPE_NOT_FOUND w___TYPE_NOT_FOUND = w_frm.cbTab(i);
                        if (m_isDocument) {
                            if (m_isItems) {
                                w___TYPE_NOT_FOUND.Tag = c_Items;
                                w___TYPE_NOT_FOUND.TabGroup = 1;
                            }
                            else if (m_isFooter) {
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
                        if (!(oTab.getFatherTab().equals(""))) {
                            iTab = iTabs(oTab.getFatherTab());
                            iTab2 = oTab;
                            w___TYPE_NOT_FOUND.Tag = w___TYPE_NOT_FOUND.Tag+ c_InerTab+ String.valueOf((iTab.Index * 100) + Abs(iTab2.Index));

                            if (oTab.getLeft() != 0) {
                                bDontResize = true;
                                left = oTab.getLeft();
                            }
                            if (oTab.getTop() != 0) {
                                bDontResize = true;
                                top = oTab.getTop();
                            }
                        }

                        w___TYPE_NOT_FOUND.Caption = "Tab"+ ((Integer) i).toString();
                        w___TYPE_NOT_FOUND.TabStop = false;
                        w___TYPE_NOT_FOUND.Visible = !m_hideTabButtons;
                        if (left + w___TYPE_NOT_FOUND.Width > getFrm().Width) {
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

                if (m_tabs == null) { return; }

                ///////////////////////////////////////////////////////////////
                // Textos y anchos
                //
                Form f = null;
                f = Me.getFrm();
                CSButton.cButton cbTab = null;

                left = 90;
                if (m_isItems) {
                    top = w_frm.shTabItems.top - w_frm.cbTab(0).cABMProperty.getHeight();
                    topItems = 10;
                }
                else if (m_isFooter) {
                    top = w_frm.shTabFooter.top - w_frm.cbTab(0).cABMProperty.getHeight();
                }
                else {
                    if (m_isDocument) {
                        top = 1080;
                    }
                    else {
                        //' 540
                        top = tabTopHeight;
                    }
                }

                for (int _i = 0; _i < iTabs.size(); _i++) {
                    iTab = iTabs.getItem(_i);
                    if (iTab.Index < 0) {
                        oTab = iTab;
                        cbTab = w_frm.cbTab(oTab.getCtlIndex() + m_firstTab);
                        cbTab.Caption = "&"+ Abs(iTab.Index)+ "-"+ iTab.Name;
                    }
                    else {
                        cbTab = w_frm.cbTab(iTab.Index + m_firstTab);
                        cbTab.Caption = "&"+ iTab.Index + m_firstTab + 1+ "-"+ iTab.Name;
                    }

                    if (!bDontResize) {
                        cbTab.Width = f.TextWidth(cbTab.Caption) + 300;
                        if (left + cbTab.Width > f.Width) {
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

            if (control(instanceOf cMaskEdit)) {
                // With control;
                    if (control.csType != csMkText  && control.csType != csMkTime) {
                        if (control.Enabled) {

                            if (oProperty.getNoShowButton()) {
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
            return m_formABM.loadToolbar(f);
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

        public void refreshFont(cIABMProperty iProperty) { // TODO: Use of ByRef founded Public Sub RefreshFont(ByRef iProperty As cIABMProperty)
            cABMProperty oProp = null;
            oProp = iProperty;

            if (oProp.getCtl() == null) { return; }
            pSetFont(oProp.getCtl(), iProperty);
        }

        public void refreshPosition(cIABMProperty iProperty) { // TODO: Use of ByRef founded Public Sub RefreshPosition(ByRef iProperty As cIABMProperty)
            cABMProperty oProp = null;
            oProp = iProperty;

            if (oProp.getCtl() == null) { return; }


                oProp.getCtl().Left = iProperty.Left;
                oProp.getCtl().Top = iProperty.Top;
                oProp.getCtl().Width = iProperty.Width;
                oProp.getCtl().Height = iProperty.Height;
            }
        }

        private void pSetFont(Control c, cIABMProperty iProperty) { // TODO: Use of ByRef founded Private Sub pSetFont(ByRef c As Control, ByRef iProperty As cIABMProperty)


                // With iProperty;
                    if (iProperty.FontName != "") {
                        c.FontName = iProperty.FontName;
                    }
                    if (iProperty.FontSize > 0) {
                        c.FontSize = iProperty.FontSize;
                    }
                    c.FontUnderline = iProperty.FontUnderline;
                    c.FontBold = iProperty.FontBold;
                    c.FontItalic = iProperty.FontItalic;
                    if (iProperty.ForeColor != -1) {
                        c.ForeColor = iProperty.ForeColor;
                    }
                // {end with: iProperty}
            }
        }

        private void pSetBackColor(Control c, cIABMProperty iProperty) { // TODO: Use of ByRef founded Private Sub pSetBackColor(ByRef c As Control, ByRef iProperty As cIABMProperty)

                // With iProperty;
                    if (iProperty.BackColor != -1) {
                        c.BackColor = iProperty.BackColor;
                    }
                // {end with: iProperty}
            }
        }

        private void pSetTabIndexDescrip() {
            cIABMProperty iProperty = null;
            cABMProperty oProperty = null;
            cIABMProperties iProperties = null;

            if (m_isDocument) {

                iProperties = m_properties;

                Object w_frm = getFrm();

                    for (int _i = 0; _i < iProperties.size(); _i++) {
                        iProperty = iProperties.getItem(_i);
                        if (iProperty.SubType == cspMemo) {
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

            Object w_frm = getFrm();

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
                            if (iProperties(i).SubType == cspMemo) {
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

        private void pResetChanged() {
            setWasChanged(false);
            m_unloading = false;
        }

        private boolean pAskDelete(String msg) {
            return Ask(msg, vbYes, "Borrar");
        }

        private void pReloadDocument() {


                if (m_unloading) { return; }

                pShowMsg("Descartando los cambios hechos al documento ...");
                m_client.MessageEx(ABM_MSG.MSG_DOC_REFRESH, null);
                setWasChanged(false);
                pHideMsg();
            }
        }

        public void printDocumento() {
            pPrint(false);
        }

        public void printDocEx(int id) {
            pPrint(false, id);
        }

        public void printDocumentoCobranzaCdo(CSInterfacesABM.cIABMClient obj) { // TODO: Use of ByRef founded Public Sub PrintDocumentoCobranzaCdo(ByRef Obj As CSInterfacesABM.cIABMClient)

                CSInterfacesABM.cIABMClient oldClient = null;
                oldClient = m_client;
                m_client = obj;
                pPrint(false);
                m_client = oldClient;
            }
        }

        public boolean printDocWithResult(CSInterfacesABM.cIABMClient obj, int id, int docId) { // TODO: Use of ByRef founded Public Function PrintDocWithResult(ByRef Obj As CSInterfacesABM.cIABMClient, ByVal Id As Long, ByVal DocId As Long) As Boolean
            boolean _rtn = false;


                CSInterfacesABM.cIABMClient oldClient = null;
                oldClient = m_client;
                m_client = obj;

                _rtn = pPrintDocWithResult(id, docId);

                m_client = oldClient;

            }
            return _rtn;
        }

        public boolean pPrintDocWithResult(int id, int docId) {
            boolean _rtn = false;

            if (id == csNO_ID) {
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

                printManager.DescripUser = pGetDescripUser();
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

                if (!TypeOf(m_client Is CSIDocumento.cIDocumento)) { / * *TODO:** goto found: GoTo ExitProc* /  }
                iDoc = m_client;

                if (id == csNO_ID) {
                    id = iDoc.Id;
                }

                if (id == csNO_ID) {
                    MsgInfo("Debe grabar el documento para poder imprimirlo", "Imprimir");
                    / * *TODO:** goto found: GoTo ExitProc* /
                }

                printManager = CSKernelClient2.CreateObject("CSPrintManager2.cPrintManager");

                // OJO: Esto es nuevo y puede traer problemas
                //      es para que no se impriman formularios
                //      con cambios sin guardar
                //
                if (!m_inSave) {

                    if (!pSaveChanges(false, false)) { / * *TODO:** goto found: GoTo ExitProc* /  }

                }

                // With printManager;

                    printManager.IsForEmail = byEmail;
                    printManager.EmailAddress = pGetEmailAddress();
                    printManager.Path = GetValidPath(mMngIni.iniGetEx(C_RPT_KEY, C_RPT_PATH_REPORTS, mUtil.gAppPath));
                    printManager.CommandTimeout = mUtil.val(mMngIni.iniGetEx(C_RPT_KEY, C_RPT_COMMAND_TIMEOUT, 0));
                    printManager.ConnectionTimeout = mUtil.val(mMngIni.iniGetEx(C_RPT_KEY, C_RPT_CONNECTION_TIMEOUT, 0));

                    printManager.DescripUser = pGetDescripUser();
                    printManager.AutoPrint = m_autoPrint;

                    printManager.ShowPrint(id, csNO_ID, iDoc.DocId);

                    if (printManager.DocImpreso) {
                        pReloadDocument();
                    }
                // {end with: printManager}

                / * *TODO:** goto found: GoTo ExitProc* /
            } catch (Exception ex) {
                MngError(VBA.ex, "pPrint", C_MODULE, "");
                if (VBA.ex.Number) { / * *TODO:** resume found: Resume(ExitProc)* /  }
                / * *TODO:** label found: ExitProc:* /

            }
        }

        private String pGetDescripUser() {
            String rtn = "";

            rtn = m_client.MessageEx(ABM_MSG.MSG_EXPORT_GET_FILE_NAME_POSTFIX, null);

            return rtn;
        }

        private String pGetPrintTitle() {
            String rtn = "";

            rtn = m_client.MessageEx(ABM_MSG.MSG_PRINT_GET_TITLE, null);

            return rtn;
        }

        private String pGetEmailAddress() {


                String emailAddress = "";

                emailAddress = m_client.MessageEx(ABM_MSG.MSG_EXPORT_GET_EMAIL, null).trim();

                return emailAddress;
            }
        }

        private boolean pNewWithWizard() {

                return mMsgConstantes.varToBool(m_client.MessageEx(ABM_MSG.MSG_DOC_NEW_WITH_WIZARD, null));
            }
        }

        private int pGetTabIndex(cIABMProperty iProperty) { // TODO: Use of ByRef founded Private Function pGetTabIndex(ByRef iProperty As cIABMProperty) As Long
            int _rtn = 0;
            // With iProperty;
                if (iProperty.TabIndex == TabIndexType.TAB_ID_XT_ALL  || iProperty.TabIndex == TabIndexType.TAB_ID_XT_ALL2) {
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
            m_constLeft = getFrm().LB(0).cABMProperty.getLeft();
            m_constLeftOp = getFrm().OP(0).cABMProperty.getLeft();
            m_textOrigWidth = getFrm().TX(0).cABMProperty.getWidth();

            if (m_isItems) {
                m_constTop = getFrm().shTabItems.cABMProperty.getTop() + 100;

            }
            else if (m_isFooter) {
                m_constTop = getFrm().shTabFooter.cABMProperty.getTop() + C_OFFSET_V1;
                m_constLeft = getFrm().shTabFooter.cABMProperty.getLeft() + 200;
            }
            else {
                m_constTop = getFrm().HL(0).cABMProperty.getTop();
            }

            m_constTopOp = getFrm().OP(0).cABMProperty.getTop();
        }

        private Object initLoadMembers() {
            //m_bLoadAdHock = False
            m_bLoadList = false;
            m_bLoadHelp = false;
            m_bLoadNumeric = false;
            m_bLoadDate = false;
            m_bLoadOption = false;
            m_bLoadLabel = false;
            m_bLoadTitle = false;
            m_bLoadProgressBar = false;
            m_bLoadDescription = false;
            m_bLoadImage = false;
            m_bLoadText = false;
            m_bLoadTextM = false;
            m_bLoadFile = false;
            m_bLoadFolder = false;
            m_bLoadPassword = false;
            m_bLoadCheck = false;
            m_bLoadGrid = false;
            m_bLoadButton = false;
        }

        public void initButtons() {
            if (getFrm(instanceOf fABMDoc)) {
                m_formDoc.setNoButtons1(m_noButtons1);
                m_formDoc.setNoButtons2(m_noButtons2);
                m_formDoc.setNoButtons3(m_noButtons3);
                m_formDoc.setButtonsEx2(m_buttonsEx2);
                m_formDoc.setButtonsEx3(m_buttonsEx3);
                m_formDoc.setToolbarButtons();
            }
        }

        // construccion - destruccion
        private void class_Initialize() {
            #If PREPROC_DEBUG Then;
            gdbInitInstance(C_MODULE);
            #End If;



                m_isDocument = false;
                m_isFooter = false;
                m_isItems = false;
                m_formShowed = false;
                m_minHeight = 5310;
                m_minWidth = 8640;
                m_tabHideCtrlsInAllTab = -1;

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
                m_mngGrid = null;

                if (m_formABM != null) {
                    Unload(m_formABM);
                }
                if (m_formDoc != null) {
                    Unload(m_formDoc);
                }
                if (m_formWizard != null) {
                    Unload(m_formWizard);
                }

                m_formABM = null;
                m_formDoc = null;
                m_formWizard = null;

                m_owner = null;

                #If PREPROC_DEBUG Then;
                gdbTerminateInstance(C_MODULE);
                #End If;
            }
        }

        private String pGetNameGrid(cIABMProperty iProp) { // TODO: Use of ByRef founded Private Function pGetNameGrid(ByRef iProp As cIABMProperty) As String
            String _rtn = "";
            if (iProp.Name != "") {
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

                if (iProp.PropertyType == cspGrid) {
                    i = i + 1;
                    grid = iProp.Grid;

                    oProp = iProp;

                    if (!oProp.getCtl() == null && getFrm() Is m_formABM) {
                        indexGrid = getFrm().GetIndexGrid(oProp.getCtl());
                        if (indexGrid == 0) { indexGrid = i; }
                    else {
                        indexGrid = i;
                    }

                    getFrm().SetDontResize(indexGrid) = grid.setDontResize();

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
                    if (grid.setDontResizeHeight()) {
                        getFrm().SetDontResizeHeight(indexGrid) = true;

                        if (!oProp.getCtl() == null) {
                            pSetGridHeight(oProp.getCtl(), iProp.Height);
                        }
                    }
                }
            }
        }

        private void pSetGridHeight(Object ctl, int height) {

                if (height > 0) {
                    ctl.Height = height;
                }
            }
        }

        private void pSetEnabled(boolean bEnabled) {


                Object ctl = null;
                int i = 0;

                if (bEnabled) {
                    for (int _i = 0; _i < getFrm().Controls.size(); _i++) {
                        ctl = Frm.Controls.getItem(_i);
                        if (ctl(instanceOf cGridAdvanced)) {
                            i = i + 1;
                            if (m_enabledState[i]) {
                                ctl.Enabled = true;
                            }
                        }
                    }

                    G.redim(m_enabledState, 0);
                }
                else {

                    G.redim(m_enabledState, 0);

                    for (int _i = 0; _i < getFrm().Controls.size(); _i++) {
                        ctl = Frm.Controls.getItem(_i);
                        if (ctl(instanceOf cGridAdvanced)) {
                            i = i + 1;
                            G.redimPreserve(m_enabledState, i);
                            m_enabledState[i] = ctl.Enabled;
                            ctl.Enabled = false;
                        }
                    }
                }
            }
        }

        private void pRefreshTitle() {
            Object w_frm = getFrm();
                if (!ValEmpty(m_title2, csText)) {
                    w_frm.lbTitleEx2.cABMDocPropertiesCol.setCaption(" - "+ m_title2);
                    w_frm.lbTitleEx2.cABMProperty.setLeft(w_frm.lbTitle.cABMProperty.getLeft() + w_frm.lbTitle.cABMProperty.getWidth() + 50);
                }
                else {
                    w_frm.lbTitleEx2.cABMDocPropertiesCol.setCaption("");
                }
            // {end with: w_frm}
        }

        public void refreshFormCaption() {

                getFrm().Caption = pGetFormCaption();
            }
        }

        private String pGetFormCaption() {
            return m_formCaption+ mUtil.gEmpNombre+ " - "+ m_client.Title+ " || Presione F12 para ver las teclas de acceso rapido";
        }

        private void pSetBackgroundColor() {
            if (mUtil.gBackgroundColor != 0) {

                setBakcColorTagMainEx(mUtil.gBackgroundColor);

            }
        }

        public void setBakcColorTagMainEx(int color) {
            mUtil.gBackgroundColor = color;
            if (m_formABM != null) {
                m_formABM.ShTab.cABMGridRow.setBackColor(color);
            }
            else if (m_formDoc != null) {
                m_formDoc.ShTab.cABMGridRow.setBackColor(color);
                m_formDoc.shTabFooter.cABMGridRow.setBackColor(color);
                m_formDoc.shTabItems.cABMGridRow.setBackColor(color);
            }
            else if (m_formWizard != null) {
                m_formWizard.ShTab.cABMGridRow.setBackColor(color);
                m_formWizard.shBack.cABMGridRow.setBackColor(color);
                m_formWizard.shTitle.cABMGridRow.setBackColor(vbWhite);
            }
        }

        private boolean pGetCtrlVisibleInTab(Object c, int index) { // TODO: Use of ByRef founded Private Function pGetCtrlVisibleInTab(ByRef c As Object, ByVal Index As Long) As Boolean
            return mUtil.val(c.Tag) == index  || (mUtil.val(c.Tag) == TabIndexType.TAB_ID_XT_ALL  && index != m_tabHideCtrlsInAllTab) || mUtil.val(c.Tag) == TabIndexType.TAB_ID_XT_ALL2;
        }

        private void pWizDisableButtons() {

                if (m_formWizard == null) { return; }
                //m_FormWizard.Enabled = False
                //m_FormWizard.cmdNext.Enabled = False
                m_inProcess = true;
                VBA.ex.Clear;
            }
        }

        private void pWizEnableButtons() {

                if (m_formWizard == null) { return; }
                //m_FormWizard.Enabled = True
                //m_FormWizard.cmdNext.Enabled = True
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