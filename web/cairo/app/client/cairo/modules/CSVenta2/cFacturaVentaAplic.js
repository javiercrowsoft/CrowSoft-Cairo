(function() {
    "use strict";

    Cairo.module("FacturaVentaAplic.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

        var createObject = function() {

            var self = {};

            var getText = Cairo.Language.getText;

            var TITLE = getText(1649, ""); // Aplicación Factura de Venta
            var SAVE_ERROR_MESSAGE = getText(2220, ""); // Error al grabar la factura de venta

            var Dialogs = Cairo.Dialogs;

            var C_MODULE = "cFacturaVentaAplic";

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

            // CobranzaItemTMP
            var CSTCOBRANZAITEMTMP = "CobranzaItemTMP";
            var CSCCOBZI_TMPID = "cobziTMP_id";

            //Private Const csTCobranzaItem                            As String = "CobranzaItem"
            var CSCCOBZI_ID = "cobzi_id";
            var CSCCOBZI_ORDEN = "cobzi_orden";
            var CSCCOBZI_OTRO_TIPO = "cobzi_otroTipo";
            var CSCCOBZI_IMPORTE = "cobzi_importe";
            var CSCCOBZI_IMPORTE_ORIGEN = "cobzi_importeOrigen";
            var CSCCOBZI_TIPO = "cobzi_tipo";

            // FacturaVentaNotaCreditoTMP
            var CSTFACTURAVENTANOTACREDITOTMP = "FacturaVentaNotaCreditoTMP";
            var CSCFV_NC_TMPID = "fvncTMP_id";

            // FacturaVentaNotaCredito
            var CSTFACTURAVENTANOTACREDITO = "FacturaVentaNotaCredito";
            var CSCFV_NC_IMPORTE = "fvnc_importe";
            var CSCFV_NC_ID = "fvnc_id";
            var CSCFV_ID_NOTA_CREDITO = "fv_id_notacredito";
            var CSCFV_ID_FACTURA = "fv_id_factura";
            var CT.FVD_ID_NOTA_CREDITO = "fvd_id_notacredito";
            var CT.FVD_ID_FACTURA = "fvd_id_factura";
            var CT.FVP_ID_NOTA_CREDITO = "fvp_id_notacredito";
            var CT.FVP_ID_FACTURA = "fvp_id_factura";

            var CSCNRO_DOC = "nrodoc";
            var CSCPENDIENTE = "Pendiente";
            var CSCIMPORTE = "Importe";

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   COBRANZAS / NOTAS DE CREDITO - CONSTANTES
            //
            //////////////////////////////////////////////////////////////////////////////////////

//*TODO:** enum is translated as a new class at the end of the file Private Enum csECobranzaItemTipo

//*TODO:** enum is translated as a new class at the end of the file Private Enum csECobranzaItemOtroTipo

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   COBRANZAS / NOTAS DE CREDITO - SOLAPA
            //
            //////////////////////////////////////////////////////////////////////////////////////

            // Cobranza / Nota de credito
            var K_PENDIENTE_COBRANZA = 10;
            var K_TOTAL_COBRANZA = 11;
            var K_VENCIMIENTOS = 12;
            var K_APLIC_COBRANZA = 13;
            var C_VENCIMIENTOS = "Vencimientos";
            var C_APLICCOBRANZA = "AplicCobr";
            var C_PENDIENTECOBRANZA = "PendienteCob";
            var C_TOTALCOBRANZA = "TotalCob";

            // Grillas de Factura / Cobranza / Nota de credito
            var KIV_FVD_ID = 1;
            var KIV_FVP_ID = 2;
            var KIV_FECHA = 3;
            var KIV_APLICADO = 4;
            var KIV_APLICADO2 = 5;
            var KIV_PENDIENTE = 6;

            var KIC_FVCOBZ_ID = 1;
            var KIC_FVD_ID = 2;
            var KIC_FVP_ID = 3;
            var KIC_FV_ID = 4;
            var KIC_DOC = 5;
            var KIC_FECHA = 6;
            var KIC_COTIZACION = 7;
            var KIC_PENDIENTE = 8;
            var KIC_APLICADO = 11;
            var KIC_APLICADO2 = 12;
            var KIC_COBZ_ID = 14;
            var KIC_NRODOC = 15;
            var KIC_IDX1 = 16;
            var KIC_IDX2 = 17;
            var KIC_FVNC_ID = 18;

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   PEDIDO - SOLAPA
            //
            //////////////////////////////////////////////////////////////////////////////////////

            // Pedido / Remito

            var K_ITEMS = 20;
            var K_APLIC_PEDIDO_REMITO = 21;
            var C_ITEMS = "Items";
            var C_APLICPEDIDOREMITO = "AplicPedidoRemito";

            var K_DESAPLIC_ITEMS = 22;

            var CSCFECHA = "Fecha";
            var CSCAPLICADO = "Aplicado";

            // Grillas de Pedidos / Remitos
            var KII_FVI_ID = 1;
            var KII_PR_ID = 2;
            var KII_APLICADO = 4;
            var KII_APLICADO2 = 5;
            var KII_PENDIENTE = 6;

            var KIPR_PVFV_ID = 1;
            var KIPR_RVFV_ID = 2;
            var KIPR_PVI_ID = 3;
            var KIPR_RVI_ID = 4;
            var KIPR_DOC = 7;
            var KIPR_FECHA = 8;
            var KIPR_PENDIENTE = 9;
            var KIPR_APLICADO = 11;
            var KIPR_APLICADO2 = 12;
            var KIPR_NRODOC = 15;
            var KIPR_IDX1 = 16;
            var KIPR_IDX2 = 17;

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   COBRANZAS / NOTAS DE CREDITO
            //
            //////////////////////////////////////////////////////////////////////////////////////

            // Factura / Cobranza / Nota de credito
//*TODO:** type is translated as a new class at the end of the file Private Type T_Cobranza

//*TODO:** type is translated as a new class at the end of the file Private Type T_CobAplic

//*TODO:** type is translated as a new class at the end of the file Private Type T_CobzNC

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   PEDIDOS / REMITOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

//*TODO:** type is translated as a new class at the end of the file Private Type T_ItAplic

//*TODO:** type is translated as a new class at the end of the file Private Type T_PedidoRemito

            // pseudo-constantes
            var c_ErrorSave = "";

            // generales

            var m_editing;
            var m_dialog;
            var m_generalConfig;
            var m_fvId = 0;
            var m_isNotaCredito;
            var m_fvNumero = "";
            var m_cliente = "";
            var m_cliId = 0;
            var m_docId = 0;
            var m_sucId = 0;
            var m_total = 0;

            var m_monDefault = 0;

            var m_lastRowVto = 0;
            var m_lastRowItem = 0;

            // Edit Apply
            //
            var m_objectClient = null;
            var m_emp_id = 0;
            var m_emp_nombre = "";

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   COBRANZAS / NOTAS DE CREDITO
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var m_vCobzNC;
            var m_fvd_id = 0;
            var m_fvp_id = 0;

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   PEDIDOS / REMITOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var m_vPedidoRemito;
            var m_fvi_id = 0;

            // eventos

            // Edit Apply
            //
            self.setObjectClient = function(rhs) {
                m_objectClient = rhs;
            };

            self.getId = function() {
                return m_fvId;
            };

            // propiedades friend
            self.show = function(fvId,  total,  fvNumero,  cliId,  cliente,  sucId,  docId,  isNotaCredito) {

                if(m_dialog === null) {
                    m_dialog = new cABMGeneric();
                }

                if(m_fvId !== fvId) {
                    m_isNotaCredito = isNotaCredito;
                    m_fvId = fvId;
                    m_fvNumero = fvNumero;
                    m_cliente = cliente;
                    m_cliId = cliId;
                    m_docId = docId;
                    m_sucId = sucId;
                    m_total = total;

                    // Edit Apply
                    //
                    if(!Cairo.Database.getData(mVentaConstantes.FACTURAVENTA, mVentaConstantes.FV_ID, m_fvId, C.EMP_ID, m_emp_id)) { return false; }

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
                var abmObj = null;

                switch (messageID) {

                    case Dialogs.Message.MSG_GRID_ROW_CHANGE:
                        if(info === null) { return null; }

                        var row = null;
                        var iProp = null;
                        var aplicado = null;

                        iProp = info;

                        switch (iProp.getKey()) {

                            case K_VENCIMIENTOS:

                                abmObj = m_dialog;

                                // Guardo la aplicacion para el vencimiento editado anteriormente
                                //
                                if(m_lastRowVto !== 0) {
                                    aplicado = pCobUpdateGrids();

                                    pCobRefreshVto(aplicado);
                                }

                                // Muestro las aplicaciones para este vencimiento
                                //
                                m_lastRowVto = iProp.getSelectedIndex();
                                row = iProp.getGrid().getRows(m_lastRowVto);
                                if(row === null) { return null; }

                                pCobSetAplicVtos(pCobGetItemsCobranzaProperty(), Dialogs.cell(row, KIV_FVD_ID).getID(), Dialogs.cell(row, KIV_FVP_ID).getID());

                                abmObj.ShowValue(pCobGetItemsCobranzaProperty(), true);

                                break;

                            case K_ITEMS:

                                abmObj = m_dialog;

                                // Guardo la aplicacion para el vencimiento editado anteriormente
                                //
                                if(m_lastRowItem !== 0) {
                                    aplicado = pItUpdateGrids();
                                }

                                // Muestro las aplicaciones para este vencimiento
                                //
                                m_lastRowItem = iProp.getSelectedIndex();
                                row = iProp.getGrid().getRows(m_lastRowItem);
                                if(row === null) { return null; }

                                pItSetAplicItems(m_dialog.getProperties().item(C_APLICPEDIDOREMITO), Dialogs.cell(row, KII_FVI_ID).getID(), Dialogs.cell(row, KII_PR_ID).getID());

                                abmObj.ShowValue(m_dialog.getProperties().item(C_APLICPEDIDOREMITO), true);

                                break;
                        }
                        break;
                }

                return true;
            };

            self.discardChanges = function() {
                if(!pCobLoadAplicVtos()) { return; }
                if(!pItLoadAplicItems()) { return; }
                return Cairo.Promises.resolvedPromise(refreshCollection());
            };

            self.propertyChange = function(key) {
                switch (key) {
                    case K_DESAPLIC_ITEMS:
                        pDesAplicItems();
                        break;
                }
            };

            var pDesAplicItems = function() {
                var i = null;
                var j = null;

                for (i = 1; i <= m_vPedidoRemito.Length; i++) {
                    m_vPedidoRemito[i].aplicado = 0;
                    m_vPedidoRemito[i].pendiente = m_vPedidoRemito[i].pendienteActual + m_vPedidoRemito[i].aplicadoActual;
                    for (j = 1; j <= m_vPedidoRemito[i].vAplicaciones.Length; j++) {
                        m_vPedidoRemito[i].vAplicaciones(j).Aplicado = 0;
                    }
                }

                var abmObj = null;
                abmObj = m_dialog;

                pSetDesAplicToGrid(m_vPedidoRemito, m_dialog.getProperties().item(C_ITEMS));

                if(m_lastRowItem > 0) {
                    var property = m_dialog.getProperties().item(C_ITEMS).getGrid().getRows().item(m_lastRowItem);
                    pItSetAplicItems(m_dialog.getProperties().item(C_APLICPEDIDOREMITO), property.Item(KII_FVI_ID).self.getId(), property.Item(KII_PR_ID).self.getId());
                }

                abmObj.ShowValue(m_dialog.getProperties().item(C_ITEMS), true);
                abmObj.ShowValue(m_dialog.getProperties().item(C_APLICPEDIDOREMITO), true);
            };

            var pSetDesAplicToGrid = function(vAplic,  iProp) { // TODO: Use of ByRef founded Private Sub pSetDesAplicToGrid(ByRef vAplic() As T_PedidoRemito, ByRef iProp As cIABMProperty)
                var row = null;

                var _count = iProp.getGrid().getRows().size();
                for (var _i = 0; _i < _count; _i++) {
                    row = iProp.getGrid().getRows().item(_i);
                    Dialogs.cell(row, KII_PENDIENTE).getValue() === Cairo.Util.val(Dialogs.cell(row, KII_PENDIENTE).getValue()) + Cairo.Util.val(Dialogs.cell(row, KII_APLICADO).getValue());
                    Dialogs.cell(row, KII_APLICADO).getValue() === 0;
                }

                var i = null;
                var j = null;

                for (i = 1; i <= vAplic.Length; i++) {
                    for (j = 1; j <= vAplic.vAplicaciones.Length; j++) {
                        vAplic.Aplicado = pItAddToAplic(vAplic.vAplicaciones, 0, j);
                        vAplic.Pendiente = vAplic.PendienteActual - (vAplic.Aplicado - vAplic.AplicadoActual);
                    }
                }
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
                return "#general/facturaventaaplic/" + m_id.toString();
            };

            self.getEditorName = function() {
                var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
                return "facturaventaaplic" + id;
            };

            self.getTitle = function() {
                var _rtn = "";
                // **TODO:** on error resume next found !!!
                //'Aplicación Factura de Venta
                _rtn = Cairo.Language.getText(1649, "");
                m_dialog.setTitle(m_fvNumero+ " - "+ m_cliente);

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
                        case K_APLIC_COBRANZA:
                            _rtn = pCobColAUpdateCobranza(pCobGetItemsCobranzaProperty(), lRow, lCol);
                            break;

                        case K_APLIC_PEDIDO_REMITO:
                            _rtn = pItColAUpdatePedidoRemito(pItGetItemsPedidoRemitoProperty(), lRow, lCol);
                            break;
                    }

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
                    switch (key) {
                        case K_APLIC_COBRANZA:
                            _rtn = pCobColBEditCobranza(pCobGetItemsCobranzaProperty(), lRow, lCol, iKeyAscii);
                            break;

                        case K_APLIC_PEDIDO_REMITO:
                            _rtn = pItColBEditPedidoRemito(pItGetItemsPedidoRemitoProperty(), lRow, lCol, iKeyAscii);
                            break;
                    }
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

                        case K_APLIC_COBRANZA:

                            var w_pCobGetItemsCobranza = pCobGetItemsCobranza().getRows();
                            if(Dialogs.cell(w_pCobGetItemsCobranza.Item(lRow), KIC_COBZ_ID).getID() === Cairo.Constants.NO_ID) {
                                ShowDocAux(Dialogs.cell(w_pCobGetItemsCobranza.Item(lRow), KIC_FV_ID).getID(), "CSVenta2.cFacturaVenta", "CSABMInterface2.cABMGeneric");
                            }
                            else {
                                ShowDocAux(Dialogs.cell(w_pCobGetItemsCobranza.Item(lRow), KIC_COBZ_ID).getID(), "CSTesoreria2.cCobranza", "CSABMInterface2.cABMGeneric");
                            }

                            break;

                        case K_APLIC_PEDIDO_REMITO:

                            var w_pItGetItemsPedidoRemito = pItGetItemsPedidoRemito().getRows();

                            var id = null;
                            var objEditName = null;

                            id = Dialogs.cell(w_pItGetItemsPedidoRemito.Item(lRow), KIPR_PVI_ID).getID();

                            if(id !== Cairo.Constants.NO_ID) {
                                if(!Cairo.Database.getData("PedidoVentaItem", "pvi_id", id, "pv_id", id)) { return; }
                                objEditName = "CSPedidoVenta2.cPedidoVenta";
                            }
                            else {
                                id = Dialogs.cell(w_pItGetItemsPedidoRemito.Item(lRow), KIPR_RVI_ID).getID();
                                if(id !== Cairo.Constants.NO_ID) {
                                    if(!Cairo.Database.getData("RemitoVentaItem", "rvi_id", id, "rv_id", id)) { return; }
                                    objEditName = "CSVenta2.cRemitoVenta";
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

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   GENERICAS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pEdit = function() {
                try {

                    if(!pCobLoadAplicVtos()) { return; }
                    if(!pItLoadAplicItems()) { return; }
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
                var iTab = null;
                var oGrd = null;

                m_lastRowVto = 0;
                m_lastRowItem = 0;

                m_dialog.getProperties().clear();
                m_dialog.getTabs().clear();

                iTab = m_dialog.getTabs().add(null);
                iTab.setIndex(0);
                //'Items
                iTab.setName(Cairo.Language.getText(1371, ""));

                iTab = m_dialog.getTabs().add(null);
                iTab.setIndex(1);
                //'Vencimientos
                iTab.setName(Cairo.Language.getText(1644, ""));

                var properties = m_dialog.getProperties();

                c = properties.add(null, C_ITEMS);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();;
                if(!pItLoadItems(c)) { return false; }
                c.setKey(K_ITEMS);
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

                var elem = properties.add(null);
                elem.setType(Dialogs.PropertyType.button);
                //'Desaplicar todos
                elem.setName(Cairo.Language.getText(2523, ""));
                elem.setKey(K_DESAPLIC_ITEMS);

                c = properties.add(null, C_APLICPEDIDOREMITO);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();;
                if(!pItSetGridAplicPedidoRemito(c)) { return false; }
                c.setKey(K_APLIC_PEDIDO_REMITO);
                c.setName("PedidoRemito");
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

                // Cobranza
                c = properties.add(null, C_TOTALCOBRANZA);
                c.setType(Dialogs.PropertyType.numeric);
                c.setSubType(Dialogs.PropertySubType.money);
                c.setName("Importe facturado");
                c.setEnabled(false);
                c.setLeft(2000);
                c.setLeftLabel(-1500);
                c.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                c.setValue(m_total);
                c.setKey(K_TOTAL_COBRANZA);
                c.setWidth(1400);
                c.setTabIndex(1);

                c = properties.add(null, C_PENDIENTECOBRANZA);
                c.setType(Dialogs.PropertyType.numeric);
                c.setSubType(Dialogs.PropertySubType.money);
                c.setName("Pendiente");
                c.setEnabled(false);
                c.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                c.setKey(K_PENDIENTE_COBRANZA);
                c.setTopFromProperty(C_TOTALCOBRANZA);
                c.setLeft(6200);
                c.setWidth(1400);
                c.setLeftLabel(-1100);
                c.setTabIndex(1);

                c = properties.add(null, C_VENCIMIENTOS);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();;
                if(!pCobLoadVencimientos(c)) { return false; }
                c.setKey(K_VENCIMIENTOS);
                c.setName("Vencimientos");
                c.hideLabel();;
                c.setWidth(9400);
                c.setLeft(250);
                c.setTopToPrevious(440);
                c.setHeight(1600);
                c.setGridEditEnabled(false);
                c.setGridAddEnabled(false);
                c.setGridRemoveEnabled(false);
                c.setTabIndex(1);
                oGrd = c.getGrid();
                oGrd.setRowSelect(true);
                oGrd.setDontSelectInGotFocus(true);

                c = properties.add(null, C_APLICCOBRANZA);
                c.setType(Dialogs.PropertyType.grid);
                c.hideLabel();;
                if(!pCobSetGridAplicCobranza(c)) { return false; }
                c.setKey(K_APLIC_COBRANZA);
                c.setName("Cobranza");
                c.hideLabel();;
                c.setWidth(9400);
                c.setLeft(250);
                c.setTop(3200);
                c.setHeight(3000);
                c.setGridEditEnabled(true);
                c.setGridAddEnabled(false);
                c.setGridRemoveEnabled(false);
                oGrd = c.getGrid();
                oGrd.setRowSelect(true);
                oGrd.setDontSelectInGotFocus(true);
                c.setTabIndex(1);

                var abmObj = null;
                abmObj = m_dialog;
                abmObj.MinHeight = 7800;

                // Edit Apply
                //
                abmObj.MinWidth = 10050;

                if(!m_dialog.show(self)) { return false; }

                pCobShowPendienteCobranza();

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

                var fvTMPId = null;

                pCobUpdateGrids();
                pItUpdateGrids();

                // Temporal
                if(!pSaveDocVta(m_docId, fvTMPId)) { return _rtn; }

                // Pedidos / Remitos
                if(!pItSavePedidoRemito(fvTMPId)) { return _rtn; }

                // Notas de credito
                if(!pSaveNotaCredito(fvTMPId)) { return _rtn; }

                // Cobranzas
                if(!pSaveCobranza(fvTMPId)) { return _rtn; }

                // Aplico llamando al sp
                var sqlstmt = null;
                var rs = null;

                sqlstmt = "sp_DocFacturaVentaSaveAplic "+ fvTMPId.toString();
                if(!Cairo.Database.openRs(sqlstmt, rs, , , , "pSave", C_MODULE, c_ErrorSave)) { return _rtn; }

                if(rs.isEOF()) { return _rtn; }

                var id = null;
                if(!GetDocIDFromRecordset(rs, id)) { return _rtn; }

                if(id === Cairo.Constants.NO_ID) { return _rtn; }

                if(!pCobLoadAplicVtos()) { return _rtn; }
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
                m_objectClient.Refresh;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            // FacturaVentaTemporal
            //////////////////////////////////////////////////////////////////////////////////////
            var pSaveDocVta = function(docId,  fvTMPId) { // TODO: Use of ByRef founded Private Function pSaveDocVta(ByVal DocId As Long, ByRef FvTMPId As Long) As Boolean
                var register = null;

                register = new cRegister();
                register.setFieldId(mVentaConstantes.FV_TMPID);
                register.setTable(mVentaConstantes.FACTURAVENTATMP);

                register.setId(Cairo.Constants.NEW_ID);
                register.getFields().add2(mVentaConstantes.FV_ID, m_fvId, Cairo.Constants.Types.id);

                register.getFields().add2(mVentaConstantes.FV_NUMERO, 0, Cairo.Constants.Types.long);
                register.getFields().add2(mVentaConstantes.FV_NRODOC, "", Cairo.Constants.Types.text);

                register.getFields().add2(mVentaConstantes.CLI_ID, 0, Cairo.Constants.Types.long);
                register.getFields().add2(mVentaConstantes.SUC_ID, 0, Cairo.Constants.Types.long);
                register.getFields().add2(mVentaConstantes.DOC_ID, docId, Cairo.Constants.Types.id);
                register.getFields().add2(mVentaConstantes.CPG_ID, csECpgTipo.cSECPGT_FECHADOCUMENTO, Cairo.Constants.Types.id);

                register.getFields().add2(mVentaConstantes.FV_GRABAR_ASIENTO, 0, Cairo.Constants.Types.boolean);
                register.getFields().add2(C.EST_ID, CSGeneralEx2.csEEstado.cSEEST_PENDIENTE, Cairo.Constants.Types.id);

                register.getFields().setHaveLastUpdate(true);
                register.getFields().setHaveWhoModify(true);

                if(!register.beginTrans(Cairo.Database)) { return false; }

                if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return false; }

                if(!register.commitTrans()) { return false; }

                fvTMPId = register.getID();
                return true;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   PEDIDOS / REMITOS
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pItLoadAplicItems = function() {

                if(!pItLoadAplicAplicados()) { return false; }
                if(!pItLoadAplicCreditos()) { return false; }

                return true;
            };

            var pItLoadItems = function(propiedad) { // TODO: Use of ByRef founded Private Function pItLoadItems(ByRef Propiedad As cIABMProperty) As Boolean
                var sqlstmt = null;
                var rs = null;
                var grid = null;
                var row = null;
                var value = null;

                sqlstmt = "sp_DocFacturaVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_fvId+ ",4";
                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pItLoadItems", C_MODULE)) { return false; }

                propiedad.getGrid().getColumns().clear();
                propiedad.getGrid().getRows().clear();

                grid = propiedad.getGrid();

                var w_columns = grid.getColumns();
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KII_FVI_ID);

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

                    elem = row.add(null);D.Status.pendientenull);

                    elem = row.add(null);
                    elem.setId(Cairo.Database.valField(rs.getFields(), mVentaConstantes.FVI_ID));
                    elem.setKey(KII_FVI_ID);

                    elem = row.add(null);
                    elem.setId(Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_ID));
                    elem.setValue(Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_NOMBRE_VENTA));
                    elem.setKey(KII_PR_ID);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(rs.getFields(), mVentaConstantes.FVI_PENDIENTE));
                    elem.setKey(KII_PENDIENTE);

                    value = Cairo.Database.valField(rs.getFields(), CSCAPLICADO);
                    elem = row.add(null);
                    elem.setValue(value);
                    elem.setKey(KII_APLICADO);

                    if(value !== 0) {
                        row = f;
                        row.setBackColor(&HFFCC99);
                    }

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(rs.getFields(), CSCAPLICADO));
                    elem.setKey(KII_APLICADO2);

                    rs.MoveNext;
                }

                return true;
            };

            var pItSetGridAplicPedidoRemito = function(propiedad) { // TODO: Use of ByRef founded Private Function pItSetGridAplicPedidoRemito(ByRef Propiedad As cIABMProperty) As Boolean
                var grid = null;

                propiedad.getGrid().getColumns().clear();
                propiedad.getGrid().getRows().clear();

                grid = propiedad.getGrid();

                var w_columns = grid.getColumns();
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIPR_IDX1);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIPR_IDX2);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIPR_RVFV_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIPR_PVFV_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIPR_RVI_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIPR_PVI_ID);

                var elem = w_columns.add(null);
                //'Documento
                elem.setName(Cairo.Language.getText(1567, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(2925);
                elem.setKey(KIPR_DOC);

                var elem = w_columns.add(null);
                //'Comprobante
                elem.setName(Cairo.Language.getText(1610, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(1575);
                elem.setKey(KIPR_NRODOC);

                var elem = w_columns.add(null);
                //'Fecha
                elem.setName(Cairo.Language.getText(1569, ""));
                elem.setType(Dialogs.PropertyType.date);
                elem.setWidth(1395);
                elem.setKey(KIPR_FECHA);

                var elem = w_columns.add(null);
                //'Pendiente
                elem.setName(Cairo.Language.getText(1609, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1245);
                elem.setKey(KIPR_PENDIENTE);

                var elem = w_columns.add(null);
                //'Aplicado
                elem.setName(Cairo.Language.getText(1608, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1245);
                elem.setKey(KIPR_APLICADO);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIPR_APLICADO2);

                return true;
            };

            var pItLoadAplicAplicados = function() {
                var sqlstmt = null;
                var rs = null;
                var i = null;
                var idx = null;

                sqlstmt = "sp_DocFacturaVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_fvId+ ",5";
                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicAplicados", C_MODULE)) { return false; }

                G.redim(m_vPedidoRemito, 0);
                G.redimPreserve(0, .vAplicaciones);

                if(!rs.isEOF()) {

                    rs.MoveLast;
                    rs.MoveFirst;

                    while (!rs.isEOF()) {

                        i = pItAddToCreditos(Cairo.Database.valField(rs.getFields(), mVentaConstantes.RVI_ID), Cairo.Database.valField(rs.getFields(), mVentaConstantes.PVI_ID), idx);

                        // Documento
                        //
                        m_vPedidoRemito[i].docNombre = Cairo.Database.valField(rs.getFields(), mVentaConstantes.DOC_NAME);
                        m_vPedidoRemito[i].nroDoc = Cairo.Database.valField(rs.getFields(), CSCNRO_DOC);
                        m_vPedidoRemito[i].fecha = Cairo.Database.valField(rs.getFields(), CSCFECHA);

                        // Pendiente
                        //
                        m_vPedidoRemito[i].pendiente = Cairo.Database.valField(rs.getFields(), CSCPENDIENTE);
                        m_vPedidoRemito[i].pendienteActual = m_vPedidoRemito[i].pendiente;

                        // Pedido / Remito
                        //
                        m_vPedidoRemito[i].rvi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.RVI_ID);
                        m_vPedidoRemito[i].pvi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PVI_ID);
                        m_vPedidoRemito[i].pr_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_ID);

                        // Aplicaciones

                        vAplicaciones.rvfv_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.RV_FV_ID);
                        vAplicaciones.pvfv_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PV_FV_ID);

                        vAplicaciones.fvi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.FVI_ID);

                        vAplicaciones.Aplicado = Cairo.Database.valField(rs.getFields(), CSCAPLICADO);

                        // Aplicacion total sobre este credito
                        m_vPedidoRemito[i].aplicado = m_vPedidoRemito[i].aplicado + m_vPedidoRemito[i].vAplicaciones(idx).Aplicado;
                        m_vPedidoRemito[i].aplicadoActual = m_vPedidoRemito[i].aplicado;

                        rs.MoveNext;
                    }
                }

                return true;
            };

            var pItLoadAplicCreditos = function() {
                var sqlstmt = null;
                var rs = null;
                var i = null;

                sqlstmt = "sp_DocFacturaVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_fvId+ ",6";
                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicCreditos", C_MODULE)) { return false; }

                if(!rs.isEOF()) {

                    rs.MoveLast;
                    rs.MoveFirst;

                    i = m_vPedidoRemito.Length;
                    G.redimPreserve(m_vPedidoRemito, i + rs.RecordCount);

                    while (!rs.isEOF()) {

                        i = i + 1;
                        m_vPedidoRemito[i].pr_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_ID);
                        m_vPedidoRemito[i].rvi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.RVI_ID);
                        m_vPedidoRemito[i].pvi_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PVI_ID);

                        m_vPedidoRemito[i].docNombre = Cairo.Database.valField(rs.getFields(), mVentaConstantes.DOC_NAME);
                        m_vPedidoRemito[i].nroDoc = Cairo.Database.valField(rs.getFields(), CSCNRO_DOC);
                        m_vPedidoRemito[i].fecha = Cairo.Database.valField(rs.getFields(), CSCFECHA);

                        m_vPedidoRemito[i].pendiente = Cairo.Database.valField(rs.getFields(), CSCPENDIENTE);
                        m_vPedidoRemito[i].pendienteActual = m_vPedidoRemito[i].pendiente;

                        G.redim(m_vPedidoRemito[i].vAplicaciones, 0);

                        rs.MoveNext;
                    }
                }

                return true;
            };

            var pItAddToCreditos = function(rviId,  pviId,  idx) { // TODO: Use of ByRef founded Private Function pItAddToCreditos(ByVal RviId As Long, ByVal PviId As Long, ByRef Idx As Long) As Long
                var _rtn = 0;
                var i = null;

                for (i = 1; i <= m_vPedidoRemito.Length; i++) {
                    if((m_vPedidoRemito[i].rvi_id === rviId && rviId !== Cairo.Constants.NO_ID) || (m_vPedidoRemito[i].pvi_id === pviId && pviId !== Cairo.Constants.NO_ID)) {

                        G.redimPreserve(m_vPedidoRemito[i].vAplicaciones, m_vPedidoRemito[i].vAplicaciones.Length + 1);

                        idx = m_vPedidoRemito[i].vAplicaciones.Length;
                        _rtn = i;
                        return _rtn;
                    }
                }

                G.redimPreserve(m_vPedidoRemito, m_vPedidoRemito.Length + 1);
                G.redimPreserve(m_vPedidoRemito.Length, .vAplicaciones);
                _rtn = m_vPedidoRemito.Length;
                idx = 1;

                return _rtn;
            };

            var pItUpdateGrids = function() {
                var _rtn = 0;
                var iProp = null;
                var row = null;

                iProp = m_dialog.getProperties().item(C_ITEMS);

                if(m_lastRowItem !== 0) {

                    row = iProp.getGrid().getRows(m_lastRowItem);
                    _rtn = pItUpdateAplicItems(m_dialog.getProperties().item(C_APLICPEDIDOREMITO), Dialogs.cell(row, KII_FVI_ID).getID());
                }

                return _rtn;
            };

            var pItSetAplicItems = function(iProp,  fvi_id,  pr_id) { // TODO: Use of ByRef founded Private Function pItSetAplicItems(ByRef iProp As cIABMProperty, ByVal fvi_id As Long, ByVal pr_id As Long) As Boolean
                var cotizacion = null;
                var i = null;
                var j = null;

                iProp.getGrid().getRows().clear();

                m_fvi_id = fvi_id;

                for (i = 1; i <= m_vPedidoRemito.Length; i++) {

                    if(m_vPedidoRemito[i].pr_id === pr_id) {

                        if(m_vPedidoRemito[i].vAplicaciones.Length > 0) {
                            pItSetAplicItemsAux1(i, iProp, fvi_id);
                        }
                        else {
                            pItSetAplicItemsAux2(i, iProp);
                        }
                    }

                }

                // Ahora los creditos que tienen aplicaciones
                // pero no estan con este vencimiento y tienen pendiente
                var id = null;
                var bAplic = null;
                var row = null;

                for (i = 1; i <= m_vPedidoRemito.Length; i++) {

                    bAplic = false;

                    if(m_vPedidoRemito[i].pr_id === pr_id) {

                        var _count = iProp.getGrid().getRows().size();
                        for (var _j = 0; _j < _count; _j++) {
                            row = iProp.getGrid().getRows().item(_j);
                            id = Dialogs.cell(row, KIPR_RVI_ID).getID();
                            if(id === m_vPedidoRemito[i].rvi_id && id !== Cairo.Constants.NO_ID) {
                                bAplic = true;
                                break;
                            }

                            id = Dialogs.cell(row, KIPR_PVI_ID).getID();
                            if(id === m_vPedidoRemito[i].pvi_id && id !== Cairo.Constants.NO_ID) {
                                bAplic = true;
                                break;
                            }

                            id = m_fvi_id;
                            for (j = 1; j <= m_vPedidoRemito[i].vAplicaciones.Length; j++) {
                                if(id === m_vPedidoRemito[i].vAplicaciones(j).fvi_id && id !== Cairo.Constants.NO_ID) {
                                    bAplic = true;
                                    break;
                                }
                            }

                            if(bAplic) { break; }
                        }

                        if(!bAplic) { pItSetAplicItemsAux2(i, iProp); }
                    }
                }

                return true;
            };

            var pItUpdateAplicItems = function(propiedad,  fvi_id) { // TODO: Use of ByRef founded Private Function pItUpdateAplicItems(ByRef Propiedad As cIABMProperty, ByVal fvi_id As Long) As Double
                var cotizacion = null;
                var i = null;
                var j = null;
                var row = null;
                var aplicado = null;
                var aplicadoTotal = null;

                var _count = pItGetItemsPedidoRemito().getRows().size();
                for (var _i = 0; _i < _count; _i++) {
                    row = pItGetItemsPedidoRemito().getRows().item(_i);

                    if(Cairo.Util.val(Dialogs.cell(row, KIPR_APLICADO).getValue()) > 0 || Dialogs.cell(row, KIPR_IDX2).getID() !== 0) {

                        i = Dialogs.cell(row, KIPR_IDX1).getID();
                        j = Dialogs.cell(row, KIPR_IDX2).getID();

                        aplicado = Cairo.Util.val(Dialogs.cell(row, KIPR_APLICADO).getValue());
                        aplicadoTotal = aplicadoTotal + aplicado;

                        m_vPedidoRemito[i].aplicado = pItAddToAplic(m_vPedidoRemito[i].vAplicaciones, aplicado, j);
                        m_vPedidoRemito[i].pendiente = m_vPedidoRemito[i].pendienteActual - (m_vPedidoRemito[i].aplicado - m_vPedidoRemito[i].aplicadoActual);
                    }
                }

                return aplicadoTotal;
            };

            var pItSetAplicItemsAux1 = function(idx,  iProp,  fvi_id) { // TODO: Use of ByRef founded Private Sub pItSetAplicItemsAux1(ByVal Idx As Long, ByRef iProp As cIABMProperty, ByVal fvi_id As Long)
                var f = null;
                var fv = null;
                var i = null;
                var iPropItem = null;
                var row = null;

                for (i = 1; i <= m_vPedidoRemito[idx].vAplicaciones.Length; i++) {

                    if(m_vPedidoRemito[idx].vAplicaciones[i].fvi_id === fvi_id && fvi_id !== Cairo.Constants.NO_ID) {

                        f = iProp.getGrid().getRows().add(null);

                        elem = row.add(null);
                        elem.setId(idx);
                        elem.setKey(KIPR_IDX1);

                        elem = row.add(null);
                        elem.setId(i);
                        elem.setKey(KIPR_IDX2);

                        elem = row.add(null);
                        elem.setId(m_vPedidoRemito[idx].vAplicaciones[i].rvfv_id);
                        elem.setKey(KIPR_RVFV_ID);

                        elem = row.add(null);
                        elem.setId(m_vPedidoRemito[idx].vAplicaciones[i].pvfv_id);
                        elem.setKey(KIPR_PVFV_ID);

                        elem = row.add(null);
                        elem.setId(m_vPedidoRemito[idx].rvi_id);
                        elem.setKey(KIPR_RVI_ID);

                        elem = row.add(null);
                        elem.setId(m_vPedidoRemito[idx].pvi_id);
                        elem.setKey(KIPR_PVI_ID);

                        elem = row.add(null);
                        elem.setValue(m_vPedidoRemito[idx].docNombre);
                        elem.setKey(KIPR_DOC);

                        elem = row.add(null);
                        elem.setValue(m_vPedidoRemito[idx].nroDoc);
                        elem.setKey(KIPR_NRODOC);

                        elem = row.add(null);
                        if(m_vPedidoRemito[idx].fecha === Cairo.Constants.cSNODATE) {
                            elem.setValue("");
                        }
                        else {
                            elem.setValue(m_vPedidoRemito[idx].fecha);
                        }
                        elem.setKey(KIPR_FECHA);

                        elem = row.add(null);
                        elem.setValue(m_vPedidoRemito[idx].pendiente);
                        elem.setKey(KIPR_PENDIENTE);

                        elem = row.add(null);
                        elem.setValue(m_vPedidoRemito[idx].vAplicaciones[i].Aplicado);
                        elem.setKey(KIPR_APLICADO);

                        elem = row.add(null);
                        elem.setValue(m_vPedidoRemito[idx].vAplicaciones[i].Aplicado);
                        elem.setKey(KIPR_APLICADO2);

                        row = f;
                        row.setBackColor(&HFFCC99);
                    }
                }
            };

            var pItSetAplicItemsAux2 = function(i,  iProp) { // TODO: Use of ByRef founded Private Sub pItSetAplicItemsAux2(ByVal i As Long, ByRef iProp As cIABMProperty)
                var f = null;
                var fv = null;

                if(m_vPedidoRemito[i].pendiente <= 0) { return; }

                f = iProp.getGrid().getRows().add(null);

                elem = row.add(null);
                elem.setId(i);
                elem.setKey(KIPR_IDX1);

                elem = row.add(null);
                elem.setId(0);
                elem.setKey(KIPR_IDX2);

                elem = row.add(null);
                elem.setId(Cairo.Constants.NO_ID);
                elem.setKey(KIPR_RVFV_ID);

                elem = row.add(null);
                elem.setId(Cairo.Constants.NO_ID);
                elem.setKey(KIPR_PVFV_ID);

                elem = row.add(null);
                elem.setId(m_vPedidoRemito[i].rvi_id);
                elem.setKey(KIPR_RVI_ID);

                elem = row.add(null);
                elem.setId(m_vPedidoRemito[i].pvi_id);
                elem.setKey(KIPR_PVI_ID);

                elem = row.add(null);
                elem.setValue(m_vPedidoRemito[i].docNombre);
                elem.setKey(KIPR_DOC);

                elem = row.add(null);
                elem.setValue(m_vPedidoRemito[i].nroDoc);
                elem.setKey(KIPR_NRODOC);

                elem = row.add(null);
                if(m_vPedidoRemito[i].fecha === Cairo.Constants.cSNODATE) {
                    elem.setValue("");
                }
                else {
                    elem.setValue(m_vPedidoRemito[i].fecha);
                }
                elem.setKey(KIPR_FECHA);

                elem = row.add(null);
                elem.setValue(m_vPedidoRemito[i].pendiente);
                elem.setKey(KIPR_PENDIENTE);

                elem = row.add(null);
                elem.setValue(0);
                elem.setKey(KIPR_APLICADO);

                elem = row.add(null);
                elem.setValue(0);
                elem.setKey(KIPR_APLICADO2);
            };

            var pItAddToAplic = function(vAplicaciones,  importe,  idx) { // TODO: Use of ByRef founded Private Function pItAddToAplic(ByRef vAplicaciones() As T_ItAplic, ByVal Importe As Double, ByVal Idx As Long) As Double
                var i = null;
                var rtn = null;

                if(idx === 0) {
                    G.redimPreserve(vAplicaciones, vAplicaciones.Length + 1);
                    idx = vAplicaciones.Length;
                    vAplicaciones.fvi_id = m_fvi_id;
                }

                vAplicaciones(idx).Aplicado = importe;

                for (i = 1; i <= vAplicaciones.Length; i++) {
                    rtn = rtn + vAplicaciones(i).Aplicado;
                }

                return rtn;
            };

            var pItGetItemsItemsProperty = function() {
                return m_dialog.getProperties().item(C_ITEMS);
            };

            var pItGetItemsPedidoRemitoProperty = function() {
                return m_dialog.getProperties().item(C_APLICPEDIDOREMITO);
            };

            var pItGetItemsPedidoRemito = function() {
                return m_dialog.getProperties().item(C_APLICPEDIDOREMITO).getGrid();
            };

            var pItColBEditPedidoRemito = function(property,  lRow,  lCol,  iKeyAscii) { // TODO: Use of ByRef founded Private Function pItColBEditPedidoRemito(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer)
                switch (cABMUtil.pGetKeyFromCol(property.getGrid().getColumns(), lCol)) {
                    case KIPR_APLICADO:
                        break;

                    default:
                        return null;
                        break;
                }

                return true;
            };

            var pItGetItemPendiente = function() {
                var iProp = null;
                iProp = m_dialog.getProperties().item(C_ITEMS);
                return Dialogs.cell(iProp.getGrid().getRows(iProp.getSelectedIndex()), KII_PENDIENTE);
            };

            var pItGetItemAplicado = function() {
                var iProp = null;
                iProp = m_dialog.getProperties().item(C_ITEMS);
                return Dialogs.cell(iProp.getGrid().getRows(iProp.getSelectedIndex()), KII_APLICADO2);
            };

            var pItColAUpdatePedidoRemito = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pItColAUpdatePedidoRemito(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long)
                var row = null;
                var maxVal = null;
                var bVisible = null;
                var pendiente = null;

                var w_grid = property.getGrid();
                switch (w_grid.getColumns(lCol).Key) {
                    case KIPR_APLICADO:
                        row = w_grid.getRows(lRow);

                        var w_pCell = Dialogs.cell(row, KIPR_APLICADO);

                        pendiente = Cairo.Util.val(pItGetItemPendiente().getValue()) + Cairo.Util.val(Dialogs.cell(row, KIPR_APLICADO2).getValue());
                        maxVal = Cairo.Util.val(Dialogs.cell(row, KIPR_PENDIENTE).getValue()) + Cairo.Util.val(Dialogs.cell(row, KIPR_APLICADO2).getValue());

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
                        var w_pCell = Dialogs.cell(row, KIPR_PENDIENTE);
                        w_pCell.setValue(Cairo.Util.val(w_pCell.getValue()) + Cairo.Util.val(Dialogs.cell(row, KIPR_APLICADO2).getValue()) - Cairo.Util.val(Dialogs.cell(row, KIPR_APLICADO).getValue()));
                        Dialogs.cell(row, KIPR_APLICADO2).getValue() === Dialogs.cell(row, KIPR_APLICADO).getValue();
                        break;
                }

                return true;
            };

            var pItGetAplicado = function() {
                var row = null;
                var rtn = null;

                var _count = m_dialog.getProperties().item(C_APLICPEDIDOREMITO).getGrid().getRows().size();
                for (var _i = 0; _i < _count; _i++) {
                    row = m_dialog.getProperties().item(C_APLICPEDIDOREMITO).getGrid().getRows().item(_i);
                    rtn = rtn + Cairo.Util.val(Dialogs.cell(row, KIPR_APLICADO).getValue());
                }
                return rtn;
            };

            var pItRefreshItem = function(aplicado) {
                var iProp = null;
                var abmObj = null;
                var row = null;
                var aplicadoActual = null;

                abmObj = m_dialog;
                iProp = m_dialog.getProperties().item(C_ITEMS);
                row = iProp.getGrid().getRows(m_lastRowItem);

                Dialogs.cell(row, KII_APLICADO).getValue() === aplicado;
                aplicadoActual = Cairo.Util.val(Dialogs.cell(row, KII_APLICADO2).getValue());

                var w_pCell = Dialogs.cell(row, KII_PENDIENTE);
                w_pCell.setValue(w_pCell.getValue() - (aplicado - aplicadoActual));

                Dialogs.cell(row, KII_APLICADO2).getValue() === aplicado;

                abmObj.ShowCellValue(iProp, m_lastRowItem, D.getCol(iProp.getGrid().getColumns(), KII_PENDIENTE));
                abmObj.ShowCellValue(iProp, m_lastRowItem, D.getCol(iProp.getGrid().getColumns(), KII_APLICADO));
            };

            var pItSavePedidoRemito = function(fvTMPId) {
                if(!pItSavePedido(fvTMPId)) { return false; }
                if(!pItSaveRemito(fvTMPId)) { return false; }
                return true;
            };

            var pItSavePedido = function(fvTMPId) {
                var register = null;
                var i = null;
                var j = null;

                for (i = 1; i <= m_vPedidoRemito.Length; i++) {

                    if(m_vPedidoRemito[i].pvi_id !== Cairo.Constants.NO_ID) {

                        for (j = 1; j <= m_vPedidoRemito[i].vAplicaciones.Length; j++) {

                            if(m_vPedidoRemito[i].vAplicaciones(j).fvi_id !== Cairo.Constants.NO_ID) {

                                if(m_vPedidoRemito[i].vAplicaciones[j].Aplicado > 0) {

                                    register = new cRegister();
                                    register.setFieldId(mVentaConstantes.PV_FV_TMPID);
                                    register.setTable(mVentaConstantes.PEDIDOFACTURAVENTATMP);
                                    register.setId(Cairo.Constants.NEW_ID);

                                    register.getFields().add2(mVentaConstantes.FV_TMPID, fvTMPId, Cairo.Constants.Types.id);
                                    register.getFields().add2(mVentaConstantes.PVI_ID, m_vPedidoRemito[i].pvi_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(mVentaConstantes.FVI_ID, m_vPedidoRemito[i].vAplicaciones[j].fvi_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(mVentaConstantes.PV_FV_CANTIDAD, m_vPedidoRemito[i].vAplicaciones[j].Aplicado, Cairo.Constants.Types.double);

                                    register.getFields().add2(mVentaConstantes.PV_FV_ID, m_vPedidoRemito[i].vAplicaciones[j].pvfv_id, Cairo.Constants.Types.long);

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

            var pItSaveRemito = function(fvTMPId) {
                var register = null;
                var i = null;
                var j = null;

                for (i = 1; i <= m_vPedidoRemito.Length; i++) {

                    if(m_vPedidoRemito[i].rvi_id !== Cairo.Constants.NO_ID) {

                        for (j = 1; j <= m_vPedidoRemito[i].vAplicaciones.Length; j++) {

                            if(m_vPedidoRemito[i].vAplicaciones(j).fvi_id !== Cairo.Constants.NO_ID) {

                                if(m_vPedidoRemito[i].vAplicaciones[j].Aplicado > 0) {

                                    register = new cRegister();
                                    register.setFieldId(mVentaConstantes.RV_FV_TMPID);
                                    register.setTable(mVentaConstantes.REMITOFACTURAVENTATMP);
                                    register.setId(Cairo.Constants.NEW_ID);

                                    register.getFields().add2(mVentaConstantes.FV_TMPID, fvTMPId, Cairo.Constants.Types.id);
                                    register.getFields().add2(mVentaConstantes.RVI_ID, m_vPedidoRemito[i].rvi_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(mVentaConstantes.FVI_ID, m_vPedidoRemito[i].vAplicaciones[j].fvi_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(mVentaConstantes.RV_FV_CANTIDAD, m_vPedidoRemito[i].vAplicaciones[j].Aplicado, Cairo.Constants.Types.double);

                                    register.getFields().add2(mVentaConstantes.RV_FV_ID, m_vPedidoRemito[i].vAplicaciones[j].rvfv_id, Cairo.Constants.Types.long);

                                    register.getFields().setHaveLastUpdate(false);
                                    register.getFields().setHaveWhoModify(false);

                                    if(!Cairo.Database.save(register, , "pItSaveRemito", C_MODULE, c_ErrorSave)) { return false; }
                                }
                            }
                        }
                    }
                }

                return true;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   COBRANZAS / NOTAS DE CREDITO
            //
            //////////////////////////////////////////////////////////////////////////////////////

            var pCobLoadAplicVtos = function() {

                if(!pCobLoadAplicAplicados()) { return false; }
                if(!pCobLoadAplicCreditos()) { return false; }

                return true;
            };

            var pCobLoadAplicAplicados = function() {
                var sqlstmt = null;
                var rs = null;
                var i = null;
                var idx = null;

                sqlstmt = "sp_DocFacturaVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_fvId+ ",2";
                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicAplicados", C_MODULE)) { return false; }

                G.redim(m_vCobzNC, 0);
                G.redimPreserve(0, .vAplicaciones);

                if(!rs.isEOF()) {

                    rs.MoveLast;
                    rs.MoveFirst;

                    while (!rs.isEOF()) {

                        i = pCobAddToCreditos(Cairo.Database.valField(rs.getFields(), CT.COBZ_ID), Cairo.Database.valField(rs.getFields(), CT.FVD_ID), Cairo.Database.valField(rs.getFields(), CT.FVP_ID), idx);

                        // Documento
                        //
                        m_vCobzNC[i].docNombre = Cairo.Database.valField(rs.getFields(), mVentaConstantes.DOC_NAME);
                        m_vCobzNC[i].nroDoc = Cairo.Database.valField(rs.getFields(), CSCNRO_DOC);

                        // Pendiente
                        //
                        m_vCobzNC[i].pendiente = Cairo.Database.valField(rs.getFields(), CSCPENDIENTE);
                        m_vCobzNC[i].pendienteActual = m_vCobzNC[i].pendiente;

                        // Factura o Nota de credito
                        //
                        m_vCobzNC[i].fv_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.FV_ID);

                        m_vCobzNC[i].fvp_id = Cairo.Database.valField(rs.getFields(), "fvp_id2");
                        m_vCobzNC[i].fvd_id = Cairo.Database.valField(rs.getFields(), "fvd_id2");

                        // Cobranza
                        //
                        m_vCobzNC[i].cobz_id = Cairo.Database.valField(rs.getFields(), CT.COBZ_ID);
                        m_vCobzNC[i].fecha = Cairo.Database.valField(rs.getFields(), CT.COBZ_FECHA);
                        m_vCobzNC[i].cotizacion = Cairo.Database.valField(rs.getFields(), CT.FV_COBZ_COTIZACION);

                        // Aplicaciones

                        vAplicaciones.fvcobz_id = Cairo.Database.valField(rs.getFields(), CT.FV_COBZ_ID);
                        vAplicaciones.fvnc_id = Cairo.Database.valField(rs.getFields(), CSCFV_NC_ID);

                        vAplicaciones.fvp_id = Cairo.Database.valField(rs.getFields(), CT.FVP_ID);
                        vAplicaciones.fvd_id = Cairo.Database.valField(rs.getFields(), CT.FVD_ID);

                        vAplicaciones.Aplicado = Cairo.Database.valField(rs.getFields(), CSCAPLICADO);

                        // Aplicacion total sobre este credito
                        m_vCobzNC[i].aplicado = m_vCobzNC[i].aplicado + m_vCobzNC[i].vAplicaciones(idx).Aplicado;
                        m_vCobzNC[i].aplicadoActual = m_vCobzNC[i].aplicado;

                        rs.MoveNext;
                    }
                }

                return true;
            };

            var pCobLoadVencimientos = function(propiedad) { // TODO: Use of ByRef founded Private Function pCobLoadVencimientos(ByRef Propiedad As cIABMProperty) As Boolean
                var sqlstmt = null;
                var rs = null;
                var grid = null;
                var row = null;
                var value = null;

                sqlstmt = "sp_DocFacturaVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_fvId+ ",1";
                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplic", C_MODULE)) { return false; }

                propiedad.getGrid().getColumns().clear();
                propiedad.getGrid().getRows().clear();

                grid = propiedad.getGrid();

                var w_columns = grid.getColumns();
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIV_FVD_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIV_FVP_ID);

                var elem = w_columns.add(null);
                //'Fecha
                elem.setName(Cairo.Language.getText(1569, ""));
                elem.setType(Dialogs.PropertyType.date);
                elem.setWidth(1395);
                elem.setKey(KIV_FECHA);

                var elem = w_columns.add(null);
                //'Pendiente
                elem.setName(Cairo.Language.getText(1609, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1245);
                elem.setKey(KIV_PENDIENTE);

                var elem = w_columns.add(null);
                //'Aplicado
                elem.setName(Cairo.Language.getText(1608, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1245);
                elem.setKey(KIV_APLICADO);

                var elem = w_columns.add(null);
                elem.setType(Dialogs.PropertyType.text);
                elem.setVisible(false);
                elem.setKey(KIV_APLICADO2);

                var f = null;
                var fv = null;

                while (!rs.isEOF()) {

                    elem = row.add(null);D.Status.pendientenull);

                    elem = row.add(null);
                    elem.setId(Cairo.Database.valField(rs.getFields(), CT.FVD_ID));
                    elem.setKey(KIV_FVD_ID);

                    elem = row.add(null);
                    elem.setId(Cairo.Database.valField(rs.getFields(), CT.FVP_ID));
                    elem.setKey(KIV_FVP_ID);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(rs.getFields(), CSCFECHA));
                    elem.setKey(KIV_FECHA);

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(rs.getFields(), CSCPENDIENTE));
                    elem.setKey(KIV_PENDIENTE);

                    value = Cairo.Database.valField(rs.getFields(), CSCIMPORTE);
                    elem = row.add(null);
                    elem.setValue(value);
                    elem.setKey(KIV_APLICADO);

                    if(value !== 0) {
                        row = f;
                        row.setBackColor(&HFFCC99);
                    }

                    elem = row.add(null);
                    elem.setValue(Cairo.Database.valField(rs.getFields(), CSCIMPORTE));
                    elem.setKey(KIV_APLICADO2);

                    rs.MoveNext;
                }

                return true;
            };

            var pCobLoadAplicCreditos = function() {
                var sqlstmt = null;
                var rs = null;
                var i = null;

                sqlstmt = "sp_DocFacturaVentaGetAplic "+ cUtil.getEmpId().toString()+ ","+ m_fvId+ ",3";
                if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicCreditos", C_MODULE)) { return false; }

                if(!rs.isEOF()) {

                    rs.MoveLast;
                    rs.MoveFirst;

                    i = m_vCobzNC.Length;
                    G.redimPreserve(m_vCobzNC, i + rs.RecordCount);

                    while (!rs.isEOF()) {

                        i = i + 1;
                        m_vCobzNC[i].cobz_id = Cairo.Database.valField(rs.getFields(), CT.COBZ_ID);
                        m_vCobzNC[i].fv_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.FV_ID);
                        m_vCobzNC[i].fvd_id = Cairo.Database.valField(rs.getFields(), CT.FVD_ID);

                        m_vCobzNC[i].docNombre = Cairo.Database.valField(rs.getFields(), mVentaConstantes.DOC_NAME);
                        m_vCobzNC[i].nroDoc = Cairo.Database.valField(rs.getFields(), CSCNRO_DOC);

                        m_vCobzNC[i].fecha = Cairo.Database.valField(rs.getFields(), CSCFECHA);
                        m_vCobzNC[i].pendiente = Cairo.Database.valField(rs.getFields(), CSCPENDIENTE);
                        m_vCobzNC[i].pendienteActual = m_vCobzNC[i].pendiente;

                        G.redim(m_vCobzNC[i].vAplicaciones, 0);

                        rs.MoveNext;
                    }
                }

                return true;
            };

            var pCobSetGridAplicCobranza = function(propiedad) { // TODO: Use of ByRef founded Private Function pCobSetGridAplicCobranza(ByRef Propiedad As cIABMProperty) As Boolean
                var grid = null;

                propiedad.getGrid().getColumns().clear();
                propiedad.getGrid().getRows().clear();

                grid = propiedad.getGrid();

                var w_columns = grid.getColumns();
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIC_IDX1);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIC_IDX2);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIC_FVCOBZ_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIC_FVNC_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIC_COBZ_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIC_FV_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIC_FVD_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIC_FVP_ID);

                var elem = w_columns.add(null);
                //'Documento
                elem.setName(Cairo.Language.getText(1567, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(2925);
                elem.setKey(KIC_DOC);

                var elem = w_columns.add(null);
                //'Comprobante
                elem.setName(Cairo.Language.getText(1610, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(1575);
                elem.setKey(KIC_NRODOC);

                var elem = w_columns.add(null);
                //'Fecha"
                elem.setName(Cairo.Language.getText(1569, ""));
                elem.setType(Dialogs.PropertyType.date);
                elem.setWidth(1395);
                elem.setKey(KIC_FECHA);

                var elem = w_columns.add(null);
                //'Pendiente
                elem.setName(Cairo.Language.getText(1609, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1245);
                elem.setKey(KIC_PENDIENTE);

                var elem = w_columns.add(null);
                //'Aplicado
                elem.setName(Cairo.Language.getText(1608, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1245);
                elem.setKey(KIC_APLICADO);

                var elem = w_columns.add(null);
                //'Cotiz.
                elem.setName(Cairo.Language.getText(1650, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setFormat(m_generalConfig.getFormatDecCotizacion());
                elem.setWidth(920);
                elem.setKey(KIC_COTIZACION);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIC_APLICADO2);

                return true;
            };

            var pCobAddToCreditos = function(cobzId,  fvdId,  fvpId,  idx) { // TODO: Use of ByRef founded Private Function pCobAddToCreditos(ByVal CobzId As Long, ByVal FvdId As Long, ByVal FvpId As Long, ByRef Idx As Long) As Long
                var _rtn = 0;
                var i = null;

                for (i = 1; i <= m_vCobzNC.Length; i++) {
                    if((m_vCobzNC[i].cobz_id === cobzId && cobzId !== Cairo.Constants.NO_ID) || (m_vCobzNC[i].fvd_id === fvdId && fvdId !== Cairo.Constants.NO_ID) || (m_vCobzNC[i].fvp_id === fvpId && fvpId !== Cairo.Constants.NO_ID)) {

                        G.redimPreserve(m_vCobzNC[i].vAplicaciones, m_vCobzNC[i].vAplicaciones.Length + 1);

                        idx = m_vCobzNC[i].vAplicaciones.Length;
                        _rtn = i;
                        return _rtn;
                    }
                }

                G.redimPreserve(m_vCobzNC, m_vCobzNC.Length + 1);
                G.redimPreserve(m_vCobzNC.Length, .vAplicaciones);
                _rtn = m_vCobzNC.Length;
                idx = 1;

                return _rtn;
            };

            var pCobSetAplicVtos = function(iProp,  fvd_id,  fvp_id) { // TODO: Use of ByRef founded Private Function pCobSetAplicVtos(ByRef iProp As cIABMProperty, ByVal fvd_id As Long, ByVal fvp_id As Long) As Boolean
                var cotizacion = null;
                var i = null;
                var j = null;

                iProp.getGrid().getRows().clear();

                m_fvd_id = fvd_id;
                m_fvp_id = fvp_id;

                for (i = 1; i <= m_vCobzNC.Length; i++) {

                    if(m_vCobzNC[i].vAplicaciones.Length > 0) {
                        pCobSetAplicVtosAux1(i, iProp, fvd_id, fvp_id);
                    }
                    else {
                        pCobSetAplicVtosAux2(i, iProp);
                    }

                }

                // Ahora los creditos que tienen aplicaciones
                // pero no estan con este vencimiento y tienen pendiente
                var id = null;
                var bAplic = null;
                var row = null;

                for (i = 1; i <= m_vCobzNC.Length; i++) {

                    bAplic = false;

                    var _count = iProp.getGrid().getRows().size();
                    for (var _j = 0; _j < _count; _j++) {
                        row = iProp.getGrid().getRows().item(_j);
                        id = Dialogs.cell(row, KIC_COBZ_ID).getID();
                        if(id === m_vCobzNC[i].cobz_id && id !== Cairo.Constants.NO_ID) {
                            bAplic = true;
                            break;
                        }

                        id = Dialogs.cell(row, KIC_FVD_ID).getID();
                        if(id === m_vCobzNC[i].fvd_id && id !== Cairo.Constants.NO_ID) {
                            bAplic = true;
                            break;
                        }

                        id = Dialogs.cell(row, KIC_FVP_ID).getID();
                        if(id === m_vCobzNC[i].fvp_id && id !== Cairo.Constants.NO_ID) {
                            bAplic = true;
                            break;
                        }

                        for (j = 1; j <= m_vCobzNC[i].vAplicaciones.Length; j++) {

                            id = Dialogs.cell(row, KIC_FVD_ID).getID();
                            if(id === m_vCobzNC[i].vAplicaciones(j).fvd_id && id !== Cairo.Constants.NO_ID) {
                                bAplic = true;
                                break;
                            }

                            id = Dialogs.cell(row, KIC_FVP_ID).getID();
                            if(id === m_vCobzNC[i].vAplicaciones(j).fvp_id && id !== Cairo.Constants.NO_ID) {
                                bAplic = true;
                                break;
                            }
                        }

                        if(bAplic) { break; }
                    }

                    if(!bAplic) { pCobSetAplicVtosAux2(i, iProp); }

                }

                return true;
            };

            var pCobSetAplicVtosAux1 = function(idx,  iProp,  fvd_id,  fvp_id) { // TODO: Use of ByRef founded Private Sub pCobSetAplicVtosAux1(ByVal Idx As Long, ByRef iProp As cIABMProperty, ByVal fvd_id As Long, ByVal fvp_id As Long)

                var f = null;
                var fv = null;
                var i = null;
                var iPropVto = null;
                var row = null;

                for (i = 1; i <= m_vCobzNC[idx].vAplicaciones.Length; i++) {

                    if((m_vCobzNC[idx].vAplicaciones[i].fvd_id === fvd_id && fvd_id !== Cairo.Constants.NO_ID) || (m_vCobzNC[idx].vAplicaciones[i].fvp_id === fvp_id && fvp_id !== Cairo.Constants.NO_ID)) {

                        f = iProp.getGrid().getRows().add(null);

                        elem = row.add(null);
                        elem.setId(idx);
                        elem.setKey(KIC_IDX1);

                        elem = row.add(null);
                        elem.setId(i);
                        elem.setKey(KIC_IDX2);

                        elem = row.add(null);
                        elem.setId(m_vCobzNC[idx].vAplicaciones[i].fvcobz_id);
                        elem.setKey(KIC_FVCOBZ_ID);

                        elem = row.add(null);
                        elem.setId(m_vCobzNC[idx].vAplicaciones[i].fvnc_id);
                        elem.setKey(KIC_FVNC_ID);

                        elem = row.add(null);
                        elem.setId(m_vCobzNC[idx].cobz_id);
                        elem.setKey(KIC_COBZ_ID);

                        elem = row.add(null);
                        elem.setId(m_vCobzNC[idx].fv_id);
                        elem.setKey(KIC_FV_ID);

                        elem = row.add(null);
                        elem.setId(m_vCobzNC[idx].vAplicaciones[i].fvd_id);
                        elem.setKey(KIC_FVD_ID);

                        elem = row.add(null);
                        elem.setId(m_vCobzNC[idx].vAplicaciones[i].fvp_id);
                        elem.setKey(KIC_FVP_ID);

                        elem = row.add(null);
                        elem.setValue(m_vCobzNC[idx].docNombre);
                        elem.setKey(KIC_DOC);

                        elem = row.add(null);
                        elem.setValue(m_vCobzNC[idx].nroDoc);
                        elem.setKey(KIC_NRODOC);

                        elem = row.add(null);
                        if(m_vCobzNC[idx].fecha === Cairo.Constants.cSNODATE) {
                            elem.setValue("");
                        }
                        else {
                            elem.setValue(m_vCobzNC[idx].fecha);
                        }
                        elem.setKey(KIC_FECHA);

                        elem = row.add(null);
                        elem.setValue(m_vCobzNC[idx].pendiente);
                        elem.setKey(KIC_PENDIENTE);

                        elem = row.add(null);
                        elem.setValue(m_vCobzNC[idx].vAplicaciones[i].Aplicado);
                        elem.setKey(KIC_APLICADO);

                        elem = row.add(null);
                        if(m_vCobzNC[idx].cotizacion !== 0) {
                            elem.setValue(m_vCobzNC[idx].cotizacion);
                        }
                        elem.setKey(KIC_COTIZACION);

                        elem = row.add(null);
                        elem.setValue(m_vCobzNC[idx].vAplicaciones[i].Aplicado);
                        elem.setKey(KIC_APLICADO2);

                        row = f;
                        row.setBackColor(&HFFCC99);
                    }
                }
            };

            var pCobSetAplicVtosAux2 = function(i,  iProp) { // TODO: Use of ByRef founded Private Sub pCobSetAplicVtosAux2(ByVal i As Long, ByRef iProp As cIABMProperty)
                var f = null;
                var fv = null;

                if(m_vCobzNC[i].pendiente <= 0) { return; }

                f = iProp.getGrid().getRows().add(null);

                elem = row.add(null);
                elem.setId(i);
                elem.setKey(KIC_IDX1);

                elem = row.add(null);
                elem.setId(0);
                elem.setKey(KIC_IDX2);

                elem = row.add(null);
                elem.setId(Cairo.Constants.NO_ID);
                elem.setKey(KIC_FVCOBZ_ID);

                elem = row.add(null);
                elem.setId(Cairo.Constants.NO_ID);
                elem.setKey(KIC_FVNC_ID);

                elem = row.add(null);
                elem.setId(m_vCobzNC[i].cobz_id);
                elem.setKey(KIC_COBZ_ID);

                elem = row.add(null);
                elem.setId(m_vCobzNC[i].fv_id);
                elem.setKey(KIC_FV_ID);

                elem = row.add(null);
                elem.setId(m_vCobzNC[i].fvd_id);
                elem.setKey(KIC_FVD_ID);

                elem = row.add(null);
                elem.setId(Cairo.Constants.NO_ID);
                elem.setKey(KIC_FVP_ID);

                elem = row.add(null);
                elem.setValue(m_vCobzNC[i].docNombre);
                elem.setKey(KIC_DOC);

                elem = row.add(null);
                elem.setValue(m_vCobzNC[i].nroDoc);
                elem.setKey(KIC_NRODOC);

                elem = row.add(null);
                if(m_vCobzNC[i].fecha === Cairo.Constants.cSNODATE) {
                    elem.setValue("");
                }
                else {
                    elem.setValue(m_vCobzNC[i].fecha);
                }
                elem.setKey(KIC_FECHA);

                elem = row.add(null);
                elem.setValue(m_vCobzNC[i].pendiente);
                elem.setKey(KIC_PENDIENTE);

                elem = row.add(null);
                elem.setValue(0);
                elem.setKey(KIC_APLICADO);

                elem = row.add(null);
                elem.setKey(KIC_COTIZACION);

                elem = row.add(null);
                elem.setValue(0);
                elem.setKey(KIC_APLICADO2);
            };

            var pCobUpdateAplicVtos = function(propiedad,  fvd_id,  fvp_id) { // TODO: Use of ByRef founded Private Function pCobUpdateAplicVtos(ByRef Propiedad As cIABMProperty, ByVal fvd_id As Long, ByVal fvp_id As Long) As Double
                var cotizacion = null;
                var i = null;
                var j = null;
                var row = null;
                var aplicado = null;
                var aplicadoTotal = null;

                var _count = pCobGetItemsCobranza().getRows().size();
                for (var _i = 0; _i < _count; _i++) {
                    row = pCobGetItemsCobranza().getRows().item(_i);

                    if(Cairo.Util.val(Dialogs.cell(row, KIC_APLICADO).getValue()) > 0 || Dialogs.cell(row, KIC_IDX2).getID() !== 0) {

                        i = Dialogs.cell(row, KIC_IDX1).getID();
                        j = Dialogs.cell(row, KIC_IDX2).getID();

                        aplicado = Cairo.Util.val(Dialogs.cell(row, KIC_APLICADO).getValue());
                        aplicadoTotal = aplicadoTotal + aplicado;

                        m_vCobzNC[i].aplicado = pCobAddToAplic(m_vCobzNC[i].vAplicaciones, aplicado, j);
                        m_vCobzNC[i].pendiente = m_vCobzNC[i].pendienteActual - (m_vCobzNC[i].aplicado - m_vCobzNC[i].aplicadoActual);
                    }
                }

                return aplicadoTotal;
            };

            var pCobAddToAplic = function(vAplicaciones,  importe,  idx) { // TODO: Use of ByRef founded Private Function pCobAddToAplic(ByRef vAplicaciones() As T_CobAplic, ByVal Importe As Double, ByVal Idx As Long) As Double
                var i = null;
                var rtn = null;

                if(idx === 0) {
                    G.redimPreserve(vAplicaciones, vAplicaciones.Length + 1);
                    idx = vAplicaciones.Length;
                    vAplicaciones.fvd_id = m_fvd_id;
                    vAplicaciones.fvp_id = m_fvp_id;
                }

                vAplicaciones(idx).Aplicado = importe;

                for (i = 1; i <= vAplicaciones.Length; i++) {
                    rtn = rtn + vAplicaciones(i).Aplicado;
                }

                return rtn;
            };

            var pCobGetVtoPendiente = function() {
                var iProp = null;
                iProp = m_dialog.getProperties().item(C_VENCIMIENTOS);
                return Dialogs.cell(iProp.getGrid().getRows(iProp.getSelectedIndex()), KIV_PENDIENTE);
            };

            var pCobGetVtoAplicado = function() {
                var iProp = null;
                iProp = m_dialog.getProperties().item(C_VENCIMIENTOS);
                return Dialogs.cell(iProp.getGrid().getRows(iProp.getSelectedIndex()), KIV_APLICADO2);
            };

            var pCobColAUpdateCobranza = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pCobColAUpdateCobranza(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long)
                var row = null;
                var maxVal = null;
                var bVisible = null;
                var pendiente = null;

                var w_grid = property.getGrid();
                switch (w_grid.getColumns(lCol).Key) {
                    case KIC_APLICADO:
                        row = w_grid.getRows(lRow);

                        var w_pCell = Dialogs.cell(row, KIC_APLICADO);

                        pendiente = Cairo.Util.val(pCobGetVtoPendiente().getValue()) + Cairo.Util.val(Dialogs.cell(row, KIC_APLICADO2).getValue());
                        maxVal = Cairo.Util.val(Dialogs.cell(row, KIC_PENDIENTE).getValue()) + Cairo.Util.val(Dialogs.cell(row, KIC_APLICADO2).getValue());

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
                        aplicado = pCobGetAplicado();
                        pCobRefreshVto(aplicado);
                        pCobGetVtoAplicado().setValue(aplicado);

                        // Actulizo el pendiente
                        var w_pCell = Dialogs.cell(row, KIC_PENDIENTE);
                        w_pCell.setValue(Cairo.Util.val(w_pCell.getValue()) + Cairo.Util.val(Dialogs.cell(row, KIC_APLICADO2).getValue()) - Cairo.Util.val(Dialogs.cell(row, KIC_APLICADO).getValue()));
                        Dialogs.cell(row, KIC_APLICADO2).getValue() === Dialogs.cell(row, KIC_APLICADO).getValue();

                        pCobShowPendienteCobranza();
                        break;
                }

                return true;
            };

            var pCobGetAplicado = function() {
                var row = null;
                var rtn = null;

                var _count = pCobGetItemsCobranzaProperty().getGrid().getRows().size();
                for (var _i = 0; _i < _count; _i++) {
                    row = pCobGetItemsCobranzaProperty().getGrid().getRows().item(_i);
                    rtn = rtn + Cairo.Util.val(Dialogs.cell(row, KIC_APLICADO).getValue());
                }
                return rtn;
            };

            var pCobRefreshVto = function(aplicado) {
                var iProp = null;
                var abmObj = null;
                var row = null;
                var aplicadoActual = null;

                abmObj = m_dialog;
                iProp = m_dialog.getProperties().item(C_VENCIMIENTOS);
                row = iProp.getGrid().getRows(m_lastRowVto);

                Dialogs.cell(row, KIV_APLICADO).getValue() === aplicado;
                aplicadoActual = Cairo.Util.val(Dialogs.cell(row, KIV_APLICADO2).getValue());

                var w_pCell = Dialogs.cell(row, KIV_PENDIENTE);
                w_pCell.setValue(w_pCell.getValue() - (aplicado - aplicadoActual));

                Dialogs.cell(row, KIV_APLICADO2).getValue() === aplicado;

                abmObj.ShowCellValue(iProp, m_lastRowVto, D.getCol(iProp.getGrid().getColumns(), KIV_PENDIENTE));
                abmObj.ShowCellValue(iProp, m_lastRowVto, D.getCol(iProp.getGrid().getColumns(), KIV_APLICADO));
            };

            var pCobGetItemsCobranzaProperty = function() {
                return m_dialog.getProperties().item(C_APLICCOBRANZA);
            };

            var pCobGetItemsCobranza = function() {
                return m_dialog.getProperties().item(C_APLICCOBRANZA).getGrid();
            };

            var pCobGetItemsVtosProperty = function() {
                return m_dialog.getProperties().item(C_VENCIMIENTOS);
            };

            var pCobColBEditCobranza = function(property,  lRow,  lCol,  iKeyAscii) { // TODO: Use of ByRef founded Private Function pCobColBEditCobranza(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer)
                switch (cABMUtil.pGetKeyFromCol(property.getGrid().getColumns(), lCol)) {
                    // Facturas
                    case KIC_APLICADO:
                        break;

                    case KIC_COTIZACION:
                        if(Dialogs.cell(property.getGrid().getRows(lRow), KIC_COTIZACION).getValue() === "") {
                            return null;
                        }
                        break;

                    default:
                        return null;
                        break;
                }

                return true;
            };

            var pCobShowPendienteCobranza = function() {
                var row = null;
                var total = null;

                var _count = pCobGetItemsVtosProperty().getGrid().getRows().size();
                for (var _i = 0; _i < _count; _i++) {
                    row = pCobGetItemsVtosProperty().getGrid().getRows().item(_i);
                    total = total + Cairo.Util.val(Dialogs.cell(row, KIV_PENDIENTE).getValue());
                }

                pCobGetPendienteCobranza().setValue(total);

                m_dialog.showValue(pCobGetPendienteCobranza());
            };

            var pCobGetPendienteCobranza = function() {
                return m_dialog.getProperties().item(C_PENDIENTECOBRANZA);
            };

            var pCobUpdateGrids = function() {
                var _rtn = 0;
                var iProp = null;
                var row = null;

                iProp = m_dialog.getProperties().item(C_VENCIMIENTOS);

                if(m_lastRowVto !== 0) {

                    row = iProp.getGrid().getRows(m_lastRowVto);
                    _rtn = pCobUpdateAplicVtos(pCobGetItemsCobranzaProperty(), Dialogs.cell(row, KIV_FVD_ID).getID(), Dialogs.cell(row, KIV_FVP_ID).getID());
                }

                return _rtn;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            // Nota de credito
            //////////////////////////////////////////////////////////////////////////////////////

            // Proposito: Vincular una/s nota de credito con una/s factura
            //
            var pSaveNotaCredito = function(fvTMPId) {
                var register = null;
                var row = null;
                var cell = null;
                var i = null;
                var j = null;

                for (i = 1; i <= m_vCobzNC.Length; i++) {

                    if(m_vCobzNC[i].fv_id !== Cairo.Constants.NO_ID) {

                        for (j = 1; j <= m_vCobzNC[i].vAplicaciones.Length; j++) {

                            if(m_vCobzNC[i].vAplicaciones[j].Aplicado > 0 || m_vCobzNC[i].vAplicaciones[j].fvnc_id) {

                                register = new cRegister();
                                register.setFieldId(CSCFV_NC_TMPID);
                                register.setTable(CSTFACTURAVENTANOTACREDITOTMP);
                                register.setId(Cairo.Constants.NEW_ID);

                                register.getFields().add2(mVentaConstantes.FV_TMPID, fvTMPId, Cairo.Constants.Types.id);

                                if(m_isNotaCredito) {
                                    register.getFields().add2(CSCFV_ID_NOTA_CREDITO, m_fvId, Cairo.Constants.Types.id);
                                    register.getFields().add2(CSCFV_ID_FACTURA, m_vCobzNC[i].fv_id, Cairo.Constants.Types.id);

                                    register.getFields().add2(CT.FVD_ID_NOTA_CREDITO, m_vCobzNC[i].vAplicaciones[j].fvd_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(CT.FVD_ID_FACTURA, m_vCobzNC[i].fvd_id, Cairo.Constants.Types.id);

                                    register.getFields().add2(CT.FVP_ID_NOTA_CREDITO, m_vCobzNC[i].vAplicaciones[j].fvp_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(CT.FVP_ID_FACTURA, m_vCobzNC[i].fvp_id, Cairo.Constants.Types.id);
                                }
                                else {
                                    register.getFields().add2(CSCFV_ID_NOTA_CREDITO, m_vCobzNC[i].fv_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(CSCFV_ID_FACTURA, m_fvId, Cairo.Constants.Types.id);

                                    register.getFields().add2(CT.FVD_ID_NOTA_CREDITO, m_vCobzNC[i].fvd_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(CT.FVD_ID_FACTURA, m_vCobzNC[i].vAplicaciones[j].fvd_id, Cairo.Constants.Types.id);

                                    register.getFields().add2(CT.FVP_ID_NOTA_CREDITO, m_vCobzNC[i].fvp_id, Cairo.Constants.Types.id);
                                    register.getFields().add2(CT.FVP_ID_FACTURA, m_vCobzNC[i].vAplicaciones[j].fvp_id, Cairo.Constants.Types.id);
                                }

                                register.getFields().add2(CSCFV_NC_IMPORTE, m_vCobzNC[i].vAplicaciones[j].Aplicado, Cairo.Constants.Types.double);
                                register.getFields().add2(CSCFV_NC_ID, 0, Cairo.Constants.Types.long);

                                register.getFields().setHaveLastUpdate(false);
                                register.getFields().setHaveWhoModify(false);

                                if(!Cairo.Database.save(register, , "pSaveFVNCAux", C_MODULE, c_ErrorSave)) { return false; }
                            }
                        }
                    }
                }

                return true;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            // Cobranza
            //////////////////////////////////////////////////////////////////////////////////////

            // Guardo cada una de las cobranzas modificadas
            // por la edicion de esta aplicacion
            var pSaveCobranza = function(fvTMPId) {
                var vCobranzas() = null;
                var i = null;

                pGetCobranzas(vCobranzas[]);

                for (i = 1; i <= vCobranzas.Length; i++) {
                    if(!pSaveCobranzaAux(vCobranzas[i].cobz_id, fvTMPId, vCobranzas[i].newAplic)) { return false; }
                }

                return true;
            };

            var pGetCobranzas = function(vCobranzas) { // TODO: Use of ByRef founded Private Sub pGetCobranzas(ByRef vCobranzas() As T_Cobranza)
                var row = null;
                var i = null;
                var k = null;

                G.redim(vCobranzas, 0);

                for (i = 1; i <= m_vCobzNC.Length; i++) {
                    if(m_vCobzNC[i].cobz_id !== Cairo.Constants.NO_ID) {

                        if(m_vCobzNC[i].aplicado > 0 || m_vCobzNC[i].aplicadoActual !== 0) {

                            k = pGetIdxCobranzas(vCobranzas, m_vCobzNC[i].cobz_id);
                            vCobranzas.cobz_id = m_vCobzNC[i].cobz_id;
                            vCobranzas.NewAplic = m_vCobzNC[i].aplicado;
                            vCobranzas.CurrAplic = m_vCobzNC[i].aplicadoActual;
                        }
                    }
                }
            };

            var pGetIdxCobranzas = function(vCobranzas,  cobzId) { // TODO: Use of ByRef founded Private Function pGetIdxCobranzas(ByRef vCobranzas() As T_Cobranza, ByVal CobzId As Long) As Long
                var _rtn = 0;
                var bFound = null;
                var i = null;

                for (i = 1; i <= vCobranzas.Length; i++) {
                    if(vCobranzas(i).cobz_id === cobzId) {
                        _rtn = i;
                        return _rtn;
                    }
                }

                if(!bFound) {
                    G.redimPreserve(vCobranzas, vCobranzas.Length + 1);
                }

                _rtn = vCobranzas.Length;

                return _rtn;
            };

            var pSaveCobranzaAux = function(cobzId,  fvTMPId,  aplic) {
                var register = null;

                register = new cRegister();
                register.setFieldId(CT.COBZ_TMP_ID);
                register.setTable(CT.COBRANZA_TMP);

                register.setId(Cairo.Constants.NEW_ID);

                register.getFields().add2(mVentaConstantes.FV_TMPID, fvTMPId, Cairo.Constants.Types.id);
                register.getFields().add2(CT.COBZ_NUMERO, 0, Cairo.Constants.Types.long);
                register.getFields().add2(mVentaConstantes.CLI_ID, Cairo.Constants.NO_ID, Cairo.Constants.Types.long);
                register.getFields().add2(mVentaConstantes.SUC_ID, Cairo.Constants.NO_ID, Cairo.Constants.Types.long);
                register.getFields().add2(mVentaConstantes.DOC_ID, Cairo.Constants.NO_ID, Cairo.Constants.Types.long);
                register.getFields().add2(C.EST_ID, Cairo.Constants.NO_ID, Cairo.Constants.Types.long);
                register.getFields().add2(CT.COBZ_ID, cobzId, Cairo.Constants.Types.id);

                register.getFields().setHaveLastUpdate(true);
                register.getFields().setHaveWhoModify(true);

                if(!register.beginTrans(Cairo.Database)) { return false; }

                if(!Cairo.Database.save(register, , "pSave", C_MODULE, c_ErrorSave)) { return false; }

                if(!pSaveItems(register.getID(), cobzId)) { return false; }
                if(!pSaveCtaCte(register.getID(), cobzId, aplic)) { return false; }

                if(!register.commitTrans()) { return false; }

                return true;
            };

            var pSaveItems = function(id,  cobzId) {
                var transaction = new Cairo.Database.Transaction();
                var i = null;
                var j = null;

                for (i = 1; i <= m_vCobzNC.Length; i++) {

                    if(m_vCobzNC[i].cobz_id === cobzId) {

                        for (j = 1; j <= m_vCobzNC[i].vAplicaciones.Length; j++) {

                            if(m_vCobzNC[i].vAplicaciones[j].Aplicado > 0 || m_vCobzNC[i].vAplicaciones[j].fvcobz_id) {

                                var register = new Cairo.Database.Register();
                                register.setFieldId(CT.FV_COBZ_TMP_ID);
                                register.setTable(FACTURA_VENTA_COBRANZA_TMP);
                                register.setId(Cairo.Constants.NEW_ID);

                                register.getFields().add2(CT.COBZ_ID, m_vCobzNC[i].cobz_id, Cairo.Constants.Types.long);
                                register.getFields().add2(CT.COBZ_TMP_ID, id, Cairo.Constants.Types.id);

                                register.getFields().add2(mVentaConstantes.FV_ID, m_fvId, Cairo.Constants.Types.id);
                                register.getFields().add2(CT.FVD_ID, m_vCobzNC[i].vAplicaciones[j].fvd_id, Cairo.Constants.Types.id);
                                register.getFields().add2(CT.FVP_ID, m_vCobzNC[i].vAplicaciones[j].fvp_id, Cairo.Constants.Types.id);
                                register.getFields().add2(CT.FV_COBZ_ID, m_vCobzNC[i].vAplicaciones[j].fvcobz_id, Cairo.Constants.Types.long);

                                register.getFields().add2(CT.FV_COBZ_COTIZACION, m_vCobzNC[i].cotizacion, Cairo.Constants.Types.double);
                                register.getFields().add2(CT.FV_COBZ_IMPORTE, m_vCobzNC[i].vAplicaciones[j].Aplicado, Cairo.Constants.Types.double);
                                register.getFields().add2(CT.FV_COBZ_IMPORTE_ORIGEN, DivideByCero(m_vCobzNC[i].vAplicaciones[j].Aplicado, m_vCobzNC[i].cotizacion), Cairo.Constants.Types.double);

                                register.getFields().setHaveLastUpdate(false);
                                register.getFields().setHaveWhoModify(false);

                                transaction.addRegister(register);
                            }
                        }
                    }
                }

                mainTransaction.addTransaction(transaction);

                return true;
            };

            var pSaveCtaCte = function(id,  cobzId,  aplic) {
                var register = null;
                var ctaCte = null;

                // Obtengo las cuentas del tercero
                if(!pGetCuentasDeudor(cobzId, ctaCte, aplic)) { return false; }

                register = new cRegister();
                register.setFieldId(CSCCOBZI_TMPID);
                register.setTable(CSTCOBRANZAITEMTMP);
                register.setId(Cairo.Constants.NEW_ID);

                register.getFields().add2(mVentaConstantes.CUE_ID, ctaCte.cue_id, Cairo.Constants.Types.id);
                register.getFields().add2(CSCCOBZI_IMPORTE_ORIGEN, ctaCte.importeOrigen, Cairo.Constants.Types.currency);
                register.getFields().add2(CSCCOBZI_IMPORTE, ctaCte.importe, Cairo.Constants.Types.currency);

                register.getFields().add2(CSCCOBZI_ORDEN, 1, Cairo.Constants.Types.integer);
                register.getFields().add2(CSCCOBZI_TIPO, csECobranzaItemTipo.csECobziTCtaCte, Cairo.Constants.Types.integer);
                register.getFields().add2(CT.COBZ_TMP_ID, id, Cairo.Constants.Types.id);
                register.getFields().add2(CSCCOBZI_ID, id, Cairo.Constants.Types.long);
                register.getFields().add2(CSCCOBZI_OTRO_TIPO, csECobranzaItemOtroTipo.csEOtroHaber, Cairo.Constants.Types.integer);

                register.getFields().setHaveLastUpdate(false);
                register.getFields().setHaveWhoModify(false);

                if(!Cairo.Database.save(register, , "pSaveCtaCte", C_MODULE, c_ErrorSave)) { return false; }

                return true;
            };

            var pGetCuentasDeudor = function(cobzId,  ctaCte,  aplic) { // TODO: Use of ByRef founded Private Function pGetCuentasDeudor(ByVal CobzId As Long, ByRef CtaCte As T_CtaCte, ByVal Aplic As Double) As Boolean
                var cueIdFactura = null;
                var cotizacion = null;

                if(!pGetCueIdFactura(cueIdFactura)) { return false; }

                ctaCte.cue_id = cueIdFactura;
                ctaCte.importe = aplic;

                if(pGetMonIdForCueId(cueIdFactura) !== m_monDefault) {
                    if(!pGetCotizacionCobranza(cobzId, cotizacion)) { return false; }
                    ctaCte.importeOrigen = aplic * cotizacion;
                }

                return true;
            };

            var pGetMonIdForCueId = function(cueId) {
                var _rtn = 0;
                try {

                    var sqlstmt = null;
                    var rs = null;

                    sqlstmt = "select mon_id from Cuenta where cue_id = "+ cueId.toString();

                    if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

                    if(rs.isEOF()) { return _rtn; }

                    _rtn = Cairo.Database.valField(rs.getFields(), mVentaConstantes.MON_ID);

                    // **TODO:** goto found: GoTo ExitProc;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, "pGetMonIdForCueId", C_MODULE, "");
                    // **TODO:** label found: ExitProc:;
                }
                // **TODO:** on error resume next found !!!

                return _rtn;
            };

            var pGetCotizacionCobranza = function(cobzId,  cotizacion) { // TODO: Use of ByRef founded Private Function pGetCotizacionCobranza(ByVal CobzId As Long, ByRef Cotizacion As Double) As Boolean
                var _rtn = null;
                try {

                    var sqlstmt = null;
                    var rs = null;

                    sqlstmt = "select cobz_cotizacion from Cobranza where cobz_id = "+ cobzId.toString();

                    if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

                    if(rs.isEOF()) { return _rtn; }

                    cotizacion = Cairo.Database.valField(rs.getFields(), CT.COBZ_COTIZACION);

                    _rtn = true;

                    // **TODO:** goto found: GoTo ExitProc;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, "pGetCotizacionCobranza", C_MODULE, "");
                    // **TODO:** label found: ExitProc:;
                }
                // **TODO:** on error resume next found !!!

                return _rtn;
            };

            var pGetCueIdFactura = function(cueIdFactura) { // TODO: Use of ByRef founded Private Function pGetCueIdFactura(ByRef CueIdFactura As Long) As Boolean
                var _rtn = null;
                try {

                    var sqlstmt = null;
                    var rs = null;

                    sqlstmt = "sp_DocFacturaVentaGetCueDeudor "+ m_fvId;

                    if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

                    if(rs.isEOF()) { return _rtn; }

                    cueIdFactura = Cairo.Database.valField(rs.getFields(), mVentaConstantes.CUE_ID);

                    _rtn = true;

                    // **TODO:** goto found: GoTo ExitProc;
                }
                catch (ex) {
                    Cairo.manageErrorEx(ex.message, "pGetCueIdFactura", C_MODULE, "");
                    // **TODO:** label found: ExitProc:;
                }
                // **TODO:** on error resume next found !!!

                return _rtn;
            };

            //////////////////////////////////////////////////////////////////////////////////////
            //
            //   construccion - destruccion
            //
            //////////////////////////////////////////////////////////////////////////////////////
            self.initialize = function() {
                try {

                    //'Error al grabar la Factura de Venta
                    c_ErrorSave = Cairo.Language.getText(2220, "");

                    m_generalConfig = new cGeneralConfig();
                    m_generalConfig.Load;

                    G.redim(m_vCobzNC, 0);
                    G.redimPreserve(0, .vAplicaciones);

                    m_monDefault = GetMonedaDefault();

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

                    G.redim(m_vCobzNC, 0);
                    G.redim(m_vPedidoRemito, 0);

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

            return self;
        };

        Edit.Controller = { getEditor: createObject };

    });

    Cairo.module("FacturaVentaAplic.List", function(List, Cairo, Backbone, Marionette, $, _) {
        List.Controller = {
            list: function() {

                var self = this;

                /*
                 this function will be called by the tab manager every time the
                 view must be created. when the tab is not visible the tab manager
                 will not call this function but only make the tab visible
                 */
                var createTreeDialog = function(tabId) {

                    var editors = Cairo.Editors.facturaventaaplicEditors || Cairo.Collections.createCollection(null);
                    Cairo.Editors.facturaventaaplicEditors = editors;

                    // ListController properties and methods
                    //
                    self.entityInfo = new Backbone.Model({
                        entitiesTitle: "FacturaVentaAplics",
                        entityName: "facturaventaaplic",
                        entitiesName: "facturaventaaplics"
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
                            var editor = Cairo.FacturaVentaAplic.Edit.Controller.getEditor();
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
                        if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_FACTURAVENTAAPLIC)) {
                            return Cairo.Promises.resolvedPromise(false);
                        }
                        var apiPath = Cairo.Database.getAPIVersion();
                        return Cairo.Database.destroy(apiPath + "general/facturaventaaplic", id, Cairo.Constants.DELETE_FUNCTION, "FacturaVentaAplic").success(
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
                    Cairo.LoadingMessage.show("FacturaVentaAplics", "Loading facturaventaaplic from Crowsoft Cairo server.");

                    // create the tree region
                    //
                    Cairo.addRegions({ facturaventaaplicTreeRegion: tabId });

                    // create the dialog
                    //
                    Cairo.Tree.List.Controller.list(
                        Cairo.Tables.FACTURAVENTAAPLIC,
                        new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
                        Cairo.facturaventaaplicTreeRegion,
                        self);

                };

                var showTreeDialog = function() {
                    Cairo.Tree.List.Controller.showTreeDialog(self);
                };

                var closeTreeDialog = function() {

                }

                // create the tab
                //
                Cairo.mainTab.showTab("FacturaVentaAplics", "facturaventaaplicTreeRegion", "#general/facturaventaaplics", createTreeDialog, closeTreeDialog, showTreeDialog);

            }
        };
    });


}());
