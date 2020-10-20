(function() {
    "use strict";

    Cairo.module("PresupuestoVentaAplic.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

        var createObject = function() {

            var self = {};

            var getText = Cairo.Language.getText;

            var TITLE = getText(????, ""); // Aplicación Presupuesto de Venta
            var SAVE_ERROR_MESSAGE = getText(1707, ""); // Error al grabar el Presupuesto de Venta

            var Dialogs = Cairo.Dialogs;

            var C_MODULE = "cPresupuestoVentaAplic";

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
            var CSCPRVD_ID = "prvd_id";
            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   PRESUPUESTO - SOLAPA
            //
            //////////////////////////////////////////////////////////////////////////////////////

            // Prespuesto

            var CSCFECHA = "Fecha";
            var CSCAPLICADO = "Aplicado";
            var CSCAPLIC_REMITO = "AplicRemito";

            // Grillas de Pedidos / Presupuestos
            var KII_PRVI_ID = 1;
            var KII_PR_ID = 2;
            var KII_APLICADO = 4;
            var KII_APLICADO2 = 5;
            var KII_PENDIENTE = 6;

            var KIP_PRVPV_ID = 1;
            var KIPD_PVI_ID = 2;
            var KIPD_PRVI_ID = 3;

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
            //   PEDIDOS / DEVOLUCION - SOLAPA
            //
            //////////////////////////////////////////////////////////////////////////////////////

            // Pedidos

            var K_PEDIDO_DEV = 20;
            var K_APLIC_PEDIDO_DEV = 21;
            var C_PEDIDODEV = "PedidoDev";
            var C_APLICPEDIDODEV = "AplicPedidoDev";

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   PEDIDOS
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
            var m_prvId = 0;
            var m_isDevolucion;
            var m_prvNumero = "";
            var m_cliente = "";
            var m_cliId = 0;
            var m_docId = 0;
            var m_sucId = 0;
            var m_total = 0;

            var m_monDefault = 0;

            var m_lastRowItem = 0;
            var m_lastRowPedidoDev = 0;

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

            var m_vPedidoDevs;
            var m_prvi_id = 0;

            // eventos

            // Edit Apply
            //
            self.setObjectClient = function(rhs) {
                m_objectClient = rhs;
            };

            self.getId = function() {
                return m_prvId;
            };

            // propiedades friend
            self.show = function(prvId,  total,  prvNumero,  cliId,  cliente,  sucId,  docId,  isDevolucion) {

                if(m_dialog === null) {
                    m_dialog = new cABMGeneric();
                }

                if(m_prvId !== prvId) {
                    m_isDevolucion = isDevolucion;
                    m_prvId = prvId;
                    m_prvNumero = prvNumero;
                    m_cliente = cliente;
                    m_cliId = cliId;
                    m_docId = docId;
                    m_sucId = sucId;
                    m_total = total;

                    // Edit Apply
                    //
                    if(!Cairo.Database.getData(mVentaConstantes.PRESUPUESTOVENTA, mVentaConstantes.PRV_ID, m_prvId, C.EMP_ID, m_emp_id)) { return false; }

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

                            case K_PEDIDO_DEV:

                                abmObj = m_dialog;

                                // Guardo la aplicacion para el item editado anteriormente
                                //
                                if(m_lastRowPedidoDev !== 0) {
                                    aplicado = pItUpdateGrids(m_vPedidoDevs);
                                }

                                // Muestro las aplicaciones para este item
                                //
                                m_lastRowPedidoDev = iProp.getSelectedIndex();
                                row = iProp.getGrid().getRows(m_lastRowPedidoDev);
                                if(row === null) { return null; }

                                pItSetAplicItems(m_dialog.getProperties().item(C_APLICPEDIDODEV), Dialogs.cell(row, KII_PRVI_ID).getID(), Dialogs.cell(row, KII_PR_ID).getID(), m_vPedidoDevs);

                                abmObj.ShowValue(m_dialog.getProperties().item(C_APLICPEDIDODEV), true);

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
                return "#general/presupuestoventaaplic/" + m_id.toString();
            };

            self.getEditorName = function() {
                var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
                return "presupuestoventaaplic" + id;
            };

            self.getTitle = function() {
                var _rtn = "";
                // **TODO:** on error resume next found !!!
                _rtn = "Aplicacion presupuesto de venta";
                m_dialog.setTitle(m_prvNumero+ " - "+ m_cliente);

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
                        case K_APLIC_PEDIDO_DEV:
                            _rtn = pItColAUpdate(pItGetItemsProperty(), lRow, lCol);
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
                        case K_APLIC_PEDIDO_DEV:
                            _rtn = pItColBEdit(pItGetItemsProperty(), lRow, lCol, iKeyAscii);
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

                        case K_APLIC_PEDIDO_DEV:

                            var w_pItGetItemsAplic = pItGetItemsAplic().getRows();

                            var objEditName = null;

                            id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIPD_PVI_ID).getID();

                            if(id !== Cairo.Constants.NO_ID) {
                                if(!Cairo.Database.getData("PedidoVentaItem", "pvi_id", id, "pv_id", id)) { return; }

                                objEditName = "CSPedidoVenta2.cPedidoVenta";

                            }
                            else {

                                id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIPD_PRVI_ID).getID();

                                if(id !== Cairo.Constants.NO_ID) {
                                    if(!Cairo.Database.getData("PresupuestoVentaItem", "prvi_id", id, "prv_id", id)) { return; }

                                    objEditName = "CSVenta2.cPresupuestoVenta";
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
                var iTab = null;
                var oGrd = null;

                m_lastRowPedidoDev = 0;

                m_dialog.getProperties().clear();
                m_dialog.getTabs().clear();

                c = m_dialog.getProperties().add(null, C_PEDIDODEV);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();;
                if(!pItLoadPedidoDev(c)) { return false; }
                c.setKey(K_PEDIDO_DEV);
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

                c = m_dialog.getProperties().add(null, C_APLICPEDIDODEV);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();;
                if(!pItSetGridAplicPedidoDev(c)) { return false; }
                c.setKey(K_APLIC_PEDIDO_DEV);
                c.setName("Pedidos");
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

                var abmObj = null;
                abmObj = m_dialog;
                abmObj.MinHeight = 7800;

                // Edit Apply
                //
                abmObj.MinWidth = 10050;

                return m_dialog.show(self);
            };

            var pSave = function() {
                var _rtn = null;

                // Edit Apply
                //
                if(m_emp_id !== cUtil.getEmpId()) {
                    MsgApplyDisabled(m_emp_nombre);
                    return _rtn;
                }

                var prvTMPId = null;

                pItUpdateGrids(m_vPedidoDevs);

                // Temporal
                if(!pSaveDocVta(m_docId, prvTMPId)) { return _rtn; }

                // Facturas / Devoluciones
                if(!pItSavePedidoDev(prvTMPId, m_vPedidoDevs)) { return _rtn; }

                // Aplico llamando al sp
                var sqlstmt = null;
                var rs = null;

                sqlstmt = "sp_DocPresupuestoVentaSaveAplic "+ prvTMPId.toString();
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
            // PresupuestoVentaTemporal
            //////////////////////////////////////////////////////////////////////////////////////
            var pSaveDocVta = function(docId,  prvTMPId) { // TODO: Use of ByRef founded Private Function pSaveDocVta(ByVal DocId As Long, ByRef prvTMPId As Long) As Boolean
                var register = null;

                register = new cRegister();
                register.setFieldId(mVentaConstantes.PRV_TMP_ID);
                register.setTable(mVentaConstantes.PRESUPUESTOVENTATMP);

                register.setId(Cairo.Constants.NEW_ID);
                register.getFields().add2(mVentaConstantes.PRV_ID, m_prvId, Cairo.Constants.Types.id);

                register.getFields().add2(mVentaConstantes.PRV_NUMERO, 0, Cairo.Constants.Types.long);
                register.getFields().add2(mVentaConstantes.PRV_NRODOC, "", Cairo.Constants.Types.text);

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

                prvTMPId = register.getID();
                return true;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   PRESUPUESTOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pItLoadAplicItems = function() {

                if(!pItLoadAplicAplicados(m_vPedidoDevs)) { return false; }
                if(!pItLoadAplicCreditos(m_vPedidoDevs)) { return false; }

                return true;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   GENERICAS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pItLoadItemsAux = function(iProp) { // TODO: Use of ByRef founded Private Function pItLoadItemsAux(ByRef iProp As cIABMProperty) As Boolean
                var sqlstmt = null;
                var rs = null;
                var grid = null;
                var row = null;
                var value = null;

                sqlstmt = "sp_DocPresupuestoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_prvId+ ",1";
                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pItLoadItems", C_MODULE)) { return false; }

                iProp.getGrid().getColumns().clear();
                iProp.getGrid().getRows().clear();

                grid = iProp.getGrid();

                var w_columns = grid.getColumns();
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KII_PRVI_ID);

                var elem = w_columns.add(null);
                elem.setName("Producto");
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(2500);
                elem.setKey(KII_PR_ID);

                var elem = w_columns.add(null);
                elem.setName("Pendiente");
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1245);
                elem.setKey(KII_PENDIENTE);

                var elem = w_columns.add(null);
                elem.setName("Aplicado");
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
                    elem.setId(Cairo.Database.valField(rs.getFields(), mVentaConstantes.PRVI_ID));
                    elem.setKey(KII_PRVI_ID);

                    elem = row.add(null);
                    elem.setId(Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_ID));
                    elem.setValue(Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_NOMBRE_VENTA));
                    elem.setKey(KII_PR_ID);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(rs.getFields(), mVentaConstantes.PRVI_PENDIENTE));
                    elem.setKey(KII_PENDIENTE);
                    value = Cairo.Database.valField(rs.getFields(), CSCAPLIC_REMITO);

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

            var pItSetGridAplicAux = function(iProp) { // TODO: Use of ByRef founded Private Function pItSetGridAplicAux(ByRef iProp As cIABMProperty) As Boolean
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
                elem.setKey(KIP_PRVPV_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIPD_PRVI_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIPD_PVI_ID);

                var elem = w_columns.add(null);
                elem.setName("Documento");
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(2925);
                elem.setKey(KIP_DOC);

                var elem = w_columns.add(null);
                elem.setName("Comprobante");
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(1575);
                elem.setKey(KIP_NRODOC);

                var elem = w_columns.add(null);
                elem.setName("Fecha");
                elem.setType(Dialogs.PropertyType.date);
                elem.setWidth(1395);
                elem.setKey(KIP_FECHA);

                var elem = w_columns.add(null);
                elem.setName("Pendiente");
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1245);
                elem.setKey(KIP_PENDIENTE);

                var elem = w_columns.add(null);
                elem.setName("Aplicado");
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

            var pItLoadAplicAplicados = function(vAplic) { // TODO: Use of ByRef founded Private Function pItLoadAplicAplicados(ByRef vAplic() As T_Aplic) As Boolean
                var sqlstmt = null;
                var rs = null;
                var i = null;
                var idx = null;

                sqlstmt = "sp_DocPresupuestoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_prvId+ ",2";

                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicAplicados", C_MODULE)) { return false; }

                G.redim(vAplic, 0);
                G.redimPreserve(0, .vAplicaciones);

                if(!rs.isEOF()) {

                    rs.MoveLast;
                    rs.MoveFirst;

                    while (!rs.isEOF()) {

                        i = pItAddToCreditos(Cairo.Database.valField(rs.getFields(), mVentaConstantes.PVI_ID), Cairo.Database.valField(rs.getFields(), mVentaConstantes.PRVI_ID), idx, vAplic);

                        // Documento
                        //
                        vAplic.docNombre = Cairo.Database.valField(rs.getFields(), mVentaConstantes.DOC_NAME);
                        vAplic.NroDoc = Cairo.Database.valField(rs.getFields(), CSCNRO_DOC);
                        vAplic.Fecha = Cairo.Database.valField(rs.getFields(), CSCFECHA);

                        // Pendiente
                        //
                        vAplic.Pendiente = Cairo.Database.valField(rs.getFields(), CSCPENDIENTE);
                        vAplic.PendienteActual = vAplic.Pendiente;

                        // Presupuesto
                        //
                        vAplic.prvi_id = Cairo.Database.valField(rs.getFields(), CSCPRVD_ID);
                        vAplic.pvi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PVI_ID);

                        vAplic.PR_ID = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_ID);

                        // Aplicaciones
                        //*TODO:** can't found type for with block
                        //*With .vAplicaciones(idx)
                        var w___TYPE_NOT_FOUND = vAplic.vAplicaciones(idx);

                        w___TYPE_NOT_FOUND.vinc_id = Cairo.Database.valField(rs.getFields(), CSCVINC_ID);

                        w___TYPE_NOT_FOUND.prvi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PRVI_ID);

                        w___TYPE_NOT_FOUND.Aplicado = Cairo.Database.valField(rs.getFields(), CSCAPLICADO);

                        // Aplicacion total sobre este credito
                        vAplic.Aplicado = vAplic.Aplicado + vAplic.vAplicaciones(idx).Aplicado;
                        vAplic.AplicadoActual = vAplic.Aplicado;

                        rs.MoveNext;
                    }
                }

                return true;
            };

            var pItLoadAplicCreditos = function(vAplic) { // TODO: Use of ByRef founded Private Function pItLoadAplicCreditos(ByRef vAplic() As T_Aplic) As Boolean
                var sqlstmt = null;
                var rs = null;
                var i = null;

                sqlstmt = "sp_DocPresupuestoVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_prvId+ ",3";

                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicCreditos", C_MODULE)) { return false; }

                if(!rs.isEOF()) {

                    rs.MoveLast;
                    rs.MoveFirst;

                    i = vAplic.Length;
                    G.redimPreserve(vAplic, i + rs.RecordCount);

                    while (!rs.isEOF()) {

                        i = i + 1;
                        vAplic.PR_ID = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_ID);

                        vAplic.pvi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PVI_ID);
                        vAplic.prvi_id = Cairo.Database.valField(rs.getFields(), CSCPRVD_ID);

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

            var pItAddToCreditos = function(pviId,  prviId,  idx,  vAplic) { // TODO: Use of ByRef founded Private Function pItAddToCreditos(ByVal PviId As Long, ByVal PrviId As Long, ByRef Idx As Long, ByRef vAplic() As T_Aplic) As Long
                var _rtn = 0;
                var i = null;

                for(i = 1; i <= vAplic.Length; i++) {
                    if((vAplic.pvi_id === pviId && pviId !== Cairo.Constants.NO_ID) || (vAplic.prvi_id === prviId && prviId !== Cairo.Constants.NO_ID)) {

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

            var pItUpdateGrids = function(vAplic) { // TODO: Use of ByRef founded Private Function pItUpdateGrids(ByRef vAplic() As T_Aplic) As Double
                var _rtn = 0;
                var iProp = null;
                var iPropAplic = null;
                var row = null;
                var lastRow = null;

                iProp = m_dialog.getProperties().item(C_PEDIDODEV);
                iPropAplic = m_dialog.getProperties().item(C_APLICPEDIDODEV);
                lastRow = m_lastRowPedidoDev;

                if(lastRow !== 0) {

                    row = iProp.getGrid().getRows(lastRow);
                    _rtn = pItUpdateAplicItems(iPropAplic, Dialogs.cell(row, KII_PRVI_ID).getID(), vAplic);
                }

                return _rtn;
            };

            var pItSetAplicItems = function(iProp,  prvi_id,  pR_ID,  vAplic) { // TODO: Use of ByRef founded Private Function pItSetAplicItems(ByRef iProp As cIABMProperty, ByVal prvi_id As Long, ByVal PR_ID As Long, ByRef vAplic() As T_Aplic) As Boolean
                var cotizacion = null;
                var i = null;
                var j = null;

                iProp.getGrid().getRows().clear();

                m_prvi_id = prvi_id;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).PR_ID === pR_ID) {

                        if(vAplic(i).vAplicaciones.Length > 0) {
                            pItSetAplicItemsAux1(i, iProp, prvi_id, vAplic);
                        }
                        else {
                            pItSetAplicItemsAux2(i, iProp, vAplic);
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

                            id = Dialogs.cell(row, KIPD_PVI_ID).getID();
                            if(id === vAplic(i).pvi_id && id !== Cairo.Constants.NO_ID) {
                                bAplic = true;
                                break;
                            }

                            id = Dialogs.cell(row, KIPD_PRVI_ID).getID();
                            if(id === vAplic(i).prvi_id && id !== Cairo.Constants.NO_ID) {
                                bAplic = true;
                                break;
                            }

                            id = m_prvi_id;
                            for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {
                                if(id === vAplic(i).vAplicaciones(j).prvi_id && id !== Cairo.Constants.NO_ID) {
                                    bAplic = true;
                                    break;
                                }
                            }

                            if(bAplic) { break; }
                        }

                        if(!bAplic) { pItSetAplicItemsAux2(i, iProp, vAplic); }
                    }
                }

                return true;
            };

            var pItUpdateAplicItems = function(iProp,  prvi_id,  vAplic) { // TODO: Use of ByRef founded Private Function pItUpdateAplicItems(ByRef iProp As cIABMProperty, ByVal prvi_id As Long, ByRef vAplic() As T_Aplic) As Double
                var cotizacion = null;
                var i = null;
                var j = null;
                var row = null;
                var aplicado = null;
                var aplicadoTotal = null;

                var _count = pItGetItemsAplic().getRows().size();
                for(var _i = 0; _i < _count; _i++) {
                    row = pItGetItemsAplic().getRows().item(_i);

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

            var pItSetAplicItemsAux1 = function(idx,  iProp,  prvi_id,  vAplic) { // TODO: Use of ByRef founded Private Sub pItSetAplicItemsAux1(ByVal Idx As Long, ByRef iProp As cIABMProperty, ByVal prvi_id As Long, ByRef vAplic() As T_Aplic)
                var f = null;
                var fv = null;
                var i = null;
                var iPropItem = null;
                var row = null;

                for(i = 1; i <= vAplic(idx).vAplicaciones.Length; i++) {

                    if(vAplic.prvi_id === prvi_id && prvi_id !== Cairo.Constants.NO_ID) {

                        f = iProp.getGrid().getRows().add(null);

                        elem = row.add(null);
                        elem.setId(idx);
                        elem.setKey(KIP_IDX1);

                        elem = row.add(null);
                        elem.setId(i);
                        elem.setKey(KIP_IDX2);

                        elem = row.add(null);
                        elem.setId(vAplic.vinc_id);
                        elem.setKey(KIP_PRVPV_ID);

                        elem = row.add(null);
                        elem.setId(vAplic(idx).prvi_id);
                        elem.setKey(KIPD_PRVI_ID);

                        elem = row.add(null);
                        elem.setId(vAplic(idx).pvi_id);
                        elem.setKey(KIPD_PVI_ID);

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

            var pItSetAplicItemsAux2 = function(i,  iProp,  vAplic) { // TODO: Use of ByRef founded Private Sub pItSetAplicItemsAux2(ByVal i As Long, ByRef iProp As cIABMProperty, ByRef vAplic() As T_Aplic)
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
                elem.setKey(KIP_PRVPV_ID);

                elem = row.add(null);
                elem.setId(vAplic.prvi_id);
                elem.setKey(KIPD_PRVI_ID);

                elem = row.add(null);
                elem.setId(vAplic.pvi_id);
                elem.setKey(KIPD_PVI_ID);

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
                    vAplicaciones.prvi_id = m_prvi_id;
                }

                vAplicaciones(idx).Aplicado = importe;

                for(i = 1; i <= vAplicaciones.Length; i++) {
                    rtn = rtn + vAplicaciones(i).Aplicado;
                }

                return rtn;
            };

            var pItGetItemsProperty = function() {
                return m_dialog.getProperties().item(C_APLICPEDIDODEV);
            };

            var pItGetItemsAplic = function() {
                return m_dialog.getProperties().item(C_APLICPEDIDODEV).getGrid();
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

            var pItGetItemPendiente = function() {
                var iProp = null;
                iProp = m_dialog.getProperties().item(C_PEDIDODEV);
                return Dialogs.cell(iProp.getGrid().getRows(iProp.getSelectedIndex()), KII_PENDIENTE);
            };

            var pItGetItemAplicado = function() {
                var iProp = null;
                iProp = m_dialog.getProperties().item(C_PEDIDODEV);
                return Dialogs.cell(iProp.getGrid().getRows(iProp.getSelectedIndex()), KII_APLICADO2);
            };

            var pItColAUpdate = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pItColAUpdate(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long)
                var row = null;
                var maxVal = null;
                var bVisible = null;
                var pendiente = null;

                var w_grid = property.getGrid();
                switch (w_grid.getColumns(lCol).Key) {
                    case KIP_APLICADO:
                        row = w_grid.getRows(lRow);

                        var w_pCell = Dialogs.cell(row, KIP_APLICADO);

                        pendiente = Cairo.Util.val(pItGetItemPendiente().getValue()) + Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO2).getValue());
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
                        aplicado = pItGetAplicado();
                        pItRefreshItem(aplicado);
                        pItGetItemAplicado().setValue(aplicado);

                        // Actulizo el pendiente
                        var w_pCell = Dialogs.cell(row, KIP_PENDIENTE);
                        w_pCell.setValue(Cairo.Util.val(w_pCell.getValue()) + Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO2).getValue()) - Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO).getValue()));
                        Dialogs.cell(row, KIP_APLICADO2).getValue() === Dialogs.cell(row, KIP_APLICADO).getValue();
                        break;
                }

                return true;
            };

            var pItGetAplicado = function() {
                var row = null;
                var rtn = null;
                var iProp = null;

                iProp = m_dialog.getProperties().item(C_APLICPEDIDODEV);

                var _count = iProp.getGrid().getRows().size();
                for(var _i = 0; _i < _count; _i++) {
                    row = iProp.getGrid().getRows().item(_i);
                    rtn = rtn + Cairo.Util.val(Dialogs.cell(row, KIP_APLICADO).getValue());
                }
                return rtn;
            };

            var pItRefreshItem = function(aplicado) {
                var iProp = null;
                var abmObj = null;
                var row = null;
                var aplicadoActual = null;
                var lastRow = null;

                abmObj = m_dialog;

                iProp = m_dialog.getProperties().item(C_PEDIDODEV);
                lastRow = m_lastRowPedidoDev;
                row = iProp.getGrid().getRows(lastRow);

                Dialogs.cell(row, KII_APLICADO).getValue() === aplicado;
                aplicadoActual = Cairo.Util.val(Dialogs.cell(row, KII_APLICADO2).getValue());

                var w_pCell = Dialogs.cell(row, KII_PENDIENTE);
                w_pCell.setValue(w_pCell.getValue() - (aplicado - aplicadoActual));

                Dialogs.cell(row, KII_APLICADO2).getValue() === aplicado;

                abmObj.ShowCellValue(iProp, lastRow, D.getCol(iProp.getGrid().getColumns(), KII_PENDIENTE));
                abmObj.ShowCellValue(iProp, lastRow, D.getCol(iProp.getGrid().getColumns(), KII_APLICADO));
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   construccion - destruccion
            //
            //////////////////////////////////////////////////////////////////////////////////////
            self.initialize = function() {
                try {

                    //'Error al grabar el Presupuesto de Venta
                    c_ErrorSave = Cairo.Language.getText(1707, "");

                    m_generalConfig = new cGeneralConfig();
                    m_generalConfig.Load;

                    G.redim(m_vPedidoDevs, 0);
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

                    G.redim(m_vPedidoDevs, 0);

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

            var pItLoadPedidoDev = function(iProp) { // TODO: Use of ByRef founded Private Function pItLoadPedidoDev(ByRef iProp As cIABMProperty) As Boolean
                return pItLoadItemsAux(iProp);
            };

            var pItSetGridAplicPedidoDev = function(iProp) { // TODO: Use of ByRef founded Private Function pItSetGridAplicPedidoDev(ByRef iProp As cIABMProperty) As Boolean
                return pItSetGridAplicAux(iProp);
            };

            var pItSavePedidoDev = function(prvTMPId,  vAplic) { // TODO: Use of ByRef founded Private Function pItSavePedidoDev(ByVal prvTMPId As Long, ByRef vAplic() As T_Aplic) As Boolean
                var register = null;
                var i = null;
                var j = null;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).prvi_id !== Cairo.Constants.NO_ID || vAplic(i).pvi_id !== Cairo.Constants.NO_ID) {

                        for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {

                            if(vAplic(i).vAplicaciones(j).prvi_id !== Cairo.Constants.NO_ID) {

                                if(vAplic.Aplicado > 0) {

                                    register = new cRegister();

                                    // Si estoy vinculando contra un pedido
                                    if(vAplic(i).pvi_id !== 0) {
                                        register.setFieldId(mVentaConstantes.PRV_PV_TMP_ID);
                                        register.setTable(mVentaConstantes.PRESUPUESTOPEDIDO_VENTATMP);
                                        register.getFields().add2(mVentaConstantes.PVI_ID, vAplic(i).pvi_id, Cairo.Constants.Types.id);
                                        register.getFields().add2(mVentaConstantes.PRVI_ID, vAplic.prvi_id, Cairo.Constants.Types.id);

                                        register.getFields().add2(mVentaConstantes.PRV_PV_CANTIDAD, vAplic.Aplicado, Cairo.Constants.Types.double);
                                        register.getFields().add2(mVentaConstantes.PRV_PV_ID, vAplic.vinc_id, Cairo.Constants.Types.long);

                                        // Si vinculo contra un Presupuesto (Presupuesto - Devolucion)
                                    }
                                    else {
                                        register.setFieldId(mVentaConstantes.PRV_DV_TMP_ID);
                                        register.setTable(mVentaConstantes.PRESUPUESTODEVOLUCIONVENTATMP);

                                        if(m_isDevolucion) {
                                            register.getFields().add2(mVentaConstantes.PRVI_ID_DEVOLUCION, vAplic.prvi_id, Cairo.Constants.Types.id);
                                            register.getFields().add2(mVentaConstantes.PRVI_ID_PRESUPUESTO, vAplic(i).prvi_id, Cairo.Constants.Types.id);
                                        }
                                        else {
                                            register.getFields().add2(mVentaConstantes.PRVI_ID_PRESUPUESTO, vAplic.prvi_id, Cairo.Constants.Types.id);
                                            register.getFields().add2(mVentaConstantes.PRVI_ID_DEVOLUCION, vAplic(i).prvi_id, Cairo.Constants.Types.id);
                                        }

                                        register.getFields().add2(mVentaConstantes.PRV_DV_CANTIDAD, vAplic.Aplicado, Cairo.Constants.Types.double);
                                        register.getFields().add2(mVentaConstantes.PRV_DV_ID, vAplic.vinc_id, Cairo.Constants.Types.long);

                                    }

                                    register.setId(Cairo.Constants.NEW_ID);
                                    register.getFields().add2(mVentaConstantes.PRV_TMP_ID, prvTMPId, Cairo.Constants.Types.id);

                                    register.getFields().setHaveLastUpdate(false);
                                    register.getFields().setHaveWhoModify(false);

                                    if(!Cairo.Database.save(register, , "pItSavePedidoDev ", C_MODULE, c_ErrorSave)) { return false; }
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

    Cairo.module("PresupuestoVentaAplic.List", function(List, Cairo, Backbone, Marionette, $, _) {
        List.Controller = {
            list: function() {

                var self = this;

                /*
                 this function will be called by the tab manager every time the
                 view must be created. when the tab is not visible the tab manager
                 will not call this function but only make the tab visible
                 */
                var createTreeDialog = function(tabId) {

                    var editors = Cairo.Editors.presupuestoventaaplicEditors || Cairo.Collections.createCollection(null);
                    Cairo.Editors.presupuestoventaaplicEditors = editors;

                    // ListController properties and methods
                    //
                    self.entityInfo = new Backbone.Model({
                        entitiesTitle: "PresupuestoVentaAplics",
                        entityName: "presupuestoventaaplic",
                        entitiesName: "presupuestoventaaplics"
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
                            var editor = Cairo.PresupuestoVentaAplic.Edit.Controller.getEditor();
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
                        if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_PRESUPUESTOVENTAAPLIC)) {
                            return Cairo.Promises.resolvedPromise(false);
                        }
                        var apiPath = Cairo.Database.getAPIVersion();
                        return Cairo.Database.destroy(apiPath + "general/presupuestoventaaplic", id, Cairo.Constants.DELETE_FUNCTION, "PresupuestoVentaAplic").success(
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
                    Cairo.LoadingMessage.show("PresupuestoVentaAplics", "Loading presupuestoventaaplic from CrowSoft Cairo server.");

                    // create the tree region
                    //
                    Cairo.addRegions({ presupuestoventaaplicTreeRegion: tabId });

                    // create the dialog
                    //
                    Cairo.Tree.List.Controller.list(
                        Cairo.Tables.PRESUPUESTOVENTAAPLIC,
                        new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
                        Cairo.presupuestoventaaplicTreeRegion,
                        self);

                };

                var showTreeDialog = function() {
                    Cairo.Tree.List.Controller.showTreeDialog(self);
                };

                var closeTreeDialog = function() {

                }

                // create the tab
                //
                Cairo.mainTab.showTab("PresupuestoVentaAplics", "presupuestoventaaplicTreeRegion", "#general/presupuestoventaaplics", createTreeDialog, closeTreeDialog, showTreeDialog);

            }
        };
    });


}());

private class T_ItAplic {
    public Long vinc_id;//' lo uso para prvpv_id y prvdv_id
    public Long prvi_id;//' Ids de items al que este credito esta vinculado
    public Double aplicado;
}


private class T_Aplic {
    public Long pvi_id;//' Pedido
    public Long prvi_id;//' Cancelacion de presupuesto
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


case class PresupuestoventaaplicData(
    id: Option[Int],

)

object Presupuestoventaaplics extends Controller with ProvidesUser {

    val presupuestoventaaplicForm = Form(
        mapping(
                "id" -> optional(number),

        )(PresupuestoventaaplicData.apply)(PresupuestoventaaplicData.unapply))

    implicit val presupuestoventaaplicWrites = new Writes[Presupuestoventaaplic] {
        def writes(presupuestoventaaplic: Presupuestoventaaplic) = Json.obj(
                "id" -> Json.toJson(presupuestoventaaplic.id),
                C.ID -> Json.toJson(presupuestoventaaplic.id),

        )
    }

    def get(id: Int) = GetAction { implicit request =>
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PRESUPUESTOVENTAAPLIC), { user =>
        Ok(Json.toJson(Presupuestoventaaplic.get(user, id)))
    })
}

def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in presupuestoventaaplics.update")
    presupuestoventaaplicForm.bindFromRequest.fold(
        formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
    BadRequest
},
presupuestoventaaplic => {
    Logger.debug(s"form: ${presupuestoventaaplic.toString}")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PRESUPUESTOVENTAAPLIC), { user =>
    Ok(
        Json.toJson(
            Presupuestoventaaplic.update(user,
                Presupuestoventaaplic(
                    id,

                ))))
})
}
)
}

def create = PostAction { implicit request =>
    Logger.debug("in presupuestoventaaplics.create")
    presupuestoventaaplicForm.bindFromRequest.fold(
        formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
    BadRequest
},
presupuestoventaaplic => {
    Logger.debug(s"form: ${presupuestoventaaplic.toString}")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PRESUPUESTOVENTAAPLIC), { user =>
    Ok(
        Json.toJson(
            Presupuestoventaaplic.create(user,
                Presupuestoventaaplic(

                ))))
})
}
)
}

def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in presupuestoventaaplics.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PRESUPUESTOVENTAAPLIC), { user =>
    Presupuestoventaaplic.delete(user, id)
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

case class Presupuestoventaaplic(
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

object Presupuestoventaaplic {

    lazy val emptyPresupuestoventaaplic = Presupuestoventaaplic(
    )

    def apply(
        id: Int,
) = {

        new Presupuestoventaaplic(
            id,
        )
    }

    def apply(
    ) = {

        new Presupuestoventaaplic(
        )
    }

    private val presupuestoventaaplicParser: RowParser[Presupuestoventaaplic] = {
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
        Presupuestoventaaplic(
            id,
            ,
            createdAt,
            updatedAt,
            updatedBy)
    }
}

def create(user: CompanyUser, presupuestoventaaplic: Presupuestoventaaplic): Presupuestoventaaplic = {
    save(user, presupuestoventaaplic, true)
}

def update(user: CompanyUser, presupuestoventaaplic: Presupuestoventaaplic): Presupuestoventaaplic = {
    save(user, presupuestoventaaplic, false)
}

private def save(user: CompanyUser, presupuestoventaaplic: Presupuestoventaaplic, isNew: Boolean): Presupuestoventaaplic = {
    def getFields = {
        List(

            )
    }
    def throwException = {
        throw new RuntimeException(s"Error when saving ${C.PRESUPUESTOVENTAAPLIC}")
}

DBHelper.saveEx(
    user,
    Register(
        C.PRESUPUESTOVENTAAPLIC,
        C.ID,
        presupuestoventaaplic.id,
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

def load(user: CompanyUser, id: Int): Option[Presupuestoventaaplic] = {
    loadWhere(user, s"${C.ID} = {id}", 'id -> id)
}

def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
    SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.PRESUPUESTOVENTAAPLIC} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
.on(args: _*)
.as(presupuestoventaaplicParser.singleOpt)
}
}

def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
    try {
        SQL(s"DELETE FROM ${C.PRESUPUESTOVENTAAPLIC} WHERE ${C.ID} = {id}")
    .on('id -> id)
            .executeUpdate
    } catch {
    case NonFatal(e) => {
            Logger.error(s"can't delete a ${C.PRESUPUESTOVENTAAPLIC}. ${C.ID} id: $id. Error ${e.toString}")
            throw e
        }
    }
}
}

def get(user: CompanyUser, id: Int): Presupuestoventaaplic = {
    load(user, id) match {
        case Some(p) => p
    case None => emptyPresupuestoventaaplic
}
}
}


// Router

GET     /api/v1/general/presupuestoventaaplic/:id              controllers.logged.modules.general.Presupuestoventaaplics.get(id: Int)
POST    /api/v1/general/presupuestoventaaplic                  controllers.logged.modules.general.Presupuestoventaaplics.create
PUT     /api/v1/general/presupuestoventaaplic/:id              controllers.logged.modules.general.Presupuestoventaaplics.update(id: Int)
DELETE  /api/v1/general/presupuestoventaaplic/:id              controllers.logged.modules.general.Presupuestoventaaplics.delete(id: Int)




/**/
