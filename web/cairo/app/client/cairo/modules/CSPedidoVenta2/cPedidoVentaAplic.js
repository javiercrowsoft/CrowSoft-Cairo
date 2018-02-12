(function() {
    "use strict";

    Cairo.module("PedidoVentaAplic.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

        var createObject = function() {

            var self = {};

            var getText = Cairo.Language.getText;

            var TITLE = getText(1600, ""); // Aplicación Pedido de Venta
            var SAVE_ERROR_MESSAGE = getText(1591, ""); // Error al grabar el pedido de venta

            var Dialogs = Cairo.Dialogs;

            var C_MODULE = "cPedidoVentaAplic";

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
            var CSCPVD_ID = "pvd_id";
            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   REMITO - SOLAPA
            //
            //////////////////////////////////////////////////////////////////////////////////////

            // Remito
            var K_PRESUPUESTO = 10;
            var K_APLIC_PRESU = 11;

            var C_PRESU = "Presu";
            var C_APLICPRESU = "AplicPresu";

            var K_PACKING = 12;
            var K_APLIC_PACKING = 13;

            var C_ITEMS = "Items";
            var C_APLICPACKING = "AplicPacking";

            var CSCFECHA = "Fecha";
            var CSCAPLICADO = "Aplicado";
            var CSCAPLIC_PRESU = "AplicPresu";
            var CSCAPLIC_PACKING = "AplicPacking";
            var CSCAPLIC_REMITO = "AplicRemito";

            // Grillas de Remitos / Pedidos
            var KII_PVI_ID = 1;
            var KII_PR_ID = 2;
            var KII_APLICADO = 4;
            var KII_APLICADO2 = 5;
            var KII_PENDIENTE = 6;

            var KIP_PVRV_ID = 1;

            var KIFD_FVI_ID = 2;
            var KIFD_RVI_ID = 3;

            // Estos dos tienen el mismo valor a proposito
            var KIP_PKI_ID = 4;
            var KIP_PRVI_ID = KIP_PKI_ID;
            var KIFD_PVI_ID = KIP_PKI_ID;

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

            // Remito

            var K_FAC_DEV = 20;
            var K_APLIC_FAC_DEV = 21;
            var C_FACDEV = "FacDev";
            var C_APLICFACDEV = "AplicFacDev";

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   REMITOS / REMITOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

//*TODO:** type is translated as a new class at the end of the file Private Type T_ItAplic

//*TODO:** type is translated as a new class at the end of the file Private Type T_Aplic
            // Vinculacion con

            // pseudo-constantes
            var c_ErrorSave = "";

            // generales

            var m_editing;
            var m_dialog;
            var m_generalConfig;
            var m_pvId = 0;
            var m_isDevolucion;
            var m_pvNumero = "";
            var m_cliente = "";
            var m_cliId = 0;
            var m_docId = 0;
            var m_sucId = 0;
            var m_total = 0;

            var m_monDefault = 0;

            var m_lastRowPresu = 0;
            var m_lastRowItem = 0;
            var m_lastRowFacDev = 0;

            // Edit Apply
            //
            var m_objectClient;
            var m_emp_id = 0;
            var m_emp_nombre = "";

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   REMITOS / REMITOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var m_vPresupuesto;
            var m_vPacking;
            var m_vFacDevs;
            var m_pvi_id = 0;

            // eventos

            // Edit Apply
            //
            self.setObjectClient = function(rhs) {
                m_objectClient = rhs;
            };

            self.getId = function() {
                return m_pvId;
            };

            // propiedades friend
            self.show = function(pvId,  total,  pvNumero,  cliId,  cliente,  sucId,  docId,  isDevolucion) {

                if(m_dialog === null) {
                    m_dialog = new cABMGeneric();
                }

                if(m_pvId !== pvId) {
                    m_isDevolucion = isDevolucion;
                    m_pvId = pvId;
                    m_pvNumero = pvNumero;
                    m_cliente = cliente;
                    m_cliId = cliId;
                    m_docId = docId;
                    m_sucId = sucId;
                    m_total = total;

                    // Edit Apply
                    //
                    if(!Cairo.Database.getData(mPedidoConstantes.PEDIDOVENTA, mPedidoConstantes.PV_ID, m_pvId, C.EMP_ID, m_emp_id)) { return false; }

                    if(!Cairo.Database.getData(Cairo.Constants.EMPRESA, C.EMP_ID, m_emp_id, Cairo.Constants.EMP_NAME, m_emp_nombre)) { return false; }

                    pEdit();
                }
                else {
                    m_dialog.getObjForm().ZOrder;
                }

                return true;
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

                            case K_PRESUPUESTO:

                                abmObj = m_dialog;

                                // Guardo la aplicacion para el item editado anteriormente
                                //
                                if(m_lastRowPresu !== 0) {
                                    aplicado = pItUpdateGrids(cE_Presupuesto, m_vPresupuesto);
                                }

                                // Muestro las aplicaciones para este item
                                //
                                m_lastRowPresu = iProp.getSelectedIndex();
                                row = iProp.getGrid().getRows(m_lastRowPresu);
                                if(row === null) { return null; }

                                pItSetAplicItems(m_dialog.getProperties().item(C_APLICPRESU), Dialogs.cell(row, KII_PVI_ID).getID(), Dialogs.cell(row, KII_PR_ID).getID(), m_vPresupuesto, cE_Presupuesto);

                                abmObj.ShowValue(m_dialog.getProperties().item(C_APLICPRESU), true);

                                break;

                            case K_PACKING:

                                abmObj = m_dialog;

                                // Guardo la aplicacion para el item editado anteriormente
                                //
                                if(m_lastRowItem !== 0) {
                                    aplicado = pItUpdateGrids(cE_Packing, m_vPacking);
                                }

                                // Muestro las aplicaciones para este item
                                //
                                m_lastRowItem = iProp.getSelectedIndex();
                                row = iProp.getGrid().getRows(m_lastRowItem);
                                if(row === null) { return null; }

                                pItSetAplicItems(m_dialog.getProperties().item(C_APLICPACKING), Dialogs.cell(row, KII_PVI_ID).getID(), Dialogs.cell(row, KII_PR_ID).getID(), m_vPacking, cE_Packing);

                                abmObj.ShowValue(m_dialog.getProperties().item(C_APLICPACKING), true);

                                break;

                            case K_FAC_DEV:

                                abmObj = m_dialog;

                                // Guardo la aplicacion para el item editado anteriormente
                                //
                                if(m_lastRowFacDev !== 0) {
                                    aplicado = pItUpdateGrids(cE_FacDev, m_vFacDevs);
                                }

                                // Muestro las aplicaciones para este item
                                //
                                m_lastRowFacDev = iProp.getSelectedIndex();
                                row = iProp.getGrid().getRows(m_lastRowFacDev);
                                if(row === null) { return null; }

                                pItSetAplicItems(m_dialog.getProperties().item(C_APLICFACDEV), Dialogs.cell(row, KII_PVI_ID).getID(), Dialogs.cell(row, KII_PR_ID).getID(), m_vFacDevs, cE_FacDev);

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
                return "#general/pedidoventaaplic/" + m_id.toString();
            };

            self.getEditorName = function() {
                var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
                return "pedidoventaaplic" + id;
            };

            self.getTitle = function() {
                var _rtn = "";
                // **TODO:** on error resume next found !!!
                //'Aplicación pedido de venta
                _rtn = Cairo.Language.getText(1600, "");
                m_dialog.setTitle(m_pvNumero+ " - "+ m_cliente);

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
                        case K_APLIC_PRESU:
                            _rtn = pItColAUpdate(pItGetItemsProperty(cE_Presupuesto), lRow, lCol, cE_Presupuesto);
                            break;

                        case K_APLIC_PACKING:
                            _rtn = pItColAUpdate(pItGetItemsProperty(cE_Packing), lRow, lCol, cE_Packing);
                            break;

                        case K_APLIC_FAC_DEV:
                            _rtn = pItColAUpdate(pItGetItemsProperty(cE_FacDev), lRow, lCol, cE_FacDev);
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
                        case K_APLIC_PRESU:
                            _rtn = pItColBEdit(pItGetItemsProperty(cE_Presupuesto), lRow, lCol, iKeyAscii);
                            break;

                        case K_APLIC_PACKING:
                            _rtn = pItColBEdit(pItGetItemsProperty(cE_Packing), lRow, lCol, iKeyAscii);
                            break;

                        case K_APLIC_FAC_DEV:
                            _rtn = pItColBEdit(pItGetItemsProperty(cE_FacDev), lRow, lCol, iKeyAscii);
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

                        case K_APLIC_PRESU:

                            var w_pItGetItemsAplic = pItGetItemsAplic(cE_Presupuesto).getRows();

                            id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIP_PRVI_ID).getID();

                            if(id !== Cairo.Constants.NO_ID) {

                                if(!Cairo.Database.getData("PresupuestoVentaItem", "prvi_id", id, "prv_id", id)) { return; }

                                if(id !== Cairo.Constants.NO_ID) {

                                    ShowDocAux(id, "CSVenta2.cPresupuestoVenta", "CSABMInterface2.cABMGeneric");
                                }
                            }

                            break;

                        case K_APLIC_PACKING:

                            var w_pItGetItemsAplic = pItGetItemsAplic(cE_Packing).getRows();

                            id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIP_PKI_ID).getID();

                            if(id !== Cairo.Constants.NO_ID) {

                                if(!Cairo.Database.getData("PackingListItem", "pklsti_id", id, "pklst_id", id)) { return; }

                                if(id !== Cairo.Constants.NO_ID) {

                                    ShowDocAux(id, "CSExport2.cPackingList", "CSABMInterface2.cABMGeneric");
                                }
                            }

                            break;

                        case K_APLIC_FAC_DEV:

                            var w_pItGetItemsAplic = pItGetItemsAplic(cE_FacDev).getRows();

                            var objEditName = null;

                            id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIFD_RVI_ID).getID();

                            if(id !== Cairo.Constants.NO_ID) {

                                if(!Cairo.Database.getData("RemitoVentaItem", "rvi_id", id, "rv_id", id)) { return; }

                                objEditName = "CSVenta2.cRemitoVenta";

                            }
                            else {

                                id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIFD_FVI_ID).getID();

                                if(id !== Cairo.Constants.NO_ID) {
                                    if(!Cairo.Database.getData("FacturaVentaItem", "fvi_id", id, "fv_id", id)) { return; }

                                    objEditName = "CSVenta2.cFacturaVenta";

                                }
                                else {

                                    id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIFD_PVI_ID).getID();

                                    if(id !== Cairo.Constants.NO_ID) {
                                        if(!Cairo.Database.getData("PedidoVentaItem", "pvi_id", id, "pv_id", id)) { return; }

                                        objEditName = "CSPedidoVenta2.cPedidoVenta";
                                    }
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

            var newRow = function(key,  rows) {

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
                try {

                    if(!pItLoadAplicItems()) { return; }
                    if(!loadCollection()) { return; }

                    m_editing = true;

                    return;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, ex, "pEdit", C_MODULE, "");
                }
            };

            var loadCollection = function() {

                var c = null;
                var oGrd = null;

                m_lastRowItem = 0;
                m_lastRowFacDev = 0;
                m_lastRowPresu = 0;

                m_dialog.getProperties().clear();
                var w_tabs = m_dialog.getTabs();

                w_tabs.clear();

                var tab = w_tabs.add(null);
                //'Presupuestos
                tab.setName(Cairo.Language.getText(1601, ""));

                var tab = w_tabs.add(null);
                tab.setIndex(1);
                //'Packing List
                tab.setName(Cairo.Language.getText(1602, ""));

                var tab = w_tabs.add(null);
                tab.setIndex(2);
                //'Remitos/Facturas
                tab.setName(Cairo.Language.getText(1603, ""));

                c = m_dialog.getProperties().add(null, C_PRESU);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();;
                if(!pItLoadPresupuesto(c)) { return false; }
                c.setKey(K_PRESUPUESTO);
                c.setName("Items1");
                c.setWidth(9400);
                c.setLeft(250);
                c.setHeight(2600);
                c.setGridEditEnabled(false);
                c.setGridAddEnabled(false);
                c.setGridRemoveEnabled(false);
                oGrd = c.getGrid();
                oGrd.setRowSelect(true);
                oGrd.setDontSelectInGotFocus(true);

                c = m_dialog.getProperties().add(null, C_APLICPRESU);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();;
                if(!pItSetGridAplicPresupuesto(c)) { return false; }
                c.setKey(K_APLIC_PRESU);
                c.setName("Presupuestos");
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

                c = m_dialog.getProperties().add(null, C_ITEMS);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();;
                if(!pItLoadItems(c)) { return false; }
                c.setKey(K_PACKING);
                c.setName("Items");
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

                c = m_dialog.getProperties().add(null, C_APLICPACKING);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();;
                if(!pItSetGridAplicPacking(c)) { return false; }
                c.setKey(K_APLIC_PACKING);
                c.setName("Packing");
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

                c = m_dialog.getProperties().add(null, C_FACDEV);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();;
                if(!pItLoadFacDev(c)) { return false; }
                c.setKey(K_FAC_DEV);
                c.setName("Items2");
                c.setWidth(9400);
                c.setLeft(250);
                c.setHeight(2600);
                c.setGridEditEnabled(false);
                c.setGridAddEnabled(false);
                c.setGridRemoveEnabled(false);
                c.setTabIndex(2);
                oGrd = c.getGrid();
                oGrd.setRowSelect(true);
                oGrd.setDontSelectInGotFocus(true);

                c = m_dialog.getProperties().add(null, C_APLICFACDEV);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();;
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
                c.setTabIndex(2);
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
                if(m_emp_id !== cUtil.getEmpId()) {
                    MsgApplyDisabled(m_emp_nombre);
                    return _rtn;
                }

                var pvTMPId = null;

                pItUpdateGrids(cE_Presupuesto, m_vPresupuesto);
                pItUpdateGrids(cE_Packing, m_vPacking);
                pItUpdateGrids(cE_FacDev, m_vFacDevs);

                // Temporal
                if(!pSaveDocVta(m_docId, pvTMPId)) { return _rtn; }

                // Packing
                if(!pItSavePresupuesto(pvTMPId, m_vPresupuesto)) { return _rtn; }

                // Packing
                if(!pItSavePacking(pvTMPId, m_vPacking)) { return _rtn; }

                // Facturas / Devoluciones
                if(!pItSaveFacDev(pvTMPId, m_vFacDevs)) { return _rtn; }

                // Aplico llamando al sp
                var sqlstmt = null;
                var rs = null;

                sqlstmt = "sp_DocPedidoVentaSaveAplic "+ pvTMPId.toString();
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
            // PedidoVentaTemporal
            //////////////////////////////////////////////////////////////////////////////////////
            var pSaveDocVta = function(docId,  pvTMPId) { // TODO: Use of ByRef founded Private Function pSaveDocVta(ByVal DocId As Long, ByRef pvTMPId As Long) As Boolean
                var register = null;

                register = new cRegister();
                register.setFieldId(mPedidoConstantes.PV_TMPID);
                register.setTable(mPedidoConstantes.PEDIDOVENTATMP);

                register.setId(Cairo.Constants.NEW_ID);
                register.getFields().add2(mPedidoConstantes.PV_ID, m_pvId, Cairo.Constants.Types.id);

                register.getFields().add2(mPedidoConstantes.PV_NUMERO, 0, Cairo.Constants.Types.long);
                register.getFields().add2(mPedidoConstantes.PV_NRODOC, "", Cairo.Constants.Types.text);

                register.getFields().add2(mPedidoConstantes.CLI_ID, 0, Cairo.Constants.Types.long);
                register.getFields().add2(mPedidoConstantes.SUC_ID, 0, Cairo.Constants.Types.long);
                register.getFields().add2(mPedidoConstantes.DOC_ID, docId, Cairo.Constants.Types.id);
                register.getFields().add2(mPedidoConstantes.CPG_ID, csECpgTipo.cSECPGT_FECHADOCUMENTO, Cairo.Constants.Types.id);

                register.getFields().add2(C.EST_ID, CSGeneralEx2.csEEstado.cSEEST_PENDIENTE, Cairo.Constants.Types.id);

                register.getFields().setHaveLastUpdate(true);
                register.getFields().setHaveWhoModify(true);

                if(!register.beginTrans(Cairo.Database)) { return false; }

                if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return false; }

                if(!register.commitTrans()) { return false; }

                pvTMPId = register.getID();
                return true;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   PEDIDOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pItLoadAplicItems = function() {

                if(!pItLoadAplicAplicados(m_vPresupuesto, cE_Presupuesto)) { return false; }
                if(!pItLoadAplicCreditos(m_vPresupuesto, cE_Presupuesto)) { return false; }

                if(!pItLoadAplicAplicados(m_vPacking, cE_Packing)) { return false; }
                if(!pItLoadAplicCreditos(m_vPacking, cE_Packing)) { return false; }

                if(!pItLoadAplicAplicados(m_vFacDevs, cE_FacDev)) { return false; }
                if(!pItLoadAplicCreditos(m_vFacDevs, cE_FacDev)) { return false; }

                return true;
            };

            var pItLoadItems = function(iProp) { // TODO: Use of ByRef founded Private Function pItLoadItems(ByRef iProp As cIABMProperty) As Boolean
                return pItLoadItemsAux(iProp, cE_Packing);
            };

            var pItSetGridAplicPacking = function(iProp) { // TODO: Use of ByRef founded Private Function pItSetGridAplicPacking(ByRef iProp As cIABMProperty) As Boolean
                return pItSetGridAplicAux(iProp, cE_Packing);
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   GENERICAS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pItLoadItemsAux = function(iProp,  typeApply) { // TODO: Use of ByRef founded Private Function pItLoadItemsAux(ByRef iProp As cIABMProperty, ByVal TypeApply As c_TypeApply) As Boolean
                var sqlstmt = null;
                var rs = null;
                var grid = null;
                var row = null;
                var value = null;

                sqlstmt = "sp_DocPedidoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_pvId+ ",1";
                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pItLoadItems", C_MODULE)) { return false; }

                iProp.getGrid().getColumns().clear();
                iProp.getGrid().getRows().clear();

                grid = iProp.getGrid();

                var w_columns = grid.getColumns();
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KII_PVI_ID);

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
                    elem.setId(Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PVI_ID));
                    elem.setKey(KII_PVI_ID);

                    elem = row.add(null);
                    elem.setId(Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PR_ID));
                    elem.setValue(Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PR_NOMBREVENTA));
                    elem.setKey(KII_PR_ID);

                    elem = row.add(null);
                    switch (typeApply) {
                        case c_TypeApply.cE_Presupuesto:
                            elem.setValue(Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PVI_PENDIENTE_PRV));
                            break;

                        case c_TypeApply.cE_Packing:
                            elem.setValue(Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PVI_PENDIENTE_PKLST));
                            break;

                        case c_TypeApply.cE_FacDev:
                            elem.setValue(Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PVI_PENDIENTE));
                            break;
                    }
                    elem.setKey(KII_PENDIENTE);

                    switch (typeApply) {
                        case c_TypeApply.cE_Presupuesto:
                            value = Cairo.Database.valField(rs.getFields(), CSCAPLIC_PRESU);
                            break;

                        case c_TypeApply.cE_Packing:
                            value = Cairo.Database.valField(rs.getFields(), CSCAPLIC_PACKING);
                            break;

                        case c_TypeApply.cE_FacDev:
                            value = Cairo.Database.valField(rs.getFields(), CSCAPLIC_REMITO);
                            break;
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

            var pItSetGridAplicAux = function(iProp,  typeApply) { // TODO: Use of ByRef founded Private Function pItSetGridAplicAux(ByRef iProp As cIABMProperty, ByVal TypeApply As c_TypeApply) As Boolean
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
                elem.setKey(KIP_PVRV_ID);

                if(typeApply === cE_FacDev) {
                    var elem = w_columns.add(null);
                    elem.setVisible(false);
                    elem.setKey(KIFD_FVI_ID);
                    var elem = w_columns.add(null);
                    elem.setVisible(false);
                    elem.setKey(KIFD_RVI_ID);
                }

                var elem = w_columns.add(null);
                elem.setVisible(false);
                //' KIP_PRVI_ID Valen lo mismo
                elem.setKey(KIP_PKI_ID);

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

            var pItLoadAplicAplicados = function(vAplic,  typeApply) { // TODO: Use of ByRef founded Private Function pItLoadAplicAplicados(ByRef vAplic() As T_Aplic, ByVal TypeApply As c_TypeApply) As Boolean
                var sqlstmt = null;
                var rs = null;
                var i = null;
                var idx = null;

                switch (typeApply) {
                    case c_TypeApply.cE_Presupuesto:
                        sqlstmt = "sp_DocPedidoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_pvId+ ",6";
                        break;

                    case c_TypeApply.cE_Packing:
                        sqlstmt = "sp_DocPedidoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_pvId+ ",4";
                        break;

                    case c_TypeApply.cE_FacDev:
                        sqlstmt = "sp_DocPedidoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_pvId+ ",2";
                        break;
                }

                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicAplicados", C_MODULE)) { return false; }

                G.redim(vAplic, 0);
                G.redimPreserve(0, .vAplicaciones);

                if(!rs.isEOF()) {

                    rs.MoveLast;
                    rs.MoveFirst;

                    while (!rs.isEOF()) {

                        switch (typeApply) {

                            case c_TypeApply.cE_Presupuesto:
                                i = pItAddToCreditos(Cairo.Constants.NO_ID, Cairo.Constants.NO_ID, Cairo.Constants.NO_ID, Cairo.Constants.NO_ID, Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PRVI_ID), idx, vAplic);

                                break;

                            case c_TypeApply.cE_Packing:
                                i = pItAddToCreditos(Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PKLSTI_ID), Cairo.Constants.NO_ID, Cairo.Constants.NO_ID, Cairo.Constants.NO_ID, Cairo.Constants.NO_ID, idx, vAplic);

                                break;

                            case c_TypeApply.cE_FacDev:
                                i = pItAddToCreditos(Cairo.Constants.NO_ID, Cairo.Database.valField(rs.getFields(), mPedidoConstantes.RVI_ID), Cairo.Database.valField(rs.getFields(), mPedidoConstantes.FVI_ID), Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PVI_ID), Cairo.Constants.NO_ID, idx, vAplic);
                                break;
                        }

                        // Documento
                        //
                        vAplic.docNombre = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.DOC_NAME);
                        vAplic.nroDoc = Cairo.Database.valField(rs.getFields(), CSCNRO_DOC);
                        vAplic.Fecha = Cairo.Database.valField(rs.getFields(), CSCFECHA);

                        // Pendiente
                        //
                        vAplic.Pendiente = Cairo.Database.valField(rs.getFields(), CSCPENDIENTE);
                        vAplic.PendienteActual = vAplic.Pendiente;

                        switch (typeApply) {

                            case c_TypeApply.cE_Presupuesto:
                                // Presupuesto
                                //
                                vAplic.prvi_id = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PRVI_ID);

                                break;

                            case c_TypeApply.cE_Packing:
                                // Packing
                                //
                                vAplic.pki_id = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PKLSTI_ID);

                                break;

                            case c_TypeApply.cE_FacDev:
                                // Factura/remito/devolucion
                                //
                                vAplic.pvi_id = Cairo.Database.valField(rs.getFields(), CSCPVD_ID);
                                vAplic.fvi_id = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.FVI_ID);
                                vAplic.rvi_id = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.RVI_ID);
                                break;
                        }

                        vAplic.PR_ID = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PR_ID);

                        // Aplicaciones
                        //*TODO:** can't found type for with block
                        //*With .vAplicaciones(idx)
                        var w___TYPE_NOT_FOUND = vAplic.vAplicaciones(idx);

                        w___TYPE_NOT_FOUND.vinc_id = Cairo.Database.valField(rs.getFields(), CSCVINC_ID);

                        w___TYPE_NOT_FOUND.pvi_id = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PVI_ID);

                        w___TYPE_NOT_FOUND.Aplicado = Cairo.Database.valField(rs.getFields(), CSCAPLICADO);

                        // Aplicacion total sobre este credito
                        vAplic.Aplicado = vAplic.Aplicado + vAplic.vAplicaciones(idx).Aplicado;
                        vAplic.AplicadoActual = vAplic.Aplicado;

                        rs.MoveNext;
                    }
                }

                return true;
            };

            var pItLoadAplicCreditos = function(vAplic,  typeApply) { // TODO: Use of ByRef founded Private Function pItLoadAplicCreditos(ByRef vAplic() As T_Aplic, ByVal TypeApply As c_TypeApply) As Boolean
                var sqlstmt = null;
                var rs = null;
                var i = null;

                switch (typeApply) {

                    case c_TypeApply.cE_Presupuesto:
                        sqlstmt = "sp_DocPedidoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_pvId+ ",7";

                        break;

                    case c_TypeApply.cE_Packing:
                        sqlstmt = "sp_DocPedidoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_pvId+ ",5";

                        break;

                    case c_TypeApply.cE_FacDev:
                        sqlstmt = "sp_DocPedidoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_pvId+ ",3";

                        break;
                }

                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicCreditos", C_MODULE)) { return false; }

                if(!rs.isEOF()) {

                    rs.MoveLast;
                    rs.MoveFirst;

                    i = vAplic.Length;
                    G.redimPreserve(vAplic, i + rs.RecordCount);

                    while (!rs.isEOF()) {

                        i = i + 1;
                        vAplic.PR_ID = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PR_ID);

                        switch (typeApply) {

                            case c_TypeApply.cE_Presupuesto:
                                vAplic.prvi_id = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PRVI_ID);

                                break;

                            case c_TypeApply.cE_Packing:
                                vAplic.pki_id = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.PKLSTI_ID);

                                break;

                            case c_TypeApply.cE_FacDev:
                                vAplic.rvi_id = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.RVI_ID);
                                vAplic.pvi_id = Cairo.Database.valField(rs.getFields(), CSCPVD_ID);
                                vAplic.fvi_id = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.FVI_ID);

                                break;
                        }

                        vAplic.docNombre = Cairo.Database.valField(rs.getFields(), mPedidoConstantes.DOC_NAME);
                        vAplic.nroDoc = Cairo.Database.valField(rs.getFields(), CSCNRO_DOC);
                        vAplic.Fecha = Cairo.Database.valField(rs.getFields(), CSCFECHA);

                        vAplic.Pendiente = Cairo.Database.valField(rs.getFields(), CSCPENDIENTE);
                        vAplic.PendienteActual = vAplic.Pendiente;

                        G.redim(vAplic.vAplicaciones, 0);

                        rs.MoveNext;
                    }
                }

                return true;
            };

            var pItAddToCreditos = function(pkiId,  rviId,  fviId,  pviId,  prviId,  idx,  vAplic) { // TODO: Use of ByRef founded Private Function pItAddToCreditos(ByVal PkiId As Long, ByVal RviId As Long, ByVal FviId As Long, ByVal PviId As Long, ByVal PrviId As Long, ByRef Idx As Long, ByRef vAplic() As T_Aplic) As Long
                var _rtn = 0;
                var i = null;

                for(i = 1; i <= vAplic.Length; i++) {
                    if((vAplic.pki_id === pkiId && pkiId !== Cairo.Constants.NO_ID) || (vAplic.rvi_id === rviId && rviId !== Cairo.Constants.NO_ID) || (vAplic.fvi_id === fviId && fviId !== Cairo.Constants.NO_ID) || (vAplic.pvi_id === pviId && pviId !== Cairo.Constants.NO_ID) || (vAplic.prvi_id === prviId && prviId !== Cairo.Constants.NO_ID)) {

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

            var pItUpdateGrids = function(typeApply,  vAplic) { // TODO: Use of ByRef founded Private Function pItUpdateGrids(ByVal TypeApply As c_TypeApply, ByRef vAplic() As T_Aplic) As Double
                var _rtn = 0;
                var iProp = null;
                var iPropAplic = null;
                var row = null;
                var lastRow = null;

                switch (typeApply) {

                    case c_TypeApply.cE_Presupuesto:
                        iProp = m_dialog.getProperties().item(C_PRESU);
                        iPropAplic = m_dialog.getProperties().item(C_APLICPRESU);
                        lastRow = m_lastRowPresu;

                        break;

                    case c_TypeApply.cE_Packing:
                        iProp = m_dialog.getProperties().item(C_ITEMS);
                        iPropAplic = m_dialog.getProperties().item(C_APLICPACKING);
                        lastRow = m_lastRowItem;

                        break;

                    case c_TypeApply.cE_FacDev:
                        iProp = m_dialog.getProperties().item(C_FACDEV);
                        iPropAplic = m_dialog.getProperties().item(C_APLICFACDEV);
                        lastRow = m_lastRowFacDev;

                        break;
                }

                if(lastRow !== 0) {

                    row = iProp.getGrid().getRows(lastRow);
                    _rtn = pItUpdateAplicItems(iPropAplic, Dialogs.cell(row, KII_PVI_ID).getID(), vAplic, typeApply);
                }

                return _rtn;
            };

            var pItSetAplicItems = function(iProp,  pvi_id,  pR_ID,  vAplic,  typeApply) { // TODO: Use of ByRef founded Private Function pItSetAplicItems(ByRef iProp As cIABMProperty, ByVal pvi_id As Long, ByVal PR_ID As Long, ByRef vAplic() As T_Aplic, ByVal TypeApply As c_TypeApply) As Boolean
                var cotizacion = null;
                var i = null;
                var j = null;

                iProp.getGrid().getRows().clear();

                m_pvi_id = pvi_id;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).PR_ID === pR_ID) {

                        if(vAplic(i).vAplicaciones.Length > 0) {
                            pItSetAplicItemsAux1(i, iProp, pvi_id, vAplic, typeApply);
                        }
                        else {
                            pItSetAplicItemsAux2(i, iProp, vAplic, typeApply);
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

                            switch (typeApply) {

                                case c_TypeApply.cE_Presupuesto:
                                    id = Dialogs.cell(row, KIP_PRVI_ID).getID();
                                    if(id === vAplic(i).prvi_id && id !== Cairo.Constants.NO_ID) {
                                        bAplic = true;
                                        break;
                                    }

                                    break;

                                case c_TypeApply.cE_Packing:
                                    id = Dialogs.cell(row, KIP_PKI_ID).getID();
                                    if(id === vAplic(i).pki_id && id !== Cairo.Constants.NO_ID) {
                                        bAplic = true;
                                        break;
                                    }

                                    break;

                                case c_TypeApply.cE_FacDev:
                                    id = Dialogs.cell(row, KIFD_FVI_ID).getID();
                                    if(id === vAplic(i).fvi_id && id !== Cairo.Constants.NO_ID) {
                                        bAplic = true;
                                        break;
                                    }

                                    id = Dialogs.cell(row, KIFD_RVI_ID).getID();
                                    if(id === vAplic(i).rvi_id && id !== Cairo.Constants.NO_ID) {
                                        bAplic = true;
                                        break;
                                    }

                                    id = Dialogs.cell(row, KIFD_PVI_ID).getID();
                                    if(id === vAplic(i).pvi_id && id !== Cairo.Constants.NO_ID) {
                                        bAplic = true;
                                        break;
                                    }
                                    break;
                            }

                            id = m_pvi_id;
                            for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {
                                if(id === vAplic(i).vAplicaciones(j).pvi_id && id !== Cairo.Constants.NO_ID) {
                                    bAplic = true;
                                    break;
                                }
                            }

                            if(bAplic) { break; }
                        }

                        if(!bAplic) { pItSetAplicItemsAux2(i, iProp, vAplic, typeApply); }
                    }
                }

                return true;
            };

            var pItUpdateAplicItems = function(iProp,  pvi_id,  vAplic,  typeApply) { // TODO: Use of ByRef founded Private Function pItUpdateAplicItems(ByRef iProp As cIABMProperty, ByVal pvi_id As Long, ByRef vAplic() As T_Aplic, ByVal TypeApply As c_TypeApply) As Double
                var cotizacion = null;
                var i = null;
                var j = null;
                var row = null;
                var aplicado = null;
                var aplicadoTotal = null;

                var _count = pItGetItemsAplic(typeApply).getRows().size();
                for(var _i = 0; _i < _count; _i++) {
                    row = pItGetItemsAplic(typeApply).getRows().item(_i);

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

            var pItSetAplicItemsAux1 = function(idx,  iProp,  pvi_id,  vAplic,  typeApply) { // TODO: Use of ByRef founded Private Sub pItSetAplicItemsAux1(ByVal Idx As Long, ByRef iProp As cIABMProperty, ByVal pvi_id As Long, ByRef vAplic() As T_Aplic, ByVal TypeApply As c_TypeApply)
                var f = null;
                var fv = null;
                var i = null;
                var iPropItem = null;
                var row = null;

                for(i = 1; i <= vAplic(idx).vAplicaciones.Length; i++) {

                    if(vAplic.pvi_id === pvi_id && pvi_id !== Cairo.Constants.NO_ID) {

                        f = iProp.getGrid().getRows().add(null);

                        elem = row.add(null);
                        elem.setId(idx);
                        elem.setKey(KIP_IDX1);

                        elem = row.add(null);
                        elem.setId(i);
                        elem.setKey(KIP_IDX2);

                        elem = row.add(null);
                        elem.setId(vAplic.vinc_id);
                        elem.setKey(KIP_PVRV_ID);

                        elem = row.add(null);

                        switch (typeApply) {

                            case c_TypeApply.cE_Presupuesto:
                                elem.setKey(KIP_PRVI_ID);
                                elem.setId(vAplic(idx).prvi_id);

                                break;

                            case c_TypeApply.cE_Packing:
                                elem.setKey(KIP_PKI_ID);
                                elem.setId(vAplic(idx).pki_id);

                                break;

                            case c_TypeApply.cE_FacDev:

                                elem.setKey(KIFD_PVI_ID);
                                elem.setId(vAplic(idx).pvi_id);

                                elem = row.add(null);
                                elem.setId(vAplic(idx).fvi_id);
                                elem.setKey(KIFD_FVI_ID);

                                elem = row.add(null);
                                elem.setId(vAplic(idx).rvi_id);
                                elem.setKey(KIFD_RVI_ID);
                                break;
                        }

                        elem = row.add(null);
                        elem.setValue(vAplic(idx).docNombre);
                        elem.setKey(KIP_DOC);

                        elem = row.add(null);
                        elem.setValue(vAplic(idx).nroDoc);
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

            var pItSetAplicItemsAux2 = function(i,  iProp,  vAplic,  typeApply) { // TODO: Use of ByRef founded Private Sub pItSetAplicItemsAux2(ByVal i As Long, ByRef iProp As cIABMProperty, ByRef vAplic() As T_Aplic, ByVal TypeApply As c_TypeApply)
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
                elem.setKey(KIP_PVRV_ID);

                elem = row.add(null);

                switch (typeApply) {

                    case c_TypeApply.cE_Presupuesto:
                        elem.setKey(KIP_PRVI_ID);
                        elem.setId(vAplic.prvi_id);

                        break;

                    case c_TypeApply.cE_Packing:
                        elem.setKey(KIP_PKI_ID);
                        elem.setId(vAplic.pki_id);

                        break;

                    case c_TypeApply.cE_FacDev:

                        elem.setKey(KIFD_PVI_ID);
                        elem.setId(vAplic.pvi_id);

                        elem = row.add(null);
                        elem.setId(vAplic.fvi_id);
                        elem.setKey(KIFD_FVI_ID);

                        elem = row.add(null);
                        elem.setId(vAplic.rvi_id);
                        elem.setKey(KIFD_RVI_ID);
                        break;
                }

                elem = row.add(null);
                elem.setValue(vAplic.docNombre);
                elem.setKey(KIP_DOC);

                elem = row.add(null);
                elem.setValue(vAplic.nroDoc);
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
                    vAplicaciones.pvi_id = m_pvi_id;
                }

                vAplicaciones(idx).Aplicado = importe;

                for(i = 1; i <= vAplicaciones.Length; i++) {
                    rtn = rtn + vAplicaciones(i).Aplicado;
                }

                return rtn;
            };

            var pItGetItemsProperty = function(typeApply) {
                switch (typeApply) {

                    case c_TypeApply.cE_Presupuesto:
                        return m_dialog.getProperties().item(C_APLICPRESU);

                        break;

                    case c_TypeApply.cE_Packing:
                        return m_dialog.getProperties().item(C_APLICPACKING);

                        break;

                    case c_TypeApply.cE_FacDev:
                        return m_dialog.getProperties().item(C_APLICFACDEV);

                        break;
                }
            };

            var pItGetItemsAplic = function(typeApply) {
                switch (typeApply) {

                    case c_TypeApply.cE_Presupuesto:
                        return m_dialog.getProperties().item(C_APLICPRESU).getGrid();

                        break;

                    case c_TypeApply.cE_Packing:
                        return m_dialog.getProperties().item(C_APLICPACKING).getGrid();

                        break;

                    case c_TypeApply.cE_FacDev:
                        return m_dialog.getProperties().item(C_APLICFACDEV).getGrid();
                        break;
                }
            };

            var pItColBEdit = function(property,  lRow,  lCol,  iKeyAscii) { // TODO: Use of ByRef founded Private Function pItColBEdit(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer)
                switch (cABMUtil.pGetKeyFromCol(property.getGrid().getColumns(), lCol)) {
                    case KIP_APLICADO:
                        break;

                    default:
                        return null;
                        break;
                }

                return true;
            };

            var pItGetItemPendiente = function(typeApply) {
                var iProp = null;

                switch (typeApply) {

                    case c_TypeApply.cE_Presupuesto:
                        iProp = m_dialog.getProperties().item(C_PRESU);

                        break;

                    case c_TypeApply.cE_Packing:
                        iProp = m_dialog.getProperties().item(C_ITEMS);

                        break;

                    case c_TypeApply.cE_FacDev:
                        iProp = m_dialog.getProperties().item(C_FACDEV);
                        break;
                }

                return Dialogs.cell(iProp.getGrid().getRows(iProp.getSelectedIndex()), KII_PENDIENTE);
            };

            var pItGetItemAplicado = function(typeApply) {
                var iProp = null;

                switch (typeApply) {

                    case c_TypeApply.cE_Presupuesto:
                        iProp = m_dialog.getProperties().item(C_PRESU);

                        break;

                    case c_TypeApply.cE_Packing:
                        iProp = m_dialog.getProperties().item(C_ITEMS);

                        break;

                    case c_TypeApply.cE_FacDev:
                        iProp = m_dialog.getProperties().item(C_FACDEV);
                        break;
                }

                return Dialogs.cell(iProp.getGrid().getRows(iProp.getSelectedIndex()), KII_APLICADO2);
            };

            var pItColAUpdate = function(property,  lRow,  lCol,  typeApply) { // TODO: Use of ByRef founded Private Function pItColAUpdate(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal TypeApply As c_TypeApply)
                var row = null;
                var maxVal = null;
                var bVisible = null;
                var pendiente = null;

                var w_grid = property.getGrid();
                switch (w_grid.getColumns(lCol).Key) {
                    case KIP_APLICADO:
                        row = w_grid.getRows(lRow);

                        var w_pCell = Dialogs.cell(row, KIP_APLICADO);

                        pendiente = Cairo.Util.val(pItGetItemPendiente(typeApply).getValue()) + Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO2).getValue());
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
                        aplicado = pItGetAplicado(typeApply);
                        pItRefreshItem(aplicado, typeApply);
                        pItGetItemAplicado(typeApply).setValue(aplicado);

                        // Actulizo el pendiente
                        var w_pCell = Dialogs.cell(row, KIP_PENDIENTE);
                        w_pCell.setValue(Cairo.Util.val(w_pCell.getValue()) + Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO2).getValue()) - Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO).getValue()));
                        Dialogs.cell(row, KIP_APLICADO2).getValue() === Dialogs.cell(row, KIP_APLICADO).getValue();
                        break;
                }

                return true;
            };

            var pItGetAplicado = function(typeApply) {
                var row = null;
                var rtn = null;
                var iProp = null;

                switch (typeApply) {

                    case c_TypeApply.cE_Presupuesto:
                        iProp = m_dialog.getProperties().item(C_APLICPRESU);

                        break;

                    case c_TypeApply.cE_Packing:
                        iProp = m_dialog.getProperties().item(C_APLICPACKING);

                        break;

                    case c_TypeApply.cE_FacDev:
                        iProp = m_dialog.getProperties().item(C_APLICFACDEV);

                        break;
                }

                var _count = iProp.getGrid().getRows().size();
                for(var _i = 0; _i < _count; _i++) {
                    row = iProp.getGrid().getRows().item(_i);
                    rtn = rtn + Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO).getValue());
                }
                return rtn;
            };

            var pItRefreshItem = function(aplicado,  typeApply) {
                var iProp = null;
                var abmObj = null;
                var row = null;
                var aplicadoActual = null;
                var lastRow = null;

                abmObj = m_dialog;

                switch (typeApply) {

                    case c_TypeApply.cE_Presupuesto:
                        iProp = m_dialog.getProperties().item(C_PRESU);
                        lastRow = m_lastRowPresu;

                        break;

                    case c_TypeApply.cE_Packing:
                        iProp = m_dialog.getProperties().item(C_ITEMS);
                        lastRow = m_lastRowItem;

                        break;

                    case c_TypeApply.cE_FacDev:
                        iProp = m_dialog.getProperties().item(C_FACDEV);
                        lastRow = m_lastRowFacDev;
                        break;
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

            var pItSavePacking = function(pvTMPId,  vAplic) { // TODO: Use of ByRef founded Private Function pItSavePacking(ByVal pvTMPId As Long, ByRef vAplic() As T_Aplic) As Boolean
                var register = null;
                var i = null;
                var j = null;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).pki_id !== Cairo.Constants.NO_ID) {

                        for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {

                            if(vAplic(i).vAplicaciones(j).pvi_id !== Cairo.Constants.NO_ID) {

                                if(vAplic.Aplicado > 0) {

                                    register = new cRegister();
                                    register.setFieldId(mPedidoConstantes.PV_PKLST_TMPID);
                                    register.setTable(mPedidoConstantes.PEDIDOPACKINGLISTTMP);
                                    register.setId(Cairo.Constants.NEW_ID);

                                    register.getFields().add2(mPedidoConstantes.PV_TMPID, pvTMPId, Cairo.Constants.Types.id);
                                    register.getFields().add2(mPedidoConstantes.PKLSTI_ID, vAplic(i).pki_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(mPedidoConstantes.PVI_ID, vAplic.pvi_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(mPedidoConstantes.PV_PKLST_CANTIDAD, vAplic.Aplicado, Cairo.Constants.Types.double);

                                    register.getFields().add2(mPedidoConstantes.PV_PKLST_ID, vAplic.vinc_id, Cairo.Constants.Types.long);

                                    register.getFields().setHaveLastUpdate(false);
                                    register.getFields().setHaveWhoModify(false);

                                    if(!Cairo.Database.save(register, , "pItSavePacking", C_MODULE, c_ErrorSave)) { return false; }
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

                    c_ErrorSave = Cairo.Language.getText(1591, "");
                    //Error al grabar el Pedido de Venta

                    m_generalConfig = new cGeneralConfig();
                    m_generalConfig.Load;

                    G.redim(m_vPresupuesto, 0);
                    G.redimPreserve(0, .vAplicaciones);

                    G.redim(m_vPacking, 0);
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

                    G.redim(m_vPresupuesto, 0);
                    G.redim(m_vFacDevs, 0);
                    G.redim(m_vPacking, 0);

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
            //   REMITOS / REMITOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pItLoadFacDev = function(iProp) { // TODO: Use of ByRef founded Private Function pItLoadFacDev(ByRef iProp As cIABMProperty) As Boolean
                return pItLoadItemsAux(iProp, cE_FacDev);
            };

            var pItSetGridAplicFacDev = function(iProp) { // TODO: Use of ByRef founded Private Function pItSetGridAplicFacDev(ByRef iProp As cIABMProperty) As Boolean
                return pItSetGridAplicAux(iProp, cE_FacDev);
            };

            var pItSaveFacDev = function(pvTMPId,  vAplic) { // TODO: Use of ByRef founded Private Function pItSaveFacDev(ByVal pvTMPId As Long, ByRef vAplic() As T_Aplic) As Boolean
                var register = null;
                var i = null;
                var j = null;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).fvi_id !== Cairo.Constants.NO_ID || vAplic(i).pvi_id !== Cairo.Constants.NO_ID || vAplic(i).rvi_id !== Cairo.Constants.NO_ID) {

                        for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {

                            if(vAplic(i).vAplicaciones(j).pvi_id !== Cairo.Constants.NO_ID) {

                                if(vAplic.Aplicado > 0) {

                                    register = new cRegister();

                                    // Si estoy vinculando contra una factura
                                    if(vAplic(i).fvi_id !== 0) {
                                        register.setFieldId(mPedidoConstantes.PV_FV_TMPID);
                                        register.setTable(mPedidoConstantes.PEDIDOFACTURAVENTATMP);
                                        register.getFields().add2(mPedidoConstantes.FVI_ID, vAplic(i).fvi_id, Cairo.Constants.Types.id);
                                        register.getFields().add2(mPedidoConstantes.PVI_ID, vAplic.pvi_id, Cairo.Constants.Types.id);

                                        register.getFields().add2(mPedidoConstantes.PV_FV_CANTIDAD, vAplic.Aplicado, Cairo.Constants.Types.double);
                                        register.getFields().add2(mPedidoConstantes.PV_FV_ID, vAplic.vinc_id, Cairo.Constants.Types.long);

                                    }
                                    else if(vAplic(i).rvi_id !== 0) {

                                        register.setFieldId(mPedidoConstantes.PV_RV_TMPID);
                                        register.setTable(mPedidoConstantes.PEDIDOREMITOVENTATMP);
                                        register.getFields().add2(mPedidoConstantes.RVI_ID, vAplic(i).rvi_id, Cairo.Constants.Types.id);
                                        register.getFields().add2(mPedidoConstantes.PVI_ID, vAplic.pvi_id, Cairo.Constants.Types.id);

                                        register.getFields().add2(mPedidoConstantes.PV_RV_CANTIDAD, vAplic.Aplicado, Cairo.Constants.Types.double);
                                        register.getFields().add2(mPedidoConstantes.PV_RV_ID, vAplic.vinc_id, Cairo.Constants.Types.long);

                                        // Si vinculo contra un pedido (Pedido - Devolucion)
                                    }
                                    else {
                                        register.setFieldId(mPedidoConstantes.PV_DV_TMPID);
                                        register.setTable(mPedidoConstantes.PEDIDODEVOLUCIONVENTATMP);

                                        if(m_isDevolucion) {
                                            register.getFields().add2(mPedidoConstantes.PVI_ID_DEVOLUCION, vAplic.pvi_id, Cairo.Constants.Types.id);
                                            register.getFields().add2(mPedidoConstantes.PVI_ID_PEDIDO, vAplic(i).pvi_id, Cairo.Constants.Types.id);
                                        }
                                        else {
                                            register.getFields().add2(mPedidoConstantes.PVI_ID_PEDIDO, vAplic.pvi_id, Cairo.Constants.Types.id);
                                            register.getFields().add2(mPedidoConstantes.PVI_ID_DEVOLUCION, vAplic(i).pvi_id, Cairo.Constants.Types.id);
                                        }

                                        register.getFields().add2(mPedidoConstantes.PV_DV_CANTIDAD, vAplic.Aplicado, Cairo.Constants.Types.double);
                                        register.getFields().add2(mPedidoConstantes.PV_DV_ID, vAplic.vinc_id, Cairo.Constants.Types.long);

                                    }

                                    register.setId(Cairo.Constants.NEW_ID);
                                    register.getFields().add2(mPedidoConstantes.PV_TMPID, pvTMPId, Cairo.Constants.Types.id);

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

            var pItLoadPresupuesto = function(iProp) { // TODO: Use of ByRef founded Private Function pItLoadPresupuesto(ByRef iProp As cIABMProperty) As Boolean
                return pItLoadItemsAux(iProp, cE_Presupuesto);
            };

            var pItSetGridAplicPresupuesto = function(iProp) { // TODO: Use of ByRef founded Private Function pItSetGridAplicPresupuesto(ByRef iProp As cIABMProperty) As Boolean
                return pItSetGridAplicAux(iProp, cE_Presupuesto);
            };

            var pItSavePresupuesto = function(pvTMPId,  vAplic) { // TODO: Use of ByRef founded Private Function pItSavePresupuesto(ByVal pvTMPId As Long, ByRef vAplic() As T_Aplic) As Boolean
                var register = null;
                var i = null;
                var j = null;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).prvi_id !== Cairo.Constants.NO_ID) {

                        for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {

                            if(vAplic(i).vAplicaciones(j).pvi_id !== Cairo.Constants.NO_ID) {

                                if(vAplic.Aplicado > 0) {

                                    register = new cRegister();
                                    register.setFieldId(mPedidoConstantes.PRV_PV_TMPID);
                                    register.setTable(mPedidoConstantes.PRESUPUESTOPEDIDOVENTATMP);
                                    register.setId(Cairo.Constants.NEW_ID);

                                    register.getFields().add2(mPedidoConstantes.PV_TMPID, pvTMPId, Cairo.Constants.Types.id);
                                    register.getFields().add2(mPedidoConstantes.PRVI_ID, vAplic(i).prvi_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(mPedidoConstantes.PVI_ID, vAplic.pvi_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(mPedidoConstantes.PRV_PV_CANTIDAD, vAplic.Aplicado, Cairo.Constants.Types.double);

                                    register.getFields().add2(mPedidoConstantes.PRV_PV_ID, vAplic.vinc_id, Cairo.Constants.Types.long);

                                    register.getFields().setHaveLastUpdate(false);
                                    register.getFields().setHaveWhoModify(false);

                                    if(!Cairo.Database.save(register, , "pItSavePresupuesto", C_MODULE, c_ErrorSave)) { return false; }
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

    Cairo.module("PedidoVentaAplic.List", function(List, Cairo, Backbone, Marionette, $, _) {
        List.Controller = {
            list: function() {

                var self = this;

                /*
                 this function will be called by the tab manager every time the
                 view must be created. when the tab is not visible the tab manager
                 will not call this function but only make the tab visible
                 */
                var createTreeDialog = function(tabId) {

                    var editors = Cairo.Editors.pedidoventaaplicEditors || Cairo.Collections.createCollection(null);
                    Cairo.Editors.pedidoventaaplicEditors = editors;

                    // ListController properties and methods
                    //
                    self.entityInfo = new Backbone.Model({
                        entitiesTitle: "PedidoVentaAplics",
                        entityName: "pedidoventaaplic",
                        entitiesName: "pedidoventaaplics"
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
                            var editor = Cairo.PedidoVentaAplic.Edit.Controller.getEditor();
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
                        if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_PEDIDOVENTAAPLIC)) {
                            return Cairo.Promises.resolvedPromise(false);
                        }
                        var apiPath = Cairo.Database.getAPIVersion();
                        return Cairo.Database.destroy(apiPath + "general/pedidoventaaplic", id, Cairo.Constants.DELETE_FUNCTION, "PedidoVentaAplic").success(
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
                    Cairo.LoadingMessage.show("PedidoVentaAplics", "Loading pedidoventaaplic from Crowsoft Cairo server.");

                    // create the tree region
                    //
                    Cairo.addRegions({ pedidoventaaplicTreeRegion: tabId });

                    // create the dialog
                    //
                    Cairo.Tree.List.Controller.list(
                        Cairo.Tables.PEDIDOVENTAAPLIC,
                        new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
                        Cairo.pedidoventaaplicTreeRegion,
                        self);

                };

                var showTreeDialog = function() {
                    Cairo.Tree.List.Controller.showTreeDialog(self);
                };

                var closeTreeDialog = function() {

                }

                // create the tab
                //
                Cairo.mainTab.showTab("PedidoVentaAplics", "pedidoventaaplicTreeRegion", "#general/pedidoventaaplics", createTreeDialog, closeTreeDialog, showTreeDialog);

            }
        };
    });


}());

private class T_ItAplic {
    public Long vinc_id;//' lo uso para pvrv_id, pvfv_id y pvdv_id y pvpklst_id
    public Long pvi_id;//' Ids de items al que este credito esta vinculado
    public Double aplicado;
}


private class T_Aplic {
    public Long pki_id;//' Packing list
    public Long prvi_id;//' Presupuesto
    public Long rvi_id;//' Remito
    public Long fvi_id;//' Factura
    public Long pvi_id;//' Cancelacion de pedido
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


private enum c_TypeApply {
    CE_PRESUPUESTO = 1,
        CE_PACKING = 2,
        CE_FACDEV = 3
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


case class PedidoventaaplicData(
    id: Option[Int],

)

object Pedidoventaaplics extends Controller with ProvidesUser {

    val pedidoventaaplicForm = Form(
        mapping(
                "id" -> optional(number),

        )(PedidoventaaplicData.apply)(PedidoventaaplicData.unapply))

    implicit val pedidoventaaplicWrites = new Writes[Pedidoventaaplic] {
        def writes(pedidoventaaplic: Pedidoventaaplic) = Json.obj(
                "id" -> Json.toJson(pedidoventaaplic.id),
                C.ID -> Json.toJson(pedidoventaaplic.id),

        )
    }

    def get(id: Int) = GetAction { implicit request =>
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PEDIDOVENTAAPLIC), { user =>
        Ok(Json.toJson(Pedidoventaaplic.get(user, id)))
    })
}

def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in pedidoventaaplics.update")
    pedidoventaaplicForm.bindFromRequest.fold(
        formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
    BadRequest
},
pedidoventaaplic => {
    Logger.debug(s"form: ${pedidoventaaplic.toString}")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PEDIDOVENTAAPLIC), { user =>
    Ok(
        Json.toJson(
            Pedidoventaaplic.update(user,
                Pedidoventaaplic(
                    id,

                ))))
})
}
)
}

def create = PostAction { implicit request =>
    Logger.debug("in pedidoventaaplics.create")
    pedidoventaaplicForm.bindFromRequest.fold(
        formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
    BadRequest
},
pedidoventaaplic => {
    Logger.debug(s"form: ${pedidoventaaplic.toString}")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PEDIDOVENTAAPLIC), { user =>
    Ok(
        Json.toJson(
            Pedidoventaaplic.create(user,
                Pedidoventaaplic(

                ))))
})
}
)
}

def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in pedidoventaaplics.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PEDIDOVENTAAPLIC), { user =>
    Pedidoventaaplic.delete(user, id)
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

case class Pedidoventaaplic(
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

object Pedidoventaaplic {

    lazy val emptyPedidoventaaplic = Pedidoventaaplic(
    )

    def apply(
        id: Int,
) = {

        new Pedidoventaaplic(
            id,
        )
    }

    def apply(
    ) = {

        new Pedidoventaaplic(
        )
    }

    private val pedidoventaaplicParser: RowParser[Pedidoventaaplic] = {
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
        Pedidoventaaplic(
            id,
            ,
            createdAt,
            updatedAt,
            updatedBy)
    }
}

def create(user: CompanyUser, pedidoventaaplic: Pedidoventaaplic): Pedidoventaaplic = {
    save(user, pedidoventaaplic, true)
}

def update(user: CompanyUser, pedidoventaaplic: Pedidoventaaplic): Pedidoventaaplic = {
    save(user, pedidoventaaplic, false)
}

private def save(user: CompanyUser, pedidoventaaplic: Pedidoventaaplic, isNew: Boolean): Pedidoventaaplic = {
    def getFields = {
        List(

            )
    }
    def throwException = {
        throw new RuntimeException(s"Error when saving ${C.PEDIDOVENTAAPLIC}")
}

DBHelper.saveEx(
    user,
    Register(
        C.PEDIDOVENTAAPLIC,
        C.ID,
        pedidoventaaplic.id,
        false,
        true,
        true,
        getFields),
    isNew,
    C.CODE
) match {
case SaveResult(true, id) => load(user, id).getOrElse(throwException)
case SaveResult(false, id) => throwException
}
}

def load(user: CompanyUser, id: Int): Option[Pedidoventaaplic] = {
    loadWhere(user, s"${C.ID} = {id}", 'id -> id)
}

def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
    SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.PEDIDOVENTAAPLIC} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
.on(args: _*)
.as(pedidoventaaplicParser.singleOpt)
}
}

def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
    try {
        SQL(s"DELETE FROM ${C.PEDIDOVENTAAPLIC} WHERE ${C.ID} = {id}")
    .on('id -> id)
            .executeUpdate
    } catch {
    case NonFatal(e) => {
            Logger.error(s"can't delete a ${C.PEDIDOVENTAAPLIC}. ${C.ID} id: $id. Error ${e.toString}")
            throw e
        }
    }
}
}

def get(user: CompanyUser, id: Int): Pedidoventaaplic = {
    load(user, id) match {
        case Some(p) => p
    case None => emptyPedidoventaaplic
}
}
}


// Router

GET     /api/v1/general/pedidoventaaplic/:id              controllers.logged.modules.general.Pedidoventaaplics.get(id: Int)
POST    /api/v1/general/pedidoventaaplic                  controllers.logged.modules.general.Pedidoventaaplics.create
PUT     /api/v1/general/pedidoventaaplic/:id              controllers.logged.modules.general.Pedidoventaaplics.update(id: Int)
DELETE  /api/v1/general/pedidoventaaplic/:id              controllers.logged.modules.general.Pedidoventaaplics.delete(id: Int)




/**/
