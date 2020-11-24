(function() {
    "use strict";

    Cairo.module("PedidoCompraAplic.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

        var createObject = function() {

            var self = {};

            var getText = Cairo.Language.getText;

            var TITLE = getText(1940, ""); // Aplicación Pedido de Compra
            var SAVE_ERROR_MESSAGE = getText(1936, ""); // Error al grabar el pedido de compra

            var Dialogs = Cairo.Dialogs;

            var C_MODULE = "cPedidoCompraAplic";

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
            var CSCPCD_ID = "pcd_id";
            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   COTIZACIONES - SOLAPA
            //
            //////////////////////////////////////////////////////////////////////////////////////

            // Cotizaciones

            var CSCFECHA = "Fecha";
            var CSCAPLICADO = "Aplicado";
            var CSCAPLIC_COTIZACION = "AplicCotizacion";

            // Grillas de Cotizaciones / Pedidos
            var KII_PCI_ID = 1;
            var KII_PR_ID = 2;
            var KII_APLICADO = 4;
            var KII_APLICADO2 = 5;
            var KII_PENDIENTE = 6;

            var KIP_PCCOT_ID = 1;

            var KIOD_OCI_ID = 2;
            var KIOD_COTI_ID = 3;
            var KIOD_PCI_ID = 4;

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
            //   ORDEN DE COMPRA / DEVOLUCION - SOLAPA
            //
            //////////////////////////////////////////////////////////////////////////////////////

            // Cotizaciones

            var K_FAC_DEV = 20;
            var K_APLIC_FAC_DEV = 21;
            var C_FACDEV = "FacDev";
            var C_APLICFACDEV = "AplicFacDev";

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   COTIZACIONES / ORDENES DE COMPRA
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
            var m_pcId = 0;
            var m_isDevolucion;
            var m_pcNumero = "";
            var m_usuario = "";
            var m_usId = 0;
            var m_docId = 0;
            var m_sucId = 0;
            var m_total = 0;

            var m_monDefault = 0;

            var m_lastRowFacDev = 0;

            // Edit Apply
            //
            var m_objectClient;
            var m_emp_id = 0;
            var m_emp_nombre = "";

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   COTIZACIONES / ORDENES DE COMPRA
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var m_vFacDevs;
            var m_pci_id = 0;

            // eventos

            // Edit Apply
            //
            self.setObjectClient = function(rhs) {
                m_objectClient = rhs;
            };

            self.getId = function() {
                return m_pcId;
            };

            // propiedades friend
            self.show = function(pcId,  total,  pcNumero,  usId,  usuario,  sucId,  docId,  isDevolucion) {
                var _rtn = null;

                if(m_dialog === null) {
                    m_dialog = new cABMGeneric();
                }

                if(m_pcId !== pcId) {
                    m_isDevolucion = isDevolucion;
                    m_pcId = pcId;
                    m_pcNumero = pcNumero;
                    m_usuario = usuario;
                    m_usId = usId;
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

                            case K_FAC_DEV:

                                abmObj = m_dialog;

                                // Guardo la aplicacion para el item editado anteriormente
                                //
                                if(m_lastRowFacDev !== 0) {
                                    aplicado = pItUpdateGrids(m_vFacDevs);
                                }

                                // Muestro las aplicaciones para este item
                                //
                                m_lastRowFacDev = iProp.getSelectedIndex();
                                row = iProp.getGrid().getRows(m_lastRowFacDev);
                                if(row === null) { return null; }

                                pItSetAplicItems(m_dialog.getProperties().item(C_APLICFACDEV), Dialogs.cell(row, KII_PCI_ID).getID(), Dialogs.cell(row, KII_PR_ID).getID(), m_vFacDevs);

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
                return "#general/pedidocompraaplic/" + m_id.toString();
            };

            self.getEditorName = function() {
                var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
                return "pedidocompraaplic" + id;
            };

            self.getTitle = function() {
                var _rtn = "";
                // **TODO:** on error resume next found !!!
                //'Aplicación Pedido de Compra
                _rtn = Cairo.Language.getText(1940, "");
                m_dialog.setTitle(m_pcNumero+ " - "+ m_usuario);

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
                        case K_APLIC_FAC_DEV:
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
                        case K_APLIC_FAC_DEV:
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

                        case K_APLIC_FAC_DEV:

                            var w_pItGetItemsAplic = pItGetItemsAplic().getRows();

                            var objEditName = null;

                            id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIOD_COTI_ID).getID();

                            if(id !== Cairo.Constants.NO_ID) {

                                if(!Cairo.Database.getData("CotizacionCompraItem", "coti_id", id, "cot_id", id)) { return; }

                                objEditName = "CSCompra2.cCotizacionCompra";

                            }
                            else {

                                id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIOD_OCI_ID).getID();

                                if(id !== Cairo.Constants.NO_ID) {
                                    if(!Cairo.Database.getData("OrdenCompraItem", "oci_id", id, "oc_id", id)) { return; }

                                    objEditName = "CSCompra2.cOrdenCompra";

                                }
                                else {

                                    id = Dialogs.cell(w_pItGetItemsAplic.Item(lRow), KIOD_PCI_ID).getID();

                                    if(id !== Cairo.Constants.NO_ID) {
                                        if(!Cairo.Database.getData("PedidoCompraItem", "pci_id", id, "pc_id", id)) { return; }

                                        objEditName = "CSPedidoCompra2.cPedidoCompra";
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

                m_lastRowFacDev = 0;

                m_dialog.getProperties().clear();
                m_dialog.getTabs().clear();

                iTab = m_dialog.getTabs().add(null);
                iTab.setIndex(0);
                //'Cotizaciones/Ordenes de Compra
                iTab.setName(Cairo.Language.getText(1941, ""));

                var properties = m_dialog.getProperties();

                c = properties.add(null, C_FACDEV);
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
                oGrd = c.getGrid();
                oGrd.setRowSelect(true);
                oGrd.setDontSelectInGotFocus(true);

                c = properties.add(null, C_APLICFACDEV);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();;
                if(!pItSetGridAplicFacDev(c)) { return false; }
                c.setKey(K_APLIC_FAC_DEV);
                c.setName("Ordenes de compra");
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

                var pcTMPId = null;

                pItUpdateGrids(m_vFacDevs);

                // Temporal
                if(!pSaveDocCpra(m_docId, pcTMPId)) { return _rtn; }

                // Ordenes de compra / Devoluciones
                if(!pItSaveFacDev(pcTMPId, m_vFacDevs)) { return _rtn; }

                // Aplico llamando al sp
                var sqlstmt = null;
                var rs = null;

                sqlstmt = "sp_DocPedidoCompraSaveAplic "+ pcTMPId.toString();
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
            // PedidoCompraTemporal
            //////////////////////////////////////////////////////////////////////////////////////
            var pSaveDocCpra = function(docId,  pcTMPId) { // TODO: Use of ByRef founded Private Function pSaveDocCpra(ByVal DocId As Long, ByRef pcTMPId As Long) As Boolean
                var register = new DB.Register();

                register = new cRegister();
                register.setFieldId(mComprasConstantes.PC_TMP_ID);
                register.setTable(mComprasConstantes.PEDIDOCOMPRATMP);

                register.setId(Cairo.Constants.NEW_ID);
                register.getFields().add2(mComprasConstantes.PC_ID, m_pcId, Types.id);

                register.getFields().add2(mComprasConstantes.PC_NUMERO, 0, Types.long);
                register.getFields().add2(mComprasConstantes.PC_NRODOC, "", Types.text);

                register.getFields().add2(Cairo.Constants.US_ID, 0, Types.long);
                register.getFields().add2(mComprasConstantes.SUC_ID, 0, Types.long);
                register.getFields().add2(mComprasConstantes.DOC_ID, docId, Types.id);

                register.getFields().add2(C.EST_ID, CSGeneralEx2.csEEstado.cSEEST_PENDIENTE, Types.id);

                register.getFields().setHaveLastUpdate(true);
                register.getFields().setHaveWhoModify(true);

                if(!register.beginTrans(Cairo.Database)) { return false; }

                if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return false; }

                if(!register.commitTrans()) { return false; }

                pcTMPId = register.getID();
                return true;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   PEDIDOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pItLoadAplicItems = function() {

                if(!pItLoadAplicAplicados(m_vFacDevs)) { return false; }
                if(!pItLoadAplicCreditos(m_vFacDevs)) { return false; }

                return true;
            };

            var pItLoadItems = function(iProp) { // TODO: Use of ByRef founded Private Function pItLoadItems(ByRef iProp As cIABMProperty) As Boolean
                return pItLoadItemsAux(iProp);
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

                sqlstmt = "sp_DocPedidoCompraGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_pcId+ ",1";
                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pItLoadItems", C_MODULE)) { return false; }

                iProp.getGrid().getColumns().clear();
                iProp.getGrid().getRows().clear();

                grid = iProp.getGrid();

                var w_columns = grid.getColumns();
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KII_PCI_ID);

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
                    elem.setId(Cairo.Database.valField(rs.getFields(), mComprasConstantes.PCI_ID));
                    elem.setKey(KII_PCI_ID);

                    elem = row.add(null);
                    elem.setId(Cairo.Database.valField(rs.getFields(), C.PR_ID));
                    elem.setValue(Cairo.Database.valField(rs.getFields(), C.PR_NAME_COMPRA));
                    elem.setKey(KII_PR_ID);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(rs.getFields(), mComprasConstantes.PCI_PENDIENTE));
                    elem.setKey(KII_PENDIENTE);

                    value = Cairo.Database.valField(rs.getFields(), CSCAPLIC_COTIZACION);
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
                elem.setKey(KIP_PCCOT_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIOD_OCI_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIOD_COTI_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIOD_PCI_ID);

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

            var pItLoadAplicAplicados = function(vAplic) { // TODO: Use of ByRef founded Private Function pItLoadAplicAplicados(ByRef vAplic() As T_Aplic) As Boolean
                var sqlstmt = null;
                var rs = null;
                var i = null;
                var idx = null;

                sqlstmt = "sp_DocPedidoCompraGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_pcId+ ",2";
                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicAplicados", C_MODULE)) { return false; }

                G.redim(vAplic, 0);
                G.redimPreserve(0, .vAplicaciones);

                if(!rs.isEOF()) {

                    rs.MoveLast;
                    rs.MoveFirst;

                    while (!rs.isEOF()) {

                        i = pItAddToCreditos(Cairo.Database.valField(rs.getFields(), mComprasConstantes.COTI_ID), Cairo.Database.valField(rs.getFields(), mComprasConstantes.OCI_ID), Cairo.Database.valField(rs.getFields(), mComprasConstantes.PCI_ID), idx, vAplic);

                        // Documento
                        //
                        vAplic.docNombre = Cairo.Database.valField(rs.getFields(), mComprasConstantes.DOC_NAME);
                        vAplic.NroDoc = Cairo.Database.valField(rs.getFields(), CSCNRO_DOC);
                        vAplic.Fecha = Cairo.Database.valField(rs.getFields(), CSCFECHA);

                        // Pendiente
                        //
                        vAplic.Pendiente = Cairo.Database.valField(rs.getFields(), CSCPENDIENTE);
                        vAplic.PendienteActual = vAplic.Pendiente;

                        // Pedido
                        //
                        vAplic.pci_id = Cairo.Database.valField(rs.getFields(), CSCPCD_ID);
                        vAplic.oci_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.OCI_ID);
                        vAplic.coti_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.COTI_ID);

                        vAplic.PR_ID = Cairo.Database.valField(rs.getFields(), C.PR_ID);

                        // Aplicaciones
                        //*TODO:** can't found type for with block
                        //*With .vAplicaciones(idx)
                        var w___TYPE_NOT_FOUND = vAplic.vAplicaciones(idx);

                        w___TYPE_NOT_FOUND.vinc_id = Cairo.Database.valField(rs.getFields(), CSCVINC_ID);

                        w___TYPE_NOT_FOUND.pci_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.PCI_ID);

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

                sqlstmt = "sp_DocPedidoCompraGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_pcId+ ",3";
                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicCreditos", C_MODULE)) { return false; }

                if(!rs.isEOF()) {

                    rs.MoveLast;
                    rs.MoveFirst;

                    i = vAplic.Length;
                    G.redimPreserve(vAplic, i + rs.RecordCount);

                    while (!rs.isEOF()) {

                        i = i + 1;
                        vAplic.PR_ID = Cairo.Database.valField(rs.getFields(), C.PR_ID);

                        vAplic.coti_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.COTI_ID);
                        vAplic.pci_id = Cairo.Database.valField(rs.getFields(), CSCPCD_ID);
                        vAplic.oci_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.OCI_ID);

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

            var pItAddToCreditos = function(cotiId,  ociId,  pciId,  idx,  vAplic) { // TODO: Use of ByRef founded Private Function pItAddToCreditos(ByVal CotiId As Long, ByVal OciId As Long, ByVal PciId As Long, ByRef Idx As Long, ByRef vAplic() As T_Aplic) As Long
                var _rtn = 0;
                var i = null;

                for(i = 1; i <= vAplic.Length; i++) {
                    if((vAplic.coti_id === cotiId && cotiId !== Cairo.Constants.NO_ID) || (vAplic.oci_id === ociId && ociId !== Cairo.Constants.NO_ID) || (vAplic.pci_id === pciId && pciId !== Cairo.Constants.NO_ID)) {

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

                iProp = m_dialog.getProperties().item(C_FACDEV);
                iPropAplic = m_dialog.getProperties().item(C_APLICFACDEV);
                lastRow = m_lastRowFacDev;

                if(lastRow !== 0) {

                    row = iProp.getGrid().getRows(lastRow);
                    _rtn = pItUpdateAplicItems(iPropAplic, Dialogs.cell(row, KII_PCI_ID).getID(), vAplic);
                }

                return _rtn;
            };

            var pItSetAplicItems = function(iProp,  pci_id,  pR_ID,  vAplic) { // TODO: Use of ByRef founded Private Function pItSetAplicItems(ByRef iProp As cIABMProperty, ByVal pci_id As Long, ByVal PR_ID As Long, ByRef vAplic() As T_Aplic) As Boolean
                var cotizacion = null;
                var i = null;
                var j = null;

                iProp.getGrid().getRows().clear();

                m_pci_id = pci_id;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).PR_ID === pR_ID) {

                        if(vAplic(i).vAplicaciones.Length > 0) {
                            pItSetAplicItemsAux1(i, iProp, pci_id, vAplic);
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

                            id = Dialogs.cell(row, KIOD_OCI_ID).getID();
                            if(id === vAplic(i).oci_id && id !== Cairo.Constants.NO_ID) {
                                bAplic = true;
                                break;
                            }

                            id = Dialogs.cell(row, KIOD_COTI_ID).getID();
                            if(id === vAplic(i).coti_id && id !== Cairo.Constants.NO_ID) {
                                bAplic = true;
                                break;
                            }

                            id = Dialogs.cell(row, KIOD_PCI_ID).getID();
                            if(id === vAplic(i).pci_id && id !== Cairo.Constants.NO_ID) {
                                bAplic = true;
                                break;
                            }

                            id = m_pci_id;
                            for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {
                                if(id === vAplic(i).vAplicaciones(j).pci_id && id !== Cairo.Constants.NO_ID) {
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

            var pItUpdateAplicItems = function(iProp,  pci_id,  vAplic) { // TODO: Use of ByRef founded Private Function pItUpdateAplicItems(ByRef iProp As cIABMProperty, ByVal pci_id As Long, ByRef vAplic() As T_Aplic) As Double
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

            var pItSetAplicItemsAux1 = function(idx,  iProp,  pci_id,  vAplic) { // TODO: Use of ByRef founded Private Sub pItSetAplicItemsAux1(ByVal Idx As Long, ByRef iProp As cIABMProperty, ByVal pci_id As Long, ByRef vAplic() As T_Aplic)
                var f = null;
                var fv = null;
                var i = null;
                var iPropItem = null;
                var row = null;

                for(i = 1; i <= vAplic(idx).vAplicaciones.Length; i++) {

                    if(vAplic.pci_id === pci_id && pci_id !== Cairo.Constants.NO_ID) {

                        f = iProp.getGrid().getRows().add(null);

                        elem = row.add(null);
                        elem.setId(idx);
                        elem.setKey(KIP_IDX1);

                        elem = row.add(null);
                        elem.setId(i);
                        elem.setKey(KIP_IDX2);

                        elem = row.add(null);
                        elem.setId(vAplic.vinc_id);
                        elem.setKey(KIP_PCCOT_ID);

                        elem = row.add(null);

                        elem.setKey(KIOD_PCI_ID);
                        elem.setId(vAplic(idx).pci_id);

                        elem = row.add(null);
                        elem.setId(vAplic(idx).oci_id);
                        elem.setKey(KIOD_OCI_ID);

                        elem = row.add(null);
                        elem.setId(vAplic(idx).coti_id);
                        elem.setKey(KIOD_COTI_ID);

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
                elem.setKey(KIP_PCCOT_ID);

                elem = row.add(null);

                elem.setKey(KIOD_PCI_ID);
                elem.setId(vAplic.pci_id);

                elem = row.add(null);
                elem.setId(vAplic.oci_id);
                elem.setKey(KIOD_OCI_ID);

                elem = row.add(null);
                elem.setId(vAplic.coti_id);
                elem.setKey(KIOD_COTI_ID);

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
                    vAplicaciones.pci_id = m_pci_id;
                }

                vAplicaciones(idx).Aplicado = importe;

                for(i = 1; i <= vAplicaciones.Length; i++) {
                    rtn = rtn + vAplicaciones(i).Aplicado;
                }

                return rtn;
            };

            var pItGetItemsProperty = function() {
                return m_dialog.getProperties().item(C_APLICFACDEV);
            };

            var pItGetItemsAplic = function() {
                return m_dialog.getProperties().item(C_APLICFACDEV).getGrid();
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
                iProp = m_dialog.getProperties().item(C_FACDEV);
                return Dialogs.cell(iProp.getGrid().getRows(iProp.getSelectedIndex()), KII_PENDIENTE);
            };

            var pItGetItemAplicado = function() {
                var iProp = null;
                iProp = m_dialog.getProperties().item(C_FACDEV);
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

                iProp = m_dialog.getProperties().item(C_APLICFACDEV);

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

                iProp = m_dialog.getProperties().item(C_FACDEV);
                lastRow = m_lastRowFacDev;
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

                    //'Error al grabar el Pedido de Compra
                    c_ErrorSave = Cairo.Language.getText(1936, "");

                    m_generalConfig = new cGeneralConfig();
                    m_generalConfig.Load;

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
            //   COTIZACIONES / ORDENES DE COMPRA
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pItLoadFacDev = function(iProp) { // TODO: Use of ByRef founded Private Function pItLoadFacDev(ByRef iProp As cIABMProperty) As Boolean
                return pItLoadItemsAux(iProp);
            };

            var pItSetGridAplicFacDev = function(iProp) { // TODO: Use of ByRef founded Private Function pItSetGridAplicFacDev(ByRef iProp As cIABMProperty) As Boolean
                return pItSetGridAplicAux(iProp);
            };

            var pItSaveFacDev = function(pcTMPId,  vAplic) { // TODO: Use of ByRef founded Private Function pItSaveFacDev(ByVal pcTMPId As Long, ByRef vAplic() As T_Aplic) As Boolean
                var register = new DB.Register();
                var i = null;
                var j = null;

                for(i = 1; i <= vAplic.Length; i++) {

                    if(vAplic(i).oci_id !== Cairo.Constants.NO_ID || vAplic(i).pci_id !== Cairo.Constants.NO_ID || vAplic(i).coti_id !== Cairo.Constants.NO_ID) {

                        for(j = 1; j <= vAplic(i).vAplicaciones.Length; j++) {

                            if(vAplic(i).vAplicaciones(j).pci_id !== Cairo.Constants.NO_ID) {

                                if(vAplic.Aplicado > 0) {

                                    register = new cRegister();

                                    // Si estoy vinculando contra una orden de compra
                                    if(vAplic(i).oci_id !== 0) {
                                        register.setFieldId(mComprasConstantes.PC_OC_TMP_ID);
                                        register.setTable(mComprasConstantes.PEDIDOORDENCOMPRATMP);
                                        register.getFields().add2(mComprasConstantes.OCI_ID, vAplic(i).oci_id, Types.id);
                                        register.getFields().add2(mComprasConstantes.PCI_ID, vAplic.pci_id, Types.id);

                                        register.getFields().add2(mComprasConstantes.PC_OC_CANTIDAD, vAplic.Aplicado, Types.double);
                                        register.getFields().add2(mComprasConstantes.PC_OC_ID, vAplic.vinc_id, Types.long);

                                    }
                                    else if(vAplic(i).coti_id !== 0) {

                                        register.setFieldId(mComprasConstantes.PCCOT_TMP_ID);
                                        register.setTable(mComprasConstantes.PEDIDOCOTIZACIONCOMPRATMP);
                                        register.getFields().add2(mComprasConstantes.COTI_ID, vAplic(i).coti_id, Types.id);
                                        register.getFields().add2(mComprasConstantes.PCI_ID, vAplic.pci_id, Types.id);

                                        register.getFields().add2(mComprasConstantes.PCCOT_CANTIDAD, vAplic.Aplicado, Types.double);
                                        register.getFields().add2(mComprasConstantes.PCCOT_ID, vAplic.vinc_id, Types.long);

                                        // Si vinculo contra un pedido (Pedido - Devolucion)
                                    }
                                    else {
                                        register.setFieldId(mComprasConstantes.PC_DC_TMP_ID);
                                        register.setTable(mComprasConstantes.PEDIDODEVOLUCIONCOMPRATMP);

                                        if(m_isDevolucion) {
                                            register.getFields().add2(mComprasConstantes.PCI_ID_DEVOLUCION, vAplic.pci_id, Types.id);
                                            register.getFields().add2(mComprasConstantes.PCI_ID_PEDIDO, vAplic(i).pci_id, Types.id);
                                        }
                                        else {
                                            register.getFields().add2(mComprasConstantes.PCI_ID_PEDIDO, vAplic.pci_id, Types.id);
                                            register.getFields().add2(mComprasConstantes.PCI_ID_DEVOLUCION, vAplic(i).pci_id, Types.id);
                                        }

                                        register.getFields().add2(mComprasConstantes.PC_DC_CANTIDAD, vAplic.Aplicado, Types.double);
                                        register.getFields().add2(mComprasConstantes.PC_DC_ID, vAplic.vinc_id, Types.long);

                                    }

                                    register.setId(Cairo.Constants.NEW_ID);
                                    register.getFields().add2(mComprasConstantes.PC_TMP_ID, pcTMPId, Types.id);

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

    Cairo.module("PedidoCompraAplic.List", function(List, Cairo, Backbone, Marionette, $, _) {
        List.Controller = {
            list: function() {

                var self = this;

                /*
                 this function will be called by the tab manager every time the
                 view must be created. when the tab is not visible the tab manager
                 will not call this function but only make the tab visible
                 */
                var createTreeDialog = function(tabId) {

                    var editors = Cairo.Editors.pedidocompraaplicEditors || Cairo.Collections.createCollection(null);
                    Cairo.Editors.pedidocompraaplicEditors = editors;

                    // ListController properties and methods
                    //
                    self.entityInfo = new Backbone.Model({
                        entitiesTitle: "PedidoCompraAplics",
                        entityName: "pedidocompraaplic",
                        entitiesName: "pedidocompraaplics"
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
                            var editor = Cairo.PedidoCompraAplic.Edit.Controller.getEditor();
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
                        if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_PEDIDOCOMPRAAPLIC)) {
                            return Cairo.Promises.resolvedPromise(false);
                        }
                        var apiPath = Cairo.Database.getAPIVersion();
                        return Cairo.Database.destroy(apiPath + "general/pedidocompraaplic", id, Cairo.Constants.DELETE_FUNCTION, "PedidoCompraAplic").success(
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
                    Cairo.LoadingMessage.show("PedidoCompraAplics", "Loading pedidocompraaplic from CrowSoft Cairo server.");

                    // create the tree region
                    //
                    Cairo.addRegions({ pedidocompraaplicTreeRegion: tabId });

                    // create the dialog
                    //
                    Cairo.Tree.List.Controller.list(
                        Cairo.Tables.PEDIDOCOMPRAAPLIC,
                        new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
                        Cairo.pedidocompraaplicTreeRegion,
                        self);

                };

                var showTreeDialog = function() {
                    Cairo.Tree.List.Controller.showTreeDialog(self);
                };

                var closeTreeDialog = function() {

                }

                // create the tab
                //
                Cairo.mainTab.showTab("PedidoCompraAplics", "pedidocompraaplicTreeRegion", "#general/pedidocompraaplics", createTreeDialog, closeTreeDialog, showTreeDialog);

            }
        };
    });


}());

private class T_ItAplic {
    public Long vinc_id;//' lo uso para pcoc_id, pccot_id y pcdc_id
    public Long pci_id;//' Ids de items al que este credito esta vinculado
    public Double aplicado;
}


private class T_Aplic {
    public Long coti_id;//' Cotizaciones
    public Long oci_id;//' Ordenes de compra
    public Long pci_id;//' Cancelacion de pedido
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


case class PedidocompraaplicData(
    id: Option[Int],

)

object Pedidocompraaplics extends Controller with ProvidesUser {

    val pedidocompraaplicForm = Form(
        mapping(
                "id" -> optional(number),

        )(PedidocompraaplicData.apply)(PedidocompraaplicData.unapply))

    implicit val pedidocompraaplicWrites = new Writes[Pedidocompraaplic] {
        def writes(pedidocompraaplic: Pedidocompraaplic) = Json.obj(
                "id" -> Json.toJson(pedidocompraaplic.id),
                C.ID -> Json.toJson(pedidocompraaplic.id),

        )
    }

    def get(id: Int) = GetAction { implicit request =>
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PEDIDOCOMPRAAPLIC), { user =>
        Ok(Json.toJson(Pedidocompraaplic.get(user, id)))
    })
}

def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in pedidocompraaplics.update")
    pedidocompraaplicForm.bindFromRequest.fold(
        formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
    BadRequest
},
pedidocompraaplic => {
    Logger.debug(s"form: ${pedidocompraaplic.toString}")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PEDIDOCOMPRAAPLIC), { user =>
    Ok(
        Json.toJson(
            Pedidocompraaplic.update(user,
                Pedidocompraaplic(
                    id,

                ))))
})
}
)
}

def create = PostAction { implicit request =>
    Logger.debug("in pedidocompraaplics.create")
    pedidocompraaplicForm.bindFromRequest.fold(
        formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
    BadRequest
},
pedidocompraaplic => {
    Logger.debug(s"form: ${pedidocompraaplic.toString}")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PEDIDOCOMPRAAPLIC), { user =>
    Ok(
        Json.toJson(
            Pedidocompraaplic.create(user,
                Pedidocompraaplic(

                ))))
})
}
)
}

def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in pedidocompraaplics.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PEDIDOCOMPRAAPLIC), { user =>
    Pedidocompraaplic.delete(user, id)
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

case class Pedidocompraaplic(
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

object Pedidocompraaplic {

    lazy val emptyPedidocompraaplic = Pedidocompraaplic(
    )

    def apply(
        id: Int,
) = {

        new Pedidocompraaplic(
            id,
        )
    }

    def apply(
    ) = {

        new Pedidocompraaplic(
        )
    }

    private val pedidocompraaplicParser: RowParser[Pedidocompraaplic] = {
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
        Pedidocompraaplic(
            id,
            ,
            createdAt,
            updatedAt,
            updatedBy)
    }
}

def create(user: CompanyUser, pedidocompraaplic: Pedidocompraaplic): Pedidocompraaplic = {
    save(user, pedidocompraaplic, true)
}

def update(user: CompanyUser, pedidocompraaplic: Pedidocompraaplic): Pedidocompraaplic = {
    save(user, pedidocompraaplic, false)
}

private def save(user: CompanyUser, pedidocompraaplic: Pedidocompraaplic, isNew: Boolean): Pedidocompraaplic = {
    def getFields = {
        List(

            )
    }
    def throwException = {
        throw new RuntimeException(s"Error when saving ${C.PEDIDOCOMPRAAPLIC}")
}

DBHelper.saveEx(
    user,
    Register(
        C.PEDIDOCOMPRAAPLIC,
        C.ID,
        pedidocompraaplic.id,
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

def load(user: CompanyUser, id: Int): Option[Pedidocompraaplic] = {
    loadWhere(user, s"${C.ID} = {id}", 'id -> id)
}

def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
    SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.PEDIDOCOMPRAAPLIC} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
.on(args: _*)
.as(pedidocompraaplicParser.singleOpt)
}
}

def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
    try {
        SQL(s"DELETE FROM ${C.PEDIDOCOMPRAAPLIC} WHERE ${C.ID} = {id}")
    .on('id -> id)
            .executeUpdate
    } catch {
    case NonFatal(e) => {
            Logger.error(s"can't delete a ${C.PEDIDOCOMPRAAPLIC}. ${C.ID} id: $id. Error ${e.toString}")
            throw e
        }
    }
}
}

def get(user: CompanyUser, id: Int): Pedidocompraaplic = {
    load(user, id) match {
        case Some(p) => p
    case None => emptyPedidocompraaplic
}
}
}


// Router

GET     /api/v1/general/pedidocompraaplic/:id              controllers.logged.modules.general.Pedidocompraaplics.get(id: Int)
POST    /api/v1/general/pedidocompraaplic                  controllers.logged.modules.general.Pedidocompraaplics.create
PUT     /api/v1/general/pedidocompraaplic/:id              controllers.logged.modules.general.Pedidocompraaplics.update(id: Int)
DELETE  /api/v1/general/pedidocompraaplic/:id              controllers.logged.modules.general.Pedidocompraaplics.delete(id: Int)




/**/
