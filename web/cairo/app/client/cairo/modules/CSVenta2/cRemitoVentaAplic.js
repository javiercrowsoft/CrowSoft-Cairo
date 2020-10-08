(function() {
    "use strict";

    Cairo.module("RemitoVentaAplic.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

        var createObject = function() {

            var self = {};

            var getText = Cairo.Language.getText;

            var TITLE = getText(1721, ""); // Aplicación Remito de Venta
            var SAVE_ERROR_MESSAGE = getText(2222, ""); // Error al grabar el Remito de Venta

            var Dialogs = Cairo.Dialogs;

            var C_MODULE = "cRemitoVentaAplic";

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
            var CSCVINC_ID = "rvfvdv_id";
            var CSCRVD_ID = "rvd_id";
            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   PEDIDO - SOLAPA
            //
            //////////////////////////////////////////////////////////////////////////////////////

            // Pedido

            var K_PEDIDO = 10;
            var K_APLIC_PEDIDO = 11;
            var C_ITEMS = "Items";
            var C_APLICPEDIDO = "AplicPedido";

            var CSCFECHA = "Fecha";
            var CSCAPLICADO = "Aplicado";
            var CSCAPLIC_REMITO = "AplicRemito";
            var CSCAPLIC_PEDIDO = "AplicPedido";

            // Grillas de Pedidos / Remitos
            var KII_RVI_ID = 1;
            var KII_PR_ID = 2;
            var KII_APLICADO = 4;
            var KII_APLICADO2 = 5;
            var KII_PENDIENTE = 6;

            var KIP_PVRV_ID = 1;
            var KIP_OSRV_ID = 100;

            // Estos dos tienen el mismo valor aproposito
            var KIP_PVI_ID = 3;
            var KIFD_RVI_ID = KIP_PVI_ID;
            var KIP_OSI_ID = 101;

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

            // Facturas

            var KIFD_FVI_ID = 2;

            var K_FAC_DEV = 20;
            var K_APLIC_FAC_DEV = 21;
            var C_FACDEV = "FacDev";
            var C_APLICFACDEV = "AplicFacDev";

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   PEDIDOS / REMITOS
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
            var m_rvId = 0;
            var m_isDevolucion;
            var m_rvNumero = "";
            var m_cliente = "";
            var m_cliId = 0;
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
            //   PEDIDOS / REMITOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var m_vPedidoOrden;
            var m_vFacDevs;
            var m_rvi_id = 0;

            // eventos

            // Edit Apply
            //
            self.setObjectClient = function(rhs) {
                m_objectClient = rhs;
            };

            self.getId = function() {
                return m_rvId;
            };

            // propiedades friend
            self.show = function(rvId,  total,  rvNumero,  cliId,  cliente,  sucId,  docId,  isDevolucion) {

                if(m_dialog === null) {
                    m_dialog = new cABMGeneric();
                }

                if(m_rvId !== rvId) {
                    m_isDevolucion = isDevolucion;
                    m_rvId = rvId;
                    m_rvNumero = rvNumero;
                    m_cliente = cliente;
                    m_cliId = cliId;
                    m_docId = docId;
                    m_sucId = sucId;
                    m_total = total;

                    // Edit Apply
                    //
                    if(!Cairo.Database.getData(mVentaConstantes.REMITO_VENTA, mVentaConstantes.RV_ID, m_rvId, C.EMP_ID, m_emp_id)) { return false; }

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

                            case K_PEDIDO:

                                abmObj = m_dialog;

                                // Guardo la aplicacion para el item editado anteriormente
                                //
                                if(m_lastRowItem !== 0) {
                                    aplicado = pItUpdateGrids(true, m_vPedidoOrden);
                                }

                                // Muestro las aplicaciones para este item
                                //
                                m_lastRowItem = iProp.getSelectedIndex();
                                row = iProp.getGrid().getRows(m_lastRowItem);
                                if(row === null) { return null; }

                                pItSetAplicItems(m_dialog.getProperties().item(C_APLICPEDIDO), Dialogs.cell(row, KII_RVI_ID).getID(), Dialogs.cell(row, KII_PR_ID).getID(), m_vPedidoOrden, true);

                                abmObj.ShowValue(m_dialog.getProperties().item(C_APLICPEDIDO), true);

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

                                pItSetAplicItems(m_dialog.getProperties().item(C_APLICFACDEV), Dialogs.cell(row, KII_RVI_ID).getID(), Dialogs.cell(row, KII_PR_ID).getID(), m_vFacDevs, false);

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
                return "#general/remitoventaaplic/" + m_id.toString();
            };

            self.getEditorName = function() {
                var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
                return "remitoventaaplic" + id;
            };

            self.getTitle = function() {
                var _rtn = "";
                // **TODO:** on error resume next found !!!
                //'Aplicación Remito de Venta
                _rtn = Cairo.Language.getText(1721, "");
                m_dialog.setTitle(m_rvNumero+ " - "+ m_cliente);

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
                        case K_APLIC_PEDIDO:
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
                        case K_APLIC_PEDIDO:
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
                    var objEditName = null;

                    switch (key) {

                        case K_APLIC_PEDIDO:

                            var w_pItGetItemsAplic = pItGetItemsAplic(true).getRows();

                            id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIP_PVI_ID).getID();

                            if(id !== Cairo.Constants.NO_ID) {

                                if(!Cairo.Database.getData("PedidoVentaItem", "pvi_id", id, "pv_id", id)) { return; }

                                objEditName = "CSPedidoVenta2.cPedidoVenta";

                            }
                            else {

                                id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIP_OSI_ID).getID();

                                if(id !== Cairo.Constants.NO_ID) {

                                    if(!Cairo.Database.getData("OrdenServicioItem", "osi_id", id, "os_id", id)) { return; }

                                    objEditName = "CSTicket.cOrdenServicio";

                                }
                            }

                            if(id !== Cairo.Constants.NO_ID) {

                                ShowDocAux(id, objEditName, "CSABMInterface2.cABMGeneric");
                            }

                            break;

                        case K_APLIC_FAC_DEV:

                            var w_pItGetItemsAplic = pItGetItemsAplic(false).getRows();

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

                m_dialog.getProperties().clear();

                var w_tabs = m_dialog.getTabs();

                w_tabs.clear();

                var tab = w_tabs.add(null);
                //'Pedidos/Ordenes
                tab.setName(Cairo.Language.getText(1720, ""));

                var tab = w_tabs.add(null);
                tab.setIndex(1);
                //'Facturas
                tab.setName(Cairo.Language.getText(1607, ""));

                var properties = m_dialog.getProperties();

                c = properties.add(null, C_ITEMS);
                c.setType(Dialogs.PropertyType.grid);
                if(!pItLoadItems(c)) { return false; }
                c.setKey(K_PEDIDO);
                c.setName("Items");
                c.hideLabel();;
                c.setWidth(9400);
                c.setLeft(250);
                c.setHeight(2600);
                c.setGridEditEnabled(false);
                c.setGridAddEnabled(false);
                c.setGridRemoveEnabled(false);
                oGrd = c.getGrid();
                oGrd.setRowSelect(true);
                oGrd.setDontSelectInGotFocus(true);

                c = properties.add(null, C_APLICPEDIDO);
                c.setType(Dialogs.PropertyType.grid);
                if(!pItSetGridAplicPedido(c)) { return false; }
                c.setKey(K_APLIC_PEDIDO);
                c.setName("Pedido");
                c.hideLabel();;
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
                if(!pItLoadFacDev(c)) { return false; }
                c.setKey(K_FAC_DEV);
                c.setName("Items2");
                c.hideLabel();;
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
                if(!pItSetGridAplicFacDev(c)) { return false; }
                c.setKey(K_APLIC_FAC_DEV);
                c.setName("Facturas");
                c.hideLabel();;
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
                if(m_emp_id !== cUtil.getEmpId()) {
                    MsgApplyDisabled(m_emp_nombre);
                    return _rtn;
                }

                var rvTMPId = null;

                pItUpdateGrids(true, m_vPedidoOrden);
                pItUpdateGrids(false, m_vFacDevs);

                // Temporal
                if(!pSaveDocVta(m_docId, rvTMPId)) { return _rtn; }

                // Pedidos
                if(!pItSavePedidoOrden(rvTMPId, m_vPedidoOrden)) { return _rtn; }

                // Facturas / Devoluciones
                if(!pItSaveFacDev(rvTMPId, m_vFacDevs)) { return _rtn; }

                // Aplico llamando al sp
                var sqlstmt = null;
                var rs = null;

                sqlstmt = "sp_DocRemitoVentaSaveAplic "+ rvTMPId.toString();
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
            // RemitoVentaTemporal
            //////////////////////////////////////////////////////////////////////////////////////
            var pSaveDocVta = function(docId,  rvTMPId) { // TODO: Use of ByRef founded Private Function pSaveDocVta(ByVal DocId As Long, ByRef RvTMPId As Long) As Boolean
                var register = null;

                register = new cRegister();
                register.setFieldId(mVentaConstantes.RV_TMP_ID);
                register.setTable(mVentaConstantes.REMITO_VENTATMP);

                register.setId(Cairo.Constants.NEW_ID);
                register.getFields().add2(mVentaConstantes.RV_ID, m_rvId, Cairo.Constants.Types.id);

                register.getFields().add2(mVentaConstantes.RV_NUMERO, 0, Cairo.Constants.Types.long);
                register.getFields().add2(mVentaConstantes.RV_NRODOC, "", Cairo.Constants.Types.text);

                register.getFields().add2(mVentaConstantes.CLI_ID, 0, Cairo.Constants.Types.long);
                register.getFields().add2(mVentaConstantes.SUC_ID, 0, Cairo.Constants.Types.long);
                register.getFields().add2(mVentaConstantes.DOC_ID, docId, Cairo.Constants.Types.id);
                register.getFields().add2(mVentaConstantes.CPG_ID, csECpgTipo.cSECPGT_FECHADOCUMENTO, Cairo.Constants.Types.id);

                register.getFields().add2(C.EST_ID, CSGeneralEx2.csEEstado.cSEEST_PENDIENTE, Cairo.Constants.Types.id);

                register.getFields().setHaveLastUpdate(true);
                register.getFields().setHaveWhoModify(true);

                if(!register.beginTrans(Cairo.Database)) { return false; }

                if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return false; }

                if(!register.commitTrans()) { return false; }

                rvTMPId = register.getID();
                return true;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   PEDIDOS / REMITOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pItLoadAplicItems = function() {

                if(!pItLoadAplicAplicados(m_vPedidoOrden, true)) { return false; }
                if(!pItLoadAplicCreditos(m_vPedidoOrden, true)) { return false; }

                if(!pItLoadAplicAplicados(m_vFacDevs, false)) { return false; }
                if(!pItLoadAplicCreditos(m_vFacDevs, false)) { return false; }

                return true;
            };

            var pItLoadItems = function(iProp) { // TODO: Use of ByRef founded Private Function pItLoadItems(ByRef iProp As cIABMProperty) As Boolean
                return pItLoadItemsAux(iProp, true);
            };

            var pItSetGridAplicPedido = function(iProp) { // TODO: Use of ByRef founded Private Function pItSetGridAplicPedido(ByRef iProp As cIABMProperty) As Boolean
                return pItSetGridAplicAux(iProp, true);
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   GENERICAS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pGetRvDesdeOs = function() {
                var doc = null;
                doc = new cDocumento();
                return doc.GetData(m_docId, mVentaConstantes.DOC_RV_DESDE_OS, Cairo.Constants.Types.boolean);
            };

            var pItLoadItemsAux = function(iProp,  isPedido) { // TODO: Use of ByRef founded Private Function pItLoadItemsAux(ByRef iProp As cIABMProperty, ByVal IsPedido As Boolean) As Boolean
                var sqlstmt = null;
                var rs = null;
                var grid = null;
                var row = null;
                var value = null;
                var rv_desde_os = null;
                var bAdd = null;

                if(isPedido) {
                    rv_desde_os = pGetRvDesdeOs();
                }

                sqlstmt = "sp_DocRemitoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_rvId+ ",1";
                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pItLoadItems", C_MODULE)) { return false; }

                iProp.getGrid().getColumns().clear();
                iProp.getGrid().getRows().clear();

                grid = iProp.getGrid();

                var w_columns = grid.getColumns();
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KII_RVI_ID);

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

                    if(isPedido) {
                        if(rv_desde_os && Cairo.Util.val(Cairo.Database.valField(rs.getFields(), "pr_esrepuesto"))) {
                            bAdd = false;
                        }
                        else {
                            bAdd = true;
                        }
                    }
                    else {
                        bAdd = true;
                    }

                    if(bAdd) {

                        f = iProp.getGrid().getRows().add(null);

                        elem = row.add(null);
                        elem.setId(Cairo.Database.valField(rs.getFields(), mVentaConstantes.RVI_ID));
                        elem.setKey(KII_RVI_ID);

                        elem = row.add(null);
                        elem.setId(Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_ID));
                        elem.setValue(Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_NOMBRE_VENTA));
                        elem.setKey(KII_PR_ID);

                        elem = row.add(null);
                        if(isPedido) {
                            elem.setValue(Cairo.Database.valField(rs.getFields(), mVentaConstantes.RVI_PENDIENTE));
                        }
                        else {
                            elem.setValue(Cairo.Database.valField(rs.getFields(), mVentaConstantes.RVI_PENDIENTEFAC));
                        }
                        elem.setKey(KII_PENDIENTE);

                        if(isPedido) {
                            value = Cairo.Database.valField(rs.getFields(), CSCAPLIC_PEDIDO);
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

                    }

                    rs.MoveNext;
                }

                return true;
            };

            var pItSetGridAplicAux = function(iProp,  isPedido) { // TODO: Use of ByRef founded Private Function pItSetGridAplicAux(ByRef iProp As cIABMProperty, ByVal IsPedido As Boolean) As Boolean
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

                if(isPedido) {
                    var elem = w_columns.add(null);
                    elem.setVisible(false);
                    elem.setKey(KIP_OSRV_ID);
                }
                else {
                    var elem = w_columns.add(null);
                    elem.setVisible(false);
                    elem.setKey(KIFD_FVI_ID);
                }

                var elem = w_columns.add(null);
                elem.setVisible(false);
                //'/KIFD_RVI_ID en solapa facturas se usa para devoluciones
                elem.setKey(KIP_PVI_ID);

                if(isPedido) {
                    var elem = w_columns.add(null);
                    elem.setVisible(false);
                    elem.setKey(KIP_OSI_ID);
                }

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

            var pItLoadAplicAplicados = function(vAplic,  isPedido) { // TODO: Use of ByRef founded Private Function pItLoadAplicAplicados(ByRef vAplic() As T_Aplic, ByVal IsPedido As Boolean) As Boolean
                var sqlstmt = null;
                var rs = null;
                var i = null;
                var idx = null;

                if(isPedido) {
                    sqlstmt = "sp_DocRemitoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_rvId+ ",4";
                }
                else {
                    sqlstmt = "sp_DocRemitoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_rvId+ ",2";
                }

                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicAplicados", C_MODULE)) { return false; }

                G.redim(vAplic, 0);
                G.redimPreserve(0, .vAplicaciones);

                if(!rs.isEOF()) {

                    rs.MoveLast;
                    rs.MoveFirst;

                    while (!rs.isEOF()) {

                        if(isPedido) {
                            i = pItAddToCreditos(Cairo.Database.valField(rs.getFields(), mVentaConstantes.PVI_ID), Cairo.Database.valField(rs.getFields(), mVentaConstantes.OSI_ID), Cairo.Constants.NO_ID, Cairo.Constants.NO_ID, idx, vAplic);
                        }
                        else {
                            i = pItAddToCreditos(Cairo.Constants.NO_ID, Cairo.Constants.NO_ID, Cairo.Database.valField(rs.getFields(), mVentaConstantes.FVI_ID), Cairo.Database.valField(rs.getFields(), mVentaConstantes.RVI_ID), idx, vAplic);
                        }

                        // Documento
                        //
                        vAplic.docNombre = Cairo.Database.valField(rs.getFields(), mVentaConstantes.DOC_NAME);
                        vAplic.NroDoc = Cairo.Database.valField(rs.getFields(), CSCNRO_DOC);
                        vAplic.Fecha = Cairo.Database.valField(rs.getFields(), CSCFECHA);

                        // Pendiente
                        //
                        vAplic.Pendiente = Cairo.Database.valField(rs.getFields(), CSCPENDIENTE);
                        vAplic.PendienteActual = vAplic.Pendiente;

                        if(isPedido) {
                            // Pedido
                            //
                            vAplic.pvi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PVI_ID);
                            vAplic.osi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.OSI_ID);

                        }
                        else {
                            // Remito
                            //
                            vAplic.rvi_id = Cairo.Database.valField(rs.getFields(), CSCRVD_ID);
                            vAplic.fvi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.FVI_ID);
                        }

                        vAplic.PR_ID = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_ID);

                        // Aplicaciones
                        //*TODO:** can't found type for with block
                        //*With .vAplicaciones(idx)
                        var w___TYPE_NOT_FOUND = vAplic.vAplicaciones(idx);

                        if(isPedido) {
                            w___TYPE_NOT_FOUND.pvrv_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PV_RV_ID);
                            w___TYPE_NOT_FOUND.osrv_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.OS_RV_ID);
                        }
                        else {
                            w___TYPE_NOT_FOUND.rvfvdv_id = Cairo.Database.valField(rs.getFields(), CSCVINC_ID);
                        }

                        w___TYPE_NOT_FOUND.rvi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.RVI_ID);

                        w___TYPE_NOT_FOUND.Aplicado = Cairo.Database.valField(rs.getFields(), CSCAPLICADO);

                        // Aplicacion total sobre este credito
                        vAplic.Aplicado = vAplic.Aplicado + vAplic.vAplicaciones(idx).Aplicado;
                        vAplic.AplicadoActual = vAplic.Aplicado;

                        rs.MoveNext;
                    }
                }

                return true;
            };

            var pItLoadAplicCreditos = function(vAplic,  isPedido) { // TODO: Use of ByRef founded Private Function pItLoadAplicCreditos(ByRef vAplic() As T_Aplic, ByVal IsPedido As Boolean) As Boolean
                var sqlstmt = null;
                var rs = null;
                var i = null;

                if(isPedido) {
                    sqlstmt = "sp_DocRemitoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_rvId+ ",5";
                }
                else {
                    sqlstmt = "sp_DocRemitoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_rvId+ ",3";
                }

                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicCreditos", C_MODULE)) { return false; }

                if(!rs.isEOF()) {

                    rs.MoveLast;
                    rs.MoveFirst;

                    i = vAplic.Length;
                    G.redimPreserve(vAplic, i + rs.RecordCount);

                    while (!rs.isEOF()) {

                        i = i + 1;
                        vAplic.PR_ID = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_ID);

                        if(isPedido) {

                            vAplic.pvi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PVI_ID);
                            vAplic.osi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.OSI_ID);

                        }
                        else {

                            vAplic.rvi_id = Cairo.Database.valField(rs.getFields(), CSCRVD_ID);
                            vAplic.fvi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.FVI_ID);
                        }

                        vAplic.docNombre = Cairo.Database.valField(rs.getFields(), mVentaConstantes.DOC_NAME);
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

            var pItAddToCreditos = function(pviId,  osiId,  fviId,  rviId,  idx,  vAplic) { // TODO: Use of ByRef founded Private Function pItAddToCreditos(ByVal PviId As Long, ByVal OsiId As Long, ByVal FviId As Long, ByVal RviId As Long, ByRef Idx As Long, ByRef vAplic() As T_Aplic) As Long
                var _rtn = 0;
                var i = null;

                for(i = 1; i <= vAplic.Length; i++) {
                    if((vAplic.pvi_id === pviId && pviId !== Cairo.Constants.NO_ID) || (vAplic.osi_id === osiId && osiId !== Cairo.Constants.NO_ID) || (vAplic.fvi_id === fviId && fviId !== Cairo.Constants.NO_ID) || (vAplic.rvi_id === rviId && rviId !== Cairo.Constants.NO_ID)) {

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

            var pItUpdateGrids = function(isPedido,  vAplic) { // TODO: Use of ByRef founded Private Function pItUpdateGrids(ByVal IsPedido As Boolean, ByRef vAplic() As T_Aplic) As Double
                var _rtn = 0;
                var iProp = null;
                var iPropAplic = null;
                var row = null;
                var lastRow = null;

                if(isPedido) {
                    iProp = m_dialog.getProperties().item(C_ITEMS);
                    iPropAplic = m_dialog.getProperties().item(C_APLICPEDIDO);
                    lastRow = m_lastRowItem;
                }
                else {
                    iProp = m_dialog.getProperties().item(C_FACDEV);
                    iPropAplic = m_dialog.getProperties().item(C_APLICFACDEV);
                    lastRow = m_lastRowFacDev;
                }

                if(lastRow !== 0) {

                    row = iProp.getGrid().getRows(lastRow);
                    _rtn = pItUpdateAplicItems(iPropAplic, Dialogs.cell(row, KII_RVI_ID).getID(), vAplic, isPedido);
                }

                return _rtn;
            };

            var pItSetAplicItems = function(iProp,  rvi_id,  pR_ID,  vAplic,  isPedido) { // TODO: Use of ByRef founded Private Function pItSetAplicItems(ByRef iProp As cIABMProperty, ByVal rvi_id As Long, ByVal PR_ID As Long, ByRef vAplic() As T_Aplic, ByVal IsPedido As Boolean) As Boolean
                var cotizacion = null;
                var i = null;
                var j = null;

                iProp.getGrid().getRows().clear();

                m_rvi_id = rvi_id;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).PR_ID === pR_ID) {

                        if(vAplic(i).vAplicaciones.Length > 0) {
                            pItSetAplicItemsAux1(i, iProp, rvi_id, vAplic, isPedido);
                        }
                        else {
                            pItSetAplicItemsAux2(i, iProp, vAplic, isPedido);
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

                            if(isPedido) {
                                id = Dialogs.cell(row, KIP_PVI_ID).getID();
                                if(id === vAplic(i).pvi_id && id !== Cairo.Constants.NO_ID) {
                                    bAplic = true;
                                    break;
                                }

                                id = Dialogs.cell(row, KIP_OSI_ID).getID();
                                if(id === vAplic(i).osi_id && id !== Cairo.Constants.NO_ID) {
                                    bAplic = true;
                                    break;
                                }

                            }
                            else {
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
                            }

                            id = m_rvi_id;
                            for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {
                                if(id === vAplic(i).vAplicaciones(j).rvi_id && id !== Cairo.Constants.NO_ID) {
                                    bAplic = true;
                                    break;
                                }
                            }

                            if(bAplic) { break; }
                        }

                        if(!bAplic) { pItSetAplicItemsAux2(i, iProp, vAplic, isPedido); }
                    }
                }

                return true;
            };

            var pItUpdateAplicItems = function(iProp,  rvi_id,  vAplic,  isPedido) { // TODO: Use of ByRef founded Private Function pItUpdateAplicItems(ByRef iProp As cIABMProperty, ByVal rvi_id As Long, ByRef vAplic() As T_Aplic, ByVal IsPedido As Boolean) As Double
                var cotizacion = null;
                var i = null;
                var j = null;
                var row = null;
                var aplicado = null;
                var aplicadoTotal = null;

                var _count = pItGetItemsAplic(isPedido).getRows().size();
                for(var _i = 0; _i < _count; _i++) {
                    row = pItGetItemsAplic(isPedido).getRows().item(_i);

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

            var pItSetAplicItemsAux1 = function(idx,  iProp,  rvi_id,  vAplic,  isPedido) { // TODO: Use of ByRef founded Private Sub pItSetAplicItemsAux1(ByVal Idx As Long, ByRef iProp As cIABMProperty, ByVal rvi_id As Long, ByRef vAplic() As T_Aplic, ByVal IsPedido As Boolean)
                var f = null;
                var fv = null;
                var i = null;
                var iPropItem = null;
                var row = null;

                for(i = 1; i <= vAplic(idx).vAplicaciones.Length; i++) {

                    if(vAplic.rvi_id === rvi_id && rvi_id !== Cairo.Constants.NO_ID) {

                        f = iProp.getGrid().getRows().add(null);

                        elem = row.add(null);
                        elem.setId(idx);
                        elem.setKey(KIP_IDX1);

                        elem = row.add(null);
                        elem.setId(i);
                        elem.setKey(KIP_IDX2);

                        elem = row.add(null);
                        elem.setKey(KIP_PVRV_ID);

                        if(isPedido) {
                            elem.setId(vAplic.pvrv_id);
                        }
                        else {
                            elem.setId(vAplic.rvfvdv_id);
                        }

                        if(isPedido) {
                            elem = row.add(null);
                            elem.setId(vAplic.osrv_id);
                            elem.setKey(KIP_OSRV_ID);
                        }

                        elem = row.add(null);

                        if(isPedido) {

                            elem.setKey(KIP_PVI_ID);
                            elem.setId(vAplic(idx).pvi_id);

                            elem = row.add(null);
                            elem.setId(vAplic(idx).osi_id);
                            elem.setKey(KIP_OSI_ID);
                        }
                        else {

                            elem.setKey(KIFD_RVI_ID);
                            elem.setId(vAplic(idx).rvi_id);

                            elem = row.add(null);
                            elem.setId(vAplic(idx).fvi_id);
                            elem.setKey(KIFD_FVI_ID);
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

            var pItSetAplicItemsAux2 = function(i,  iProp,  vAplic,  isPedido) { // TODO: Use of ByRef founded Private Sub pItSetAplicItemsAux2(ByVal i As Long, ByRef iProp As cIABMProperty, ByRef vAplic() As T_Aplic, ByVal IsPedido As Boolean)
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

                if(isPedido) {
                    elem = row.add(null);
                    elem.setId(Cairo.Constants.NO_ID);
                    elem.setKey(KIP_OSRV_ID);
                }

                elem = row.add(null);

                if(isPedido) {

                    elem.setKey(KIP_PVI_ID);
                    elem.setId(vAplic.pvi_id);

                    elem = row.add(null);
                    elem.setId(vAplic.osi_id);
                    elem.setKey(KIP_OSI_ID);

                }
                else {

                    elem.setKey(KIFD_RVI_ID);
                    elem.setId(vAplic.rvi_id);

                    elem = row.add(null);
                    elem.setId(vAplic.fvi_id);
                    elem.setKey(KIFD_FVI_ID);
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
                    vAplicaciones.rvi_id = m_rvi_id;
                }

                vAplicaciones(idx).Aplicado = importe;

                for(i = 1; i <= vAplicaciones.Length; i++) {
                    rtn = rtn + vAplicaciones(i).Aplicado;
                }

                return rtn;
            };

            var pItGetItemsProperty = function(isPedido) {
                if(isPedido) {
                    return m_dialog.getProperties().item(C_APLICPEDIDO);
                }
                else {
                    return m_dialog.getProperties().item(C_APLICFACDEV);
                }
            };

            var pItGetItemsAplic = function(isPedido) {
                if(isPedido) {
                    return m_dialog.getProperties().item(C_APLICPEDIDO).getGrid();
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

            var pItGetItemPendiente = function(isPedido) {
                var iProp = null;
                if(isPedido) {
                    iProp = m_dialog.getProperties().item(C_ITEMS);
                }
                else {
                    iProp = m_dialog.getProperties().item(C_FACDEV);
                }
                return Dialogs.cell(iProp.getGrid().getRows(iProp.getSelectedIndex()), KII_PENDIENTE);
            };

            var pItGetItemAplicado = function(isPedido) {
                var iProp = null;
                if(isPedido) {
                    iProp = m_dialog.getProperties().item(C_ITEMS);
                }
                else {
                    iProp = m_dialog.getProperties().item(C_FACDEV);
                }
                return Dialogs.cell(iProp.getGrid().getRows(iProp.getSelectedIndex()), KII_APLICADO2);
            };

            var pItColAUpdate = function(property,  lRow,  lCol,  isPedido) { // TODO: Use of ByRef founded Private Function pItColAUpdate(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal IsPedido As Boolean)
                var row = null;
                var maxVal = null;
                var bVisible = null;
                var pendiente = null;

                var w_grid = property.getGrid();
                switch (w_grid.getColumns(lCol).Key) {
                    case KIP_APLICADO:
                        row = w_grid.getRows(lRow);

                        var w_pCell = Dialogs.cell(row, KIP_APLICADO);

                        pendiente = Cairo.Util.val(pItGetItemPendiente(isPedido).getValue()) + Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO2).getValue());
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
                        aplicado = pItGetAplicado(isPedido);
                        pItRefreshItem(aplicado, isPedido);
                        pItGetItemAplicado(isPedido).setValue(aplicado);

                        // Actulizo el pendiente
                        var w_pCell = Dialogs.cell(row, KIP_PENDIENTE);
                        w_pCell.setValue(Cairo.Util.val(w_pCell.getValue()) + Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO2).getValue()) - Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO).getValue()));
                        Dialogs.cell(row, KIP_APLICADO2).getValue() === Dialogs.cell(row, KIP_APLICADO).getValue();
                        break;
                }

                return true;
            };

            var pItGetAplicado = function(isPedido) {
                var row = null;
                var rtn = null;
                var iProp = null;

                if(isPedido) {
                    iProp = m_dialog.getProperties().item(C_APLICPEDIDO);
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

            var pItRefreshItem = function(aplicado,  isPedido) {
                var iProp = null;
                var abmObj = null;
                var row = null;
                var aplicadoActual = null;
                var lastRow = null;

                abmObj = m_dialog;

                if(isPedido) {
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

            var pItSavePedidoOrden = function(rvTMPId,  vAplic) { // TODO: Use of ByRef founded Private Function pItSavePedidoOrden(ByVal RvTMPId As Long, ByRef vAplic() As T_Aplic) As Boolean
                if(!pItSavePedido(rvTMPId, vAplic())) { return false; }
                if(!pItSaveOrden(rvTMPId, vAplic())) { return false; }
                return true;
            };

            var pItSavePedido = function(rvTMPId,  vAplic) { // TODO: Use of ByRef founded Private Function pItSavePedido(ByVal RvTMPId As Long, ByRef vAplic() As T_Aplic) As Boolean
                var register = null;
                var i = null;
                var j = null;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).pvi_id !== Cairo.Constants.NO_ID) {

                        for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {

                            if(vAplic(i).vAplicaciones(j).rvi_id !== Cairo.Constants.NO_ID) {

                                if(vAplic.Aplicado > 0) {

                                    register = new cRegister();
                                    register.setFieldId(mVentaConstantes.PV_RV_TMP_ID);
                                    register.setTable(mVentaConstantes.PEDIDOREMITO_VENTATMP);
                                    register.setId(Cairo.Constants.NEW_ID);

                                    register.getFields().add2(mVentaConstantes.RV_TMP_ID, rvTMPId, Cairo.Constants.Types.id);
                                    register.getFields().add2(mVentaConstantes.PVI_ID, vAplic(i).pvi_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(mVentaConstantes.RVI_ID, vAplic.rvi_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(mVentaConstantes.PV_RV_CANTIDAD, vAplic.Aplicado, Cairo.Constants.Types.double);

                                    register.getFields().add2(mVentaConstantes.PV_RV_ID, vAplic.pvrv_id, Cairo.Constants.Types.long);

                                    register.getFields().setHaveLastUpdate(false);
                                    register.getFields().setHaveWhoModify(false);

                                    if(!Cairo.Database.save(register, , "pItSavePedido", C_MODULE, c_ErrorSave)) { return false; }
                                }
                            }
                        }
                    }
                }

                return true;
            };

            var pItSaveOrden = function(rvTMPId,  vAplic) { // TODO: Use of ByRef founded Private Function pItSaveOrden(ByVal RvTMPId As Long, ByRef vAplic() As T_Aplic) As Boolean
                var register = null;
                var i = null;
                var j = null;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).osi_id !== Cairo.Constants.NO_ID) {

                        for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {

                            if(vAplic(i).vAplicaciones(j).rvi_id !== Cairo.Constants.NO_ID) {

                                if(vAplic.Aplicado > 0) {

                                    register = new cRegister();
                                    register.setFieldId(mVentaConstantes.OS_RV_TMP_ID);
                                    register.setTable(mVentaConstantes.ORDENREMITO_VENTATMP);
                                    register.setId(Cairo.Constants.NEW_ID);

                                    register.getFields().add2(mVentaConstantes.RV_TMP_ID, rvTMPId, Cairo.Constants.Types.id);
                                    register.getFields().add2(mVentaConstantes.OSI_ID, vAplic(i).osi_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(mVentaConstantes.RVI_ID, vAplic.rvi_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(mVentaConstantes.OS_RV_CANTIDAD, vAplic.Aplicado, Cairo.Constants.Types.double);

                                    register.getFields().add2(mVentaConstantes.OS_RV_ID, vAplic.osrv_id, Cairo.Constants.Types.long);

                                    register.getFields().setHaveLastUpdate(false);
                                    register.getFields().setHaveWhoModify(false);

                                    if(!Cairo.Database.save(register, , "pItSaveOrden", C_MODULE, c_ErrorSave)) { return false; }
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

                    //'Error al grabar el Remito de Venta
                    c_ErrorSave = Cairo.Language.getText(2222, "");

                    m_generalConfig = new cGeneralConfig();
                    m_generalConfig.Load;

                    G.redim(m_vPedidoOrden, 0);
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
                    G.redim(m_vPedidoOrden, 0);

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
            //   PEDIDOS / REMITOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pItLoadFacDev = function(iProp) { // TODO: Use of ByRef founded Private Function pItLoadFacDev(ByRef iProp As cIABMProperty) As Boolean
                return pItLoadItemsAux(iProp, false);
            };

            var pItSetGridAplicFacDev = function(iProp) { // TODO: Use of ByRef founded Private Function pItSetGridAplicFacDev(ByRef iProp As cIABMProperty) As Boolean
                return pItSetGridAplicAux(iProp, false);
            };

            var pItSaveFacDev = function(rvTMPId,  vAplic) { // TODO: Use of ByRef founded Private Function pItSaveFacDev(ByVal RvTMPId As Long, ByRef vAplic() As T_Aplic) As Boolean
                var register = null;
                var i = null;
                var j = null;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).fvi_id !== Cairo.Constants.NO_ID || vAplic(i).rvi_id !== Cairo.Constants.NO_ID) {

                        for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {

                            if(vAplic(i).vAplicaciones(j).rvi_id !== Cairo.Constants.NO_ID) {

                                if(vAplic.Aplicado > 0) {

                                    register = new cRegister();

                                    // Si estoy vinculando contra una factura
                                    if(vAplic(i).fvi_id !== 0) {
                                        register.setFieldId(mVentaConstantes.RV_FV_TMP_ID);
                                        register.setTable(mVentaConstantes.REMITOFACTURAVENTATMP);
                                        register.getFields().add2(mVentaConstantes.FVI_ID, vAplic(i).fvi_id, Cairo.Constants.Types.id);
                                        register.getFields().add2(mVentaConstantes.RVI_ID, vAplic.rvi_id, Cairo.Constants.Types.id);

                                        register.getFields().add2(mVentaConstantes.RV_FV_CANTIDAD, vAplic.Aplicado, Cairo.Constants.Types.double);
                                        register.getFields().add2(mVentaConstantes.RV_FV_ID, vAplic.rvfvdv_id, Cairo.Constants.Types.long);

                                        // Si vinculo contra un remito (Remito - Devolucion)
                                    }
                                    else {
                                        register.setFieldId(mVentaConstantes.RV_DV_TMP_ID);
                                        register.setTable(mVentaConstantes.REMITODEVOLUCIONVENTATMP);

                                        if(m_isDevolucion) {
                                            register.getFields().add2(mVentaConstantes.RVI_ID_DEVOLUCION, vAplic.rvi_id, Cairo.Constants.Types.id);
                                            register.getFields().add2(mVentaConstantes.RVI_ID_REMITO, vAplic(i).rvi_id, Cairo.Constants.Types.id);
                                        }
                                        else {
                                            register.getFields().add2(mVentaConstantes.RVI_ID_REMITO, vAplic.rvi_id, Cairo.Constants.Types.id);
                                            register.getFields().add2(mVentaConstantes.RVI_ID_DEVOLUCION, vAplic(i).rvi_id, Cairo.Constants.Types.id);
                                        }

                                        register.getFields().add2(mVentaConstantes.RV_DV_CANTIDAD, vAplic.Aplicado, Cairo.Constants.Types.double);
                                        register.getFields().add2(mVentaConstantes.RV_DV_ID, vAplic.rvfvdv_id, Cairo.Constants.Types.long);

                                    }

                                    register.setId(Cairo.Constants.NEW_ID);
                                    register.getFields().add2(mVentaConstantes.RV_TMP_ID, rvTMPId, Cairo.Constants.Types.id);

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

    Cairo.module("RemitoVentaAplic.List", function(List, Cairo, Backbone, Marionette, $, _) {
        List.Controller = {
            list: function() {

                var self = this;

                /*
                 this function will be called by the tab manager every time the
                 view must be created. when the tab is not visible the tab manager
                 will not call this function but only make the tab visible
                 */
                var createTreeDialog = function(tabId) {

                    var editors = Cairo.Editors.remitoventaaplicEditors || Cairo.Collections.createCollection(null);
                    Cairo.Editors.remitoventaaplicEditors = editors;

                    // ListController properties and methods
                    //
                    self.entityInfo = new Backbone.Model({
                        entitiesTitle: "RemitoVentaAplics",
                        entityName: "remitoventaaplic",
                        entitiesName: "remitoventaaplics"
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
                            var editor = Cairo.RemitoVentaAplic.Edit.Controller.getEditor();
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
                        if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_REMITO_VENTAAPLIC)) {
                            return Cairo.Promises.resolvedPromise(false);
                        }
                        var apiPath = Cairo.Database.getAPIVersion();
                        return Cairo.Database.destroy(apiPath + "general/remitoventaaplic", id, Cairo.Constants.DELETE_FUNCTION, "RemitoVentaAplic").success(
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
                    Cairo.LoadingMessage.show("RemitoVentaAplics", "Loading remitoventaaplic from CrowSoft Cairo server.");

                    // create the tree region
                    //
                    Cairo.addRegions({ remitoventaaplicTreeRegion: tabId });

                    // create the dialog
                    //
                    Cairo.Tree.List.Controller.list(
                        Cairo.Tables.REMITO_VENTAAPLIC,
                        new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
                        Cairo.remitoventaaplicTreeRegion,
                        self);

                };

                var showTreeDialog = function() {
                    Cairo.Tree.List.Controller.showTreeDialog(self);
                };

                var closeTreeDialog = function() {

                }

                // create the tab
                //
                Cairo.mainTab.showTab("RemitoVentaAplics", "remitoventaaplicTreeRegion", "#general/remitoventaaplics", createTreeDialog, closeTreeDialog, showTreeDialog);

            }
        };
    });


}());

private class T_ItAplic {
    public Long pvrv_id;
    public Long osrv_id;
    public Long rvfvdv_id;//' lo uso para rvfv_id y rvdv_id
    public Long rvi_id;//' Ids de items al que este credito esta vinculado
    public Double aplicado;
}


private class T_Aplic {
    public Long pvi_id;//' Ids de creditos
    public Long osi_id;//'
    public Long fvi_id;//' Vinculacion con remito
    public Long rvi_id;
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


case class RemitoventaaplicData(
    id: Option[Int],

)

object Remitoventaaplics extends Controller with ProvidesUser {

    val remitoventaaplicForm = Form(
        mapping(
                "id" -> optional(number),

        )(RemitoventaaplicData.apply)(RemitoventaaplicData.unapply))

    implicit val remitoventaaplicWrites = new Writes[Remitoventaaplic] {
        def writes(remitoventaaplic: Remitoventaaplic) = Json.obj(
                "id" -> Json.toJson(remitoventaaplic.id),
                C.ID -> Json.toJson(remitoventaaplic.id),

        )
    }

    def get(id: Int) = GetAction { implicit request =>
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_REMITO_VENTAAPLIC), { user =>
        Ok(Json.toJson(Remitoventaaplic.get(user, id)))
    })
}

def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in remitoventaaplics.update")
    remitoventaaplicForm.bindFromRequest.fold(
        formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
    BadRequest
},
remitoventaaplic => {
    Logger.debug(s"form: ${remitoventaaplic.toString}")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_REMITO_VENTAAPLIC), { user =>
    Ok(
        Json.toJson(
            Remitoventaaplic.update(user,
                Remitoventaaplic(
                    id,

                ))))
})
}
)
}

def create = PostAction { implicit request =>
    Logger.debug("in remitoventaaplics.create")
    remitoventaaplicForm.bindFromRequest.fold(
        formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
    BadRequest
},
remitoventaaplic => {
    Logger.debug(s"form: ${remitoventaaplic.toString}")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_REMITO_VENTAAPLIC), { user =>
    Ok(
        Json.toJson(
            Remitoventaaplic.create(user,
                Remitoventaaplic(

                ))))
})
}
)
}

def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in remitoventaaplics.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_REMITO_VENTAAPLIC), { user =>
    Remitoventaaplic.delete(user, id)
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

case class Remitoventaaplic(
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

object Remitoventaaplic {

    lazy val emptyRemitoventaaplic = Remitoventaaplic(
    )

    def apply(
        id: Int,
) = {

        new Remitoventaaplic(
            id,
        )
    }

    def apply(
    ) = {

        new Remitoventaaplic(
        )
    }

    private val remitoventaaplicParser: RowParser[Remitoventaaplic] = {
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
        Remitoventaaplic(
            id,
            ,
            createdAt,
            updatedAt,
            updatedBy)
    }
}

def create(user: CompanyUser, remitoventaaplic: Remitoventaaplic): Remitoventaaplic = {
    save(user, remitoventaaplic, true)
}

def update(user: CompanyUser, remitoventaaplic: Remitoventaaplic): Remitoventaaplic = {
    save(user, remitoventaaplic, false)
}

private def save(user: CompanyUser, remitoventaaplic: Remitoventaaplic, isNew: Boolean): Remitoventaaplic = {
    def getFields = {
        List(

            )
    }
    def throwException = {
        throw new RuntimeException(s"Error when saving ${C.REMITO_VENTAAPLIC}")
}

DBHelper.saveEx(
    user,
    Register(
        C.REMITO_VENTAAPLIC,
        C.ID,
        remitoventaaplic.id,
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

def load(user: CompanyUser, id: Int): Option[Remitoventaaplic] = {
    loadWhere(user, s"${C.ID} = {id}", 'id -> id)
}

def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
    SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.REMITO_VENTAAPLIC} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
.on(args: _*)
.as(remitoventaaplicParser.singleOpt)
}
}

def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
    try {
        SQL(s"DELETE FROM ${C.REMITO_VENTAAPLIC} WHERE ${C.ID} = {id}")
    .on('id -> id)
            .executeUpdate
    } catch {
    case NonFatal(e) => {
            Logger.error(s"can't delete a ${C.REMITO_VENTAAPLIC}. ${C.ID} id: $id. Error ${e.toString}")
            throw e
        }
    }
}
}

def get(user: CompanyUser, id: Int): Remitoventaaplic = {
    load(user, id) match {
        case Some(p) => p
    case None => emptyRemitoventaaplic
}
}
}


// Router

GET     /api/v1/general/remitoventaaplic/:id              controllers.logged.modules.general.Remitoventaaplics.get(id: Int)
POST    /api/v1/general/remitoventaaplic                  controllers.logged.modules.general.Remitoventaaplics.create
PUT     /api/v1/general/remitoventaaplic/:id              controllers.logged.modules.general.Remitoventaaplics.update(id: Int)
DELETE  /api/v1/general/remitoventaaplic/:id              controllers.logged.modules.general.Remitoventaaplics.delete(id: Int)




/**/
