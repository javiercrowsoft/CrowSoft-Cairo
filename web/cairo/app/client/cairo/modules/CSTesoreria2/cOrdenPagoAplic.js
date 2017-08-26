(function() {
    "use strict";

    Cairo.module("OrdenPagoAplic.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

        var createObject = function() {

            var self = {};

            var getText = Cairo.Language.getText;

            var TITLE = getText(1908, ""); // Aplicación Factura de Compra
            var SAVE_ERROR_MESSAGE = getText(1907, ""); // Error al grabar la factura de compra

            var Dialogs = Cairo.Dialogs;

            var C_MODULE = "cFacturaCompraAplic";

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

            var K_APLICACIONES = 1;
            var K_PENDIENTE = 2;
            var K_TOTAL = 3;

            var C_APLICACIONES = "Aplic";
            var C_PENDIENTE = "Pendiente";
            var C_TOTAL = "Total";

            var KI_FCOPG_ID = 1;
            var KI_FCD_ID = 2;
            var KI_FCP_ID = 3;
            var KI_FC_ID = 4;
            var KI_DOC = 5;
            var KI_FECHA = 6;
            var KI_COTIZACION = 7;
            var KI_PENDIENTE = 8;
            var KI_PENDIENTE2 = 9;
            var KI_APLICADO = 10;
            var KI_APLICADO2 = 11;
            var KI_APLICADO3 = 12;

            // pseudo-constantes
            var c_ErrorSave = "";

            var m_editing;
            var m_dialog;
            var m_total = 0;
            var m_generalConfig;
            var m_opgId = 0;
            var m_opgNumero = "";
            var m_proveedor = "";

            // Edit Apply
            //
            var m_objectClient;
            var m_emp_id = 0;
            var m_emp_nombre = "";

            // eventos

            // Edit Apply
            //
            self.setObjectClient = function(rhs) {
                m_objectClient = rhs;
            };

            self.getId = function() {
                return m_opgId;
            };

            // propiedades friend
            self.show = function(opgId,  total,  opgNumero,  proveedor) {
                if(m_dialog === null) {
                    m_dialog = new cABMGeneric();
                }

                if(m_opgId !== opgId) {
                    m_opgId = opgId;
                    m_opgNumero = opgNumero;
                    m_proveedor = proveedor;
                    m_total = total;

                    // Edit Apply
                    //
                    if(!Cairo.Database.getData(mTesoreriaConstantes.ORDENPAGO, mTesoreriaConstantes.OPG_ID, m_opgId, Cairo.Constants.EMP_ID, m_emp_id)) { return false; }

                    if(!Cairo.Database.getData(Cairo.Constants.EMPRESA, Cairo.Constants.EMP_ID, m_emp_id, Cairo.Constants.EMP_NAME, m_emp_nombre)) { return false; }

                    pEdit();
                }
                else {
                    m_dialog.getObjForm().ZOrder;
                }

                return true;
            };

            self.copy = function() {
            };

            self.editNew = function() {
            };

            self.getApplication = function() {
                return Cairo.appName;
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
                return true;
            };

            self.discardChanges = function() {
                return Cairo.Promises.resolvedPromise(refreshCollection());
            };

            self.propertyChange = function(key) {
                return Cairo.Promises.resolvedPromise(false);
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
                return "#general/ordenpagoaplic/" + m_id.toString();
            };

            self.getEditorName = function() {
                var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
                return "ordenpagoaplic" + id;
            };

            self.getTitle = function() {
                var _rtn = "";
                // **TODO:** on error resume next found !!!
                //'Aplicación Orden de Pago
                _rtn = Cairo.Language.getText(2198, "");
                m_dialog.setTitle(m_opgNumero+ " - "+ m_proveedor);

                return _rtn;
            };

            self.validate = function() {
                return Cairo.Promises.resolvedPromise(true);
            };

            var pEdit = function() {
                try {

                    if(!loadCollection()) { return; }

                    m_editing = true;

                    return;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, "pEdit", C_MODULE, "");
                }
            };

            var loadCollection = function() {
                var c = null;

                m_dialog.getProperties().clear();

                c = m_dialog.getProperties().add(null, C_TOTAL);
                c.setType(Dialogs.PropertyType.numeric);
                c.setSubType(Dialogs.PropertySubType.money);
                //'Importe a Pagar
                c.setName(Cairo.Language.getText(2199, ""));
                c.setEnabled(false);
                c.setLeft(2000);
                c.setLeftLabel(-1500);
                c.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                c.setValue(m_total);
                c.setKey(K_TOTAL);
                c.setWidth(1400);

                c = m_dialog.getProperties().add(null, C_PENDIENTE);
                c.setType(Dialogs.PropertyType.numeric);
                c.setSubType(Dialogs.PropertySubType.money);
                //'Pendiente
                c.setName(Cairo.Language.getText(1609, ""));
                c.setEnabled(false);
                c.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                c.setKey(K_PENDIENTE);
                c.setTopFromProperty(C_TOTAL);
                c.setLeft(6200);
                c.setWidth(1400);
                c.setLeftLabel(-1100);

                c = m_dialog.getProperties().add(null, C_APLICACIONES);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();;
                setGridAplic(c);
                if(!pLoadAplic(c)) { return false; }
                c.setKey(K_APLICACIONES);
                c.setWidth(9400);
                c.setLeft(250);
                c.setTopToPrevious(540);
                c.setGridEditEnabled(true);
                c.setGridAddEnabled(false);
                c.setGridRemoveEnabled(false);

                var abmObj = null;
                abmObj = m_dialog;
                abmObj.MinHeight = 7800;

                // Edit Apply
                //
                abmObj.MinWidth = 10050;

                if(!m_dialog.show(self)) { return false; }

                pShowPendiente();

                return true;
            };

            var refreshCollection = function() {

                m_dialog.setTitle(m_name);

                var properties = m_dialog.getProperties();

                return m_dialog.showValues(properties);
            };

            var setGridAplic = function(property) {
                var grid = null;
                var cotizacion = null;

                property.getGrid().getColumns().clear();
                property.getGrid().getRows().clear();

                grid = property.getGrid();

                var w_columns = grid.getColumns();
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_FCOPG_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_FCD_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_FCP_ID);

                var elem = w_columns.add(null);
                //'Documento
                elem.setName(Cairo.Language.getText(1567, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(2925);
                elem.setKey(KI_DOC);

                var elem = w_columns.add(null);
                //'Comprobante
                elem.setName(Cairo.Language.getText(1610, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(1575);
                elem.setKey(KI_FC_ID);

                var elem = w_columns.add(null);
                //'Fecha
                elem.setName(Cairo.Language.getText(1569, ""));
                elem.setType(Dialogs.PropertyType.date);
                elem.setWidth(1395);
                elem.setKey(KI_FECHA);

                var elem = w_columns.add(null);
                //'Pendiente
                elem.setName(Cairo.Language.getText(1609, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1245);
                elem.setKey(KI_PENDIENTE);

                var elem = w_columns.add(null);
                //'Aplicado
                elem.setName(Cairo.Language.getText(1608, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1245);
                elem.setKey(KI_APLICADO);

                var elem = w_columns.add(null);
                //'Cotiz.
                elem.setName(Cairo.Language.getText(1650, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setFormat(m_generalConfig.getFormatDecCotizacion());
                elem.setWidth(920);
                elem.setKey(KI_COTIZACION);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_PENDIENTE2);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_APLICADO2);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_APLICADO3);

                var f = null;
                var fv = null;

                for(var _i = 0; _i < m_data.aplic.length; _i += 1) {

                    f = property.getGrid().getRows().add(null);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(m_data.aplic[_i], mTesoreriaConstantes.FC_OPG_ID));
                    elem.setKey(KI_FCOPG_ID);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(m_data.aplic[_i], mTesoreriaConstantes.FCD_ID));
                    elem.setKey(KI_FCD_ID);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(m_data.aplic[_i], mTesoreriaConstantes.FCP_ID));
                    elem.setKey(KI_FCP_ID);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(m_data.aplic[_i], mTesoreriaConstantes.DOC_NAME));
                    elem.setKey(KI_DOC);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(m_data.aplic[_i], mTesoreriaConstantes.FC_NRODOC));
                    elem.setId(Cairo.Database.valField(m_data.aplic[_i], mTesoreriaConstantes.FC_ID));
                    elem.setKey(KI_FC_ID);

                    elem = row.add(null);
                    if(rs.getFields(mTesoreriaConstantes.FCD_FECHA) === null) {
                        if(rs.getFields(mTesoreriaConstantes.FCP_FECHA) === null) {
                            elem.setValue("");
                        }
                        else {
                            elem.setValue(Cairo.Database.valField(m_data.aplic[_i], mTesoreriaConstantes.FCP_FECHA));
                        }
                    }
                    else {
                        elem.setValue(Cairo.Database.valField(m_data.aplic[_i], mTesoreriaConstantes.FCD_FECHA));
                    }
                    elem.setKey(KI_FECHA);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(m_data.aplic[_i], mTesoreriaConstantes.FCD_PENDIENTE));
                    elem.setKey(KI_PENDIENTE);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(m_data.aplic[_i], mTesoreriaConstantes.FC_OPG_IMPORTE));
                    elem.setKey(KI_APLICADO);

                    elem = row.add(null);
                    cotizacion = Cairo.Database.valField(m_data.aplic[_i], mTesoreriaConstantes.FC_OPG_COTIZACION);
                    if(cotizacion !== 0) {
                        elem.setValue(cotizacion);
                    }
                    elem.setKey(KI_COTIZACION);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(m_data.aplic[_i], mTesoreriaConstantes.FCD_PENDIENTE));
                    elem.setKey(KI_PENDIENTE2);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(m_data.aplic[_i], mTesoreriaConstantes.FC_OPG_IMPORTE));
                    elem.setKey(KI_APLICADO2);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(m_data.aplic[_i], mTesoreriaConstantes.FC_OPG_IMPORTE));
                    elem.setKey(KI_APLICADO3);

                }

                return true;
            };

            // funciones friend
            // funciones privadas
            self.initialize = function() {
                try {

                    //'Error al grabar la orden de pago
                    c_ErrorSave = Cairo.Language.getText(1910, "");

                    m_generalConfig = new cGeneralConfig();
                    m_generalConfig.Load;

                    // **TODO:** goto found: GoTo ExitProc;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, "Class_Initialize", C_MODULE, "");
                    // **TODO:** label found: ExitProc:;
                }
                // **TODO:** on error resume next found !!!
            };

            self.destroy = function() {
                try {

                    m_dialog = null;
                    m_generalConfig = null;

                    // **TODO:** goto found: GoTo ExitProc;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, "Class_Terminate", C_MODULE, "");
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

            // Implementacion de cIABMClientGrid
            var isEmptyRow = function(key,  row,  rowIndex) {
                return false;
            };

            var columnAfterUpdate = function(key,  lRow,  lCol) {
                var _rtn = null;
                try {

                    _rtn = pColAUpdate(pGetItemsProperty(), lRow, lCol);

                    // **TODO:** goto found: GoTo ExitProc;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, "columnAfterUpdate", C_MODULE, "");
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

                    _rtn = pColBEdit(pGetItemsProperty(), lRow, lCol, iKeyAscii);

                    // **TODO:** goto found: GoTo ExitProc;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, "columnBeforeEdit", C_MODULE, "");
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

                    switch (key) {

                        case K_APLICACIONES:

                            var w_pGetItems = pGetItems().getRows();
                            ShowDocAux(Dialogs.cell(w_pGetItems.Item(lRow), KI_FC_ID).getID(), "CSCompra2.cFacturaCompra", "CSABMInterface2.cABMGeneric");

                            break;
                    }

                    return;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, "dblClick", C_MODULE, "");
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

            var pColAUpdate = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pColAUpdate(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long)
                var row = null;
                var maxVal = null;
                var bVisible = null;
                var pendiente = null;

                var w_grid = property.getGrid();
                switch (w_grid.getColumns(lCol).Key) {
                    case KI_APLICADO:
                        row = w_grid.getRows(lRow);

                        var w_pCell = Dialogs.cell(row, KI_APLICADO);

                        pendiente = Cairo.Util.val(pGetPendiente().getValue()) + Cairo.Util.val(Dialogs.cell(row, KI_APLICADO3).getValue());
                        maxVal = Cairo.Util.val(Dialogs.cell(row, KI_PENDIENTE2).getValue()) + Cairo.Util.val(Dialogs.cell(row, KI_APLICADO2).getValue());

                        if(maxVal > pendiente) {
                            maxVal = pendiente;
                        }

                        if(Cairo.Util.val(w_pCell.getValue()) > maxVal) {
                            w_pCell.setValue(maxVal);
                        }
                        else if(Cairo.Util.val(w_pCell.getValue()) < 0) {
                            w_pCell.setValue(0);
                        }

                        Dialogs.cell(row, KI_APLICADO3).getValue() === w_pCell.getValue();

                        // Actulizo el pendiente
                        var w_pCell = Dialogs.cell(row, KI_PENDIENTE);
                        w_pCell.setValue(Cairo.Util.val(Dialogs.cell(row, KI_PENDIENTE2).getValue()) + (Cairo.Util.val(Dialogs.cell(row, KI_APLICADO2).getValue()) - Cairo.Util.val(Dialogs.cell(row, KI_APLICADO).getValue())));

                        pShowPendiente();
                        break;
                }

                return true;
            };

            var pGetItemsProperty = function() {
                return m_dialog.getProperties().item(C_APLICACIONES);
            };

            var pGetItems = function() {
                return m_dialog.getProperties().item(C_APLICACIONES).getGrid();
            };

            var pColBEdit = function(property,  lRow,  lCol,  iKeyAscii) { // TODO: Use of ByRef founded Private Function pColBEdit(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer)
                switch (cABMUtil.pGetKeyFromCol(property.getGrid().getColumns(), lCol)) {
                    // Facturas
                    case KI_APLICADO:
                        break;

                    case KI_COTIZACION:
                        if(Dialogs.cell(property.getGrid().getRows(lRow), KI_COTIZACION).getValue() === "") {
                            return null;
                        }
                        break;

                    default:
                        return null;
                        break;
                }

                return true;
            };

            var pShowPendiente = function() {
                var row = null;
                var total = null;

                var _count = pGetItems().getRows().size();
                for (var _i = 0; _i < _count; _i++) {
                    row = pGetItems().getRows().item(_i);
                    total = total + Cairo.Util.val(Dialogs.cell(row, KI_APLICADO).getValue());
                }

                pGetPendiente().setValue(m_total - total);

                m_dialog.showValue(pGetPendiente());
            };

            var pGetPendiente = function() {
                return m_dialog.getProperties().item(C_PENDIENTE);
            };

            var pSave = function() {
                var _rtn = null;

                // Aplicaciones Automaticas
                //
                var bSuccess = null;
                if(pIsAutomatic(bSuccess)) {
                    //'Esta orden de pago fue generada automaticamente por una factura no se puede modificar su aplicación.
                    MsgWarning(Cairo.Language.getText(3580, ""));
                    return _rtn;
                }
                else {
                    if(!bSuccess) {
                        //'No se pudo determinar si esta orden de pago fue generada automaticamente. Vuelva a intentar gurdar la aplicación.
                        MsgWarning(Cairo.Language.getText(3581, ""));
                        return _rtn;
                    }
                }

                // Edit Apply
                //
                if(m_emp_id !== cUtil.getEmpId()) {
                    MsgApplyDisabled(m_emp_nombre);
                    return _rtn;
                }

                var register = null;

                var mouse = null;
                mouse = new cMouseWait();

                DoEvents:(DoEvents: DoEvents: DoEvents);

                register = new cRegister();
                register.setFieldId(mTesoreriaConstantes.OPG_TMPID);
                register.setTable(mTesoreriaConstantes.ORDENPAGOTMP);

                register.setId(Cairo.Constants.NEW_ID);

                register.getFields().add2(mTesoreriaConstantes.OPG_NUMERO, 0, Cairo.Constants.Types.long);
                register.getFields().add2(mTesoreriaConstantes.PROV_ID, Cairo.Constants.NO_ID, Cairo.Constants.Types.long);
                register.getFields().add2(mTesoreriaConstantes.SUC_ID, Cairo.Constants.NO_ID, Cairo.Constants.Types.long);
                register.getFields().add2(mTesoreriaConstantes.DOC_ID, Cairo.Constants.NO_ID, Cairo.Constants.Types.long);
                register.getFields().add2(C.EST_ID, Cairo.Constants.NO_ID, Cairo.Constants.Types.long);
                register.getFields().add2(mTesoreriaConstantes.OPG_ID, m_opgId, Cairo.Constants.Types.id);

                register.getFields().setHaveLastUpdate(true);
                register.getFields().setHaveWhoModify(true);

                var c_ErrorSave = null;

                //'Error al grabar la aplicación de la Orden de Pago
                c_ErrorSave = Cairo.Language.getText(2200, "");

                if(!register.beginTrans(Cairo.Database)) { return _rtn; }

                if(!Cairo.Database.save(register, , "pSave", C_MODULE, c_ErrorSave)) { return _rtn; }

                if(!pSaveItems(register.getID())) { return _rtn; }
                if(!pSaveCtaCte(register.getID())) { return _rtn; }

                if(!register.commitTrans()) { return _rtn; }

                var sqlstmt = null;
                var rs = null;

                sqlstmt = "sp_DocOrdenPagoSaveAplic "+ register.getID().toString();
                if(!Cairo.Database.openRs(sqlstmt, rs, , , , "pSave", C_MODULE, c_ErrorSave)) { return _rtn; }

                if(rs.isEOF()) { return _rtn; }

                var id = null;
                if(!GetDocIDFromRecordset(rs, id)) { return _rtn; }

                _rtn = id !== Cairo.Constants.NO_ID;

                // Edit Apply
                //
                pRefreshClient();

                return _rtn;
            };

            var pIsAutomatic = function(bSuccess) { // TODO: Use of ByRef founded Private Function pIsAutomatic(ByRef bSuccess As Boolean) As Boolean
                var fc_id = null;

                if(!Cairo.Database.getData(mTesoreriaConstantes.ORDENPAGO, mTesoreriaConstantes.OPG_ID, m_opgId, mTesoreriaConstantes.FC_ID, fc_id)) {
                    return null;
                }

                bSuccess = true;

                return fc_id !== Cairo.Constants.NO_ID;
            };

            // Edit Apply
            //
            var pRefreshClient = function() {
                // **TODO:** on error resume next found !!!
                if(m_objectClient === null) { return; }
                m_objectClient.self.refresh();
            };

            var pSaveItems = function(id) {
                var transaction = new Cairo.Database.Transaction();
                var bSave = null;
                var row = null;
                var cell = null;
                var importe = null;
                var cotizacion = null;

                var _count = pGetItems().getRows().size();
                for (var _i = 0; _i < _count; _i++) {
                    row = pGetItems().getRows().item(_i);

                    var register = new Cairo.Database.Register();
                    register.setFieldId(mTesoreriaConstantes.FC_OPG_TMPID);
                    register.setTable(mTesoreriaConstantes.FACTURACOMPRAORDENPAGOTMP);
                    register.setId(Cairo.Constants.NEW_ID);

                    bSave = false;

                    if(Cairo.Util.val(Dialogs.cell(row, KI_APLICADO).getValue())) {

                        bSave = true;

                        var _count = row.size();
                        for (var _j = 0; _j < _count; _j++) {
                            cell = row.item(_j);
                            switch (cell.getKey()) {
                                case KI_FC_ID:
                                    register.getFields().add2(mTesoreriaConstantes.FC_ID, cell.getId(), Cairo.Constants.Types.id);
                                    break;

                                case KI_FCD_ID:
                                    register.getFields().add2(mTesoreriaConstantes.FCD_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.id);
                                    break;

                                case KI_FCP_ID:
                                    register.getFields().add2(mTesoreriaConstantes.FCP_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.id);
                                    break;

                                case KI_APLICADO:
                                    importe = Cairo.Util.val(cell.getValue());
                                    register.getFields().add2(mTesoreriaConstantes.FC_OPG_IMPORTE, importe, Cairo.Constants.Types.double);
                                    break;

                                case KI_COTIZACION:
                                    cotizacion = Cairo.Util.val(cell.getValue());
                                    register.getFields().add2(mTesoreriaConstantes.FC_OPG_COTIZACION, cotizacion, Cairo.Constants.Types.double);
                                    break;
                            }
                        }
                    }

                    if(bSave) {

                        register.getFields().add2(mTesoreriaConstantes.FC_OPG_IMPORTE_ORIGEN, DivideByCero(importe, cotizacion), Cairo.Constants.Types.double);
                        register.getFields().add2(mTesoreriaConstantes.FC_OPG_ID, 0, Cairo.Constants.Types.long);
                        register.getFields().add2(mTesoreriaConstantes.OPG_ID, 0, Cairo.Constants.Types.long);
                        register.getFields().add2(mTesoreriaConstantes.OPG_TMPID, id, Cairo.Constants.Types.id);

                        register.getFields().setHaveLastUpdate(false);
                        register.getFields().setHaveWhoModify(false);

                        transaction.addRegister(register);
                    }
                }

                mainTransaction.addTransaction(transaction);

                return true;
            };

            var pSaveCtaCte = function(id) {
                var register = null;
                var vCtaCte() = null;
                var i = null;

                // Obtengo las cuentas del tercero
                if(!mCobranza.self.getCuentasDeudor(pGetItems(), vCtaCte[], KI_FC_ID, KI_APLICADO, KI_COTIZACION, 0, 0, "", 0)) { return false; }

                for (i = 1; i <= vCtaCte[].Length; i++) {

                    register = new cRegister();
                    register.setFieldId(mTesoreriaConstantes.OPGI_TMPID);
                    register.setTable(mTesoreriaConstantes.ORDENPAGOITEMTMP);
                    register.setId(Cairo.Constants.NEW_ID);

                    register.getFields().add2(mTesoreriaConstantes.CUE_ID, vCtaCte[i].cue_id, Cairo.Constants.Types.id);
                    register.getFields().add2(mTesoreriaConstantes.OPGI_IMPORTE_ORIGEN, vCtaCte[i].importeOrigen, Cairo.Constants.Types.currency);
                    register.getFields().add2(mTesoreriaConstantes.OPGI_IMPORTE, vCtaCte[i].importe, Cairo.Constants.Types.currency);

                    register.getFields().add2(mTesoreriaConstantes.OPGI_ORDEN, i, Cairo.Constants.Types.integer);
                    register.getFields().add2(mTesoreriaConstantes.OPGI_TIPO, csEOrdenPagoItemTipo.cSEOPGITCTACTE, Cairo.Constants.Types.integer);
                    register.getFields().add2(mTesoreriaConstantes.OPG_TMPID, id, Cairo.Constants.Types.id);
                    register.getFields().add2(mTesoreriaConstantes.OPGI_ID, id, Cairo.Constants.Types.long);
                    register.getFields().add2(mTesoreriaConstantes.OPGI_OTRO_TIPO, csEItemOtroTipo.cSEOTROHABER, Cairo.Constants.Types.integer);

                    register.getFields().setHaveLastUpdate(false);
                    register.getFields().setHaveWhoModify(false);

                    if(!Cairo.Database.save(register, , "pSaveCtaCte", C_MODULE, c_ErrorSave)) { return false; }
                }

                return true;
            };


            return self;
        };

        Edit.Controller = { getEditor: createObject };

    });

    Cairo.module("OrdenPagoAplic.List", function(List, Cairo, Backbone, Marionette, $, _) {
        List.Controller = {
            list: function() {

                var self = this;

                /*
                 this function will be called by the tab manager every time the
                 view must be created. when the tab is not visible the tab manager
                 will not call this function but only make the tab visible
                 */
                var createTreeDialog = function(tabId) {

                    var editors = Cairo.Editors.ordenpagoaplicEditors || Cairo.Collections.createCollection(null);
                    Cairo.Editors.ordenpagoaplicEditors = editors;

                    // ListController properties and methods
                    //
                    self.entityInfo = new Backbone.Model({
                        entitiesTitle: "OrdenPagoAplics",
                        entityName: "ordenpagoaplic",
                        entitiesName: "ordenpagoaplics"
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
                            var editor = Cairo.OrdenPagoAplic.Edit.Controller.getEditor();
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
                        if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_ORDENPAGOAPLIC)) {
                            return Cairo.Promises.resolvedPromise(false);
                        }
                        var apiPath = Cairo.Database.getAPIVersion();
                        return Cairo.Database.destroy(apiPath + "general/ordenpagoaplic", id, Cairo.Constants.DELETE_FUNCTION, "OrdenPagoAplic").success(
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
                    Cairo.LoadingMessage.show("OrdenPagoAplics", "Loading ordenpagoaplic from Crowsoft Cairo server.");

                    // create the tree region
                    //
                    Cairo.addRegions({ ordenpagoaplicTreeRegion: tabId });

                    // create the dialog
                    //
                    Cairo.Tree.List.Controller.list(
                        Cairo.Tables.ORDENPAGOAPLIC,
                        new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
                        Cairo.ordenpagoaplicTreeRegion,
                        self);

                };

                var showTreeDialog = function() {
                    Cairo.Tree.List.Controller.showTreeDialog(self);
                };

                var closeTreeDialog = function() {

                }

                // create the tab
                //
                Cairo.mainTab.showTab("OrdenPagoAplics", "ordenpagoaplicTreeRegion", "#general/ordenpagoaplics", createTreeDialog, closeTreeDialog, showTreeDialog);

            }
        };
    });


}());



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


case class OrdenpagoaplicData(
    id: Option[Int],

)

object Ordenpagoaplics extends Controller with ProvidesUser {

    val ordenpagoaplicForm = Form(
        mapping(
                "id" -> optional(number),

        )(OrdenpagoaplicData.apply)(OrdenpagoaplicData.unapply))

    implicit val ordenpagoaplicWrites = new Writes[Ordenpagoaplic] {
        def writes(ordenpagoaplic: Ordenpagoaplic) = Json.obj(
                "id" -> Json.toJson(ordenpagoaplic.id),
                C.ID -> Json.toJson(ordenpagoaplic.id),
            Json.toJson(ordenpagoaplic.)
        )
    }

    def get(id: Int) = GetAction { implicit request =>
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_ORDENPAGOAPLIC), { user =>
        Ok(Json.toJson(Ordenpagoaplic.get(user, id)))
    })
}

def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in ordenpagoaplics.update")
    ordenpagoaplicForm.bindFromRequest.fold(
        formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
    BadRequest
},
ordenpagoaplic => {
    Logger.debug(s"form: ${ordenpagoaplic.toString}")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_ORDENPAGOAPLIC), { user =>
    Ok(
        Json.toJson(
            Ordenpagoaplic.update(user,
                Ordenpagoaplic(
                    id,

                ))))
})
}
)
}

def create = PostAction { implicit request =>
    Logger.debug("in ordenpagoaplics.create")
    ordenpagoaplicForm.bindFromRequest.fold(
        formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
    BadRequest
},
ordenpagoaplic => {
    Logger.debug(s"form: ${ordenpagoaplic.toString}")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_ORDENPAGOAPLIC), { user =>
    Ok(
        Json.toJson(
            Ordenpagoaplic.create(user,
                Ordenpagoaplic(

                ))))
})
}
)
}

def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in ordenpagoaplics.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_ORDENPAGOAPLIC), { user =>
    Ordenpagoaplic.delete(user, id)
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

case class Ordenpagoaplic(
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

object Ordenpagoaplic {

    lazy val emptyOrdenpagoaplic = Ordenpagoaplic(
        0)

    def apply(
        id: Int,
) = {

        new Ordenpagoaplic(
            id,
        )
    }

    def apply(
    ) = {

        new Ordenpagoaplic(
        )
    }

    private val ordenpagoaplicParser: RowParser[Ordenpagoaplic] = {
        SqlParser.get[Int](C.ID) ~
        SqlParser.get[Double](C.) ~
        SqlParser.get[Date](DBHelper.CREATED_AT) ~
        SqlParser.get[Date](DBHelper.UPDATED_AT) ~
        SqlParser.get[Int](DBHelper.UPDATED_BY) map {
    case
        id ~
            ~
                createdAt ~
            updatedAt ~
            updatedBy =>
        Ordenpagoaplic(
            id,
            ,
            createdAt,
            updatedAt,
            updatedBy)
    }
}

def create(user: CompanyUser, ordenpagoaplic: Ordenpagoaplic): Ordenpagoaplic = {
    save(user, ordenpagoaplic, true)
}

def update(user: CompanyUser, ordenpagoaplic: Ordenpagoaplic): Ordenpagoaplic = {
    save(user, ordenpagoaplic, false)
}

private def save(user: CompanyUser, ordenpagoaplic: Ordenpagoaplic, isNew: Boolean): Ordenpagoaplic = {
    def getFields = {
        List(
            Field(C., ordenpagoaplic., FieldType.number)
            )
    }
    def throwException = {
        throw new RuntimeException(s"Error when saving ${C.ORDENPAGOAPLIC}")
}

DBHelper.saveEx(
    user,
    Register(
        C.ORDENPAGOAPLIC,
        C.ID,
        ordenpagoaplic.id,
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

def load(user: CompanyUser, id: Int): Option[Ordenpagoaplic] = {
    loadWhere(user, s"${C.ID} = {id}", 'id -> id)
}

def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
    SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.ORDENPAGOAPLIC} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
.on(args: _*)
.as(ordenpagoaplicParser.singleOpt)
}
}

def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
    try {
        SQL(s"DELETE FROM ${C.ORDENPAGOAPLIC} WHERE ${C.ID} = {id}")
    .on('id -> id)
            .executeUpdate
    } catch {
    case NonFatal(e) => {
            Logger.error(s"can't delete a ${C.ORDENPAGOAPLIC}. ${C.ID} id: $id. Error ${e.toString}")
            throw e
        }
    }
}
}

def get(user: CompanyUser, id: Int): Ordenpagoaplic = {
    load(user, id) match {
        case Some(p) => p
    case None => emptyOrdenpagoaplic
}
}
}


// Router

GET     /api/v1/general/ordenpagoaplic/:id              controllers.logged.modules.general.Ordenpagoaplics.get(id: Int)
POST    /api/v1/general/ordenpagoaplic                  controllers.logged.modules.general.Ordenpagoaplics.create
PUT     /api/v1/general/ordenpagoaplic/:id              controllers.logged.modules.general.Ordenpagoaplics.update(id: Int)
DELETE  /api/v1/general/ordenpagoaplic/:id              controllers.logged.modules.general.Ordenpagoaplics.delete(id: Int)




/**/
