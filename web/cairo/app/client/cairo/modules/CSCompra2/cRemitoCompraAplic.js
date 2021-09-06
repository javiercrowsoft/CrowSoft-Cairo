(function() {
    "use strict";

    Cairo.module("RemitoCompraAplic.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

        var createObject = function() {

            var self = {};

            var getText = Cairo.Language.getText;

            var TITLE = getText(1949, ""); // Aplicación Remito de Compra
            var SAVE_ERROR_MESSAGE = getText(1945, ""); // Error al grabar la remito de compra

            var Dialogs = Cairo.Dialogs;

            var C_MODULE = "cRemitoCompraAplic";

            var P = Cairo.Promises;
            var C = Cairo.General.Constants;
            var CC = Cairo.Compras.Constants;
            var CT = Cairo.Tesoreria.Constants;
            var getCell = Dialogs.cell;
            var cellVal = Dialogs.cellVal;
            var D = Cairo.Documents;
            var M = Cairo.Modal;
            var DB = Cairo.Database;
            var NO_ID = Cairo.Constants.NO_ID;
            var cellFloat = Dialogs.cellFloat;
            var Types = Cairo.Constants.Types;
            var valField = DB.valField;
            var valFieldDateValue = DB.valFieldDateValue;

            var CSCNRO_DOC = "nrodoc";
            var CSCPENDIENTE = "Pendiente";
            var CSCIMPORTE = "Importe";
            var CSCVINC_ID = "vinc_id";
            var CSCRCD_ID = "rcd_id";
            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   ORDEN - SOLAPA
            //
            //////////////////////////////////////////////////////////////////////////////////////

            // Orden

            var K_ORDEN = 10;
            var K_APLIC_ORDEN = 11;
            var C_ITEMS = "Items";
            var C_APLICORDEN = "AplicOrden";

            var CSCFECHA = "Fecha";
            var CSCAPLICADO = "Aplicado";
            var CSCAPLIC_REMITO = "AplicRemito";
            var CSCAPLIC_ORDEN = "AplicOrden";

            // Grillas de Ordenes / Remitos
            var KII_RCI_ID = 1;
            var KII_PR_ID = 2;
            var KII_APLICADO = 4;
            var KII_APLICADO2 = 5;
            var KII_PENDIENTE = 6;

            var KIP_OCRC_ID = 1;

            var KIFD_FCI_ID = 2;

            // Estos dos tienen el mismo valor aproposito
            var KIP_OCI_ID = 3;
            var KIFD_RCI_ID = KIP_OCI_ID;

            var KIP_DOC = 7;
            var KIP_FECHA = 8;
            var KIP_PENDIENTE = 9;
            var KIP_APLICADO = 11;
            var KIP_APLICADO2 = 12;
            var KIP_NRODOC = 15;
            var KIP_IDX1 = 16;
            var KIP_IDX2 = 17;

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   FACTURA / DEVOLUCION - SOLAPA
            //
            //////////////////////////////////////////////////////////////////////////////////////

            // Orden

            var K_FAC_DEV = 20;
            var K_APLIC_FAC_DEV = 21;
            var C_FACDEV = "FacDev";
            var C_APLICFACDEV = "AplicFacDev";

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   ORDENES / REMITOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

//*TODO:** type is translated as a new class at the end of the file Private Type T_ItAplic

//*TODO:** type is translated as a new class at the end of the file Private Type T_Aplic

            // pseudo-constantes
            var c_ErrorSave = "";

            // generales

            var m_editing;
            var m_dialog;
            var m_generalConfig;
            var m_rcId = 0;
            var m_isDevolucion;
            var m_rcNumero = "";
            var m_proveedor = "";
            var m_provId = 0;
            var m_docId = 0;
            var m_sucId = 0;
            var m_total = 0;

            var m_monDefault = 0;

            var m_lastRowItem = 0;
            var m_lastRowFacDev = 0;

            // Edit Apply
            //
            var m_objectClient;
            var m_emp_id = 0;
            var m_emp_nombre = "";

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   ORDENES / REMITOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var m_vOrdenes;
            var m_vFacDevs;
            var m_rci_id = 0;

            // eventos

            // Edit Apply
            //
            self.setObjectClient = function(rhs) {
                m_objectClient = rhs;
            };

            self.getId = function() {
                return m_rcId;
            };

            // propiedades friend
            self.show = function(rcId,  total,  rcNumero,  provId,  proveedor,  sucId,  docId,  isDevolucion) {
                var _rtn = null;

                if(m_dialog === null) {
                    m_dialog = new cABMGeneric();
                }

                if(m_rcId !== rcId) {
                    m_isDevolucion = isDevolucion;
                    m_rcId = rcId;
                    m_rcNumero = rcNumero;
                    m_proveedor = proveedor;
                    m_provId = provId;
                    m_docId = docId;
                    m_sucId = sucId;
                    m_total = total;

                    // Edit Apply
                    //
                    if(!Cairo.Database.getData(mComprasConstantes.DOCUMENTO, mComprasConstantes.DOC_ID, m_docId, C.EMP_ID, m_emp_id)) { return _rtn; }

                    if(!Cairo.Database.getData(Cairo.Constants.EMPRESA, C.EMP_ID, m_emp_id, Cairo.Constants.EMP_NAME, m_emp_nombre)) { return _rtn; }

                    _rtn = pEdit();
                }
                else {
                    m_dialog.getObjForm().ZOrder;

                    _rtn = true;
                }


                return _rtn;
            };

            // funciones friend
            // funciones privadas

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   cIABMClient_
            //
            //////////////////////////////////////////////////////////////////////////////////////

            self.copy = function() {
            };

            self.editNew = function() {
            };

            self.getApplication = function() {
                return Cairo.Application.getName();
            };

            self.editDocumentsEnabled = function() {
                return false;
            };

            self.copyEnabled = function() {
                return false;
            };

            self.addEnabled = function() {
                return false;
            };

            self.showDocDigital = function() {
                return false;
            };

            self.messageEx = function(messageID,  info) {
                var abmObj = null;

                switch (messageID) {

                    case Dialogs.Message.MSG_GRID_ROW_CHANGE:
                        if(info === null) { return null; }

                        var row = null;
                        var iProp = null;
                        var aplicado = null;

                        iProp = info;

                        switch (iProp.getKey()) {

                            case K_ORDEN:

                                abmObj = m_dialog;

                                // Guardo la aplicacion para el item editado anteriormente
                                //
                                if(m_lastRowItem !== 0) {
                                    aplicado = pItUpdateGrids(true, m_vOrdenes);
                                }

                                // Muestro las aplicaciones para este item
                                //
                                m_lastRowItem = iProp.getSelectedIndex();
                                row = iProp.getGrid().getRows(m_lastRowItem);
                                if(row === null) { return null; }

                                pItSetAplicItems(m_dialog.getProperties().item(C_APLICORDEN), Dialogs.cell(row, KII_RCI_ID).getID(), Dialogs.cell(row, KII_PR_ID).getID(), m_vOrdenes, true);

                                abmObj.ShowValue(m_dialog.getProperties().item(C_APLICORDEN), true);

                                break;

                            case K_FAC_DEV:

                                abmObj = m_dialog;

                                // Guardo la aplicacion para el item editado anteriormente
                                //
                                if(m_lastRowFacDev !== 0) {
                                    aplicado = pItUpdateGrids(false, m_vFacDevs);
                                }

                                // Muestro las aplicaciones para este item
                                //
                                m_lastRowFacDev = iProp.getSelectedIndex();
                                row = iProp.getGrid().getRows(m_lastRowFacDev);
                                if(row === null) { return null; }

                                pItSetAplicItems(m_dialog.getProperties().item(C_APLICFACDEV), Dialogs.cell(row, KII_RCI_ID).getID(), Dialogs.cell(row, KII_PR_ID).getID(), m_vFacDevs, false);

                                abmObj.ShowValue(m_dialog.getProperties().item(C_APLICFACDEV), true);

                                break;
                        }
                        break;
                }

                return true;
            };

            self.discardChanges = function() {
                if(!pItLoadAplicItems()) { return; }
                return Cairo.Promises.resolvedPromise(refreshCollection());
            };

            self.propertyChange = function(key) {
            };

            self.save = function() {
                return pSave();
            };

            var updateList = function() {
                if(m_id === Cairo.Constants.NO_ID) { return; }
                if(m_listController === null) { return; }

                if(m_isNew) {
                    m_listController.addLeave(m_id, m_branchId);
                }
                else {
                    m_listController.refreshBranch(m_id, m_branchId);
                }
            };

            self.terminate = function() {

                m_editing = false;

                try {
                    if(m_listController !== null) {
                        updateList();
                        m_listController.removeEditor(self);
                    }
                }
                catch (ignored) {
                    Cairo.logError('Error in terminate', ignored);
                }
            };

            self.getPath = function() {
                return "#general/remitocompraaplic/" + m_id.toString();
            };

            self.getEditorName = function() {
                var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
                return "remitocompraaplic" + id;
            };

            self.getTitle = function() {
                var _rtn = "";
                // **TODO:** on error resume next found !!!
                //'Aplicación Remito de Compra
                _rtn = Cairo.Language.getText(1949, "");
                m_dialog.setTitle(m_rcNumero+ " - "+ m_proveedor);

                return _rtn;
            };

            self.validate = function() {
                return Cairo.Promises.resolvedPromise(true);
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   cIABMClientGrid_
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var isEmptyRow = function(key,  row,  rowIndex) {
                return false;
            };

            var columnAfterUpdate = function(key,  lRow,  lCol) {
                var _rtn = null;
                try {
                    switch (key) {
                        case K_APLIC_ORDEN:
                            _rtn = pItColAUpdate(pItGetItemsProperty(true), lRow, lCol, true);
                            break;

                        case K_APLIC_FAC_DEV:
                            _rtn = pItColAUpdate(pItGetItemsProperty(false), lRow, lCol, false);
                            break;
                    }

                    // **TODO:** goto found: GoTo ExitProc;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, ex, "columnAfterUpdate", C_MODULE, "");
                    // **TODO:** label found: ExitProc:;
                }
                // **TODO:** on error resume next found !!!

                return _rtn;
            };

            var columnAfterEdit = function(key,  lRow,  lCol,  newValue,  newValueID) {
                return true;
            };

            var columnBeforeEdit = function(key,  lRow,  lCol,  iKeyAscii) {
                var _rtn = null;
                try {
                    switch (key) {
                        case K_APLIC_ORDEN:
                            _rtn = pItColBEdit(pItGetItemsProperty(true), lRow, lCol, iKeyAscii);
                            break;

                        case K_APLIC_FAC_DEV:
                            _rtn = pItColBEdit(pItGetItemsProperty(false), lRow, lCol, iKeyAscii);
                            break;
                    }
                    // **TODO:** goto found: GoTo ExitProc;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, ex, "columnBeforeEdit", C_MODULE, "");
                    // **TODO:** label found: ExitProc:;
                }
                // **TODO:** on error resume next found !!!

                return _rtn;
            };

            var columnButtonClick = function(key,  lRow,  lCol,  iKeyAscii) {

            };

            var columnClick = function(key,  lRow,  lCol) {

            };

            var dblClick = function(key,  lRow,  lCol) {
                try {

                    var id = null;

                    switch (key) {

                        case K_APLIC_ORDEN:

                            var w_pItGetItemsAplic = pItGetItemsAplic(true).getRows();

                            id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIP_OCI_ID).getID();

                            if(id !== Cairo.Constants.NO_ID) {

                                if(!Cairo.Database.getData("OrdenCompraItem", "oci_id", id, "oc_id", id)) { return; }

                                if(id !== Cairo.Constants.NO_ID) {

                                    ShowDocAux(id, "CSCompra2.cOrdenCompra", "CSABMInterface2.cABMGeneric");
                                }
                            }

                            break;

                        case K_APLIC_FAC_DEV:

                            var w_pItGetItemsAplic = pItGetItemsAplic(false).getRows();

                            var objEditName = null;

                            id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIFD_RCI_ID).getID();

                            if(id !== Cairo.Constants.NO_ID) {

                                if(!Cairo.Database.getData("RemitoCompraItem", "rci_id", id, "rc_id", id)) { return; }

                                objEditName = "CSCompra2.cRemitoCompra";

                            }
                            else {

                                id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIFD_FCI_ID).getID();

                                if(id !== Cairo.Constants.NO_ID) {
                                    if(!Cairo.Database.getData("FacturaCompraItem", "fci_id", id, "fc_id", id)) { return; }

                                    objEditName = "CSCompra2.cFacturaCompra";
                                }
                            }

                            if(id !== Cairo.Constants.NO_ID) {

                                ShowDocAux(id, objEditName, "CSABMInterface2.cABMGeneric");
                            }

                            break;
                    }

                    return;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, ex, "dblClick", C_MODULE, "");
                }
            };

            var deleteRow = function(key,  row,  lRow) {

            };

            var listAdHock = function(key,  row,  colIndex,  list) {

            };

            self.newRow = function(key, rows) {

            };

            var validateRow = function(key,  row,  rowIndex) {
                return true;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   GENERICAS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pEdit = function() {
                var _rtn = null;
                try {

                    if(!pItLoadAplicItems()) { return _rtn; }
                    if(!loadCollection()) { return _rtn; }

                    m_editing = true;
                    _rtn = true;

                    return _rtn;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, ex, "pEdit", C_MODULE, "");
                }

                return _rtn;
            };

            var loadCollection = function() {
                var c = null;
                var iTab = null;
                var oGrd = null;

                m_lastRowItem = 0;
                m_lastRowFacDev = 0;

                m_dialog.getProperties().clear();

                var w_tabs = m_dialog.getTabs();

                w_tabs.clear();

                var tab = w_tabs.add(null);
                //'Ordenes
                tab.setName(Cairo.Language.getText(1950, ""));

                var tab = w_tabs.add(null);
                tab.setIndex(1);
                //'Facturas
                tab.setName(Cairo.Language.getText(1607, ""));

                var properties = m_dialog.getProperties();

                c = properties.add(null, C_ITEMS);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();
                if(!pItLoadItems(c)) { return false; }
                c.setKey(K_ORDEN);
                c.setName("Items");
                c.setWidth(9400);
                c.setLeft(250);
                c.setHeight(2600);
                c.setGridEditEnabled(false);
                c.setGridAddEnabled(false);
                c.setGridRemoveEnabled(false);
                oGrd = c.getGrid();
                oGrd.setRowSelect(true);
                oGrd.setDontSelectInGotFocus(true);

                c = properties.add(null, C_APLICORDEN);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();
                if(!pItSetGridAplicOrden(c)) { return false; }
                c.setKey(K_APLIC_ORDEN);
                c.setName("Orden");
                c.setWidth(9400);
                c.setLeft(250);
                c.setTop(4200);
                c.setHeight(2000);
                c.setGridEditEnabled(true);
                c.setGridAddEnabled(false);
                c.setGridRemoveEnabled(false);
                oGrd = c.getGrid();
                oGrd.setRowSelect(true);
                oGrd.setDontSelectInGotFocus(true);

                c = properties.add(null, C_FACDEV);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();
                if(!pItLoadFacDev(c)) { return false; }
                c.setKey(K_FAC_DEV);
                c.setName("Items2");
                c.setWidth(9400);
                c.setLeft(250);
                c.setHeight(2600);
                c.setGridEditEnabled(false);
                c.setGridAddEnabled(false);
                c.setGridRemoveEnabled(false);
                c.setTabIndex(1);
                oGrd = c.getGrid();
                oGrd.setRowSelect(true);
                oGrd.setDontSelectInGotFocus(true);

                c = properties.add(null, C_APLICFACDEV);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();
                if(!pItSetGridAplicFacDev(c)) { return false; }
                c.setKey(K_APLIC_FAC_DEV);
                c.setName("Facturas");
                c.setWidth(9400);
                c.setLeft(250);
                c.setTop(4200);
                c.setHeight(2000);
                c.setGridEditEnabled(true);
                c.setGridAddEnabled(false);
                c.setGridRemoveEnabled(false);
                c.setTabIndex(1);
                oGrd = c.getGrid();
                oGrd.setRowSelect(true);
                oGrd.setDontSelectInGotFocus(true);

                var abmObj = null;
                abmObj = m_dialog;
                abmObj.MinHeight = 7800;

                // Edit Apply
                //
                abmObj.MinWidth = 10050;

                if(!m_dialog.show(self)) { return false; }

                return true;
            };

            var pSave = function() {
                var _rtn = null;

                // Edit Apply
                //
                if(m_emp_id !== Cairo.Company.getId()) {
                    MsgApplyDisabled(m_emp_nombre);
                    return _rtn;
                }

                var rcTMPId = null;

                pItUpdateGrids(true, m_vOrdenes);
                pItUpdateGrids(false, m_vFacDevs);

                // Temporal
                if(!pSaveDocCpra(m_docId, rcTMPId)) { return _rtn; }

                // Ordenes
                if(!pItSaveOrdenes(rcTMPId, m_vOrdenes)) { return _rtn; }

                // Facturas / Devoluciones
                if(!pItSaveFacDev(rcTMPId, m_vFacDevs)) { return _rtn; }

                // Aplico llamando al sp
                var sqlstmt = null;
                var rs = null;

                sqlstmt = "sp_DocRemitoCompraSaveAplic "+ rcTMPId.toString();
                if(!Cairo.Database.openRs(sqlstmt, rs, , , , "pSave", C_MODULE, c_ErrorSave)) { return _rtn; }

                if(rs.isEOF()) { return _rtn; }

                var id = null;
                if(!GetDocIDFromRecordset(rs, id)) { return _rtn; }

                if(id === Cairo.Constants.NO_ID) { return _rtn; }

                if(!pItLoadAplicItems()) { return _rtn; }

                _rtn = true;

                // Edit Apply
                //
                pRefreshClient();

                return _rtn;
            };

            // Edit Apply
            //
            var pRefreshClient = function() {
                // **TODO:** on error resume next found !!!
                if(m_objectClient === null) { return; }
                m_objectClient.self.refresh();
            };

            //////////////////////////////////////////////////////////////////////////////////////
            // RemitoCompraTemporal
            //////////////////////////////////////////////////////////////////////////////////////
            var pSaveDocCpra = function(docId,  rcTMPId) { // TODO: Use of ByRef founded Private Function pSaveDocCpra(ByVal DocId As Long, ByRef RcTMPId As Long) As Boolean
                var register = new DB.Register();

                register = new cRegister();
                register.setFieldId(mComprasConstantes.RC_TMP_ID);
                register.setTable(mComprasConstantes.REMITO_COMPRATMP);

                register.setId(Cairo.Constants.NEW_ID);
                register.getFields().add2(mComprasConstantes.RC_ID, m_rcId, Types.id);

                register.getFields().add2(mComprasConstantes.RC_NUMERO, 0, Types.long);
                register.getFields().add2(mComprasConstantes.RC_NRODOC, "", Types.text);

                register.getFields().add2(mComprasConstantes.PROV_ID, 0, Types.long);
                register.getFields().add2(mComprasConstantes.SUC_ID, 0, Types.long);
                register.getFields().add2(mComprasConstantes.DOC_ID, docId, Types.id);
                register.getFields().add2(mComprasConstantes.CPG_ID, csECpgTipo.cSECPGT_FECHADOCUMENTO, Types.id);

                register.getFields().add2(C.EST_ID, CSGeneralEx2.csEEstado.cSEEST_PENDIENTE, Types.id);

                register.getFields().setHaveLastUpdate(true);
                register.getFields().setHaveWhoModify(true);

                if(!register.beginTrans(Cairo.Database)) { return false; }

                if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return false; }

                if(!register.commitTrans()) { return false; }

                rcTMPId = register.getID();
                return true;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   ORDENES / REMITOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pItLoadAplicItems = function() {

                if(!pItLoadAplicAplicados(m_vOrdenes, true)) { return false; }
                if(!pItLoadAplicCreditos(m_vOrdenes, true)) { return false; }

                if(!pItLoadAplicAplicados(m_vFacDevs, false)) { return false; }
                if(!pItLoadAplicCreditos(m_vFacDevs, false)) { return false; }

                return true;
            };

            var pItLoadItems = function(iProp) { // TODO: Use of ByRef founded Private Function pItLoadItems(ByRef iProp As cIABMProperty) As Boolean
                return pItLoadItemsAux(iProp, true);
            };

            var pItSetGridAplicOrden = function(iProp) { // TODO: Use of ByRef founded Private Function pItSetGridAplicOrden(ByRef iProp As cIABMProperty) As Boolean
                return pItSetGridAplicAux(iProp, true);
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   GENERICAS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pItLoadItemsAux = function(iProp,  isOrden) { // TODO: Use of ByRef founded Private Function pItLoadItemsAux(ByRef iProp As cIABMProperty, ByVal IsOrden As Boolean) As Boolean
                var sqlstmt = null;
                var rs = null;
                var grid = null;
                var row = null;
                var value = null;

                sqlstmt = "sp_DocRemitoCompraGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_rcId+ ",1";
                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pItLoadItems", C_MODULE)) { return false; }

                iProp.getGrid().getColumns().clear();
                iProp.getGrid().getRows().clear();

                grid = iProp.getGrid();

                var w_columns = grid.getColumns();
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KII_RCI_ID);

                var elem = w_columns.add(null);
                //'Producto
                elem.setName(Cairo.Language.getText(1619, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(2500);
                elem.setKey(KII_PR_ID);

                var elem = w_columns.add(null);
                //'Pendiente
                elem.setName(Cairo.Language.getText(1609, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1245);
                elem.setKey(KII_PENDIENTE);

                var elem = w_columns.add(null);
                //'Aplicado
                elem.setName(Cairo.Language.getText(1608, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1245);
                elem.setKey(KII_APLICADO);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KII_APLICADO2);

                var f = null;
                var fv = null;

                while (!rs.isEOF()) {

                    f = iProp.getGrid().getRows().add(null);

                    elem = row.add(null);
                    elem.setId(Cairo.Database.valField(rs.getFields(), mComprasConstantes.RCI_ID));
                    elem.setKey(KII_RCI_ID);

                    elem = row.add(null);
                    elem.setId(Cairo.Database.valField(rs.getFields(), C.PR_ID));
                    elem.setValue(Cairo.Database.valField(rs.getFields(), C.PR_NAME_COMPRA));
                    elem.setKey(KII_PR_ID);

                    elem = row.add(null);
                    if(isOrden) {
                        elem.setValue(Cairo.Database.valField(rs.getFields(), mComprasConstantes.RCI_PENDIENTE));
                    }
                    else {
                        elem.setValue(Cairo.Database.valField(rs.getFields(), mComprasConstantes.RCI_PENDIENTEFAC));
                    }
                    elem.setKey(KII_PENDIENTE);

                    if(isOrden) {
                        value = Cairo.Database.valField(rs.getFields(), CSCAPLIC_ORDEN);
                    }
                    else {
                        value = Cairo.Database.valField(rs.getFields(), CSCAPLIC_REMITO);
                    }

                    elem = row.add(null);
                    elem.setValue(value);
                    elem.setKey(KII_APLICADO);

                    if(value !== 0) {
                        row = f;
                        row.setBackColor(&HFFCC99);
                    }

                    elem = row.add(null);
                    elem.setValue(value);
                    elem.setKey(KII_APLICADO2);

                    rs.MoveNext;
                }

                return true;
            };

            var pItSetGridAplicAux = function(iProp,  isOrden) { // TODO: Use of ByRef founded Private Function pItSetGridAplicAux(ByRef iProp As cIABMProperty, ByVal IsOrden As Boolean) As Boolean
                var grid = null;

                iProp.getGrid().getColumns().clear();
                iProp.getGrid().getRows().clear();

                grid = iProp.getGrid();

                var w_columns = grid.getColumns();
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIP_IDX1);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIP_IDX2);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIP_OCRC_ID);

                if(!isOrden) {
                    var elem = w_columns.add(null);
                    elem.setVisible(false);
                    elem.setKey(KIFD_FCI_ID);
                }

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIP_OCI_ID);

                var elem = w_columns.add(null);
                //'Documento
                elem.setName(Cairo.Language.getText(1567, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(2925);
                elem.setKey(KIP_DOC);

                var elem = w_columns.add(null);
                //'Comprobante
                elem.setName(Cairo.Language.getText(1610, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(1575);
                elem.setKey(KIP_NRODOC);

                var elem = w_columns.add(null);
                //'Fecha
                elem.setName(Cairo.Language.getText(1569, ""));
                elem.setType(Dialogs.PropertyType.date);
                elem.setWidth(1395);
                elem.setKey(KIP_FECHA);

                var elem = w_columns.add(null);
                //'Pendiente
                elem.setName(Cairo.Language.getText(1609, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1245);
                elem.setKey(KIP_PENDIENTE);

                var elem = w_columns.add(null);
                //'Aplicado
                elem.setName(Cairo.Language.getText(1608, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1245);
                elem.setKey(KIP_APLICADO);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIP_APLICADO2);
                return true;
            };

            var pItLoadAplicAplicados = function(vAplic,  isOrden) { // TODO: Use of ByRef founded Private Function pItLoadAplicAplicados(ByRef vAplic() As T_Aplic, ByVal IsOrden As Boolean) As Boolean
                var sqlstmt = null;
                var rs = null;
                var i = null;
                var idx = null;

                if(isOrden) {
                    sqlstmt = "sp_DocRemitoCompraGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_rcId+ ",4";
                }
                else {
                    sqlstmt = "sp_DocRemitoCompraGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_rcId+ ",2";
                }

                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicAplicados", C_MODULE)) { return false; }

                G.redim(vAplic, 0);
                G.redimPreserve(0, .vAplicaciones);

                if(!rs.isEOF()) {

                    rs.MoveLast;
                    rs.MoveFirst;

                    while (!rs.isEOF()) {

                        if(isOrden) {
                            i = pItAddToCreditos(Cairo.Database.valField(rs.getFields(), mComprasConstantes.OCI_ID), Cairo.Constants.NO_ID, Cairo.Constants.NO_ID, idx, vAplic);
                        }
                        else {
                            i = pItAddToCreditos(Cairo.Constants.NO_ID, Cairo.Database.valField(rs.getFields(), mComprasConstantes.FCI_ID), Cairo.Database.valField(rs.getFields(), mComprasConstantes.RCI_ID), idx, vAplic);
                        }

                        // Documento
                        //
                        vAplic.docNombre = Cairo.Database.valField(rs.getFields(), mComprasConstantes.DOC_NAME);
                        vAplic.NroDoc = Cairo.Database.valField(rs.getFields(), CSCNRO_DOC);
                        vAplic.Fecha = Cairo.Database.valField(rs.getFields(), CSCFECHA);

                        // Pendiente
                        //
                        vAplic.Pendiente = Cairo.Database.valField(rs.getFields(), CSCPENDIENTE);
                        vAplic.PendienteActual = vAplic.Pendiente;

                        if(isOrden) {
                            // Orden
                            //
                            vAplic.oci_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.OCI_ID);

                        }
                        else {
                            // Remito
                            //
                            vAplic.rci_id = Cairo.Database.valField(rs.getFields(), CSCRCD_ID);
                            vAplic.fci_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.FCI_ID);
                        }

                        vAplic.PR_ID = Cairo.Database.valField(rs.getFields(), C.PR_ID);

                        // Aplicaciones
                        //*TODO:** can't found type for with block
                        //*With .vAplicaciones(idx)
                        var w___TYPE_NOT_FOUND = vAplic.vAplicaciones(idx);

                        w___TYPE_NOT_FOUND.vinc_id = Cairo.Database.valField(rs.getFields(), CSCVINC_ID);

                        w___TYPE_NOT_FOUND.rci_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.RCI_ID);

                        w___TYPE_NOT_FOUND.Aplicado = Cairo.Database.valField(rs.getFields(), CSCAPLICADO);

                        // Aplicacion total sobre este credito
                        vAplic.Aplicado = vAplic.Aplicado + vAplic.vAplicaciones(idx).Aplicado;
                        vAplic.AplicadoActual = vAplic.Aplicado;

                        rs.MoveNext;
                    }
                }

                return true;
            };

            var pItLoadAplicCreditos = function(vAplic,  isOrden) { // TODO: Use of ByRef founded Private Function pItLoadAplicCreditos(ByRef vAplic() As T_Aplic, ByVal IsOrden As Boolean) As Boolean
                var sqlstmt = null;
                var rs = null;
                var i = null;

                if(isOrden) {
                    sqlstmt = "sp_DocRemitoCompraGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_rcId+ ",5";
                }
                else {
                    sqlstmt = "sp_DocRemitoCompraGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_rcId+ ",3";
                }

                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicCreditos", C_MODULE)) { return false; }

                if(!rs.isEOF()) {

                    rs.MoveLast;
                    rs.MoveFirst;

                    i = vAplic.Length;
                    G.redimPreserve(vAplic, i + rs.RecordCount);

                    while (!rs.isEOF()) {

                        i = i + 1;
                        vAplic.PR_ID = Cairo.Database.valField(rs.getFields(), C.PR_ID);

                        if(isOrden) {

                            vAplic.oci_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.OCI_ID);

                        }
                        else {

                            vAplic.rci_id = Cairo.Database.valField(rs.getFields(), CSCRCD_ID);
                            vAplic.fci_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.FCI_ID);
                        }

                        vAplic.docNombre = Cairo.Database.valField(rs.getFields(), mComprasConstantes.DOC_NAME);
                        vAplic.NroDoc = Cairo.Database.valField(rs.getFields(), CSCNRO_DOC);
                        vAplic.Fecha = Cairo.Database.valField(rs.getFields(), CSCFECHA);

                        vAplic.Pendiente = Cairo.Database.valField(rs.getFields(), CSCPENDIENTE);
                        vAplic.PendienteActual = vAplic.Pendiente;

                        G.redim(vAplic.vAplicaciones, 0);

                        rs.MoveNext;
                    }
                }

                return true;
            };

            var pItAddToCreditos = function(ociId,  fciId,  rciId,  idx,  vAplic) { // TODO: Use of ByRef founded Private Function pItAddToCreditos(ByVal OciId As Long, ByVal FciId As Long, ByVal RciId As Long, ByRef Idx As Long, ByRef vAplic() As T_Aplic) As Long
                var _rtn = 0;
                var i = null;

                for(i = 1; i <= vAplic.Length; i++) {
                    if((vAplic.oci_id === ociId && ociId !== Cairo.Constants.NO_ID) || (vAplic.fci_id === fciId && fciId !== Cairo.Constants.NO_ID) || (vAplic.rci_id === rciId && rciId !== Cairo.Constants.NO_ID)) {

                        G.redimPreserve(vAplic.vAplicaciones, vAplic.vAplicaciones.Length + 1);

                        idx = vAplic.vAplicaciones.Length;
                        _rtn = i;
                        return _rtn;
                    }
                }

                G.redimPreserve(vAplic, vAplic.Length + 1);
                G.redimPreserve(vAplic.Length, .vAplicaciones);
                _rtn = vAplic.Length;
                idx = 1;

                return _rtn;
            };

            var pItUpdateGrids = function(isOrden,  vAplic) { // TODO: Use of ByRef founded Private Function pItUpdateGrids(ByVal IsOrden As Boolean, ByRef vAplic() As T_Aplic) As Double
                var _rtn = 0;
                var iProp = null;
                var iPropAplic = null;
                var row = null;
                var lastRow = null;

                if(isOrden) {
                    iProp = m_dialog.getProperties().item(C_ITEMS);
                    iPropAplic = m_dialog.getProperties().item(C_APLICORDEN);
                    lastRow = m_lastRowItem;
                }
                else {
                    iProp = m_dialog.getProperties().item(C_FACDEV);
                    iPropAplic = m_dialog.getProperties().item(C_APLICFACDEV);
                    lastRow = m_lastRowFacDev;
                }

                if(lastRow !== 0) {

                    row = iProp.getGrid().getRows(lastRow);
                    _rtn = pItUpdateAplicItems(iPropAplic, Dialogs.cell(row, KII_RCI_ID).getID(), vAplic, isOrden);
                }

                return _rtn;
            };

            var pItSetAplicItems = function(iProp,  rci_id,  pR_ID,  vAplic,  isOrden) { // TODO: Use of ByRef founded Private Function pItSetAplicItems(ByRef iProp As cIABMProperty, ByVal rci_id As Long, ByVal PR_ID As Long, ByRef vAplic() As T_Aplic, ByVal IsOrden As Boolean) As Boolean
                var i = null;
                var j = null;

                iProp.getGrid().getRows().clear();

                m_rci_id = rci_id;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).PR_ID === pR_ID) {

                        if(vAplic(i).vAplicaciones.Length > 0) {
                            pItSetAplicItemsAux1(i, iProp, rci_id, vAplic, isOrden);
                        }
                        else {
                            pItSetAplicItemsAux2(i, iProp, vAplic, isOrden);
                        }
                    }

                }

                // Ahora los creditos que tienen aplicaciones
                // pero no estan con este item y tienen pendiente
                var id = null;
                var bAplic = null;
                var row = null;

                for(i = 1; i <= vAplic.Length; i++) {

                    bAplic = false;

                    if(vAplic(i).PR_ID === pR_ID) {

                        var _count = iProp.getGrid().getRows().size();
                        for(var _j = 0; _j < _count; _j++) {
                            row = iProp.getGrid().getRows().item(_j);

                            if(isOrden) {
                                id = Dialogs.cell(row, KIP_OCI_ID).getID();
                                if(id === vAplic(i).oci_id && id !== Cairo.Constants.NO_ID) {
                                    bAplic = true;
                                    break;
                                }
                            }
                            else {
                                id = Dialogs.cell(row, KIFD_FCI_ID).getID();
                                if(id === vAplic(i).fci_id && id !== Cairo.Constants.NO_ID) {
                                    bAplic = true;
                                    break;
                                }

                                id = Dialogs.cell(row, KIFD_RCI_ID).getID();
                                if(id === vAplic(i).rci_id && id !== Cairo.Constants.NO_ID) {
                                    bAplic = true;
                                    break;
                                }
                            }

                            id = m_rci_id;
                            for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {
                                if(id === vAplic(i).vAplicaciones(j).rci_id && id !== Cairo.Constants.NO_ID) {
                                    bAplic = true;
                                    break;
                                }
                            }

                            if(bAplic) { break; }
                        }

                        if(!bAplic) { pItSetAplicItemsAux2(i, iProp, vAplic, isOrden); }
                    }
                }

                return true;
            };

            var pItUpdateAplicItems = function(iProp,  rci_id,  vAplic,  isOrden) { // TODO: Use of ByRef founded Private Function pItUpdateAplicItems(ByRef iProp As cIABMProperty, ByVal rci_id As Long, ByRef vAplic() As T_Aplic, ByVal IsOrden As Boolean) As Double
                var i = null;
                var j = null;
                var row = null;
                var aplicado = null;
                var aplicadoTotal = null;

                var _count = pItGetItemsAplic(isOrden).getRows().size();
                for(var _i = 0; _i < _count; _i++) {
                    row = pItGetItemsAplic(isOrden).getRows().item(_i);

                    if(Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO).getValue()) > 0 || Dialogs.cell(row, KIP_IDX2).getID() !== 0) {

                        i = Dialogs.cell(row, KIP_IDX1).getID();
                        j = Dialogs.cell(row, KIP_IDX2).getID();

                        aplicado = Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO).getValue());
                        aplicadoTotal = aplicadoTotal + aplicado;

                        vAplic.Aplicado = pItAddToAplic(vAplic.vAplicaciones, aplicado, j);
                        vAplic.Pendiente = vAplic.PendienteActual - (vAplic.Aplicado - vAplic.AplicadoActual);
                    }
                }

                return aplicadoTotal;
            };

            var pItSetAplicItemsAux1 = function(idx,  iProp,  rci_id,  vAplic,  isOrden) { // TODO: Use of ByRef founded Private Sub pItSetAplicItemsAux1(ByVal Idx As Long, ByRef iProp As cIABMProperty, ByVal rci_id As Long, ByRef vAplic() As T_Aplic, ByVal IsOrden As Boolean)
                var f = null;
                var fv = null;
                var i = null;
                var iPropItem = null;
                var row = null;

                for(i = 1; i <= vAplic(idx).vAplicaciones.Length; i++) {

                    if(vAplic.rci_id === rci_id && rci_id !== Cairo.Constants.NO_ID) {

                        f = iProp.getGrid().getRows().add(null);

                        elem = row.add(null);
                        elem.setId(idx);
                        elem.setKey(KIP_IDX1);

                        elem = row.add(null);
                        elem.setId(i);
                        elem.setKey(KIP_IDX2);

                        elem = row.add(null);
                        elem.setId(vAplic.vinc_id);
                        elem.setKey(KIP_OCRC_ID);

                        elem = row.add(null);

                        if(isOrden) {

                            elem.setKey(KIP_OCI_ID);
                            elem.setId(vAplic(idx).oci_id);

                        }
                        else {

                            elem.setKey(KIFD_RCI_ID);
                            elem.setId(vAplic(idx).rci_id);

                            elem = row.add(null);
                            elem.setId(vAplic(idx).fci_id);
                            elem.setKey(KIFD_FCI_ID);
                        }

                        elem = row.add(null);
                        elem.setValue(vAplic(idx).docNombre);
                        elem.setKey(KIP_DOC);

                        elem = row.add(null);
                        elem.setValue(vAplic(idx).NroDoc);
                        elem.setKey(KIP_NRODOC);

                        elem = row.add(null);
                        if(vAplic(idx).Fecha === Cairo.Constants.cSNODATE) {
                            elem.setValue("");
                        }
                        else {
                            elem.setValue(vAplic(idx).Fecha);
                        }
                        elem.setKey(KIP_FECHA);

                        elem = row.add(null);
                        elem.setValue(vAplic(idx).Pendiente);
                        elem.setKey(KIP_PENDIENTE);

                        elem = row.add(null);
                        elem.setValue(vAplic.Aplicado);
                        elem.setKey(KIP_APLICADO);

                        elem = row.add(null);
                        elem.setValue(vAplic.Aplicado);
                        elem.setKey(KIP_APLICADO2);

                        row = f;
                        row.setBackColor(&HFFCC99);
                    }
                }
            };

            var pItSetAplicItemsAux2 = function(i,  iProp,  vAplic,  isOrden) { // TODO: Use of ByRef founded Private Sub pItSetAplicItemsAux2(ByVal i As Long, ByRef iProp As cIABMProperty, ByRef vAplic() As T_Aplic, ByVal IsOrden As Boolean)
                var f = null;
                var fv = null;

                if(vAplic(i).Pendiente <= 0) { return; }

                f = iProp.getGrid().getRows().add(null);

                elem = row.add(null);
                elem.setId(i);
                elem.setKey(KIP_IDX1);

                elem = row.add(null);
                elem.setId(0);
                elem.setKey(KIP_IDX2);

                elem = row.add(null);
                elem.setId(Cairo.Constants.NO_ID);
                elem.setKey(KIP_OCRC_ID);

                elem = row.add(null);

                if(isOrden) {

                    elem.setKey(KIP_OCI_ID);
                    elem.setId(vAplic.oci_id);

                }
                else {

                    elem.setKey(KIFD_RCI_ID);
                    elem.setId(vAplic.rci_id);

                    elem = row.add(null);
                    elem.setId(vAplic.fci_id);
                    elem.setKey(KIFD_FCI_ID);
                }

                elem = row.add(null);
                elem.setValue(vAplic.docNombre);
                elem.setKey(KIP_DOC);

                elem = row.add(null);
                elem.setValue(vAplic.NroDoc);
                elem.setKey(KIP_NRODOC);

                elem = row.add(null);
                if(vAplic.Fecha === Cairo.Constants.cSNODATE) {
                    elem.setValue("");
                }
                else {
                    elem.setValue(vAplic.Fecha);
                }
                elem.setKey(KIP_FECHA);

                elem = row.add(null);
                elem.setValue(vAplic.Pendiente);
                elem.setKey(KIP_PENDIENTE);

                elem = row.add(null);
                elem.setValue(0);
                elem.setKey(KIP_APLICADO);

                elem = row.add(null);
                elem.setValue(0);
                elem.setKey(KIP_APLICADO2);
            };

            var pItAddToAplic = function(vAplicaciones,  importe,  idx) { // TODO: Use of ByRef founded Private Function pItAddToAplic(ByRef vAplicaciones() As T_ItAplic, ByVal Importe As Double, ByVal Idx As Long) As Double
                var i = null;
                var rtn = null;

                if(idx === 0) {
                    G.redimPreserve(vAplicaciones, vAplicaciones.Length + 1);
                    idx = vAplicaciones.Length;
                    vAplicaciones.rci_id = m_rci_id;
                }

                vAplicaciones(idx).Aplicado = importe;

                for(i = 1; i <= vAplicaciones.Length; i++) {
                    rtn = rtn + vAplicaciones(i).Aplicado;
                }

                return rtn;
            };

            var pItGetItemsProperty = function(isOrden) {
                if(isOrden) {
                    return m_dialog.getProperties().item(C_APLICORDEN);
                }
                else {
                    return m_dialog.getProperties().item(C_APLICFACDEV);
                }
            };

            var pItGetItemsAplic = function(isOrden) {
                if(isOrden) {
                    return m_dialog.getProperties().item(C_APLICORDEN).getGrid();
                }
                else {
                    return m_dialog.getProperties().item(C_APLICFACDEV).getGrid();
                }
            };

            var pItColBEdit = function(property,  lRow,  lCol,  iKeyAscii) { // TODO: Use of ByRef founded Private Function pItColBEdit(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer)
                switch (property.getGrid().getColumns().item(lCol).getKey()) {
                    case KIP_APLICADO:
                        break;

                    default:
                        return null;
                        break;
                }

                return true;
            };

            var pItGetItemPendiente = function(isOrden) {
                var iProp = null;
                if(isOrden) {
                    iProp = m_dialog.getProperties().item(C_ITEMS);
                }
                else {
                    iProp = m_dialog.getProperties().item(C_FACDEV);
                }
                return Dialogs.cell(iProp.getGrid().getRows(iProp.getSelectedIndex()), KII_PENDIENTE);
            };

            var pItGetItemAplicado = function(isOrden) {
                var iProp = null;
                if(isOrden) {
                    iProp = m_dialog.getProperties().item(C_ITEMS);
                }
                else {
                    iProp = m_dialog.getProperties().item(C_FACDEV);
                }
                return Dialogs.cell(iProp.getGrid().getRows(iProp.getSelectedIndex()), KII_APLICADO2);
            };

            var pItColAUpdate = function(property,  lRow,  lCol,  isOrden) { // TODO: Use of ByRef founded Private Function pItColAUpdate(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal IsOrden As Boolean)
                var row = null;
                var maxVal = null;
                var bVisible = null;
                var pendiente = null;

                var w_grid = property.getGrid();
                switch (w_grid.getColumns(lCol).Key) {
                    case KIP_APLICADO:
                        row = w_grid.getRows(lRow);

                        var w_pCell = Dialogs.cell(row, KIP_APLICADO);

                        pendiente = Cairo.Util.val(pItGetItemPendiente(isOrden).getValue()) + Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO2).getValue());
                        maxVal = Cairo.Util.val(Dialogs.cell(row, KIP_PENDIENTE).getValue()) + Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO2).getValue());

                        if(maxVal > pendiente) {
                            maxVal = pendiente;
                        }

                        if(Cairo.Util.val(w_pCell.getValue()) > maxVal) {
                            w_pCell.setValue(maxVal);
                        }
                        else if(Cairo.Util.val(w_pCell.getValue()) < 0) {
                            w_pCell.setValue(0);
                        }

                        var aplicado = null;
                        aplicado = pItGetAplicado(isOrden);
                        pItRefreshItem(aplicado, isOrden);
                        pItGetItemAplicado(isOrden).setValue(aplicado);

                        // Actulizo el pendiente
                        var w_pCell = Dialogs.cell(row, KIP_PENDIENTE);
                        w_pCell.setValue(Cairo.Util.val(w_pCell.getValue()) + Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO2).getValue()) - Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO).getValue()));
                        Dialogs.cell(row, KIP_APLICADO2).getValue() === Dialogs.cell(row, KIP_APLICADO).getValue();
                        break;
                }

                return true;
            };

            var pItGetAplicado = function(isOrden) {
                var row = null;
                var rtn = null;
                var iProp = null;

                if(isOrden) {
                    iProp = m_dialog.getProperties().item(C_APLICORDEN);
                }
                else {
                    iProp = m_dialog.getProperties().item(C_APLICFACDEV);
                }

                var _count = iProp.getGrid().getRows().size();
                for(var _i = 0; _i < _count; _i++) {
                    row = iProp.getGrid().getRows().item(_i);
                    rtn = rtn + Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO).getValue());
                }
                return rtn;
            };

            var pItRefreshItem = function(aplicado,  isOrden) {
                var iProp = null;
                var abmObj = null;
                var row = null;
                var aplicadoActual = null;
                var lastRow = null;

                abmObj = m_dialog;

                if(isOrden) {
                    iProp = m_dialog.getProperties().item(C_ITEMS);
                    lastRow = m_lastRowItem;
                }
                else {
                    iProp = m_dialog.getProperties().item(C_FACDEV);
                    lastRow = m_lastRowFacDev;
                }
                row = iProp.getGrid().getRows(lastRow);

                Dialogs.cell(row, KII_APLICADO).getValue() === aplicado;
                aplicadoActual = Cairo.Util.val(Dialogs.cell(row, KII_APLICADO2).getValue());

                var w_pCell = Dialogs.cell(row, KII_PENDIENTE);
                w_pCell.setValue(w_pCell.getValue() - (aplicado - aplicadoActual));

                Dialogs.cell(row, KII_APLICADO2).getValue() === aplicado;

                abmObj.ShowCellValue(iProp, lastRow, D.getCol(iProp.getGrid().getColumns(), KII_PENDIENTE));
                abmObj.ShowCellValue(iProp, lastRow, D.getCol(iProp.getGrid().getColumns(), KII_APLICADO));
            };

            var pItSaveOrdenes = function(rcTMPId,  vAplic) { // TODO: Use of ByRef founded Private Function pItSaveOrdenes(ByVal RcTMPId As Long, ByRef vAplic() As T_Aplic) As Boolean
                var register = new DB.Register();
                var i = null;
                var j = null;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).oci_id !== Cairo.Constants.NO_ID) {

                        for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {

                            if(vAplic(i).vAplicaciones(j).rci_id !== Cairo.Constants.NO_ID) {

                                if(vAplic.Aplicado > 0) {

                                    register = new cRegister();
                                    register.setFieldId(mComprasConstantes.OC_RC_TMP_ID);
                                    register.setTable(mComprasConstantes.ORDENREMITO_COMPRATMP);
                                    register.setId(Cairo.Constants.NEW_ID);

                                    register.getFields().add2(mComprasConstantes.RC_TMP_ID, rcTMPId, Types.id);
                                    register.getFields().add2(mComprasConstantes.OCI_ID, vAplic(i).oci_id, Types.id);
                                    register.getFields().add2(mComprasConstantes.RCI_ID, vAplic.rci_id, Types.id);
                                    register.getFields().add2(mComprasConstantes.OC_RC_CANTIDAD, vAplic.Aplicado, Types.double);

                                    register.getFields().add2(mComprasConstantes.OC_RC_ID, vAplic.vinc_id, Types.long);

                                    register.getFields().setHaveLastUpdate(false);
                                    register.getFields().setHaveWhoModify(false);

                                    if(!Cairo.Database.save(register, , "pItSaveOrdenes", C_MODULE, c_ErrorSave)) { return false; }
                                }
                            }
                        }
                    }
                }

                return true;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   construccion - destruccion
            //
            //////////////////////////////////////////////////////////////////////////////////////
            self.initialize = function() {
                try {

                    //'Error al grabar los Remitos de Compra
                    c_ErrorSave = Cairo.Language.getText(1945, "");

                    m_generalConfig = new cGeneralConfig();
                    m_generalConfig.Load;

                    G.redim(m_vOrdenes, 0);
                    G.redimPreserve(0, .vAplicaciones);

                    G.redim(m_vFacDevs, 0);
                    G.redimPreserve(0, .vAplicaciones);

                    m_monDefault = GetMonedaDefault();

                    // **TODO:** goto found: GoTo ExitProc;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, ex, "Class_Initialize", C_MODULE, "");
                    // **TODO:** label found: ExitProc:;
                }
                // **TODO:** on error resume next found !!!
            };

            self.destroy = function() {
                try {

                    m_dialog = null;
                    m_generalConfig = null;

                    G.redim(m_vFacDevs, 0);
                    G.redim(m_vOrdenes, 0);

                    // **TODO:** goto found: GoTo ExitProc;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, ex, "Class_Terminate", C_MODULE, "");
                    // **TODO:** label found: ExitProc:;
                }
                // **TODO:** on error resume next found !!!
            };
            ////////////////////////////////
            //  Codigo estandar de errores
            //  On Error GoTo ControlError
            //
            //  GoTo ExitProc
            //ControlError:
            //  MngError err,"", C_Module, ""
            //  If Err.Number Then Resume ExitProc
            //ExitProc:
            //  On Error Resume Next

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   ORDENES / REMITOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pItLoadFacDev = function(iProp) { // TODO: Use of ByRef founded Private Function pItLoadFacDev(ByRef iProp As cIABMProperty) As Boolean
                return pItLoadItemsAux(iProp, false);
            };

            var pItSetGridAplicFacDev = function(iProp) { // TODO: Use of ByRef founded Private Function pItSetGridAplicFacDev(ByRef iProp As cIABMProperty) As Boolean
                return pItSetGridAplicAux(iProp, false);
            };

            var pItSaveFacDev = function(rcTMPId,  vAplic) { // TODO: Use of ByRef founded Private Function pItSaveFacDev(ByVal RcTMPId As Long, ByRef vAplic() As T_Aplic) As Boolean
                var register = new DB.Register();
                var i = null;
                var j = null;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).fci_id !== Cairo.Constants.NO_ID || vAplic(i).rci_id !== Cairo.Constants.NO_ID) {

                        for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {

                            if(vAplic(i).vAplicaciones(j).rci_id !== Cairo.Constants.NO_ID) {

                                if(vAplic.Aplicado > 0) {

                                    register = new cRegister();

                                    // Si estoy vinculando contra una factura
                                    if(vAplic(i).fci_id !== 0) {
                                        register.setFieldId(mComprasConstantes.RC_FC_TMP_ID);
                                        register.setTable(mComprasConstantes.REMITOFACTURA_COMPRATMP);
                                        register.getFields().add2(mComprasConstantes.FCI_ID, vAplic(i).fci_id, Types.id);
                                        register.getFields().add2(mComprasConstantes.RCI_ID, vAplic.rci_id, Types.id);

                                        register.getFields().add2(mComprasConstantes.RC_FC_CANTIDAD, vAplic.Aplicado, Types.double);
                                        register.getFields().add2(mComprasConstantes.RC_FC_ID, vAplic.vinc_id, Types.long);

                                        // Si vinculo contra un remito (Remito - Devolucion)
                                    }
                                    else {
                                        register.setFieldId(mComprasConstantes.RC_DC_TMP_ID);
                                        register.setTable(mComprasConstantes.REMITODEVOLUCIONCOMPRATMP);

                                        if(m_isDevolucion) {
                                            register.getFields().add2(mComprasConstantes.RCI_ID_DEVOLUCION, vAplic.rci_id, Types.id);
                                            register.getFields().add2(mComprasConstantes.RCI_ID_REMITO, vAplic(i).rci_id, Types.id);
                                        }
                                        else {
                                            register.getFields().add2(mComprasConstantes.RCI_ID_REMITO, vAplic.rci_id, Types.id);
                                            register.getFields().add2(mComprasConstantes.RCI_ID_DEVOLUCION, vAplic(i).rci_id, Types.id);
                                        }

                                        register.getFields().add2(mComprasConstantes.RC_DC_CANTIDAD, vAplic.Aplicado, Types.double);
                                        register.getFields().add2(mComprasConstantes.RC_DC_ID, vAplic.vinc_id, Types.long);

                                    }

                                    register.setId(Cairo.Constants.NEW_ID);
                                    register.getFields().add2(mComprasConstantes.RC_TMP_ID, rcTMPId, Types.id);

                                    register.getFields().setHaveLastUpdate(false);
                                    register.getFields().setHaveWhoModify(false);

                                    if(!Cairo.Database.save(register, , "pItSaveFacDev ", C_MODULE, c_ErrorSave)) { return false; }
                                }
                            }
                        }
                    }
                }

                return true;
            };

            return self;
        };

        Edit.Controller = { getEditor: createObject };

    });

    Cairo.module("RemitoCompraAplic.List", function(List, Cairo, Backbone, Marionette, $, _) {
        List.Controller = {
            list: function() {

                var self = this;

                /*
                 this function will be called by the tab manager every time the
                 view must be created. when the tab is not visible the tab manager
                 will not call this function but only make the tab visible
                 */
                var createTreeDialog = function(tabId) {

                    var editors = Cairo.Editors.remitocompraaplicEditors || Cairo.Collections.createCollection(null);
                    Cairo.Editors.remitocompraaplicEditors = editors;

                    // ListController properties and methods
                    //
                    self.entityInfo = new Backbone.Model({
                        entitiesTitle: "RemitoCompraAplics",
                        entityName: "remitocompraaplic",
                        entitiesName: "remitocompraaplics"
                    });

                    self.showBranch = function(branchId) {
                        Cairo.log("Loading nodeId: " + branchId);
                        Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self);
                    };

                    self.addLeave = function(id, branchId) {
                        try {
                            Cairo.Tree.List.Controller.addLeave(branchId, id, self);
                        }
                        catch(ignore) {
                            Cairo.log("Error when adding this item to the branch\n\n" + ignore.message);
                        }
                    };

                    self.refreshBranch = function(id, branchId) {
                        try {
                            Cairo.Tree.List.Controller.refreshBranchIfActive(branchId, id, self);
                        }
                        catch(ignore) {
                            Cairo.log("Error when refreshing a branch\n\n" + ignore.message);
                        }
                    };

                    var getIndexFromEditor = function(editor) {
                        var count = editors.count();
                        for(var i = 0; i < count; i += 1) {
                            if(editors.item(i).editor === editor) {
                                return i;
                            }
                        }
                        return -1;
                    };

                    self.removeEditor = function(editor) {
                        var index = getIndexFromEditor(editor);
                        if(index >= 0) {
                            editors.remove(index);
                        }
                    };

                    var getKey = function(id) {
                        if(id === Cairo.Constants.NO_ID) {
                            return "new-id:" + (new Date).getTime().toString()
                        }
                        else {
                            return "k:" + id.toString();
                        }
                    };

                    self.updateEditorKey = function(editor, newId) {
                        var index = getIndexFromEditor(editor);
                        if(index >= 0) {
                            var editor = editors.item(index);
                            editors.remove(index);
                            var key = getKey(newId);
                            editors.add(editor, key);
                        }
                    };

                    self.edit = function(id, treeId, branchId) {
                        var key = getKey(id);
                        if(editors.contains(key)) {
                            editors.item(key).dialog.showDialog();
                        }
                        else {
                            var editor = Cairo.RemitoCompraAplic.Edit.Controller.getEditor();
                            var dialog = Cairo.Dialogs.Views.Controller.newDialog();

                            editor.setTree(self);
                            editor.setDialog(dialog);
                            editor.setTreeId(treeId);
                            editor.setBranchId(branchId);
                            editor.edit(id);

                            editors.add({editor: editor, dialog: dialog}, key);
                        }
                    };

                    self.destroy = function(id, treeId, branchId) {
                        if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_REMITO_COMPRAAPLIC)) {
                            return Cairo.Promises.resolvedPromise(false);
                        }
                        var apiPath = Cairo.Database.getAPIVersion();
                        return Cairo.Database.destroy(apiPath + "general/remitocompraaplic", id, Cairo.Constants.DELETE_FUNCTION, "RemitoCompraAplic").success(
                            function() {
                                try {
                                    var key = getKey(id);
                                    if(editors.contains(key)) {
                                        editors.item(key).dialog.closeDialog();
                                    }
                                }
                                catch(ignore) {
                                    Cairo.log('Error closing dialog after delete');
                                }
                                return true;
                            }
                        );
                    };

                    // progress message
                    //
                    Cairo.LoadingMessage.show("RemitoCompraAplics", "Loading remitocompraaplic from CrowSoft Cairo server.");

                    // create the tree region
                    //
                    Cairo.addRegions({ remitocompraaplicTreeRegion: tabId });

                    // create the dialog
                    //
                    Cairo.Tree.List.Controller.list(
                        Cairo.Tables.REMITO_COMPRAAPLIC,
                        new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
                        Cairo.remitocompraaplicTreeRegion,
                        self);

                };

                var showTreeDialog = function() {
                    Cairo.Tree.List.Controller.showTreeDialog(self);
                };

                var closeTreeDialog = function() {

                }

                // create the tab
                //
                Cairo.mainTab.showTab("RemitoCompraAplics", "remitocompraaplicTreeRegion", "#general/remitocompraaplics", createTreeDialog, closeTreeDialog, showTreeDialog);

            }
        };
    });


}());

private class T_ItAplic {
    public Long vinc_id;//' lo uso para ocrc_id, rcfc_id y rcdc_id
    public Long rci_id;//' Ids de items al que este credito esta vinculado
    public Double aplicado;
}


private class T_Aplic {
    public Long oci_id;//' Vinculacion con orden
    public Long fci_id;//' factura
    public Long rci_id;//' devolucion / remito
    public Long pR_ID;
    public Date fecha;
    public String docNombre;
    public String nroDoc;
    public Double pendienteActual;
    public Double aplicadoActual;
    public Double pendiente;
    public Double aplicado;
    public object[] vAplicaciones;
}




// Controller

package controllers.logged.modules.general

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.general._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.DBHelper


case class RemitocompraaplicData(
    id: Option[Int],

)

object Remitocompraaplics extends Controller with ProvidesUser {

    val remitocompraaplicForm = Form(
        mapping(
                "id" -> optional(number),

        )(RemitocompraaplicData.apply)(RemitocompraaplicData.unapply))

    implicit val remitocompraaplicWrites = new Writes[Remitocompraaplic] {
        def writes(remitocompraaplic: Remitocompraaplic) = Json.obj(
                "id" -> Json.toJson(remitocompraaplic.id),
                C.ID -> Json.toJson(remitocompraaplic.id),

        )
    }

    def get(id: Int) = GetAction { implicit request =>
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_REMITO_COMPRAAPLIC), { user =>
        Ok(Json.toJson(Remitocompraaplic.get(user, id)))
    })
}

def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in remitocompraaplics.update")
    remitocompraaplicForm.bindFromRequest.fold(
        formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
    BadRequest
},
remitocompraaplic => {
    Logger.debug(s"form: ${remitocompraaplic.toString}")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_REMITO_COMPRAAPLIC), { user =>
    Ok(
        Json.toJson(
            Remitocompraaplic.update(user,
                Remitocompraaplic(
                    id,

                ))))
})
}
)
}

def create = PostAction { implicit request =>
    Logger.debug("in remitocompraaplics.create")
    remitocompraaplicForm.bindFromRequest.fold(
        formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
    BadRequest
},
remitocompraaplic => {
    Logger.debug(s"form: ${remitocompraaplic.toString}")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_REMITO_COMPRAAPLIC), { user =>
    Ok(
        Json.toJson(
            Remitocompraaplic.create(user,
                Remitocompraaplic(

                ))))
})
}
)
}

def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in remitocompraaplics.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_REMITO_COMPRAAPLIC), { user =>
    Remitocompraaplic.delete(user, id)
    // Backbonejs requires at least an empty json object in the response
    // if not it will call errorHandler even when we responded with 200 OK :P
    Ok(JsonUtil.emptyJson)
})
}

}

// Model

package models.cairo.modules.general

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.DateUtil
import services.db.DB
import models.cairo.system.database.{DBHelper, Register, Field, FieldType, SaveResult}
import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal

case class Remitocompraaplic(
    id: Int,
    ,
    createdAt: Date,
    updatedAt: Date,
    updatedBy: Int) {

    def this(
        id: Int,
) = {

        this(
            id,
                ,
                DateUtil.currentTime,
                DateUtil.currentTime,
                DBHelper.NoId)
    }

    def this(
    ) = {

        this(
            DBHelper.NoId,
            )

    }

}

object Remitocompraaplic {

    lazy val emptyRemitocompraaplic = Remitocompraaplic(
    )

    def apply(
        id: Int,
) = {

        new Remitocompraaplic(
            id,
        )
    }

    def apply(
    ) = {

        new Remitocompraaplic(
        )
    }

    private val remitocompraaplicParser: RowParser[Remitocompraaplic] = {
        SqlParser.get[Int](C.ID) ~
        SqlParser.get[Date](DBHelper.CREATED_AT) ~
        SqlParser.get[Date](DBHelper.UPDATED_AT) ~
        SqlParser.get[Int](DBHelper.UPDATED_BY) map {
    case
        id ~
            ~
                createdAt ~
            updatedAt ~
            updatedBy =>
        Remitocompraaplic(
            id,
            ,
            createdAt,
            updatedAt,
            updatedBy)
    }
}

def create(user: CompanyUser, remitocompraaplic: Remitocompraaplic): Remitocompraaplic = {
    save(user, remitocompraaplic, true)
}

def update(user: CompanyUser, remitocompraaplic: Remitocompraaplic): Remitocompraaplic = {
    save(user, remitocompraaplic, false)
}

private def save(user: CompanyUser, remitocompraaplic: Remitocompraaplic, isNew: Boolean): Remitocompraaplic = {
    def getFields = {
        List(

            )
    }
    def throwException = {
        throw new RuntimeException(s"Error when saving ${C.REMITO_COMPRAAPLIC}")
}

DBHelper.saveEx(
    user,
    Register(
        C.REMITO_COMPRAAPLIC,
        C.ID,
        remitocompraaplic.id,
        false,
        true,
        true,
        getFields),
    isNew,
    C.CODE
) match {
case SaveResult(true, id) => load(user, id).getOrElse(throwException)
case SaveResult(false, _) => throwException
}
}

def load(user: CompanyUser, id: Int): Option[Remitocompraaplic] = {
    loadWhere(user, s"${C.ID} = {id}", 'id -> id)
}

def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
    SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.REMITO_COMPRAAPLIC} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
.on(args: _*)
.as(remitocompraaplicParser.singleOpt)
}
}

def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
    try {
        SQL(s"DELETE FROM ${C.REMITO_COMPRAAPLIC} WHERE ${C.ID} = {id}")
    .on('id -> id)
            .executeUpdate
    } catch {
    case NonFatal(e) => {
            Logger.error(s"can't delete a ${C.REMITO_COMPRAAPLIC}. ${C.ID} id: $id. Error ${e.toString}")
            throw e
        }
    }
}
}

def get(user: CompanyUser, id: Int): Remitocompraaplic = {
    load(user, id) match {
        case Some(p) => p
    case None => emptyRemitocompraaplic
}
}
}


// Router

GET     /api/v1/general/remitocompraaplic/:id              controllers.logged.modules.general.Remitocompraaplics.get(id: Int)
POST    /api/v1/general/remitocompraaplic                  controllers.logged.modules.general.Remitocompraaplics.create
PUT     /api/v1/general/remitocompraaplic/:id              controllers.logged.modules.general.Remitocompraaplics.update(id: Int)
DELETE  /api/v1/general/remitocompraaplic/:id              controllers.logged.modules.general.Remitocompraaplics.delete(id: Int)




/**/
