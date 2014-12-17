(function() {
  "use strict";

  Cairo.module("Producto.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;
      var Constants = Cairo.General.Constants;
      var Types = Cairo.Constants.Types;
      var bToI = Cairo.Util.boolToInt;

      var C_MODULE = "cProducto";

      var C_PRODUCTO_KIT = "PRODKIT";
      var C_PROVEEDOR = "PROV";
      var C_CLIENTE = "CLI";
      var C_CMI = "CMI";
      var C_BOM = "BOM";
      var C_TAGS = "TAGS";
      var C_WEB_IMAGES = "WEB_IMAGES";
      var C_LEYENDAS = "LEYENDAS";

      var C_WEB_CATALOGS = "WEB_catalogs";
      var C_WEB_CATEGORIES = "WEB_categories";

      var K_NOMBRE_COMPRA = 2;
      var K_NOMBRE_VENTA = 3;
      var K_NOMBRE_FACTURA = 179;
      var K_CODE = 4;
      var K_CODIGO_BARRA = 200;
      var K_CODIGO_BARRA_NOMBRE = 201;
      var K_ACTIVE = 5;
      var K_DESCRIP_VENTA = 6;
      var K_DESCRIP_COMPRA = 7;
      var K_UN_ID_COMPRA = 8;
      var K_UN_ID_VENTA = 9;
      var K_UN_ID_STOCK = 10;
      var K_COMPRA_VENTA = 11;
      var K_VENTA_STOCK = 12;
      var K_COMPRA_STOCK = 13;
      var K_LLEVA_STOCK = 14;
      var K_SE_COMPRA = 15;
      var K_SE_VENDE = 16;
      var K_NO_REDONDEO = 520;
      var K_DINERARIO = 510;
      var K_ES_KIT = 17;
      var K_ES_LISTA = 18;
      var K_TI_ID_IVA_RI_COMPRA = 19;
      var K_TI_ID_IVA_RI_VENTA = 21;
      var K_TI_ID_INTERNOS_V = 23;
      var K_TI_ID_INTERNOS_C = 24;
      var K_PORC_INTERNO_C = 25;
      var K_PORC_INTERNO_V = 26;
      var K_IBC_ID = 27;
      var K_CUEG_ID_COMPRA = 28;
      var K_CUEG_ID_VENTA = 29;
      var K_X = 30;
      var K_Y = 31;
      var K_Z = 32;
      var K_TIENE_HIJO = 33;
      var K_STOCK_MINIMO = 38;
      var K_STOCK_MAXIMO = 39;
      var K_CODIGO_EXTERNO = 40;
      var K_REPOSICION = 41;
      var K_RUB_ID = 42;

      var K_RUBTI_ID1 = 43;
      var K_RUBTI_ID2 = 44;
      var K_RUBTI_ID3 = 45;
      var K_RUBTI_ID4 = 46;
      var K_RUBTI_ID5 = 47;
      var K_RUBTI_ID6 = 48;
      var K_RUBTI_ID7 = 49;
      var K_RUBTI_ID8 = 50;
      var K_RUBTI_ID9 = 51;
      var K_RUBTI_ID10 = 52;

      var K_MARC_ID = 53;

      var K_PESO_NETO = 54;
      var K_PESO_TOTAL = 55;
      var K_UN_ID_PESO = 56;
      var K_EGP_ID = 57;
      var K_EFM_ID = 69;
      var K_CANTIDAD_X_CAJA_EXPO = 58;
      var K_LLEVA_NRO_SERIE = 59;
      var K_LLEVA_NRO_LOTE = 60;
      var K_ESREPUESTO = 600;
      var K_LOTEFIFO = 61;
      var K_FLETEEXPO = 68;

      var K_PRODUCTO_KIT = 162;

      var K_KIT_STK_X_ITEM = 163;

      var K_EMBL_ID = 164;

      var K_PROVEEDOR = 165;

      var K_CLIENTE = 175;

      var K_SEPRODUCE = 166;
      var K_BOM = 167;
      var K_TAGS = 176;
      var K_NOMBRE_WEB = 178;
      var K_ALIAS_WEB = 180;
      var K_CODIGO_HTML = 181;
      var K_CODIGO_HTML_DETALLE = 182;
      var K_ACTIVOWEB = 183;
      var K_EXPOCAIRO = 184;
      var K_EXPOWEB = 185;
      var K_LEY_ID = 186;
      var K_VENTA_WEB_MAXIMA = 187;
      var K_WEB_IMAGES = 188;
      var K_WEB_CATALOGOS = 191;
      var K_WEB_CATEGORIAS = 192;

      var K_KIT_RESUMIDO = 168;
      var K_KIT_IDENTIDAD = 169;
      var K_KIT_IDENTIDADXITEM = 170;
      var K_TA_ID_KITSERIE = 171;

      var K_KIT_LOTE = 172;
      var K_KIT_LOTEXITEM = 173;
      var K_TA_ID_KITLOTE = 174;

      var K_WEB_IMAGE_FOLDER = 189;
      var K_WEB_IMAGE_UPDATE = 190;

      var K_CCOS_ID_COMPRA = 193;
      var K_CCOS_ID_VENTA = 194;

      var K_ESPLANTILLA = 195;
      var K_CUR_ID = 196;

      var K_RPT_ID_NOMBRE_VENTA = 550;
      var K_RPT_ID_NOMBRE_COMPRA = 551;
      var K_RPT_ID_NOMBRE_FACTURA = 552;
      var K_RPT_ID_NOMBRE_WEB = 553;
      var K_RPT_ID_NOMBRE_IMG = 554;
      var K_RPT_ID_NOMBRE_IMG_ALT = 555;

      var K_TI_COMEX_GANANCIAS = 556;
      var K_TI_COMEX_IGB = 557;
      var K_TI_COMEX_IVA = 558;

      var K_POAR_ID = 559;

      var K_CMI = 560;
      var K_LEYENDAS = 561;

      var K_PR_ID_WEB_PADRE = 570;

      var KIK_PRFK_ID = 1;
      var KIK_PRFK_DEFAULT = 2;

      var KIK_PRPROV_ID = 1;
      var KIK_PROV_ID = 2;
      var KIK_PROV_FABRICANTE = 3;
      var KIK_PROV_NOMBRE = 4;
      var KIK_PROV_CODIGO = 5;
      var KIK_PROV_CODBARRA = 6;
      var KIK_PA_ID = 7;
      var KIK_PROV_LPI_ID = 8;
      var KIK_PROV_PRECIO = 9;
      var KIK_PROV_PRECIO_FECHA = 10;
      var KIK_PROV_PRECIO_DEFAULT = 11;
      var KIK_PROV_PRECIO2 = 12;

      var KIK_PRCLI_ID = 1;
      var KIK_CLI_ID = 2;
      var KIK_CLI_NOMBRE = 4;
      var KIK_CLI_CODIGO = 5;
      var KIK_CLI_CODBARRA = 6;

      var KIT_PRT_ID = 1;
      var KIT_PR_ID_TAG = 2;
      var KIT_TEXTO = 3;
      var KIT_EXPOWEB = 4;
      var KIT_EXPOCAIRO = 5;

      var KIK_PBM_ID = 1;

      var KIWI_PRWI_ID = 1;
      var KIWI_IMAGE = 2;
      var KIWI_IMAGE_TYPE = 3;
      var KIWI_ALT = 4;
      var KIWI_POSICION = 5;

      var KICWI_ID = 1;
      var KICW_ID = 2;
      var KICW_SELECT = 3;

      var KICWCI_ID = 1;
      var KICWC_ID = 2;
      var KICWC_SELECT = 3;
      var KICWCI_POSICION = 4;

      var KICMI_ID = 1;
      var KICMI_CMI_ID = 2;
      var KICMI_CODIGO = 3;
      var KICMI_DESCRIP = 4;
      var KICMI_PRECIO = 5;
      var KICMI_FECHAALTA = 6;
      var KICMI_FECHAVTO = 7;

      var KIPRL_ID = 1;
      var KIPRL_NOMBRE = 2;
      var KIPRL_TEXTO = 3;
      var KIPRL_TAG = 4;
      var KIPRL_ORDEN = 5;

      var TAB_RUBRO = 4;

      var m_id = 0;
      var m_purchaseName = "";
      var m_saleName = "";
      var m_nombreFactura = "";
      var m_nombreWeb = "";
      var m_aliasWeb = "";
      var m_activoWeb;
      var m_codigoHtml = "";
      var m_codigoHtmlDetalle = "";
      var m_code = "";
      var m_active;
      var m_descripventa = "";
      var m_descripcompra = "";
      var m_un_id_compra = 0;
      var m_unidadCompra = "";
      var m_un_id_venta = 0;
      var m_unidadVenta = "";
      var m_un_id_stock = 0;
      var m_unidadStock = "";
      var m_compraVenta = 0;
      var m_ventaStock = 0;
      var m_compraStock = 0;
      var m_llevaStock = 0;
      var m_seCompra = 0;
      var m_seVende = 0;
      var m_dinerario;
      var m_noRedondeo;
      var m_eskit;
      var m_kitStkXItem;
      var m_esLista;
      var m_ti_id_IVA_RI_compra = 0;
      var m_tiIvaRiCompra = "";
      var m_ti_id_ivarnicompra = 0;
      var m_tiIvaRniCompra = "";
      var m_ti_id_IVA_RI_venta = 0;
      var m_tiIvaRiVenta = "";
      var m_ti_id_ivarniventa = 0;
      var m_tiIvaRniVenta = "";
      var m_ti_id_INTERNOS_v = 0;
      var m_tiInternosv = "";
      var m_ti_id_INTERNOS_c = 0;
      var m_tiInternosc = "";
      var m_porcInternoC = 0;
      var m_porcInternoV = 0;
      var m_ibc_id = 0;
      var m_ingresosBrutos = "";
      var m_cueg_id_compra = 0;
      var m_cuentaGCompra = "";
      var m_marc_id = 0;
      var m_marca = "";
      var m_cueg_id_venta = 0;
      var m_cuentaGVenta = "";
      var m_x = 0;
      var m_y = 0;
      var m_z = 0;
      var m_tieneHijo;
      var m_id_Padre = 0;
      var m_editarPrecioHijo;
      var m_permiteEdicion;
      var m_borrado;
      var m_stockMinimo = 0;
      var m_stockMaximo = 0;
      var m_codigoExterno = "";
      var m_codigoBarra = "";
      var m_codigoBarraNombre = "";
      var m_reposicion = 0;
      var m_llevaNroSerie;
      var m_llevaNroLote;
      var m_loteFifo;
      var m_seProduce;
      var m_esRepuesto;
      var m_rub_id = 0;
      var m_rubro = "";

      var m_rubti_id1 = 0;
      var m_tablaItem1 = "";
      var m_rubti_id2 = 0;
      var m_tablaItem2 = "";
      var m_rubti_id3 = 0;
      var m_tablaItem3 = "";
      var m_rubti_id4 = 0;
      var m_tablaItem4 = "";
      var m_rubti_id5 = 0;
      var m_tablaItem5 = "";
      var m_rubti_id6 = 0;
      var m_tablaItem6 = "";
      var m_rubti_id7 = 0;
      var m_tablaItem7 = "";
      var m_rubti_id8 = 0;
      var m_tablaItem8 = "";
      var m_rubti_id9 = 0;
      var m_tablaItem9 = "";
      var m_rubti_id10 = 0;
      var m_tablaItem10 = "";

      var m_pesoNeto = 0;
      var m_pesoTotal = 0;
      var m_un_id_peso = 0;
      var m_unidadPeso = "";
      var m_egp_id = 0;
      var m_grupoExpo = "";
      var m_efm_id = 0;
      var m_familiaExpo = "";
      var m_cantXCajaExpo = 0;
      var m_fleteExpo;

      var m_kitResumido;
      var m_kitIdentidad;
      var m_kitIdentidadXItem;
      var m_kitLote;
      var m_kitLoteXItem;

      var m_ta_id_kitSerie = 0;
      var m_talonarioKitSerie = "";

      var m_ta_id_kitLote = 0;
      var m_talonarioKitLote = "";

      var m_ccos_id_compra = 0;
      var m_centroCostoCompra = "";

      var m_ccos_id_venta = 0;
      var m_centroCostoVenta = "";

      var m_embl_id = 0;
      var m_embalaje = "";

      var m_expoCairo = 0;
      var m_expoWeb = 0;
      var m_ventaWebMaxima = 0;
      var m_ley_id = 0;
      var m_leyenda = "";
      var m_webImageFolder = "";
      var m_productowebpadre = "";
      var m_pr_id_webPadre = 0;
      var m_webImageUpdate;
      var m_isTemplate;
      var m_cur_id = 0;
      var m_curso = "";

      var m_rpt_id_nombreVenta = 0;
      var m_rpt_nombreVenta = "";

      var m_rpt_id_nombreCompra = 0;
      var m_rpt_nombreCompra = "";

      var m_rpt_id_nombrefactura = 0;
      var m_rpt_nombrefactura = "";

      var m_rpt_id_nombreweb = 0;
      var m_rpt_nombreweb = "";

      var m_rpt_id_nombreimg = 0;
      var m_rpt_nombreimg = "";

      var m_rpt_id_nombreimgalt = 0;
      var m_rpt_nombreimgalt = "";

      var m_ti_id_comex_igb = 0;
      var m_ti_comex_igb = "";

      var m_ti_id_comex_ganancias = 0;
      var m_ti_comex_ganancias = "";

      var m_ti_id_comex_iva = 0;
      var m_ti_comex_iva = "";

      var m_poar_id = 0;
      var m_posicionArancel = "";

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;

      var m_itemsDeletedProveedor = "";
      var m_itemsDeletedCliente = "";
      var m_itemsDeletedTag = "";
      var m_itemsDeletedWebImages = "";
      var m_itemsDeletedCMI = "";
      var m_itemsDeletedLeyendas = "";

      var m_lastRubId = 0;
      var m_rubroHasChanged = false;

      var m_userConfig;

      var m_genericEdit;

      var m_data = {
        proveedor: [],
        cliente: [],
        cmi: [],
        leyendas: [],
        tags: [],
        categoriasWeb: [],
        catalogosWeb: [],
        webImages: [],
        kit: [],
        bom: [],
        rubro: null
      };

      self.getId = function() {
        return m_id;
      };

      self.getName = function() {
        return m_purchaseName;
      };

      self.getCode = function() {
        return m_code;
      };

      self.copy = function() {

        if(m_isTemplate) {
          m_isTemplate = false;
          refreshCollection();
        }

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        var property = m_dialog.getProperties().item(Constants.PR_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Constants.PR_CODE));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        if(!pValidateAccessNewEdit(Cairo.Constants.NO_ID)) { return false; }

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        return load(Cairo.Constants.NO_ID).then(
          function(ignored) {
            return refreshCollection();
          }
        );
      };

      self.getApplication = function() {
        return Cairo.appName;
      };

      self.editDocumentsEnabled = function() {
        return m_id !== Cairo.Constants.NO_ID;
      };

      self.copyEnabled = function() {
        return true;
      };

      self.addEnabled = function() {
        return true;
      };

      self.showDocDigital = function() {
        var _rtn = null;
        try {

          if(m_id === Cairo.Constants.NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(Constants.PRODUCTO);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageID,  info) {
        var _rtn = null;
        switch (messageID) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_PRODUCTO);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;
            break;

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            _rtn = pProcessMultiRow(info);
            break;

          default:

            _rtn = true;
            break;
        }

        return Cairo.Promises.resolvedPromise(_rtn);
      };

      var pProcessMultiRow = function(info) {
        var p = null;

        info.bAddRows = false;

        switch (info.Key) {
          case K_TAGS:
            var w_pGetTags = pGetTags();

            var row = null;
            row = w_pGetTags.getGrid().getRows(info.row);

            if(row.item(info.col).getKey() === KIT_PR_ID_TAG) {

              var cell = null;

              cell = Dialogs.cell(row, KIT_PR_ID_TAG);

              if(cell.getSelectIntValue() !== "") {
                if(cell.getSelectIntValue().indexOf(",", 1)) {
                  p = Cairo.Selections.addMultiRowsPurchase(cell.getSelectIntValue(), info, -1);
                }
              }
            }
            break;
        }

        return p || Cairo.Promises.resolvedPromise(false);
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      var setEnabledCompra = function(status, noRefresh) {

        noRefresh = noRefresh !== undefined ? noRefresh : false;

        var properties = m_dialog.getProperties();
        properties.item(Constants.PR_UN_ID_COMPRA).setEnabled(status);
        properties.item(Constants.PR_CUEG_ID_COMPRA).setEnabled(status);
        properties.item(Constants.PR_TI_ID_RI_COMPRA).setEnabled(status);
        properties.item(Constants.PR_TI_ID_INTERNOS_COMPRA).setEnabled(status);
        properties.item(Constants.PR_PORCINTERNOC).setEnabled(status);
        properties.item(C_PROVEEDOR).setEnabled(status);

        if(!noRefresh) m_dialog.refreshControls();

        m_seCompra = status;
      };

      var setEnabledVenta = function(status, noRefresh) {

        noRefresh = noRefresh !== undefined ? noRefresh : false;

        var properties = m_dialog.getProperties();
        properties.item(Constants.PR_UN_ID_VENTA).setEnabled(status);
        properties.item(Constants.PR_CUEG_ID_VENTA).setEnabled(status);
        properties.item(Constants.PR_TI_ID_RI_VENTA).setEnabled(status);
        properties.item(Constants.PR_NOMBRE_FACTURA).setEnabled(status);
        properties.item(Constants.PR_TI_ID_INTERNOS_VENTA).setEnabled(status);
        properties.item(Constants.PR_PORCINTERNOV).setEnabled(status);
        properties.item(Constants.PR_NOMBRE_VENTA).setEnabled(status);
        properties.item(Constants.PR_DESCRIPVENTA).setEnabled(status);
        properties.item(Constants.PR_VENTA_COMPRA).setEnabled(status);
        properties.item(Constants.PR_VENTA_STOCK).setEnabled(status);
        properties.item(Constants.PR_ES_LISTA).setEnabled(status);
        properties.item(C_CLIENTE).setEnabled(status);

        if(!noRefresh) m_dialog.refreshControls();

        m_seVende = status;
      };

      var setEnabledStock = function(status, noRefresh) {

        noRefresh = noRefresh !== undefined ? noRefresh : false;

        var properties = m_dialog.getProperties();
        properties.item(Constants.PR_UN_ID_STOCK).setEnabled(status);
        properties.item(Constants.PR_STOCK_COMPRA).setEnabled(status);
        properties.item(Constants.PR_X).setEnabled(status);
        properties.item(Constants.PR_Y).setEnabled(status);
        properties.item(Constants.PR_Z).setEnabled(status);
        properties.item(Constants.PR_STOCKMINIMO).setEnabled(status);
        properties.item(Constants.PR_STOCKMAXIMO).setEnabled(status);
        properties.item(Constants.PR_REPOSICION).setEnabled(status);
        properties.item(Constants.PR_LLEVA_NRO_LOTE).setEnabled(status);
        properties.item(Constants.PR_LLEVA_NRO_SERIE).setEnabled(status);
        properties.item(Constants.PR_LOTE_FIFO).setEnabled(status);
        properties.item(Constants.PR_SE_PRODUCE).setEnabled(status);
        properties.item(Constants.PR_ES_REPUESTO).setEnabled(status);

        if(!noRefresh) m_dialog.refreshControls();

        m_llevaStock = status;
      };

      var setEnabledPlantilla = function(noRefresh) {
        var iProp = null;
        var status = m_isTemplate === false;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          iProp = m_dialog.getProperties().item(_i);
          iProp.setEnabled(status);
        }

        if(!m_isTemplate) {

          setEnabledCompra(m_seCompra, noRefresh);
          setEnabledStock(m_llevaStock, noRefresh);
          setEnabledVenta(m_seVende, noRefresh);

        }

        m_dialog.getProperties().item(Constants.PR_ES_PLANTILLA).setEnabled(true);
        pGetTags().setEnabled(m_pr_id_webPadre === Cairo.Constants.NO_ID);

      };

      self.propertyChange = function(key) {

        var bEnabled = null;
        var iProp = null;
        var bSeVende = null;
        var _rtn = true;

        switch (key) {
          case K_SE_COMPRA:

            setEnabledCompra(Cairo.Util.val(m_dialog.getProperties().item(Constants.PR_SECOMPRA).getValue()) !== 0);
            break;

          case K_SE_VENDE:

            bSeVende = Cairo.Util.val(m_dialog.getProperties().item(Constants.PR_SEVENDE).getValue()) !== 0;
            setEnabledVenta(bSeVende);

            iProp = m_dialog.getProperties().item(Constants.PR_NOMBRE_VENTA);

            if(bSeVende) {

              if(iProp.getValue() === "") {
                iProp.setValue(m_dialog.getProperties().item(Constants.PR_NOMBRE_COMPRA).getValue());
              }

            }
            else {

              if(iProp.getValue() === m_dialog.getProperties().item(Constants.PR_NOMBRE_COMPRA).getValue()) {
                iProp.setValue("");
              }

            }
            break;

          case K_LLEVA_STOCK:
            
            setEnabledStock(Cairo.Util.val(m_dialog.getProperties().item(Constants.PR_LLEVASTOCK).getValue()) !== 0);
            break;

          case K_RUB_ID:
            
            var rubId = pGetRubId();
            
            if(m_lastRubId !== rubId) {
              m_rubroHasChanged = true;
              var rubro = new Rubro();
              rubro.load(rubId).success(
                function() {
                  m_data.rubro = rubro;
                  setRubro();
                  if (m_dialog.show(self, TAB_RUBRO)) {
                    m_rubroHasChanged = false;
                  }
                  m_lastRubId = rubId;
                }
              );
            }
            break;

          case K_NOMBRE_COMPRA:

            var properties = m_dialog.getProperties();

            var nombre = properties.item(Constants.PR_NOMBRE_COMPRA).getValue();
            var nombreVenta = properties.item(Constants.PR_NOMBRE_VENTA).getValue();
            bSeVende = Cairo.Util.val(properties.item(Constants.PR_SEVENDE).getValue());

            if(m_purchaseName !== nombre && nombre !== nombreVenta && bSeVende) {

              Cairo.Modal.confirmViewYesDefault(
                  "",
                  Cairo.Language.getText(1282, "") // Ha modificado el nombre de compras, desea aplicar el mismo nombre a ventas
                ).then(
                function(answer) {
                  if(answer === "yes") {
                    properties.item(Constants.PR_NOMBRE_VENTA).setValue(nombre);
                  }
                }
              );
            }
            break;

          case K_ES_KIT:

            var properties = m_dialog.getProperties();

            bEnabled = Cairo.Util.val(properties.item(Constants.PR_ESKIT).getValue());

            iProp = properties.item(Constants.PR_KIT_STOCK_XITEM);
            iProp.setEnabled(bEnabled);
            m_dialog.showValue(iProp);

            iProp = properties.item(Constants.PR_KIT_RESUMIDO);
            iProp.setEnabled(bEnabled);
            m_dialog.showValue(iProp);

            pSetKitEnabled();
            break;

          case K_KIT_RESUMIDO:
            pSetKitEnabled();
            break;

          case K_KIT_IDENTIDAD:
          case K_KIT_IDENTIDADXITEM:

            bEnabled = Cairo.Util.val(m_dialog.getProperties().item(Constants.PR_KIT_RESUMIDO).getValue());
            pSetKitSerieEnabled(bEnabled);
            pSetKitLoteEnabled(bEnabled);
            break;

          case K_KIT_LOTE:
          case K_KIT_LOTEXITEM:

            pSetKitLoteEnabled(Cairo.Util.val(m_dialog.getProperties().item(Constants.PR_KIT_RESUMIDO).getValue()));
            break;

          case K_PR_ID_WEB_PADRE:
            
            var tabs = pGetTags();
            tabs.setEnabled(m_dialog.getProperties().item(Constants.PR_ID_WEB_PADRE).getSelectId() === Cairo.Constants.NO_ID);
            m_dialog.showValue(tabs, true);
            break;

          default:
            _rtn = false;
            break;
        }

        return _rtn;
      };

      self.save = function() {

        var kitInfo = {
          esKit: false,
          kitStockXItem: false,
          kitResumido: false,
          kitIdentidad: false,
          kitIdentidadXItem: false,
          taIdKitSerie: false,
          kitLote: false,
          kitLoteXItem: false,
          taIdKitLote: false
        };

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(Constants.PR_ID);
        register.setTable(Constants.PRODUCTO);

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/producto");

        if(m_copy) {
          register.setId(Cairo.Constants.NEW_ID);
        }
        else {
          register.setId(m_id);
        }

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {

          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {
            case K_NOMBRE_COMPRA:
              fields.add(Constants.PR_NOMBRE_COMPRA, property.getValue(), Types.text);
              break;

            case K_NOMBRE_VENTA:
              fields.add(Constants.PR_NOMBRE_VENTA, property.getValue(), Types.text);
              break;

            case K_NOMBRE_FACTURA:
              fields.add(Constants.PR_NOMBRE_FACTURA, property.getValue(), Types.text);
              break;

            case K_NOMBRE_WEB:
              fields.add(Constants.PR_NOMBRE_WEB, property.getValue(), Types.text);
              break;

            case K_ALIAS_WEB:
              fields.add(Constants.PR_ALIAS_WEB, property.getValue(), Types.text);
              break;

            case K_PR_ID_WEB_PADRE:
              fields.add(Constants.PR_ID_WEB_PADRE, property.getSelectId(), Types.id);
              break;

            case K_ACTIVOWEB:
              fields.add(Constants.PR_ACTIVO_WEB, property.getValue(), Types.boolean);
              break;

            case K_LEY_ID:
              fields.add(Constants.LEY_ID, property.getSelectId(), Types.id);
              break;

            case K_CODIGO_HTML:
              fields.add(Constants.PR_CODIGO_HTML, property.getValue(), Types.text);
              break;

            case K_CODIGO_HTML_DETALLE:
              fields.add(Constants.PR_CODIGO_HTML_DETALLE, property.getValue(), Types.text);
              break;

            case K_CODE:
              fields.add(Constants.PR_CODE, property.getValue(), Types.text);
              break;

            case K_CODIGO_BARRA:
              fields.add(Constants.PR_CODIGO_BARRA, property.getValue(), Types.text);
              break;

            case K_CODIGO_BARRA_NOMBRE:
              fields.add(Constants.PR_CODIGO_BARRA_NAME, property.getValue(), Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Types.boolean);
              break;

            case K_DESCRIP_VENTA:
              fields.add(Constants.PR_DESCRIPVENTA, property.getValue(), Types.text);
              break;

            case K_DESCRIP_COMPRA:
              fields.add(Constants.PR_DESCRIPCOMPRA, property.getValue(), Types.text);
              break;

            case K_UN_ID_COMPRA:
              fields.add(Constants.PR_UN_ID_COMPRA, property.getSelectId(), Types.id);
              break;

            case K_UN_ID_VENTA:
              fields.add(Constants.PR_UN_ID_VENTA, property.getSelectId(), Types.id);
              break;

            case K_UN_ID_STOCK:
              fields.add(Constants.PR_UN_ID_STOCK, property.getSelectId(), Types.id);
              break;

            case K_COMPRA_VENTA:
              fields.add(Constants.PR_VENTA_COMPRA, property.getValue(), Types.double);
              break;

            case K_VENTA_STOCK:
              fields.add(Constants.PR_VENTA_STOCK, property.getValue(), Types.double);
              break;

            case K_COMPRA_STOCK:
              fields.add(Constants.PR_STOCK_COMPRA, property.getValue(), Types.double);
              break;

            case K_LLEVA_STOCK:
              fields.add(Constants.PR_LLEVASTOCK, property.getValue(), Types.integer);
              break;

            case K_SE_COMPRA:
              fields.add(Constants.PR_SECOMPRA, property.getValue(), Types.integer);
              break;

            case K_SE_VENDE:
              fields.add(Constants.PR_SEVENDE, property.getValue(), Types.integer);
              break;

            case K_NO_REDONDEO:
              fields.add(Constants.PR_NO_REDONDEO, property.getValue(), Types.boolean);
              break;

            case K_DINERARIO:
              fields.add(Constants.PR_DINERARIO, property.getValue(), Types.boolean);
              break;

            case K_ES_LISTA:
              fields.add(Constants.PR_ES_LISTA, property.getValue(), Types.boolean);
              break;

            case K_TI_ID_IVA_RI_COMPRA:
              fields.add(Constants.PR_TI_ID_RI_COMPRA, property.getSelectId(), Types.id);
              break;

            case K_TI_ID_IVA_RI_VENTA:
              fields.add(Constants.PR_TI_ID_RI_VENTA, property.getSelectId(), Types.id);
              break;

            case K_TI_ID_INTERNOS_V:
              fields.add(Constants.PR_TI_ID_INTERNOS_VENTA, property.getSelectId(), Types.id);
              break;

            case K_TI_ID_INTERNOS_C:
              fields.add(Constants.PR_TI_ID_INTERNOS_COMPRA, property.getSelectId(), Types.id);
              break;

            case K_PORC_INTERNO_C:
              fields.add(Constants.PR_PORCINTERNOC, property.getValue(), Types.double);
              break;

            case K_PORC_INTERNO_V:
              fields.add(Constants.PR_PORCINTERNOV, property.getValue(), Types.double);
              break;

            case K_IBC_ID:
              fields.add(Constants.IBC_ID, property.getSelectId(), Types.id);
              break;

            case K_CUEG_ID_COMPRA:
              fields.add(Constants.PR_CUEG_ID_COMPRA, property.getSelectId(), Types.id);
              break;

            case K_CUEG_ID_VENTA:
              fields.add(Constants.PR_CUEG_ID_VENTA, property.getSelectId(), Types.id);
              break;

            case K_X:
              fields.add(Constants.PR_X, property.getValue(), Types.integer);
              break;

            case K_Y:
              fields.add(Constants.PR_Y, property.getValue(), Types.integer);
              break;

            case K_Z:
              fields.add(Constants.PR_Z, property.getValue(), Types.integer);
              break;

            case K_TIENE_HIJO:
              fields.add(Constants.PR_TIENEHIJO, property.getValue(), Types.boolean);
              break;

            case K_STOCK_MINIMO:
              fields.add(Constants.PR_STOCKMINIMO, property.getValue(), Types.double);
              break;

            case K_STOCK_MAXIMO:
              fields.add(Constants.PR_STOCKMAXIMO, property.getValue(), Types.double);
              break;

            case K_LLEVA_NRO_SERIE:
              fields.add(Constants.PR_LLEVA_NRO_SERIE, property.getValue(), Types.boolean);
              break;

            case K_LLEVA_NRO_LOTE:
              fields.add(Constants.PR_LLEVA_NRO_LOTE, property.getValue(), Types.boolean);
              break;

            case K_ESREPUESTO:
              fields.add(Constants.PR_ES_REPUESTO, property.getValue(), Types.boolean);
              break;

            case K_LOTEFIFO:
              fields.add(Constants.PR_LOTE_FIFO, property.getValue(), Types.boolean);
              break;

            case K_FLETEEXPO:
              fields.add(Constants.PR_FLETE_EXPO, property.getValue(), Types.boolean);
              break;

            case K_SEPRODUCE:
              fields.add(Constants.PR_SE_PRODUCE, property.getValue(), Types.boolean);
              break;

            case K_CODIGO_EXTERNO:
              fields.add(Constants.PR_CODIGOEXTERNO, property.getValue(), Types.text);
              break;

            case K_MARC_ID:
              fields.add(Constants.MARC_ID, property.getSelectId(), Types.id);
              break;

            case K_PESO_NETO:
              fields.add(Constants.PR_PESO_NETO, property.getValue(), Types.double);
              break;

            case K_PESO_TOTAL:
              fields.add(Constants.PR_PESO_TOTAL, property.getValue(), Types.double);
              break;

            case K_EGP_ID:
              fields.add(Constants.EGP_ID, property.getSelectId(), Types.id);
              break;

            case K_EFM_ID:
              fields.add(Constants.EFM_ID, property.getSelectId(), Types.id);
              break;

            case K_EMBL_ID:
              fields.add(Constants.EMBL_ID, property.getSelectId(), Types.id);
              break;

            case K_TI_COMEX_GANANCIAS:
              fields.add(Constants.TI_ID_COMEX_GANANCIAS, property.getSelectId(), Types.id);
              break;

            case K_TI_COMEX_IGB:
              fields.add(Constants.TI_ID_COMEX_IGB, property.getSelectId(), Types.id);
              break;

            case K_TI_COMEX_IVA:
              fields.add(Constants.TI_ID_COMEX_IVA, property.getSelectId(), Types.id);
              break;

            case K_POAR_ID:
              fields.add(Constants.POAR_ID, property.getSelectId(), Types.id);
              break;

            case K_UN_ID_PESO:
              fields.add(Constants.UN_ID_PESO, property.getSelectId(), Types.id);
              break;

            case K_CANTIDAD_X_CAJA_EXPO:
              fields.add(Constants.PR_CANT_XCAJA_EXPO, property.getValue(), Types.integer);
              break;

            case K_REPOSICION:
              fields.add(Constants.PR_REPOSICION, property.getValue(), Types.double);
              break;

            case K_RUB_ID:
              fields.add(Constants.RUB_ID, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID1:
              fields.add(Constants.RUBTIID1, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID2:
              fields.add(Constants.RUBTIID2, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID3:
              fields.add(Constants.RUBTIID3, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID4:
              fields.add(Constants.RUBTIID4, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID5:
              fields.add(Constants.RUBTIID5, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID6:
              fields.add(Constants.RUBTIID6, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID7:
              fields.add(Constants.RUBTIID7, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID8:
              fields.add(Constants.RUBTIID8, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID9:
              fields.add(Constants.RUBTIID9, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID10:
              fields.add(Constants.RUBTIID10, property.getSelectId(), Types.id);
              break;

            case K_EXPOWEB:
              fields.add(Constants.PR_EXPO_WEB, property.getValue(), Types.integer);
              break;

            case K_EXPOCAIRO:
              fields.add(Constants.PR_EXPO_CAIRO, property.getValue(), Types.integer);
              break;

            case K_VENTA_WEB_MAXIMA:
              fields.add(Constants.PR_VENTA_WEB_MAXIMA, property.getValue(), Types.double);
              break;

            case K_WEB_IMAGE_UPDATE:
              fields.add(Constants.PR_WEB_IMAGE_UPDATE, property.getValue(), Types.boolean);
              break;

            case K_WEB_IMAGE_FOLDER:
              fields.add(Constants.PR_WEB_IMAGE_FOLDER, property.getValue(), Types.text);
              break;

            case K_ES_KIT:
              kitInfo.esKit = Cairo.Util.val(property.getValue());
              fields.add(Constants.PR_ESKIT, property.getValue(), Types.boolean);
              break;

            case K_KIT_STK_X_ITEM:
              kitInfo.kitStockXItem = Cairo.Util.val(property.getValue());
              break;

            case K_KIT_RESUMIDO:
              kitInfo.kitResumido = Cairo.Util.val(property.getValue());
              break;

            case K_KIT_IDENTIDAD:
              kitInfo.kitIdentidad = Cairo.Util.val(property.getValue());
              break;

            case K_KIT_IDENTIDADXITEM:
              kitInfo.kitIdentidadXItem = Cairo.Util.val(property.getValue());
              break;

            case K_TA_ID_KITSERIE:
              kitInfo.taIdKitSerie = property.getSelectId();
              break;

            case K_KIT_LOTE:
              kitInfo.kitLote = Cairo.Util.val(property.getValue());
              break;

            case K_KIT_LOTEXITEM:
              kitInfo.kitLoteXItem = Cairo.Util.val(property.getValue());
              break;

            case K_TA_ID_KITLOTE:
              kitInfo.taIdKitLote = property.getSelectId();
              break;

            case K_CCOS_ID_COMPRA:
              fields.add(Constants.CCOS_ID_COMPRA, property.getSelectId(), Types.id);
              break;

            case K_CCOS_ID_VENTA:
              fields.add(Constants.CCOS_ID_VENTA, property.getSelectId(), Types.id);
              break;

            case K_ESPLANTILLA:
              fields.add(Constants.PR_ES_PLANTILLA, property.getValue(), Types.boolean);
              break;

            case K_CUR_ID:
              fields.add(Constants.CUR_ID, property.getSelectId(), Types.id);
              break;

            case K_RPT_ID_NOMBRE_COMPRA:
              fields.add(Constants.RPT_ID_NOMBRE_COMPRA, property.getSelectId(), Types.id);
              break;

            case K_RPT_ID_NOMBRE_VENTA:
              fields.add(Constants.RPT_ID_NOMBRE_VENTA, property.getSelectId(), Types.id);
              break;

            case K_RPT_ID_NOMBRE_FACTURA:
              fields.add(Constants.RPT_ID_NOMBRE_FACTURA, property.getSelectId(), Types.id);
              break;

            case K_RPT_ID_NOMBRE_WEB:
              fields.add(Constants.RPT_ID_NOMBRE_WEB, property.getSelectId(), Types.id);
              break;

            case K_RPT_ID_NOMBRE_IMG:
              fields.add(Constants.RPT_ID_NOMBRE_IMG, property.getSelectId(), Types.id);
              break;

            case K_RPT_ID_NOMBRE_IMG_ALT:
              fields.add(Constants.RPT_ID_NOMBRE_IMG_ALT, property.getSelectId(), Types.id);
              break;
          }
        }

        // IVA RNI
        //
        fields.add(Constants.PR_TI_ID_RNI_VENTA, -1, Types.id);
        fields.add(Constants.PR_TI_ID_RNI_COMPRA, -2, Types.id);

        //--------------------------
        // Kit
        //
        setKitConfig(kitInfo);

        fields.add(Constants.PR_KIT_STOCK_XITEM, bToI(kitInfo.kitStockXItem), Types.boolean);
        fields.add(Constants.PR_KIT_RESUMIDO, bToI(kitInfo.kitResumido), Types.boolean);
        fields.add(Constants.PR_KIT_IDENTIDAD, bToI(kitInfo.kitIdentidad), Types.boolean);
        fields.add(Constants.PR_KIT_IDENTIDAD_XITEM, bToI(kitInfo.kitIdentidadXItem), Types.boolean);
        fields.add(Constants.TA_ID_KIT_SERIE, kitInfo.taIdKitSerie, Types.id);
        fields.add(Constants.PR_KIT_LOTE, bToI(kitInfo.kitLote), Types.boolean);
        fields.add(Constants.PR_KIT_LOTE_XITEM, bToI(kitInfo.kitLoteXItem), Types.boolean);
        fields.add(Constants.TA_ID_KIT_LOTE, kitInfo.taIdKitLote, Types.id);

        m_genericEdit.save(m_dialog, register);

        register.prepareTransaction();

        // save items

        //
        // TODO: update ListaPrecioItem and price cache if needed
        //

        saveItemsProveedor(register);
        saveItemsCliente(register);
        saveItemsCMI(register);
        saveItemsLeyendas(register);
        saveItemsTags(register);
        saveItemsWebImages(register);
        saveItemsWebCatalogos(register);
        saveItemsWebCategorias(register);

        return Cairo.Database.saveTransaction(
            register,
            false,
            Constants.PR_CODE,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            Cairo.Language.getText(1352, "") // Error al grabar el Artículo

        ).then(

          function(result) {
            if(result.success) {
              m_copy = false;
              return load(result.data.getId()).then(
                function (success) {
                  if(success) {
                    updateList();
                    m_listController.updateEditorKey(self, m_id);
                  };
                  m_isNew = false;
                  return success;
                }
              );
            }
            else {
              return false;
            }
          }
        );
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
        return "#general/producto/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "producto" + id;
      };

      self.getTitle = function() {
        return Cairo.Language.getText(1283, ""); // Artículos
      };

      self.validate = function() {

        var p = null;
        var property = null;
        var bIsResumido = null;
        var bValidateIdentidad = null;
        var bValidateLote = null;
        var bNeedTalIdentidad = null;
        var bNeedTalLote = null;
        var bHaveTalIdentidad = null;
        var bHaveTalLote = null;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          
          property = m_dialog.getProperties().item(_i);
          
          switch (property.getKey()) {
            case K_NOMBRE_COMPRA:
              if(Cairo.Util.valEmpty(property.getValue(), Types.text)) {

                p = createNameFromRubro().then(
                  function(success) {
                    if(success === false) {
                      return Cairo.Modal.showInfo(Cairo.Constants.MUST_SET_A_NAME).then(function () {
                        return false;
                      });
                    }
                    else {
                      return true;
                    }
                  }
                );
              }
              break;

            case K_NOMBRE_VENTA:
              if(Cairo.Util.valEmpty(property.getValue(), Types.text) && m_seVende) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1293, "")).then(function() {return false;}); // Debe indicar un nombre de venta
              }
              break;

            case K_CODE:
              if(Cairo.Util.valEmpty(property.getValue(), Types.text)) {
                property.setValue(Cairo.Constants.GET_CODE_FROM_ID);
              }
              break;

            case K_UN_ID_COMPRA:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id) && m_seCompra) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1284, "")).then(function() {return false;}); // Debe indicar una unidad de compra
              }
              break;

            case K_UN_ID_VENTA:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id) && m_seVende) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1285, "")).then(function() {return false;}); // Debe indicar una unidad de venta
              }
              break;

            case K_UN_ID_STOCK:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id) && m_llevaStock) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1286, "")).then(function() {return false;}); // Debe indicar una unidad de stock
              }
              break;

            case K_COMPRA_VENTA:
              if(Cairo.Util.valEmpty(property.getValue(), Types.double) && m_seVende && m_seCompra) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1287, "")).then(function() {return false;}); // Debe indicar una relación entre la unidad de compra y la unidad de venta
              }
              break;

            case K_VENTA_STOCK:
              if(Cairo.Util.valEmpty(property.getValue(), Types.double) && m_seVende && m_llevaStock) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1288, "")).then(function() {return false;}); // Debe indicar una relación entre la unidad de venta y la unidad de stock
              }
              break;

            case K_COMPRA_STOCK:
              if(Cairo.Util.valEmpty(property.getValue(), Types.double) && m_llevaStock && m_seCompra) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1294, "")).then(function() {return false;}); // Debe indicar una relación entre la unidad de compra y la unidad de stock
              }
              break;

            case K_TI_ID_IVA_RI_COMPRA:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id) && m_seCompra) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1289, "")).then(function() {return false;}); // Debe indicar una tasa impositiva de compras para Responsables Inscriptos
              }
              break;

            case K_TI_ID_IVA_RI_VENTA:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id) && m_seVende) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1291, "")).then(function() {return false;}); // Debe indicar una tasa impositiva de ventas para Responsables Inscriptos
              }
              break;

            case K_CUEG_ID_COMPRA:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id) && m_seCompra) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1295, "")).then(function() {return false;}); // Debe indicar un grupo de cuentas para compras
              }
              break;

            case K_CUEG_ID_VENTA:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id) && m_seVende) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1296, "")).then(function() {return false;}); // Debe indicar un grupo de cuentas para ventas
              }
              break;

            case K_KIT_RESUMIDO:
              bIsResumido = Cairo.Util.val(property.getValue());
              break;

            case K_KIT_IDENTIDAD:
              bValidateIdentidad = Cairo.Util.val(property.getValue());
              break;

            case K_KIT_LOTE:
              bValidateLote = Cairo.Util.val(property.getValue());
              break;

            case K_KIT_IDENTIDADXITEM:
              bNeedTalIdentidad = Cairo.Util.val(property.getValue()) === 0;
              break;

            case K_KIT_LOTEXITEM:
              bNeedTalLote = Cairo.Util.val(property.getValue()) === 0;
              break;

            case K_TA_ID_KITSERIE:
              bHaveTalIdentidad = property.getSelectId() !== Cairo.Constants.NO_ID;
              break;

            case K_TA_ID_KITLOTE:
              bHaveTalLote = property.getSelectId() !== Cairo.Constants.NO_ID;
              break;
          }
        }

        if(bIsResumido) {

          if(bValidateIdentidad && bNeedTalIdentidad && !bHaveTalIdentidad) {
            return Cairo.Modal.showInfo(Cairo.Language.getText(1297, "")).then(function() {return false;}); // Debe indicar un talonario para la identidad del Kit
          }

          if(bValidateLote && bNeedTalLote && !bHaveTalLote) {
            return Cairo.Modal.showInfo(Cairo.Language.getText(1353, "")).then(function() {return false;}); // Debe indicar un talonario para el lote del Kit
          }
        }
        p = p || Cairo.Promises.resolvedPromise(true);
        return p.success(function() { return m_genericEdit.validate(m_dialog); });
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.setTreeId = function(rhs) {
        m_treeId = rhs;
      };

      self.getTreeId = function() {
        return m_treeId;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_PRODUCTO);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id,  inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        
        try {

          if(!pValidateAccessNewEdit(id)) { return p; }

          m_dialog.setInModalWindow(inModalWindow);

          m_genericEdit = new Cairo.GenericEdit();
          if(!m_genericEdit.init(Cairo.Tables.PRODUCTO)) { return p; }

          p = load(id).then(
            function(success) {
              if(success) {

                if(!loadCollection()) { return false; }

                m_editing = true;
                m_copy = false;

                if(inModalWindow) {
                  success = m_id !== Cairo.Constants.NO_ID;
                }
                else {
                  success = true;
                }

              }
              return success;
            });
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.EDIT_FUNCTION, C_MODULE, "");
        }

        return p;
      };

      self.setTree = function(rhs) {
        m_listController = rhs;
      };

      self.setBranchId = function(rhs) {
        m_branchId = rhs;
      };

      self.getBranchId = function() {
        return m_branchId;
      };

      var pValidateAccessNewEdit = function(id) {
        if(id === Cairo.Constants.NO_ID) {
          m_isNew = true;
          if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_PRODUCTO)) { return false; }
        }
        else {
          m_isNew = false;
          if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_PRODUCTO)) { return false; }
        }
        return true;
      };

      var loadCollection = function() {

        m_dialog.setMinHeight(8600);
        m_dialog.setMinWidth(12000);

        var tab_general = 0;
        var tab_compra = 1;
        var tab_stock = 2;
        var tab_venta = 3;
        var tab_rubro = TAB_RUBRO;
        var tab_comex = 5;
        var tab_kit = 6;
        var tab_proveedor = 7;
        var tab_Web = 8;
        var tab_web2 = 9;

        var w_tabs = m_dialog.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Constants.c_strGeneral);

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Language.getText(1489, "")); // Compras
        tab.setIndex(tab_compra);

        var tab = w_tabs.add(null);
        tab.setIndex(tab_stock);
        tab.setName(Cairo.Language.getText(1298, "")); // Stock

        var tab = w_tabs.add(null);
        tab.setIndex(tab_venta);
        tab.setName(Cairo.Language.getText(1059, "")); // Venta

        var tab = w_tabs.add(null);
        tab.setIndex(tab_rubro);
        tab.setName(Cairo.Language.getText(1299, "")); // Rubro

        var tab = w_tabs.add(null);
        tab.setIndex(tab_comex);
        tab.setName(Cairo.Language.getText(3523, "")); // COMEX

        var tab = w_tabs.add(null);
        tab.setIndex(tab_kit);
        tab.setName(Cairo.Language.getText(1301, "")); // Kit

        var tab = w_tabs.add(null);
        tab.setIndex(tab_proveedor);
        tab.setName(Cairo.Language.getText(4595, "")); // Terceros

        var tab = w_tabs.add(null);
        tab.setIndex(tab_Web);
        tab.setName(Cairo.Language.getText(1038, "")); // Web

        var tab = w_tabs.add(null);
        tab.setIndex(tab_web2);
        tab.setName(Cairo.Language.getText(4792, "")); // Cat. Web

        m_dialog.setTitle(m_purchaseName);

        var properties = m_dialog.getProperties();

        properties.clear();

        //////////////////////////////////////////////////////////////
        // General
        //
        var elem = properties.add(null, Constants.PR_NOMBRE_COMPRA);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setWidth(8000);
        elem.setKey(K_NOMBRE_COMPRA);
        elem.setValue(m_purchaseName);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTopFromProperty(Constants.PR_NOMBRE_COMPRA);
        elem.setLeftFromProperty(Constants.PR_NOMBRE_COMPRA);
        elem.setLeftToPrevious(8900);
        elem.setLeftLabel(-500);
        elem.setWidth(800);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.add(null, Constants.PR_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setLeftFromProperty(Constants.PR_NOMBRE_COMPRA);
        elem.setTopFromProperty(Constants.PR_NOMBRE_COMPRA);
        elem.setTopToPrevious(440);
        elem.setSize(90);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        var elem = properties.add(null, Constants.PR_CODIGOEXTERNO);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Language.getText(1305, "")); // Código Externo
        elem.setSize(30);
        elem.setKey(K_CODIGO_EXTERNO);
        elem.setValue(m_codigoExterno);

        var elem = properties.add(null, Constants.PR_CODIGO_BARRA);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Language.getText(1177, "")); // Código de Barras
        elem.setSize(255);
        elem.setKey(K_CODIGO_BARRA);
        elem.setValue(m_codigoBarra);

        var elem = properties.add(null, Constants.PR_CODIGO_BARRA_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Language.getText(1307, "")); // Nombre Código de Barras
        elem.setSize(255);
        elem.setKey(K_CODIGO_BARRA_NOMBRE);
        elem.setValue(m_codigoBarraNombre);

        var elem = properties.add(null, Constants.IBC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.INGRESOSBRUTOSCATEGORIA);
        elem.setName(Cairo.Language.getText(1308, "")); // Categoría Ingresos Brutos
        elem.setKey(K_IBC_ID);
        elem.setSelectId(m_ibc_id);
        elem.setValue(m_ingresosBrutos);
        elem.setTopFromProperty(Constants.PR_CODE);
        elem.setLeft(5500);

        var elem = properties.add(null, Constants.MARC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MARCA);
        elem.setName(Cairo.Language.getText(1310, "")); // Marca
        elem.setKey(K_MARC_ID);
        elem.setValue(m_marca);
        elem.setSelectId(m_marc_id);
        elem.setWidth(4050);

        var elem = properties.add(null, Constants.PR_EXPO_CAIRO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(Cairo.Language.getText(3898, "")); // Expo cairo
        elem.setKey(K_EXPOCAIRO);
        elem.setValue(m_expoCairo);
        elem.setWidth(1000);

        var elem = properties.add(null, Constants.PR_ES_PLANTILLA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Language.getText(4829, "")); // Es Plantilla
        elem.setKey(K_ESPLANTILLA);
        elem.setValue(bToI(m_isTemplate));
        elem.setTopFromProperty(Constants.PR_EXPO_CAIRO);
        elem.setLeft(8500);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Constants.CUR_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CURSOS);
        elem.setName(Cairo.Language.getText(4828, "")); // Curso
        elem.setKey(K_CUR_ID);
        elem.setValue(m_curso);
        elem.setSelectId(m_cur_id);
        elem.setWidth(4050);

        var elem = properties.add(null, Constants.PR_DESCRIPCOMPRA);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setHeight(660);
        elem.setWidth(8000);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setSize(2000);
        elem.setKey(K_DESCRIP_COMPRA);
        elem.setValue(m_descripcompra);
        elem.setLeftFromProperty(Constants.PR_CODE);
        elem.setTopToPrevious(440);

        //-------------------------------------------------------------------------

        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        elem.setWidth(10500);
        elem.setHeight(10);
        elem.setBackColor("#CCCCCC");
        elem.setLeft(300);
        elem.setTopToPrevious(840);

        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        elem.setFontBold(true);
        elem.setValue(Cairo.Language.getText(4854, "")); // Curso
        elem.setLeft(300);
        elem.setWidth(5000);
        elem.setTopToPrevious(140);
        elem.setHeight(285);

        var elem = properties.add(null, Constants.RPT_ID_NOMBRE_COMPRA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROCESOS);
        elem.setName(Cairo.Language.getText(4848, "")); // Proceso Nombre Compra
        elem.setKey(K_RPT_ID_NOMBRE_COMPRA);
        elem.setValue(m_rpt_nombreCompra);
        elem.setSelectId(m_rpt_id_nombreCompra);
        elem.setLeft(4000);
        elem.setWidth(6050);
        elem.setLeftLabel(-3000);
        elem.setTopToPrevious(300);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Constants.RPT_ID_NOMBRE_VENTA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROCESOS);
        elem.setName(Cairo.Language.getText(4849, "")); // Proceso Nombre Venta
        elem.setKey(K_RPT_ID_NOMBRE_VENTA);
        elem.setValue(m_rpt_nombreVenta);
        elem.setSelectId(m_rpt_id_nombreVenta);
        elem.setWidth(6050);
        elem.setLeftLabel(-3000);
        elem.setTopToPrevious(380);
        elem.setLeft(4000);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Constants.RPT_ID_NOMBRE_FACTURA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROCESOS);
        elem.setName(Cairo.Language.getText(4850, "")); // Proceso Nombre Factura
        elem.setKey(K_RPT_ID_NOMBRE_FACTURA);
        elem.setValue(m_rpt_nombrefactura);
        elem.setSelectId(m_rpt_id_nombrefactura);
        elem.setWidth(6050);
        elem.setLeftLabel(-3000);
        elem.setTopToPrevious(380);
        elem.setLeft(4000);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Constants.RPT_ID_NOMBRE_WEB);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROCESOS);
        elem.setName(Cairo.Language.getText(4851, "")); // Proceso Nombre Web
        elem.setKey(K_RPT_ID_NOMBRE_WEB);
        elem.setValue(m_rpt_nombreweb);
        elem.setSelectId(m_rpt_id_nombreweb);
        elem.setWidth(6050);
        elem.setLeftLabel(-3000);
        elem.setTopToPrevious(380);
        elem.setLeft(4000);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Constants.RPT_ID_NOMBRE_IMG);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROCESOS);
        elem.setName(Cairo.Language.getText(4852, "")); // Proceso Nombre Imagen
        elem.setKey(K_RPT_ID_NOMBRE_IMG);
        elem.setValue(m_rpt_nombreimg);
        elem.setSelectId(m_rpt_id_nombreimg);
        elem.setWidth(6050);
        elem.setLeftLabel(-3000);
        elem.setTopToPrevious(380);
        elem.setLeft(4000);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Constants.RPT_ID_NOMBRE_IMG_ALT);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROCESOS);
        elem.setName(Cairo.Language.getText(4853, "")); // Proceso Nombre Imagen Alternativa
        elem.setKey(K_RPT_ID_NOMBRE_IMG_ALT);
        elem.setValue(m_rpt_nombreimgalt);
        elem.setSelectId(m_rpt_id_nombreimgalt);
        elem.setWidth(6050);
        elem.setLeftLabel(-3000);
        elem.setTopToPrevious(380);
        elem.setLeft(4000);
        elem.setLeftNotChange(true);

        //-------------------------------------------------------------------------

        var elem = properties.add(null, Constants.PR_SECOMPRA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_compra);
        elem.setTopFromProperty(Constants.PR_NOMBRE_COMPRA);
        elem.setName(Cairo.Language.getText(1309, "")); // Se Compra
        elem.setKey(K_SE_COMPRA);
        elem.setValue(bToI(m_seCompra));

        var elem = properties.add(null, Constants.PR_UN_ID_COMPRA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.UNIDAD);
        elem.setName(Cairo.Language.getText(1165, "")); // Unidad
        elem.setTabIndex(tab_compra);
        elem.setKey(K_UN_ID_COMPRA);
        elem.setSelectId(m_un_id_compra);
        elem.setValue(m_unidadCompra);

        var elem = properties.add(null, Constants.PR_CUEG_ID_COMPRA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.GRUPO_DE_CUENTA);
        elem.setTabIndex(tab_compra);
        elem.setName(Cairo.Language.getText(1516, "")); // Grupo de Cuenta
        elem.setKey(K_CUEG_ID_COMPRA);
        elem.setSelectId(m_cueg_id_compra);
        elem.setValue(m_cuentaGCompra);
        elem.setSelectFilter("cueg_tipo = "+ Constants.AccountGroupType.productForPurchase.toString());

        var elem = properties.add(null, Constants.PR_TI_ID_RI_COMPRA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTopFromProperty(Constants.PR_UN_ID_COMPRA);
        elem.setLeft(6000);
        elem.setSelectTable(Cairo.Tables.TASA_IMPOSITIVA);
        elem.setName(Cairo.Language.getText(1317, "")); // IVA Resp. Ins.
        elem.setTabIndex(tab_compra);
        elem.setKey(K_TI_ID_IVA_RI_COMPRA);
        elem.setSelectId(m_ti_id_IVA_RI_compra);
        elem.setValue(m_tiIvaRiCompra);
        elem.setSelectFilter(Constants.filterForPurchase);

        var elem = properties.add(null, Constants.PR_TI_ID_INTERNOS_COMPRA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TASA_IMPOSITIVA);
        elem.setLeftFromProperty(Constants.PR_TI_ID_RI_COMPRA);
        elem.setTabIndex(tab_compra);
        elem.setName(Cairo.Language.getText(1319, "")); // Tasa Internos
        elem.setKey(K_TI_ID_INTERNOS_C);
        elem.setSelectId(m_ti_id_INTERNOS_c);
        elem.setValue(m_tiInternosc);
        elem.setSelectFilter(Constants.filterForPurchase);

        var elem = properties.add(null, Constants.PR_PORCINTERNOC);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_compra);
        elem.setName(Cairo.Language.getText(1320, "")); // Porcentaje Internos
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setKey(K_PORC_INTERNO_C);
        elem.setValue(m_porcInternoC);

        var elem = properties.add(null, Constants.CCOS_ID_COMPRA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTRO_COSTO);
        elem.setTabIndex(tab_compra);
        elem.setName(Cairo.Language.getText(1057, "")); // Centro de Costo
        elem.setKey(K_CCOS_ID_COMPRA);
        elem.setValue(m_centroCostoCompra);
        elem.setSelectId(m_ccos_id_compra);

        //////////////////////////////////////////////////////////////
        // Stock
        //
        var elem = properties.add(null, Constants.PR_LLEVASTOCK);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Language.getText(1321, "")); // Se tiene en Stock
        elem.setTabIndex(tab_stock);
        elem.setKey(K_LLEVA_STOCK);
        elem.setValue(bToI(m_llevaStock));

        var elem = properties.add(null, Constants.PR_UN_ID_STOCK);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.UNIDAD);
        elem.setTabIndex(tab_stock);
        elem.setName(Cairo.Language.getText(1165, "")); // Unidad
        elem.setKey(K_UN_ID_STOCK);
        elem.setSelectId(m_un_id_stock);
        elem.setValue(m_unidadStock);

        var elem = properties.add(null, Constants.PR_STOCK_COMPRA);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setName(Cairo.Language.getText(1322, "")); // Relación Stock-Compra
        elem.setTabIndex(tab_stock);
        elem.setKey(K_COMPRA_STOCK);
        elem.setValue(m_compraStock);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat("0.000000");

        var elem = properties.add(null, Constants.PR_X);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_stock);
        elem.setName(Cairo.Language.getText(1323, "")); // Posición x
        elem.setKey(K_X);
        elem.setValue(m_x);
        elem.setSubType(Dialogs.PropertySubType.integer);

        var elem = properties.add(null, Constants.PR_Y);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_stock);
        elem.setName(Cairo.Language.getText(1324, "")); // Posición y
        elem.setKey(K_Y);
        elem.setValue(m_y);
        elem.setSubType(Dialogs.PropertySubType.integer);

        var elem = properties.add(null, Constants.PR_Z);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_stock);
        elem.setName(Cairo.Language.getText(1325, "")); // Posición z
        elem.setKey(K_Z);
        elem.setValue(m_z);
        elem.setSubType(Dialogs.PropertySubType.integer);

        var elem = properties.add(null, Constants.PR_STOCKMINIMO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_stock);
        elem.setName(Cairo.Language.getText(1326, "")); // Stock Mínimo
        elem.setKey(K_STOCK_MINIMO);
        elem.setValue(m_stockMinimo);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setTopFromProperty(Constants.PR_UN_ID_STOCK);
        elem.setLeft(5700);

        var elem = properties.add(null, Constants.PR_REPOSICION);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_stock);
        elem.setName(Cairo.Language.getText(1328, "")); // Punto de Reposición
        elem.setKey(K_REPOSICION);
        elem.setValue(m_reposicion);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());

        var elem = properties.add(null, Constants.PR_STOCKMAXIMO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_stock);
        elem.setName(Cairo.Language.getText(1327, "")); // Stock Máximo
        elem.setKey(K_STOCK_MAXIMO);
        elem.setValue(m_stockMaximo);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());

        var elem = properties.add(null, Constants.PR_LLEVA_NRO_SERIE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_stock);
        elem.setName(Cairo.Language.getText(1329, "")); // Lleva Nro Serie
        elem.setKey(K_LLEVA_NRO_SERIE);
        elem.setValue(bToI(m_llevaNroSerie));
        elem.setTopFromProperty(Constants.PR_UN_ID_STOCK);
        elem.setLeft(10000);

        var elem = properties.add(null, Constants.PR_LLEVA_NRO_LOTE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_stock);
        elem.setName(Cairo.Language.getText(1330, "")); // Lleva Nro. Lote
        elem.setKey(K_LLEVA_NRO_LOTE);
        elem.setValue(bToI(m_llevaNroLote));

        var elem = properties.add(null, Constants.PR_LOTE_FIFO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_stock);
        elem.setName(Cairo.Language.getText(1331, "")); // Consume Lotes X FIFO
        elem.setKey(K_LOTEFIFO);
        elem.setValue(bToI(m_loteFifo));

        var elem = properties.add(null, Constants.PR_SE_PRODUCE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_stock);
        elem.setName(Cairo.Language.getText(1332, "")); // Se Produce
        elem.setKey(K_SEPRODUCE);
        elem.setValue(bToI(m_seProduce));

        var elem = properties.add(null, Constants.PR_ES_REPUESTO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_stock);
        elem.setName(Cairo.Language.getText(1333, "")); // Es un Repuesto
        elem.setKey(K_ESREPUESTO);
        elem.setValue(bToI(m_esRepuesto));

        //////////////////////////////////////////////////////////////
        // Ventas
        //
        var elem = properties.add(null, Constants.PR_SEVENDE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_venta);
        elem.setName(Cairo.Language.getText(1334, "")); // Se Vende
        elem.setKey(K_SE_VENDE);
        elem.setValue(bToI(m_seVende));

        var elem = properties.add(null, Constants.PR_NOMBRE_VENTA);
        elem.setType(Dialogs.PropertyType.text);
        elem.setTabIndex(tab_venta);
        elem.setTopFromProperty(Constants.PR_SEVENDE);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);
        elem.setLeft(2800);
        elem.setWidth(4950);
        elem.setLeftLabel(-700);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(255);
        elem.setKey(K_NOMBRE_VENTA);
        elem.setValue(m_saleName);

        var elem = properties.add(null, Constants.PR_NOMBRE_FACTURA);
        elem.setType(Dialogs.PropertyType.text);
        elem.setTabIndex(tab_venta);
        elem.setWidth(4950);
        elem.setName(Cairo.Language.getText(3521, "")); // Nombre Factura
        elem.setSize(255);
        elem.setKey(K_NOMBRE_FACTURA);
        elem.setValue(m_nombreFactura);

        var elem = properties.add(null, Constants.PR_UN_ID_VENTA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.UNIDAD);
        elem.setTabIndex(tab_venta);
        elem.setName(Cairo.Language.getText(1165, "")); // Unidad
        elem.setKey(K_UN_ID_VENTA);
        elem.setSelectId(m_un_id_venta);
        elem.setValue(m_unidadVenta);

        var elem = properties.add(null, Constants.PR_VENTA_COMPRA);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_venta);
        elem.setName(Cairo.Language.getText(1335, "")); // Relación Venta-Compra
        elem.setKey(K_COMPRA_VENTA);
        elem.setValue(m_compraVenta);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat("0.000000");

        var elem = properties.add(null, Constants.PR_VENTA_STOCK);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_venta);
        elem.setName(Cairo.Language.getText(1336, "")); // Relación Venta-Stock
        elem.setKey(K_VENTA_STOCK);
        elem.setValue(m_ventaStock);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat("0.000000");

        var elem = properties.add(null, Constants.PR_CUEG_ID_VENTA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.GRUPO_DE_CUENTA);
        elem.setName(Cairo.Language.getText(1516, "")); // Grupo de Cuenta
        elem.setKey(K_CUEG_ID_VENTA);
        elem.setTopFromProperty(Constants.PR_UN_ID_VENTA);
        elem.setLeft(5500);
        elem.setTabIndex(tab_venta);
        elem.setSelectId(m_cueg_id_venta);
        elem.setValue(m_cuentaGVenta);
        elem.setSelectFilter("cueg_tipo = "+ Constants.AccountGroupType.productForSale.toString());

        var elem = properties.add(null, Constants.PR_ES_LISTA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_venta);
        elem.setName(Cairo.Language.getText(1337, "")); // Es una Lista
        elem.setKey(K_ES_LISTA);
        elem.setValue(bToI(m_esLista));

        var elem = properties.add(null, Constants.PR_DINERARIO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_venta);
        elem.setName(Cairo.Language.getText(2552, "")); // Concepto Dinerario
        elem.setKey(K_DINERARIO);
        elem.setValue(bToI(m_dinerario));

        var elem = properties.add(null, Constants.PR_NO_REDONDEO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_venta);
        elem.setName(Cairo.Language.getText(3651, "")); // No Redondear
        elem.setKey(K_NO_REDONDEO);
        elem.setValue(bToI(m_noRedondeo));
        elem.setTopNotChange(true);
        elem.setLeftNotChange(true);
        elem.setTopFromProperty(Constants.PR_DINERARIO);
        elem.setLeftFromProperty(Constants.PR_DINERARIO);
        elem.setLeftToPrevious(2000);

        var elem = properties.add(null, Constants.PR_TI_ID_RI_VENTA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTopFromProperty(Constants.PR_NOMBRE_VENTA);
        elem.setLeftFromProperty(Constants.PR_CUEG_ID_VENTA);
        elem.setLeftToPrevious(3900);
        elem.setSelectTable(Cairo.Tables.TASA_IMPOSITIVA);
        elem.setName(Cairo.Language.getText(1317, "")); // IVA Resp. Ins.
        elem.setTabIndex(tab_venta);
        elem.setKey(K_TI_ID_IVA_RI_VENTA);
        elem.setSelectId(m_ti_id_IVA_RI_venta);
        elem.setValue(m_tiIvaRiVenta);
        elem.setSelectFilter(Constants.filterForSales);

        var elem = properties.add(null, Constants.PR_TI_ID_INTERNOS_VENTA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TASA_IMPOSITIVA);
        elem.setLeftFromProperty(Constants.PR_TI_ID_RI_VENTA);
        elem.setName(Cairo.Language.getText(1319, "")); // Tasa Internos
        elem.setKey(K_TI_ID_INTERNOS_V);
        elem.setTabIndex(tab_venta);
        elem.setSelectId(m_ti_id_INTERNOS_v);
        elem.setValue(m_tiInternosv);
        elem.setSelectFilter(Constants.filterForSales);

        var elem = properties.add(null, Constants.PR_PORCINTERNOV);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setName(Cairo.Language.getText(1320, "")); // Porcentaje Internos
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setKey(K_PORC_INTERNO_V);
        elem.setTabIndex(tab_venta);
        elem.setValue(m_porcInternoV);

        var elem = properties.add(null, Constants.CCOS_ID_VENTA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTRO_COSTO);
        elem.setTabIndex(tab_venta);
        elem.setName(Cairo.Language.getText(1057, "")); // Centro de Costo
        elem.setKey(K_CCOS_ID_VENTA);
        elem.setValue(m_centroCostoVenta);
        elem.setSelectId(m_ccos_id_venta);

        var elem = properties.add(null, Constants.PR_DESCRIPVENTA);
        elem.setType(Dialogs.PropertyType.text);
        elem.setTabIndex(tab_venta);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setLeftFromProperty(Constants.PR_SEVENDE);
        elem.setTopFromProperty(Constants.PR_VENTA_STOCK);
        elem.setTopToPrevious(440);
        elem.setHeight(880);
        elem.setWidth(10000);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setSize(2000);
        elem.setKey(K_DESCRIP_VENTA);
        elem.setValue(m_descripventa);

        var elem = properties.add(null, Constants.RUB_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RUBRO);
        elem.setTabIndex(tab_rubro);
        elem.setName(Cairo.Language.getText(1299, "")); // Rubro
        elem.setKey(K_RUB_ID);
        elem.setValue(m_rubro);
        elem.setSelectId(m_rub_id);

        setRubro();

        //////////////////////////////////////////////////////////////
        // COMEX
        //
        var elem = properties.add(null, Constants.UN_ID_PESO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.UNIDAD);
        elem.setName(Cairo.Language.getText(1165, "")); // Unidad
        elem.setKey(K_UN_ID_PESO);
        elem.setValue(m_unidadPeso);
        elem.setSelectId(m_un_id_peso);
        elem.setTabIndex(tab_comex);

        var elem = properties.add(null, Constants.PR_PESO_NETO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setName(Cairo.Language.getText(1311, "")); // Peso Neto
        elem.setKey(K_PESO_NETO);
        elem.setValue(m_pesoNeto);
        elem.setTabIndex(tab_comex);
        elem.setWidth(1000);

        var elem = properties.add(null, Constants.PR_PESO_TOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setName(Cairo.Language.getText(1312, "")); // Peso Total
        elem.setKey(K_PESO_TOTAL);
        elem.setValue(m_pesoTotal);
        elem.setTabIndex(tab_comex);
        elem.setWidth(1000);

        var elem = properties.add(null, Constants.PR_CANT_XCAJA_EXPO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(Cairo.Language.getText(1316, "")); // Cantidad x Caja
        elem.setKey(K_CANTIDAD_X_CAJA_EXPO);
        elem.setValue(m_cantXCajaExpo);
        elem.setTabIndex(tab_comex);
        elem.setWidth(1000);

        var elem = properties.add(null, Constants.EMBL_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.EMBALAJE);
        elem.setName(Cairo.Language.getText(1163, "")); // Embalaje
        elem.setKey(K_EMBL_ID);
        elem.setValue(m_embalaje);
        elem.setSelectId(m_embl_id);
        elem.setTabIndex(tab_comex);

        var elem = properties.add(null, Constants.PR_FLETE_EXPO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Language.getText(1315, "")); // Flete Expo
        elem.setKey(K_FLETEEXPO);
        elem.setValue(bToI(m_fleteExpo));
        elem.setTabIndex(tab_comex);

        var elem = properties.add(null, Constants.EGP_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.GRUPOS_DE_PRECIOS_DE_EXPORTACION);
        elem.setName(Cairo.Language.getText(1313, "")); // Grupo Exportación
        elem.setKey(K_EGP_ID);
        elem.setValue(m_grupoExpo);
        elem.setSelectId(m_egp_id);
        elem.setTabIndex(tab_comex);
        elem.setLeft(7000);
        elem.setLeftLabel(-2500);
        elem.setTopFromProperty(Constants.UN_ID_PESO);
        elem.setWidth(3500);

        var elem = properties.add(null, Constants.EFM_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.FAMILIA_DE_EXPORTACION);
        elem.setName(Cairo.Language.getText(1314, "")); // Familia de Exportación
        elem.setKey(K_EFM_ID);
        elem.setValue(m_familiaExpo);
        elem.setSelectId(m_efm_id);
        elem.setTabIndex(tab_comex);
        elem.setLeftLabel(-2500);
        elem.setWidth(3500);

        var elem = properties.add(null, Constants.POAR_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.POSICION_ARANCEL);
        elem.setName(Cairo.Language.getText(3275, "")); // Posición Arancelaria
        elem.setSelectId(m_poar_id);
        elem.setValue(m_posicionArancel);
        elem.setKey(K_POAR_ID);
        elem.setTabIndex(tab_comex);
        elem.setLeftLabel(-2500);
        elem.setWidth(3500);

        var elem = properties.add(null, Constants.TI_ID_COMEX_GANANCIAS);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TASA_IMPOSITIVA);
        elem.setName(Cairo.Language.getText(4974, "")); // Tasa Ganacias 3543/92
        elem.setSelectId(m_ti_id_comex_ganancias);
        elem.setValue(m_ti_comex_ganancias);
        elem.setKey(K_TI_COMEX_GANANCIAS);
        elem.setTabIndex(tab_comex);
        elem.setSelectFilter(Constants.filterForPurchase);
        elem.setLeftLabel(-2500);
        elem.setWidth(3500);

        var elem = properties.add(null, Constants.TI_ID_COMEX_IGB);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TASA_IMPOSITIVA);
        elem.setName(Cairo.Language.getText(4975, "")); // Ingresos Brutos Importaciones
        elem.setSelectId(m_ti_id_comex_igb);
        elem.setValue(m_ti_comex_igb);
        elem.setKey(K_TI_COMEX_IGB);
        elem.setTabIndex(tab_comex);
        elem.setSelectFilter(Constants.filterForPurchase);
        elem.setLeftLabel(-2500);
        elem.setWidth(3500);

        var elem = properties.add(null, Constants.TI_ID_COMEX_IVA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TASA_IMPOSITIVA);
        elem.setName(Cairo.Language.getText(4976, "")); // Tasa IVA 3431/91
        elem.setSelectId(m_ti_id_comex_iva);
        elem.setValue(m_ti_comex_iva);
        elem.setKey(K_TI_COMEX_IVA);
        elem.setTabIndex(tab_comex);
        elem.setSelectFilter(Constants.filterForPurchase);
        elem.setLeftLabel(-2500);
        elem.setWidth(3500);

        //////////////////////////////////////////////////////////////
        // Kit
        //
        var elem = properties.add(null, Constants.PR_ESKIT);
        elem.setType(Dialogs.PropertyType.check);
        elem.setLeft(1800);
        elem.setLeftLabel(-1500);
        elem.setTabIndex(tab_kit);
        elem.setName(Cairo.Language.getText(1338, "")); // Es un Kit
        elem.setKey(K_ES_KIT);
        elem.setValue(bToI(m_eskit));

        var elem = properties.add(null, Constants.PR_KIT_STOCK_XITEM);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_kit);
        elem.setName(Cairo.Language.getText(1339, "")); // Kit Stock x Item
        elem.setKey(K_KIT_STK_X_ITEM);
        elem.setValue(bToI(m_kitStkXItem));
        elem.setTopFromProperty(Constants.PR_ESKIT);
        elem.setTopNotChange(true);
        elem.setLeft(3500);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Constants.PR_KIT_RESUMIDO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_kit);
        elem.setName(Cairo.Language.getText(1340, "")); // Producción Resumida
        elem.setKey(K_KIT_RESUMIDO);
        elem.setValue(bToI(m_kitResumido));
        elem.setTopToPrevious(100);

        var elem = properties.add(null, Constants.PR_KIT_IDENTIDAD);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_kit);
        elem.setName(Cairo.Language.getText(1341, "")); // Posee Identidad
        elem.setKey(K_KIT_IDENTIDAD);
        elem.setValue(bToI(m_kitIdentidad));
        elem.setEnabled(bToI(m_kitResumido));

        var elem = properties.add(null, Constants.PR_KIT_IDENTIDAD_XITEM);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_kit);
        elem.setName(Cairo.Language.getText(1342, "")); // Identidad por Item
        elem.setLeftLabel(-1400);
        elem.setKey(K_KIT_IDENTIDADXITEM);
        elem.setValue(bToI(m_kitIdentidadXItem));
        elem.setEnabled(bToI(m_kitIdentidad));
        elem.setTopFromProperty(Constants.PR_KIT_IDENTIDAD);
        elem.setTopNotChange(true);
        elem.setLeft(4000);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Constants.TA_ID_KIT_SERIE);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setTabIndex(tab_kit);
        elem.setName(Cairo.Language.getText(1343, "")); // Talonario Serie
        elem.setKey(K_TA_ID_KITSERIE);
        elem.setValue(m_talonarioKitSerie);
        elem.setSelectId(m_ta_id_kitSerie);
        elem.setEnabled(m_kitIdentidad && !m_kitIdentidadXItem);
        elem.setWidth(3000);

        var elem = properties.add(null, Constants.PR_KIT_LOTE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_kit);
        elem.setName(Cairo.Language.getText(1344, "")); // Posee Lote
        elem.setKey(K_KIT_LOTE);
        elem.setValue(bToI(m_kitLote));
        elem.setEnabled(bToI(m_kitResumido));

        var elem = properties.add(null, Constants.PR_KIT_LOTE_XITEM);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_kit);
        elem.setName(Cairo.Language.getText(1345, "")); // Lote por Item
        elem.setKey(K_KIT_LOTEXITEM);
        elem.setValue(bToI(m_kitLoteXItem));
        elem.setEnabled(bToI(m_kitLote));

        elem.setTopFromProperty(Constants.PR_KIT_LOTE);
        elem.setTopNotChange(true);
        elem.setLeft(4000);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Constants.TA_ID_KIT_LOTE);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setTabIndex(tab_kit);
        elem.setName(Cairo.Language.getText(1346, "")); // Talonario Lote
        elem.setKey(K_TA_ID_KITLOTE);
        elem.setValue(m_talonarioKitLote);
        elem.setSelectId(m_ta_id_kitLote);
        elem.setEnabled(m_kitLote && !m_kitLoteXItem);
        elem.setWidth(3000);

        var elem = properties.add(null);
        elem.setTopFromProperty(Constants.PR_ESKIT);
        elem.setLeft(5000);
        elem.setLeftLabel(-1);
        elem.setWidth(3000);
        elem.setType(Dialogs.PropertyType.label);
        elem.setValue(Cairo.Language.getText(1347, "")); // Fórmulas de Producción
        elem.setTabIndex(tab_kit);

        var elem = properties.add(null, C_PRODUCTO_KIT);
        elem.setTop(1500);
        elem.setType(Dialogs.PropertyType.grid);
        elem.setLeftLabel(-1);
        setGridKit(elem);
        loadKit(elem);
        elem.setName(C_PRODUCTO_KIT);
        elem.setKey(K_PRODUCTO_KIT);
        elem.setTabIndex(tab_kit);
        elem.setHeight(1000);
        elem.setWidth(5000);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(false);
        elem.setGridRemoveEnabled(false);

        //////////////////////////////////////////////////////////////
        // Proveedores
        //
        var elem = properties.add(null, C_PROVEEDOR);
        elem.setType(Dialogs.PropertyType.grid);
        elem.setLeftLabel(-1);
        setGridProveedor(elem);
        loadProveedor(elem);
        elem.setName(C_PROVEEDOR);
        elem.setKey(K_PROVEEDOR);
        elem.setTabIndex(tab_proveedor);
        elem.setTop(1000);
        elem.setLeft(200);
        elem.setHeight(1950);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedProveedor = "";

        //////////////////////////////////////////////////////////////
        // Clientes
        //
        var elem = properties.add(null, C_CLIENTE);
        elem.setType(Dialogs.PropertyType.grid);
        elem.setLeftLabel(-1);
        setGridCliente(elem);
        loadCliente(elem);
        elem.setName(C_CLIENTE);
        elem.setKey(K_CLIENTE);
        elem.setTop(3000);
        elem.setLeft(200);
        elem.setHeight(950);
        elem.setTabIndex(tab_proveedor);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedCliente = "";

        //////////////////////////////////////////////////////////////
        // BOMs
        //
        var elem = properties.add(null, C_BOM);
        elem.setType(Dialogs.PropertyType.grid);
        elem.setLeftLabel(-1);
        setGridBOM(elem);
        loadBOM(elem);
        elem.setName(C_BOM);
        elem.setKey(K_BOM);
        elem.setTop(4000);
        elem.setLeft(200);
        elem.setHeight(950);
        elem.setTabIndex(tab_proveedor);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(false);
        elem.setGridRemoveEnabled(false);

        //////////////////////////////////////////////////////////////
        // Comunidad de Internet
        //
        var elem = properties.add(null, C_CMI);
        elem.setType(Dialogs.PropertyType.grid);
        elem.setLeftLabel(-1);
        setGridCMI(elem);
        loadCMI(elem);
        elem.setName(C_CMI);
        elem.setKey(K_CMI);
        elem.setTop(5000);
        elem.setLeft(200);
        elem.setHeight(1050);
        elem.setTabIndex(tab_proveedor);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedCMI = "";

        var elem = properties.add(null, C_LEYENDAS);
        elem.setType(Dialogs.PropertyType.grid);
        elem.setLeftLabel(-1);
        setGridLeyendas(elem);
        loadLeyendas(elem);
        elem.setName(C_LEYENDAS);
        elem.setKey(K_LEYENDAS);
        elem.setTop(6100);
        elem.setLeft(200);
        elem.setHeight(1050);
        elem.setTabIndex(tab_proveedor);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedLeyendas = "";

        //////////////////////////////////////////////////////////////
        // Web
        //
        var elem = properties.add(null, Constants.PR_NOMBRE_WEB);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(4950);
        elem.setLeftFromProperty(Constants.PR_NOMBRE_COMPRA);
        elem.setName(Cairo.Language.getText(3522, "")); // Nombre Web
        elem.setSize(255);
        elem.setKey(K_NOMBRE_WEB);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_nombreWeb);

        var elem = properties.add(null, Constants.PR_ALIAS_WEB);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1550);
        elem.setName(Cairo.Language.getText(3539, "")); // Alias Web
        elem.setSize(255);
        elem.setKey(K_ALIAS_WEB);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_aliasWeb);

        var elem = properties.add(null, Constants.PR_ID_WEB_PADRE);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTO);
        elem.setName(Cairo.Language.getText(5047, "")); // Producto Padre Web
        elem.setKey(K_PR_ID_WEB_PADRE);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_productowebpadre);
        elem.setSelectId(m_pr_id_webPadre);
        elem.setLeft(4600);
        elem.setWidth(1900);
        elem.setTopFromProperty(Constants.PR_ALIAS_WEB);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Constants.PR_ACTIVO_WEB);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Language.getText(3557, "")); // Activo Web
        elem.setKey(K_ACTIVOWEB);
        elem.setTabIndex(tab_Web);
        elem.setValue(bToI(m_activoWeb));
        elem.setTopFromProperty(Constants.PR_NOMBRE_WEB);
        elem.setLeft(7800);
        elem.setLeftLabel(-1100);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);

        var elem = properties.add(null, Constants.PR_WEB_IMAGE_UPDATE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Language.getText(4576, "")); // Actualizar Imagenes
        elem.setKey(K_WEB_IMAGE_UPDATE);
        elem.setTabIndex(tab_Web);
        elem.setValue(bToI(m_webImageUpdate));
        elem.setTopFromProperty(Constants.PR_NOMBRE_WEB);
        elem.setLeft(10500);
        elem.setLeftLabel(-1700);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);

        var elem = properties.add(null, Constants.PR_CODIGO_HTML);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(4950);
        elem.setName(Cairo.Language.getText(3538, "")); // Codigo Html Detalle
        elem.setSize(255);
        elem.setKey(K_CODIGO_HTML);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_codigoHtml);

        var elem = properties.add(null, Constants.PR_CODIGO_HTML_DETALLE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(4950);
        elem.setName(Cairo.Language.getText(3900, "")); // Codigo Html Detalle
        elem.setSize(255);
        elem.setKey(K_CODIGO_HTML_DETALLE);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_codigoHtmlDetalle);

        var elem = properties.add(null, Constants.PR_EXPO_WEB);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(Cairo.Language.getText(3897, "")); // Expo Web
        elem.setKey(K_EXPOWEB);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_expoWeb);
        elem.setTopFromProperty(Constants.PR_ALIAS_WEB);
        elem.setLeft(8000);
        elem.setWidth(1000);

        var elem = properties.add(null, Constants.PR_VENTA_WEB_MAXIMA);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setName(Cairo.Language.getText(3899, "")); // Venta Máxima
        elem.setKey(K_VENTA_WEB_MAXIMA);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_ventaWebMaxima);
        elem.setTopFromProperty(Constants.PR_ALIAS_WEB);
        elem.setLeft(10500);
        elem.setWidth(1000);

        var elem = properties.add(null, Constants.LEY_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LEYENDA);
        elem.setName(Cairo.Language.getText(1240, "")); // Leyenda
        elem.setKey(K_LEY_ID);
        elem.setTabIndex(tab_Web);
        elem.setSelectId(m_ley_id);
        elem.setValue(m_leyenda);
        elem.setTopFromProperty(Constants.PR_CODIGO_HTML);
        elem.setLeft(8000);
        elem.setWidth(3500);

        var elem = properties.add(null, Constants.PR_WEB_IMAGE_FOLDER);
        elem.setType(Dialogs.PropertyType.folder);
        elem.setName(Cairo.Language.getText(3587, "")); // Carpeta de Imagenes
        elem.setKey(K_WEB_IMAGE_FOLDER);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_webImageFolder);
        elem.setLeft(8000);
        elem.setWidth(3500);

        var elem = properties.add(null, C_WEB_IMAGES);
        elem.setType(Dialogs.PropertyType.grid);
        elem.setLeftLabel(-1);
        setGridWebImages(elem);
        loadWebImages(elem);
        elem.setName(C_WEB_IMAGES);
        elem.setKey(K_WEB_IMAGES);
        elem.setTabIndex(tab_Web);
        elem.setTop(2900);
        elem.setLeft(200);
        elem.setHeight(1950);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedWebImages = "";

        var elem = properties.add(null, C_TAGS);
        elem.setType(Dialogs.PropertyType.grid);
        elem.setLeftLabel(-1);
        setGridTags(elem);
        loadTags(elem);
        elem.setName(C_TAGS);
        elem.setKey(K_TAGS);
        elem.setTabIndex(tab_Web);
        elem.setTop(5300);
        elem.setLeft(200);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedTag = "";

        //---------------------------------------------

        var elem = properties.add(null, C_WEB_CATALOGS);
        elem.setType(Dialogs.PropertyType.grid);
        elem.setLeftLabel(-1);
        setGridCatalogosWeb(elem);
        loadCatalogosWeb(elem);
        elem.setName(C_WEB_CATALOGS);
        elem.setKey(K_WEB_CATALOGOS);
        elem.setTabIndex(tab_web2);
        elem.setTop(1000);
        elem.setLeft(200);
        elem.setHeight(1950);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(false);

        var elem = properties.add(null, C_WEB_CATEGORIES);
        elem.setType(Dialogs.PropertyType.grid);
        elem.setLeftLabel(-1);
        setGridCategoriasWeb(elem);
        loadCategoriasWeb(elem);
        elem.setName(C_WEB_CATEGORIES);
        elem.setKey(K_WEB_CATEGORIAS);
        elem.setTabIndex(tab_web2);
        elem.setTop(3000);
        elem.setLeft(200);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(false);

        setEnabledCompra(m_seCompra, true);
        setEnabledStock(m_llevaStock, true);
        setEnabledVenta(m_seVende, true);
        setEnabledPlantilla(true);

        m_genericEdit.loadCollection(m_dialog);

        if(!m_dialog.show(self, tab_general, true)) { return false; }

        return true;
      };

      var setRubro = function() {

        var properties = m_dialog.getProperties();

        //
        // unload all controls for the previous rubro definition
        //

        if(properties.contains(Constants.RUBTIID1)) {
          m_dialog.unloadControl(properties.item(Constants.RUBTIID1));
          properties.remove(Constants.RUBTIID1);
        }
        if(properties.contains(Constants.RUBTIID2)) {
          m_dialog.unloadControl(properties.item(Constants.RUBTIID2));
          properties.remove(Constants.RUBTIID2);
        }
        if(properties.contains(Constants.RUBTIID3)) {
          m_dialog.unloadControl(properties.item(Constants.RUBTIID3));
          properties.remove(Constants.RUBTIID3);
        }
        if(properties.contains(Constants.RUBTIID4)) {
          m_dialog.unloadControl(properties.item(Constants.RUBTIID4));
          properties.remove(Constants.RUBTIID4);
        }
        if(properties.contains(Constants.RUBTIID5)) {
          m_dialog.unloadControl(properties.item(Constants.RUBTIID5));
          properties.remove(Constants.RUBTIID5);
        }
        if(properties.contains(Constants.RUBTIID6)) {
          m_dialog.unloadControl(properties.item(Constants.RUBTIID6));
          properties.remove(Constants.RUBTIID6);
        }
        if(properties.contains(Constants.RUBTIID7)) {
          m_dialog.unloadControl(properties.item(Constants.RUBTIID7));
          properties.remove(Constants.RUBTIID7);
        }
        if(properties.contains(Constants.RUBTIID8)) {
          m_dialog.unloadControl(properties.item(Constants.RUBTIID8));
          properties.remove(Constants.RUBTIID8);
        }
        if(properties.contains(Constants.RUBTIID9)) {
          m_dialog.unloadControl(properties.item(Constants.RUBTIID9));
          properties.remove(Constants.RUBTIID9);
        }
        if(properties.contains(Constants.RUBTIID10)) {
          m_dialog.unloadControl(properties.item(Constants.RUBTIID10));
          properties.remove(Constants.RUBTIID10);
        }

        //
        // add new properties for the current rubro definition
        //
        var rubro = m_data.rubro;
        var tab_rubro = TAB_RUBRO;

        if(rubro.getRubtId1() !== Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Constants.RUBTIID1);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Constants.RUBTID + " = "+ rubro.getRubtId1().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.getTabla1());
          elem.setKey(K_RUBTI_ID1);

          elem.setTop(1800);
          elem.setLeft(2500);
          elem.setLeftLabel(-1800);

          if(rubro.getRubtiId1() !== Cairo.Constants.NO_ID) {
            elem.setValue(rubro.getTablaItem1());
            elem.setSelectId(rubro.getRubtiId1());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem1);
            elem.setSelectId(m_rubti_id1);
          }
        }

        if(rubro.getRubtId2() !== Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Constants.RUBTIID2);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Constants.RUBTID + " = "+ rubro.getRubtId2().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.getTabla2());
          elem.setKey(K_RUBTI_ID2);

          elem.setLeftLabel(-1800);

          if(rubro.getRubtiId2() !== Cairo.Constants.NO_ID) {
            elem.setValue(rubro.getTablaItem2());
            elem.setSelectId(rubro.getRubtiId2());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem2);
            elem.setSelectId(m_rubti_id2);
          }
        }

        if(rubro.getRubtId3() !== Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Constants.RUBTIID3);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Constants.RUBTID + " = "+ rubro.getRubtId3().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.getTabla3());
          elem.setKey(K_RUBTI_ID3);

          elem.setLeftLabel(-1800);

          if(rubro.getRubtiId3() !== Cairo.Constants.NO_ID) {
            elem.setValue(rubro.getTablaItem3());
            elem.setSelectId(rubro.getRubtiId3());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem3);
            elem.setSelectId(m_rubti_id3);
          }
        }

        if(rubro.getRubtId4() !== Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Constants.RUBTIID4);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Constants.RUBTID + " = "+ rubro.getRubtId4().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.getTabla4());
          elem.setKey(K_RUBTI_ID4);

          elem.setLeftLabel(-1800);

          if(rubro.getRubtiId4() !== Cairo.Constants.NO_ID) {
            elem.setValue(rubro.getTablaItem4());
            elem.setSelectId(rubro.getRubtiId4());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem4);
            elem.setSelectId(m_rubti_id4);
          }
        }

        if(rubro.getRubtId5() !== Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Constants.RUBTIID5);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Constants.RUBTID + " = "+ rubro.getRubtId5().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.getTabla5());
          elem.setKey(K_RUBTI_ID5);

          elem.setLeftLabel(-1800);

          if(rubro.getRubtiId5() !== Cairo.Constants.NO_ID) {
            elem.setValue(rubro.getTablaItem5());
            elem.setSelectId(rubro.getRubtiId5());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem5);
            elem.setSelectId(m_rubti_id5);
          }
        }

        if(rubro.getRubtId6() !== Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Constants.RUBTIID6);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Constants.RUBTID + " = "+ rubro.getRubtId6().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.getTabla6());
          elem.setKey(K_RUBTI_ID6);

          elem.setTop(1800);
          elem.setLeft(7200);
          elem.setLeftLabel(-1800);

          if(rubro.getRubtiId6() !== Cairo.Constants.NO_ID) {
            elem.setValue(rubro.getTablaItem6());
            elem.setSelectId(rubro.getRubtiId6());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem6);
            elem.setSelectId(m_rubti_id6);
          }
        }

        if(rubro.getRubtId7() !== Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Constants.RUBTIID7);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Constants.RUBTID + " = "+ rubro.getRubtId7().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.getTabla7());
          elem.setKey(K_RUBTI_ID7);

          elem.setLeftLabel(-1800);

          if(rubro.getRubtiId7() !== Cairo.Constants.NO_ID) {
            elem.setValue(rubro.getTablaItem7());
            elem.setSelectId(rubro.getRubtiId7());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem7);
            elem.setSelectId(m_rubti_id7);
          }
        }

        if(rubro.getRubtId8() !== Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Constants.RUBTIID8);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Constants.RUBTID + " = "+ rubro.getRubtId8().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.getTabla8());
          elem.setKey(K_RUBTI_ID8);

          elem.setLeftLabel(-1800);

          if(rubro.getRubtiId8() !== Cairo.Constants.NO_ID) {
            elem.setValue(rubro.getTablaItem8());
            elem.setSelectId(rubro.getRubtiId8());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem8);
            elem.setSelectId(m_rubti_id8);
          }
        }

        if(rubro.getRubtId9() !== Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Constants.RUBTIID9);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Constants.RUBTID + " = "+ rubro.getRubtId9().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.getTabla9());
          elem.setKey(K_RUBTI_ID9);

          elem.setLeftLabel(-1800);

          if(rubro.getRubtiId9() !== Cairo.Constants.NO_ID) {
            elem.setValue(rubro.getTablaItem9());
            elem.setSelectId(rubro.getRubtiId9());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem9);
            elem.setSelectId(m_rubti_id9);
          }
        }

        if(rubro.getRubtId10() !== Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Constants.RUBTIID10);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Constants.RUBTID + " = "+ rubro.getRubtId10().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.getTabla10());
          elem.setKey(K_RUBTI_ID10);

          elem.setLeftLabel(-1800);

          if(rubro.getRubtiId10() !== Cairo.Constants.NO_ID) {
            elem.setValue(rubro.getTablaItem10());
            elem.setSelectId(rubro.getRubtiId10());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem10);
            elem.setSelectId(m_rubti_id10);
          }
        }
      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/producto]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== Cairo.Constants.NO_ID) {

              m_id = Cairo.Database.valField(response.data, Constants.PR_ID);
              m_purchaseName = Cairo.Database.valField(response.data, Constants.PR_NOMBRE_COMPRA);
              m_saleName = Cairo.Database.valField(response.data, Constants.PR_NOMBRE_VENTA);
              m_nombreFactura = Cairo.Database.valField(response.data, Constants.PR_NOMBRE_FACTURA);
              m_nombreWeb = Cairo.Database.valField(response.data, Constants.PR_NOMBRE_WEB);
              m_aliasWeb = Cairo.Database.valField(response.data, Constants.PR_ALIAS_WEB);
              m_activoWeb = Cairo.Database.valField(response.data, Constants.PR_ACTIVO_WEB);
              m_codigoHtml = Cairo.Database.valField(response.data, Constants.PR_CODIGO_HTML);
              m_codigoHtmlDetalle = Cairo.Database.valField(response.data, Constants.PR_CODIGO_HTML_DETALLE);
              m_code = Cairo.Database.valField(response.data, Constants.PR_CODE);
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_descripventa = Cairo.Database.valField(response.data, Constants.PR_DESCRIPVENTA);
              m_descripcompra = Cairo.Database.valField(response.data, Constants.PR_DESCRIPCOMPRA);
              m_compraVenta = Cairo.Database.valField(response.data, Constants.PR_VENTA_COMPRA);
              m_ventaStock = Cairo.Database.valField(response.data, Constants.PR_VENTA_STOCK);
              m_compraStock = Cairo.Database.valField(response.data, Constants.PR_STOCK_COMPRA);
              m_llevaStock = Cairo.Database.valField(response.data, Constants.PR_LLEVASTOCK);
              m_seCompra = Cairo.Database.valField(response.data, Constants.PR_SECOMPRA);
              m_seVende = Cairo.Database.valField(response.data, Constants.PR_SEVENDE);
              m_dinerario = Cairo.Database.valField(response.data, Constants.PR_DINERARIO);
              m_noRedondeo = Cairo.Database.valField(response.data, Constants.PR_NO_REDONDEO);
              m_eskit = Cairo.Database.valField(response.data, Constants.PR_ESKIT);

              m_kitResumido = Cairo.Database.valField(response.data, Constants.PR_KIT_RESUMIDO);
              m_kitIdentidad = Cairo.Database.valField(response.data, Constants.PR_KIT_IDENTIDAD);
              m_kitIdentidadXItem = Cairo.Database.valField(response.data, Constants.PR_KIT_IDENTIDAD_XITEM);
              m_kitLote = Cairo.Database.valField(response.data, Constants.PR_KIT_LOTE);
              m_kitLoteXItem = Cairo.Database.valField(response.data, Constants.PR_KIT_LOTE_XITEM);
              m_talonarioKitSerie = Cairo.Database.valField(response.data, "TalonarioSerie");
              m_talonarioKitLote = Cairo.Database.valField(response.data, "TalonarioLote");
              m_ta_id_kitSerie = Cairo.Database.valField(response.data, Constants.TA_ID_KIT_SERIE);
              m_ta_id_kitLote = Cairo.Database.valField(response.data, Constants.TA_ID_KIT_LOTE);

              m_kitStkXItem = Cairo.Database.valField(response.data, Constants.PR_KIT_STOCK_XITEM);
              m_esLista = Cairo.Database.valField(response.data, Constants.PR_ES_LISTA);

              m_un_id_compra = Cairo.Database.valField(response.data, Constants.PR_UN_ID_COMPRA);
              m_un_id_venta = Cairo.Database.valField(response.data, Constants.PR_UN_ID_VENTA);
              m_un_id_stock = Cairo.Database.valField(response.data, Constants.PR_UN_ID_STOCK);
              m_ti_id_IVA_RI_compra = Cairo.Database.valField(response.data, Constants.PR_TI_ID_RI_COMPRA);
              m_ti_id_ivarnicompra = Cairo.Database.valField(response.data, Constants.PR_TI_ID_RNI_COMPRA);
              m_ti_id_IVA_RI_venta = Cairo.Database.valField(response.data, Constants.PR_TI_ID_RI_VENTA);
              m_ti_id_ivarniventa = Cairo.Database.valField(response.data, Constants.PR_TI_ID_RNI_VENTA);
              m_ti_id_INTERNOS_v = Cairo.Database.valField(response.data, Constants.PR_TI_ID_INTERNOS_VENTA);
              m_ti_id_INTERNOS_c = Cairo.Database.valField(response.data, Constants.PR_TI_ID_INTERNOS_COMPRA);
              m_ibc_id = Cairo.Database.valField(response.data, Constants.IBC_ID);
              m_cueg_id_compra = Cairo.Database.valField(response.data, Constants.PR_CUEG_ID_COMPRA);
              m_cueg_id_venta = Cairo.Database.valField(response.data, Constants.PR_CUEG_ID_VENTA);
              m_porcInternoC = Cairo.Database.valField(response.data, Constants.PR_PORCINTERNOC);
              m_porcInternoV = Cairo.Database.valField(response.data, Constants.PR_PORCINTERNOV);
              m_marca = Cairo.Database.valField(response.data, Constants.MARC_NAME);
              m_marc_id = Cairo.Database.valField(response.data, Constants.MARC_ID);

              m_tiIvaRiCompra = Cairo.Database.valField(response.data, "ric");
              m_tiIvaRniCompra = Cairo.Database.valField(response.data, "rnic");
              m_tiIvaRiVenta = Cairo.Database.valField(response.data, "riv");
              m_tiIvaRniVenta = Cairo.Database.valField(response.data, "rniv");
              m_tiInternosv = Cairo.Database.valField(response.data, "iv");
              m_tiInternosc = Cairo.Database.valField(response.data, "ic");
              m_ingresosBrutos = Cairo.Database.valField(response.data, Constants.IBC_NAME);
              m_cuentaGCompra = Cairo.Database.valField(response.data, "cc");
              m_cuentaGVenta = Cairo.Database.valField(response.data, "cv");
              m_unidadCompra = Cairo.Database.valField(response.data, "uc");
              m_unidadVenta = Cairo.Database.valField(response.data, "uv");
              m_unidadStock = Cairo.Database.valField(response.data, "us");

              m_x = Cairo.Database.valField(response.data, Constants.PR_X);
              m_y = Cairo.Database.valField(response.data, Constants.PR_Y);
              m_z = Cairo.Database.valField(response.data, Constants.PR_Z);
              m_tieneHijo = Cairo.Database.valField(response.data, Constants.PR_TIENEHIJO);
              m_id_Padre = Cairo.Database.valField(response.data, Constants.PR_ID_PADRE);
              m_editarPrecioHijo = Cairo.Database.valField(response.data, Constants.PR_EDITAR_PRECIOHIJO);
              m_permiteEdicion = Cairo.Database.valField(response.data, Constants.PR_PERMITEEDICION);
              m_borrado = Cairo.Database.valField(response.data, Constants.PR_BORRADO);
              m_stockMinimo = Cairo.Database.valField(response.data, Constants.PR_STOCKMINIMO);
              m_stockMaximo = Cairo.Database.valField(response.data, Constants.PR_STOCKMAXIMO);
              m_codigoExterno = Cairo.Database.valField(response.data, Constants.PR_CODIGOEXTERNO);
              m_codigoBarra = Cairo.Database.valField(response.data, Constants.PR_CODIGO_BARRA);
              m_codigoBarraNombre = Cairo.Database.valField(response.data, Constants.PR_CODIGO_BARRA_NAME);
              m_reposicion = Cairo.Database.valField(response.data, Constants.PR_REPOSICION);
              m_llevaNroLote = Cairo.Database.valField(response.data, Constants.PR_LLEVA_NRO_LOTE);
              m_loteFifo = Cairo.Database.valField(response.data, Constants.PR_LOTE_FIFO);
              m_esRepuesto = Cairo.Database.valField(response.data, Constants.PR_ES_REPUESTO);
              m_llevaNroSerie = Cairo.Database.valField(response.data, Constants.PR_LLEVA_NRO_SERIE);
              m_seProduce = Cairo.Database.valField(response.data, Constants.PR_SE_PRODUCE);
              m_rub_id = Cairo.Database.valField(response.data, Constants.RUB_ID);
              m_rubro = Cairo.Database.valField(response.data, Constants.RUB_NAME);

              m_rubti_id1 = Cairo.Database.valField(response.data, Constants.RUBTIID1);
              m_rubti_id2 = Cairo.Database.valField(response.data, Constants.RUBTIID2);
              m_rubti_id3 = Cairo.Database.valField(response.data, Constants.RUBTIID3);
              m_rubti_id4 = Cairo.Database.valField(response.data, Constants.RUBTIID4);
              m_rubti_id5 = Cairo.Database.valField(response.data, Constants.RUBTIID5);
              m_rubti_id6 = Cairo.Database.valField(response.data, Constants.RUBTIID6);
              m_rubti_id7 = Cairo.Database.valField(response.data, Constants.RUBTIID7);
              m_rubti_id8 = Cairo.Database.valField(response.data, Constants.RUBTIID8);
              m_rubti_id9 = Cairo.Database.valField(response.data, Constants.RUBTIID9);
              m_rubti_id10 = Cairo.Database.valField(response.data, Constants.RUBTIID10);

              m_tablaItem1 = Cairo.Database.valField(response.data, "rubroi1");
              m_tablaItem2 = Cairo.Database.valField(response.data, "rubroi2");
              m_tablaItem3 = Cairo.Database.valField(response.data, "rubroi3");
              m_tablaItem4 = Cairo.Database.valField(response.data, "rubroi4");
              m_tablaItem5 = Cairo.Database.valField(response.data, "rubroi5");
              m_tablaItem6 = Cairo.Database.valField(response.data, "rubroi6");
              m_tablaItem7 = Cairo.Database.valField(response.data, "rubroi7");
              m_tablaItem8 = Cairo.Database.valField(response.data, "rubroi8");
              m_tablaItem9 = Cairo.Database.valField(response.data, "rubroi9");
              m_tablaItem10 = Cairo.Database.valField(response.data, "rubroi10");

              m_pesoNeto = Cairo.Database.valField(response.data, Constants.PR_PESO_NETO);
              m_pesoTotal = Cairo.Database.valField(response.data, Constants.PR_PESO_TOTAL);

              m_fleteExpo = Cairo.Database.valField(response.data, Constants.PR_FLETE_EXPO);

              m_egp_id = Cairo.Database.valField(response.data, Constants.EGP_ID);
              m_grupoExpo = Cairo.Database.valField(response.data, Constants.EGP_NAME);

              m_efm_id = Cairo.Database.valField(response.data, Constants.EFM_ID);
              m_familiaExpo = Cairo.Database.valField(response.data, Constants.EFM_NAME);

              m_cantXCajaExpo = Cairo.Database.valField(response.data, Constants.PR_CANT_XCAJA_EXPO);
              m_un_id_peso = Cairo.Database.valField(response.data, Constants.UN_ID_PESO);
              m_unidadPeso = Cairo.Database.valField(response.data, "up");

              m_embl_id = Cairo.Database.valField(response.data, Constants.EMBL_ID);
              m_embalaje = Cairo.Database.valField(response.data, Constants.EMBL_NAME);

              m_expoCairo = Cairo.Database.valField(response.data, Constants.PR_EXPO_CAIRO);
              m_expoWeb = Cairo.Database.valField(response.data, Constants.PR_EXPO_WEB);
              m_ventaWebMaxima = Cairo.Database.valField(response.data, Constants.PR_VENTA_WEB_MAXIMA);
              m_ley_id = Cairo.Database.valField(response.data, Constants.LEY_ID);
              m_leyenda = Cairo.Database.valField(response.data, Constants.LEY_NAME);
              m_webImageFolder = Cairo.Database.valField(response.data, Constants.PR_WEB_IMAGE_FOLDER);
              m_webImageUpdate = Cairo.Database.valField(response.data, Constants.PR_WEB_IMAGE_UPDATE);

              m_centroCostoCompra = Cairo.Database.valField(response.data, "centro_costo_compra");
              m_ccos_id_compra = Cairo.Database.valField(response.data, Constants.CCOS_ID_COMPRA);

              m_centroCostoVenta = Cairo.Database.valField(response.data, "centro_costo_venta");
              m_ccos_id_venta = Cairo.Database.valField(response.data, Constants.CCOS_ID_VENTA);

              m_isTemplate = Cairo.Database.valField(response.data, Constants.PR_ES_PLANTILLA);
              m_cur_id = Cairo.Database.valField(response.data, Constants.CUR_ID);
              m_curso = Cairo.Database.valField(response.data, Constants.CUR_NAME);

              m_rpt_id_nombreCompra = Cairo.Database.valField(response.data, Constants.RPT_ID_NOMBRE_COMPRA);
              m_rpt_nombreCompra = Cairo.Database.valField(response.data, "rpt_nombreCompra");

              m_rpt_id_nombreVenta = Cairo.Database.valField(response.data, Constants.RPT_ID_NOMBRE_VENTA);
              m_rpt_nombreVenta = Cairo.Database.valField(response.data, "rpt_nombreVenta");

              m_rpt_id_nombrefactura = Cairo.Database.valField(response.data, Constants.RPT_ID_NOMBRE_FACTURA);
              m_rpt_nombrefactura = Cairo.Database.valField(response.data, "rpt_nombrefactura");

              m_rpt_id_nombreweb = Cairo.Database.valField(response.data, Constants.RPT_ID_NOMBRE_WEB);
              m_rpt_nombreweb = Cairo.Database.valField(response.data, "rpt_nombreweb");

              m_rpt_id_nombreimg = Cairo.Database.valField(response.data, Constants.RPT_ID_NOMBRE_IMG);
              m_rpt_nombreimg = Cairo.Database.valField(response.data, "rpt_nombreimg");

              m_rpt_id_nombreimgalt = Cairo.Database.valField(response.data, Constants.RPT_ID_NOMBRE_IMG_ALT);
              m_rpt_nombreimgalt = Cairo.Database.valField(response.data, "rpt_nombreimgalt");

              m_ti_id_comex_ganancias = Cairo.Database.valField(response.data, Constants.TI_ID_COMEX_GANANCIAS);
              m_ti_comex_ganancias = Cairo.Database.valField(response.data, "tiComexGanancias");

              m_ti_id_comex_igb = Cairo.Database.valField(response.data, Constants.TI_ID_COMEX_IGB);
              m_ti_comex_igb = Cairo.Database.valField(response.data, "tiComexIGB");

              m_ti_id_comex_iva = Cairo.Database.valField(response.data, Constants.TI_ID_COMEX_IVA);
              m_ti_comex_iva = Cairo.Database.valField(response.data, "tiComexIVA");

              m_poar_id = Cairo.Database.valField(response.data, Constants.POAR_ID);
              m_posicionArancel = Cairo.Database.valField(response.data, Constants.POAR_NAME);

              m_productowebpadre = Cairo.Database.valField(response.data, "webpadre");
              m_pr_id_webPadre = Cairo.Database.valField(response.data, Constants.PR_ID_WEB_PADRE);

            }
            else {

              m_id = Cairo.Constants.NO_ID;
              m_purchaseName = "";
              m_saleName = "";
              m_nombreFactura = "";
              m_nombreWeb = "";
              m_code = "";
              m_aliasWeb = "";
              m_activoWeb = false;
              m_codigoHtml = "";
              m_codigoHtmlDetalle = "";
              m_active = true;
              m_descripventa = "";
              m_descripcompra = "";
              m_un_id_compra = Cairo.Constants.NO_ID;
              m_un_id_venta = Cairo.Constants.NO_ID;
              m_un_id_stock = Cairo.Constants.NO_ID;
              m_compraVenta = 0;
              m_ventaStock = 0;
              m_compraStock = 0;
              m_llevaStock = 0;
              m_seCompra = 0;
              m_seVende = 0;
              m_dinerario = false;
              m_noRedondeo = false;
              m_eskit = false;

              m_kitResumido = false;
              m_kitIdentidad = false;
              m_kitIdentidadXItem = false;
              m_kitLote = false;
              m_kitLoteXItem = false;
              m_talonarioKitSerie = "";
              m_talonarioKitLote = "";
              m_ta_id_kitSerie = Cairo.Constants.NO_ID;
              m_ta_id_kitLote = Cairo.Constants.NO_ID;

              m_kitStkXItem = false;
              m_esLista = false;
              m_ti_id_IVA_RI_compra = Cairo.Constants.NO_ID;
              m_ti_id_ivarnicompra = Cairo.Constants.NO_ID;
              m_ti_id_IVA_RI_venta = Cairo.Constants.NO_ID;
              m_ti_id_ivarniventa = Cairo.Constants.NO_ID;
              m_ti_id_INTERNOS_v = Cairo.Constants.NO_ID;
              m_ti_id_INTERNOS_c = Cairo.Constants.NO_ID;
              m_porcInternoC = 0;
              m_porcInternoV = 0;
              m_ibc_id = Cairo.Constants.NO_ID;
              m_cueg_id_compra = Cairo.Constants.NO_ID;
              m_cueg_id_venta = Cairo.Constants.NO_ID;
              m_x = 0;
              m_y = 0;
              m_z = 0;
              m_tieneHijo = false;
              m_id_Padre = Cairo.Constants.NO_ID;
              m_editarPrecioHijo = false;
              m_permiteEdicion = false;
              m_borrado = false;
              m_stockMinimo = 0;
              m_stockMaximo = 0;
              m_codigoExterno = "";
              m_codigoBarra = "";
              m_codigoBarraNombre = "";
              m_reposicion = 0;
              m_llevaNroLote = 0;
              m_loteFifo = 0;
              m_llevaNroSerie = 0;
              m_seProduce = 0;
              m_esRepuesto = 0;

              m_marca = "";
              m_marc_id = Cairo.Constants.NO_ID;

              m_tiIvaRiCompra = "";
              m_tiIvaRniCompra = "";
              m_tiIvaRiVenta = "";
              m_tiIvaRniVenta = "";
              m_tiInternosv = "";
              m_tiInternosc = "";
              m_ingresosBrutos = "";
              m_cuentaGCompra = "";
              m_cuentaGVenta = "";
              m_unidadCompra = "";
              m_unidadVenta = "";
              m_unidadStock = "";

              m_rub_id = Cairo.Constants.NO_ID;
              m_rubro = "";

              m_rubti_id1 = Cairo.Constants.NO_ID;
              m_rubti_id2 = Cairo.Constants.NO_ID;
              m_rubti_id3 = Cairo.Constants.NO_ID;
              m_rubti_id4 = Cairo.Constants.NO_ID;
              m_rubti_id5 = Cairo.Constants.NO_ID;
              m_rubti_id6 = Cairo.Constants.NO_ID;
              m_rubti_id7 = Cairo.Constants.NO_ID;
              m_rubti_id8 = Cairo.Constants.NO_ID;
              m_rubti_id9 = Cairo.Constants.NO_ID;
              m_rubti_id10 = Cairo.Constants.NO_ID;

              m_tablaItem1 = "";
              m_tablaItem2 = "";
              m_tablaItem3 = "";
              m_tablaItem4 = "";
              m_tablaItem5 = "";
              m_tablaItem6 = "";
              m_tablaItem7 = "";
              m_tablaItem8 = "";
              m_tablaItem9 = "";
              m_tablaItem10 = "";

              m_pesoNeto = 0;
              m_pesoTotal = 0;
              m_fleteExpo = false;
              m_egp_id = Cairo.Constants.NO_ID;
              m_grupoExpo = "";
              m_efm_id = Cairo.Constants.NO_ID;
              m_familiaExpo = "";
              m_cantXCajaExpo = 0;
              m_un_id_peso = Cairo.Constants.NO_ID;
              m_unidadPeso = "";

              m_embl_id = Cairo.Constants.NO_ID;
              m_embalaje = "";

              m_expoCairo = 50;
              m_expoWeb = 50;
              m_ventaWebMaxima = 99999;
              m_ley_id = Cairo.Constants.NO_ID;
              m_leyenda = "";

              m_webImageFolder = "";
              m_webImageUpdate = true;

              m_centroCostoCompra = "";
              m_ccos_id_compra = Cairo.Constants.NO_ID;

              m_centroCostoVenta = "";
              m_ccos_id_venta = Cairo.Constants.NO_ID;

              m_isTemplate = 0;
              m_cur_id = Cairo.Constants.NO_ID;
              m_curso = "";

              m_rpt_id_nombreCompra = Cairo.Constants.NO_ID;
              m_rpt_nombreCompra = "";

              m_rpt_id_nombreVenta = Cairo.Constants.NO_ID;
              m_rpt_nombreVenta = "";

              m_rpt_id_nombrefactura = Cairo.Constants.NO_ID;
              m_rpt_nombrefactura = "";

              m_rpt_id_nombreweb = Cairo.Constants.NO_ID;
              m_rpt_nombreweb = "";

              m_rpt_id_nombreimg = Cairo.Constants.NO_ID;
              m_rpt_nombreimg = "";

              m_rpt_id_nombreimgalt = Cairo.Constants.NO_ID;
              m_rpt_nombreimgalt = "";

              m_ti_id_comex_ganancias = Cairo.Constants.NO_ID;
              m_ti_comex_ganancias = "";

              m_ti_id_comex_igb = Cairo.Constants.NO_ID;
              m_ti_comex_igb = "";

              m_ti_id_comex_iva = Cairo.Constants.NO_ID;
              m_ti_comex_iva = "";

              m_poar_id = Cairo.Constants.NO_ID;
              m_posicionArancel = "";

              m_productowebpadre = "";
              m_pr_id_webPadre = Cairo.Constants.NO_ID;

            }

            m_rubroHasChanged = m_lastRubId !== m_rub_id;
            m_lastRubId = m_rub_id;

            if(!m_genericEdit.Load(m_id)) { return false; }

            return true;
          });
      };

      var refreshCollection = function() {

        setEnabledPlantilla();

        m_dialog.setTitle(m_purchaseName);

        var properties = m_dialog.getProperties();

        //////////////////////////////////////////////////////////////
        // Compras
        //
        var property = properties.item(Constants.PR_NOMBRE_COMPRA);
        property.setValue(m_purchaseName);

        var property = properties.item(Cairo.Constants.ACTIVE);
        property.setValue(m_active === true ? 1 : 0);

        var property = properties.item(Constants.PR_CODE);
        property.setValue(m_code);

        var property = properties.item(Constants.PR_CODIGOEXTERNO);
        property.setValue(m_codigoExterno);

        var property = properties.item(Constants.PR_CODIGO_BARRA);
        property.setValue(m_codigoBarra);

        var property = properties.item(Constants.PR_CODIGO_BARRA_NAME);
        property.setValue(m_codigoBarraNombre);

        var property = properties.item(Constants.IBC_ID);
        property.setSelectId(m_ibc_id);
        property.setValue(m_ingresosBrutos);

        var property = properties.item(Constants.PR_ES_PLANTILLA);
        property.setValue(m_isTemplate);

        var property = properties.item(Constants.CUR_ID);
        property.setValue(m_curso);
        property.setSelectId(m_cur_id);

        var property = properties.item(Constants.PR_DESCRIPCOMPRA);
        property.setValue(m_descripcompra);

        var property = properties.item(Constants.RPT_ID_NOMBRE_COMPRA);
        property.setValue(m_rpt_nombreCompra);
        property.setSelectId(m_rpt_id_nombreCompra);

        var property = properties.item(Constants.RPT_ID_NOMBRE_VENTA);
        property.setValue(m_rpt_nombreVenta);
        property.setSelectId(m_rpt_id_nombreVenta);

        var property = properties.item(Constants.RPT_ID_NOMBRE_FACTURA);
        property.setValue(m_rpt_nombrefactura);
        property.setSelectId(m_rpt_id_nombrefactura);

        var property = properties.item(Constants.RPT_ID_NOMBRE_WEB);
        property.setValue(m_rpt_nombreweb);
        property.setSelectId(m_rpt_id_nombreweb);

        var property = properties.item(Constants.RPT_ID_NOMBRE_IMG);
        property.setValue(m_rpt_nombreimg);
        property.setSelectId(m_rpt_id_nombreimg);

        var property = properties.item(Constants.RPT_ID_NOMBRE_IMG_ALT);
        property.setValue(m_rpt_nombreimgalt);
        property.setSelectId(m_rpt_id_nombreimgalt);

        var property = properties.item(Constants.PR_SECOMPRA);
        property.setValue(bToI(m_seCompra));

        var property = properties.item(Constants.PR_UN_ID_COMPRA);
        property.setSelectId(m_un_id_compra);
        property.setValue(m_unidadCompra);

        var property = properties.item(Constants.PR_CUEG_ID_COMPRA);
        property.setSelectId(m_cueg_id_compra);
        property.setValue(m_cuentaGCompra);

        var property = properties.item(Constants.CCOS_ID_COMPRA);
        property.setSelectId(m_ccos_id_compra);
        property.setValue(m_centroCostoCompra);

        var property = properties.item(Constants.MARC_ID);
        property.setValue(m_marca);
        property.setSelectId(m_marc_id);

        var property = properties.item(Constants.UN_ID_PESO);
        property.setValue(m_unidadPeso);
        property.setSelectId(m_un_id_peso);

        var property = properties.item(Constants.PR_PESO_NETO);
        property.setValue(m_pesoNeto);

        var property = properties.item(Constants.PR_PESO_TOTAL);
        property.setValue(m_pesoTotal);

        var property = properties.item(Constants.EGP_ID);
        property.setValue(m_grupoExpo);
        property.setSelectId(m_egp_id);

        var property = properties.item(Constants.EFM_ID);
        property.setValue(m_familiaExpo);
        property.setSelectId(m_efm_id);

        var property = properties.item(Constants.PR_FLETE_EXPO);
        property.setValue(bToI(m_fleteExpo));

        var property = properties.item(Constants.PR_CANT_XCAJA_EXPO);
        property.setValue(m_cantXCajaExpo);

        var property = properties.item(Constants.EMBL_ID);
        property.setValue(m_embalaje);
        property.setSelectId(m_embl_id);

        var property = properties.item(Constants.TI_ID_COMEX_GANANCIAS);
        property.setSelectId(m_ti_id_comex_ganancias);
        property.setValue(m_ti_comex_ganancias);

        var property = properties.item(Constants.TI_ID_COMEX_IGB);
        property.setSelectId(m_ti_id_comex_igb);
        property.setValue(m_ti_comex_igb);

        var property = properties.item(Constants.TI_ID_COMEX_IVA);
        property.setSelectId(m_ti_id_comex_iva);
        property.setValue(m_ti_comex_iva);

        var property = properties.item(Constants.POAR_ID);
        property.setSelectId(m_poar_id);
        property.setValue(m_posicionArancel);

        var property = properties.item(Constants.PR_EXPO_WEB);
        property.setValue(m_expoWeb);

        var property = properties.item(Constants.PR_EXPO_CAIRO);
        property.setValue(m_expoCairo);

        var property = properties.item(Constants.PR_VENTA_WEB_MAXIMA);
        property.setValue(m_ventaWebMaxima);

        var property = properties.item(Constants.LEY_ID);
        property.setValue(m_leyenda);
        property.setSelectId(m_ley_id);

        var property = properties.item(Constants.PR_WEB_IMAGE_FOLDER);
        property.setValue(m_webImageFolder);

        var property = properties.item(Constants.PR_WEB_IMAGE_UPDATE);
        property.setValue(bToI(m_webImageUpdate));

        var property = properties.item(Constants.PR_TI_ID_RI_COMPRA);
        property.setValue(m_tiIvaRiCompra);
        property.setSelectId(m_ti_id_IVA_RI_compra);

        var property = properties.item(Constants.PR_TI_ID_INTERNOS_COMPRA);
        property.setValue(m_tiInternosc);
        property.setSelectId(m_ti_id_INTERNOS_c);

        var property = properties.item(Constants.PR_PORCINTERNOC);
        property.setValue(m_porcInternoC);

        //////////////////////////////////////////////////////////////
        // Stock
        //
        var property = properties.item(Constants.PR_LLEVASTOCK);
        property.setValue(bToI(m_llevaStock));

        var property = properties.item(Constants.PR_UN_ID_STOCK);
        property.setValue(m_unidadStock);
        property.setSelectId(m_un_id_stock);

        var property = properties.item(Constants.PR_STOCK_COMPRA);
        property.setValue(m_compraStock);

        var property = properties.item(Constants.PR_X);
        property.setValue(m_x);

        var property = properties.item(Constants.PR_Y);
        property.setValue(m_y);

        var property = properties.item(Constants.PR_Z);
        property.setValue(m_z);

        var property = properties.item(Constants.PR_STOCKMINIMO);
        property.setValue(m_stockMinimo);

        var property = properties.item(Constants.PR_STOCKMAXIMO);
        property.setValue(m_stockMaximo);

        var property = properties.item(Constants.PR_REPOSICION);
        property.setValue(m_reposicion);

        var property = properties.item(Constants.PR_LLEVA_NRO_SERIE);
        property.setValue(bToI(m_llevaNroSerie));

        var property = properties.item(Constants.PR_LLEVA_NRO_LOTE);
        property.setValue(bToI(m_llevaNroLote));

        var property = properties.item(Constants.PR_LOTE_FIFO);
        property.setValue(bToI(m_loteFifo));

        var property = properties.item(Constants.PR_SE_PRODUCE);
        property.setValue(bToI(m_seProduce));

        var property = properties.item(Constants.PR_ES_REPUESTO);
        property.setValue(bToI(m_esRepuesto));

        //////////////////////////////////////////////////////////////
        // Ventas
        //
        var property = properties.item(Constants.PR_SEVENDE);
        property.setValue(bToI(m_seVende));

        var property = properties.item(Constants.PR_NOMBRE_VENTA);
        property.setValue(m_saleName);

        var property = properties.item(Constants.PR_NOMBRE_FACTURA);
        property.setValue(m_nombreFactura);

        var property = properties.item(Constants.PR_UN_ID_VENTA);
        property.setValue(m_unidadVenta);
        property.setSelectId(m_un_id_venta);

        var property = properties.item(Constants.PR_VENTA_COMPRA);
        property.setValue(m_compraVenta);

        var property = properties.item(Constants.PR_VENTA_STOCK);
        property.setValue(m_ventaStock);

        var property = properties.item(Constants.PR_CUEG_ID_VENTA);
        property.setSelectId(m_cueg_id_venta);
        property.setValue(m_cuentaGVenta);

        var property = properties.item(Constants.PR_ES_LISTA);
        property.setValue(bToI(m_esLista));

        var property = properties.item(Constants.PR_TI_ID_RI_VENTA);
        property.setValue(m_tiIvaRiVenta);
        property.setSelectId(m_ti_id_IVA_RI_venta);

        var property = properties.item(Constants.PR_TI_ID_INTERNOS_VENTA);
        property.setValue(m_tiInternosv);
        property.setSelectId(m_ti_id_INTERNOS_v);

        var property = properties.item(Constants.PR_PORCINTERNOV);
        property.setValue(m_porcInternoV);

        var property = properties.item(Constants.PR_DINERARIO);
        property.setValue(bToI(m_dinerario));

        var property = properties.item(Constants.PR_NO_REDONDEO);
        property.setValue(bToI(m_noRedondeo));

        var property = properties.item(Constants.CCOS_ID_VENTA);
        property.setSelectId(m_ccos_id_venta);
        property.setValue(m_centroCostoVenta);

        var property = properties.item(Constants.PR_DESCRIPVENTA);
        property.setValue(m_descripventa);

        var property = properties.item(Constants.RUB_ID);
        property.setValue(m_rubro);
        property.setSelectId(m_rub_id);

        //////////////////////////////////////////////////////////////
        // Kit
        //
        var property = properties.item(Constants.PR_ESKIT);
        property.setValue(bToI(m_eskit));

        var property = properties.item(Constants.PR_KIT_STOCK_XITEM);
        property.setValue(bToI(m_kitStkXItem));

        var property = properties.item(Constants.PR_KIT_RESUMIDO);
        property.setValue(bToI(m_kitResumido));

        var property = properties.item(Constants.PR_KIT_IDENTIDAD);
        property.setValue(bToI(m_kitIdentidad));

        var property = properties.item(Constants.PR_KIT_IDENTIDAD_XITEM);
        property.setValue(bToI(m_kitIdentidadXItem));

        var property = properties.item(Constants.TA_ID_KIT_SERIE);
        property.setValue(m_talonarioKitSerie);
        property.setSelectId(m_ta_id_kitSerie);

        var property = properties.item(Constants.PR_KIT_LOTE);
        property.setValue(bToI(m_kitLote));

        var property = properties.item(Constants.PR_KIT_LOTE_XITEM);
        property.setValue(bToI(m_kitLoteXItem));

        var property = properties.item(Constants.TA_ID_KIT_LOTE);
        property.setValue(m_talonarioKitLote);
        property.setSelectId(m_ta_id_kitLote);

        var property = properties.item(C_PRODUCTO_KIT);
        loadKit(property);

        //////////////////////////////////////////////////////////////
        // Proveedores
        //
        var property = properties.item(C_PROVEEDOR);
        loadProveedor(property);
        m_itemsDeletedProveedor = "";

        //////////////////////////////////////////////////////////////
        // Clientes
        //
        var property = properties.item(C_CLIENTE);
        loadCliente(property);
        m_itemsDeletedCliente = "";

        //////////////////////////////////////////////////////////////
        // BOMs
        //
        var property = properties.item(C_BOM);
        loadBOM(property);

        //////////////////////////////////////////////////////////////
        // CMI
        //
        var property = properties.item(C_CMI);
        loadCMI(property);
        m_itemsDeletedCMI = "";

        //////////////////////////////////////////////////////////////
        // Leyendas
        //
        var property = properties.item(C_LEYENDAS);
        loadLeyendas(property);
        m_itemsDeletedLeyendas = "";

        //////////////////////////////////////////////////////////////
        // Tags
        //
        var property = properties.item(Constants.PR_NOMBRE_WEB);
        property.setValue(m_nombreWeb);

        var property = properties.item(Constants.PR_ALIAS_WEB);
        property.setValue(m_aliasWeb);

        var property = properties.item(Constants.PR_ID_WEB_PADRE);
        property.setValue(m_productowebpadre);
        property.setSelectId(m_pr_id_webPadre);

        var property = properties.item(Constants.PR_ACTIVO_WEB);
        property.setValue(bToI(m_activoWeb));

        var property = properties.item(Constants.PR_CODIGO_HTML);
        property.setValue(m_codigoHtml);

        var property = properties.item(Constants.PR_CODIGO_HTML_DETALLE);
        property.setValue(m_codigoHtmlDetalle);

        var property = properties.item(C_WEB_IMAGES);
        loadWebImages(property);
        m_itemsDeletedWebImages = "";

        var property = properties.item(C_TAGS);
        loadTags(property);
        m_itemsDeletedTag = "";

        //////////////////////////////////////////////////////////////
        // Catalogos
        //
        var property = properties.item(C_WEB_CATALOGS);
        loadCatalogosWeb(property);

        //////////////////////////////////////////////////////////////
        // Categorias
        //
        var property = properties.item(C_WEB_CATEGORIES);
        loadCategoriasWeb(property);

        m_genericEdit.RefreshProperties(m_dialog);


        if(m_rubroHasChanged) {
          // if the rubro has changed setRubro needs to call Dialog.show so the
          // controls are loaded
          //
          setRubro();
          if (m_dialog.show(self, TAB_RUBRO)) {
            m_rubroHasChanged = false;
          }
        }
        else {

          refreshRubro(m_rub_id);
          m_dialog.showValues(m_dialog.getProperties());
        }

      };

      var refreshRubro = function(rub_ID) {
        var rubro = new cRubro();
        rubro.load(rub_ID);

        var properties = m_dialog.getProperties();

        if(rubro.getRubtId1() !== Cairo.Constants.NO_ID) {
          var property = properties.item(Constants.RUBTIID1);
          property.setValue(m_tablaItem1);
          property.setSelectId(m_rubti_id1);
        }

        if(rubro.getRubtId2() !== Cairo.Constants.NO_ID) {
          var property = properties.item(Constants.RUBTIID2);
          property.setValue(m_tablaItem2);
          property.setSelectId(m_rubti_id2);
        }

        if(rubro.getRubtId3() !== Cairo.Constants.NO_ID) {
          var property = properties.item(Constants.RUBTIID3);
          property.setValue(m_tablaItem3);
          property.setSelectId(m_rubti_id3);
        }

        if(rubro.getRubtId4() !== Cairo.Constants.NO_ID) {
          var property = properties.item(Constants.RUBTIID4);
          property.setValue(m_tablaItem4);
          property.setSelectId(m_rubti_id4);
        }

        if(rubro.getRubtId5() !== Cairo.Constants.NO_ID) {
          var property = properties.item(Constants.RUBTIID5);
          property.setValue(m_tablaItem5);
          property.setSelectId(m_rubti_id5);
        }

        if(rubro.getRubtId6() !== Cairo.Constants.NO_ID) {
          var property = properties.item(Constants.RUBTIID6);
          property.setValue(m_tablaItem6);
          property.setSelectId(m_rubti_id6);
        }

        if(rubro.getRubtId7() !== Cairo.Constants.NO_ID) {
          var property = properties.item(Constants.RUBTIID7);
          property.setValue(m_tablaItem7);
          property.setSelectId(m_rubti_id7);
        }

        if(rubro.getRubtId8() !== Cairo.Constants.NO_ID) {
          var property = properties.item(Constants.RUBTIID8);
          property.setValue(m_tablaItem8);
          property.setSelectId(m_rubti_id8);
        }

        if(rubro.getRubtId9() !== Cairo.Constants.NO_ID) {
          var property = properties.item(Constants.RUBTIID9);
          property.setValue(m_tablaItem9);
          property.setSelectId(m_rubti_id9);
        }

        if(rubro.getRubtId10() !== Cairo.Constants.NO_ID) {
          var property = properties.item(Constants.RUBTIID10);
          property.setValue(m_tablaItem10);
          property.setSelectId(m_rubti_id10);
        }

      };

      self.initialize = function() {
        m_userConfig = new cUsuarioConfig();
        m_userConfig.load();
      };

      self.destroy = function() {
        m_dialog = null;
        m_listController = null;
        m_userConfig = null;
      };

      /////////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////
      self.columnAfterEdit = function(key,  lRow,  lCol,  newValue,  newValueID) {
        return true;
      };

      self.columnBeforeEdit = function(key,  lRow,  lCol,  iKeyAscii) {
        var _rtn = null;
        switch (key) {
          case K_WEB_CATALOGOS:
          case K_WEB_CATEGORIAS:
            _rtn = lCol === 4 || lCol === 5;
            break;

          default:
            _rtn = true;
            break;
        }

        return _rtn;
      };

      self.columnButtonClick = function(key,  lRow,  lCol,  iKeyAscii) {

      };

      self.deleteRow = function(key,  row,  lRow) {
        var id = null;

        switch (key) {

          case K_PROVEEDOR:
            id = Cairo.Util.val(Dialogs.cell(row, KIK_PRPROV_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_itemsDeletedProveedor = m_itemsDeletedProveedor + id.toString() + ","; }
            break;

          case K_CLIENTE:
            id = Cairo.Util.val(Dialogs.cell(row, KIK_PRCLI_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_itemsDeletedCliente = m_itemsDeletedCliente + id.toString() + ","; }
            break;

          case K_TAGS:
            id = Cairo.Util.val(Dialogs.cell(row, KIT_PRT_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_itemsDeletedTag = m_itemsDeletedTag + id.toString() + ","; }
            break;

          case K_WEB_IMAGES:
            id = Cairo.Util.val(Dialogs.cell(row, KIWI_PRWI_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_itemsDeletedWebImages = m_itemsDeletedWebImages + id.toString() + ","; }
            break;

          case K_CMI:
            id = Cairo.Util.val(Dialogs.cell(row, KICMI_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_itemsDeletedCMI = m_itemsDeletedCMI + id.toString() + ","; }
            break;

          case K_LEYENDAS:
            id = Cairo.Util.val(Dialogs.cell(row, KIPRL_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_itemsDeletedLeyendas = m_itemsDeletedLeyendas + id.toString() + ","; }
            break;
        }

        return true;
      };

      self.newRow = function(key,  rows) {

      };

      self.validateRow = function(key,  row,  rowIndex) {
        var p = null;
        try {

          switch (key) {

            case K_PROVEEDOR:
              p = validateRowProveedor(row, rowIndex);
              break;

            case K_CLIENTE:
              p = validateRowCliente(row, rowIndex);
              break;

            case K_WEB_IMAGES:
              p = validateRowWebImage(row, rowIndex);
              break;

            case K_CMI:
              p = validateRowCMI(row, rowIndex);
              break;

            case K_LEYENDAS:
              p = validateRowLeyendas(row, rowIndex);
              break;

            case K_BOM:
            case K_PRODUCTO_KIT:
            case K_TAGS:
            case K_WEB_CATALOGOS:
            case K_WEB_CATEGORIAS:
              p = Cairo.Promises.resolvedPromise(true);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.VALIDATE_ROW_FUNCTION, C_MODULE, "");
        }

        return p || Cairo.Promises.resolvedPromise(false);
      };

      self.columnAfterUpdate = function(key,  lRow,  lCol) {
        return true;
      };

      self.columnClick = function(key,  lRow,  lCol) {

      };

      self.gridDblClick = function(key,  lRow,  lCol) {
        switch (key) {
          case K_PROVEEDOR:
            var property = m_dialog.getProperties().item(C_PROVEEDOR);
            editPriceList(Dialogs.cell(property.getGrid().getRows().item(lRow), KIK_PROV_LPI_ID).getId());
            break;
        }
      };

      self.isEmptyRow = function(key,  row,  rowIndex) {
        var isEmpty = true;

        try {

          switch (key) {
            case K_PROVEEDOR:
              isEmpty = isEmptyRowProveedor(row, rowIndex);
              break;

            case K_CLIENTE:
              isEmpty = isEmptyRowCliente(row, rowIndex);
              break;

            case K_TAGS:
              isEmpty = isEmptyRowTags(row, rowIndex);
              break;

            case K_WEB_IMAGES:
              isEmpty = isEmptyRowWebImages(row, rowIndex);
              break;

            case K_CMI:
              isEmpty = isEmptyRowCMI(row, rowIndex);
              break;

            case K_LEYENDAS:
              isEmpty = isEmptyRowLeyendas(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.IS_EMPTY_ROW_FUNCTION, C_MODULE, "");
        }

        return Cairo.Promises.resolvedPromise(isEmpty);
      };

      var saveItemsWebCatalogos = function(mainRegister) {
        var transaction = new Cairo.Database.Transaction();
        transaction.setTable(Constants.CATALOGOWEBITEM);

        var property = m_dialog.getProperties().item(C_WEB_CATALOGS);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          if(Dialogs.cell(row, KICW_SELECT).getId()) {

            var register = new Cairo.Database.Register();

            var fields = register.getFields();
            register.setFieldId(Constants.CATWI_ID);
            register.setTable(Constants.CATALOGOWEBITEM);
            register.setId(Cairo.Constants.NEW_ID);

            var _count = row.size();
            for (var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {

                case KICW_ID:
                  fields.add(Constants.CATW_ID, cell.getId(), Types.id);
                  break;
              }
            }

            fields.add(Constants.CATWI_ACTIVO, 1, Types.boolean);
            fields.add(Constants.PR_ID, m_id, Types.id);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsWebCategorias = function(mainRegister) {
        var transaction = new Cairo.Database.Transaction();
        transaction.setTable(Constants.CATALOGOWEBCATEGORIAITEM);

        if(!Cairo.Database.execute(sqlstmt)) { return false; }

        var property = m_dialog.getProperties().item(C_WEB_CATEGORIES);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          if(Dialogs.cell(row, KICWC_SELECT).getId()) {

            var register = new Cairo.Database.Register();

            var fields = register.getFields();
            register.setFieldId(Constants.CATWCI_ID);
            register.setTable(Constants.CATALOGOWEBCATEGORIAITEM);
            register.setId(Cairo.Constants.NEW_ID);

            var _count = row.size();
            for (var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {

                case KICWC_ID:
                  fields.add(Constants.CATWC_ID, cell.getId(), Types.id);
                  break;

                case KICWCI_POSICION:
                  fields.add(Constants.CATWCI_POSICION, cell.getValue(), Types.integer);
                  break;
              }
            }

            fields.add(Constants.CATWCI_ACTIVO, 1, Types.boolean);
            fields.add(Constants.PR_ID, m_id, Types.id);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsProveedor = function(mainRegister) {
        var transaction = new Cairo.Database.Transaction();
        var updatePriceTransaction = new Cairo.Database.Transaction();

        transaction.setTable(Constants.PRODUCTOPROVEEDOR);
        updatePriceTransaction.setTable("UPDATED_PRICES");

        var property = m_dialog.getProperties().item(C_PROVEEDOR);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          if(isRowProveedorFromUser(row)) {

            var register = new Cairo.Database.Register();

            var fields = register.getFields();
            register.setFieldId(Constants.PR_PROV_ID);
            register.setTable(Constants.PRODUCTOPROVEEDOR);
            register.setId(Cairo.Constants.NEW_ID);

            var _count = row.size();
            for (var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {

                case KIK_PRPROV_ID:
                  if(!m_copy) {
                    register.setId((Cairo.Util.val(cell.getValue()) > 0) ? Cairo.Util.val(cell.getValue()) : Cairo.Constants.NEW_ID);
                  }
                  break;

                case KIK_PROV_ID:
                  fields.add(Constants.PROV_ID, cell.getId(), Types.id);
                  break;

                case KIK_PROV_FABRICANTE:
                  fields.add(Constants.PR_PROV_FABRICANTE, cell.getId(), Types.boolean);
                  break;

                case KIK_PROV_NOMBRE:
                  fields.add(Constants.PR_PROV_NAME, cell.getValue(), Types.text);
                  break;

                case KIK_PROV_CODIGO:
                  fields.add(Constants.PR_PROV_CODE, cell.getValue(), Types.text);
                  break;

                case KIK_PROV_CODBARRA:
                  fields.add(Constants.PR_PROV_CODIGO_BARRA, cell.getValue(), Types.text);
                  break;

                case KIK_PA_ID:
                  fields.add(Constants.PA_ID, cell.getId(), Types.id);
                  break;
              }
            }

            fields.add(Constants.PR_ID, m_id, Types.id);

            transaction.addRegister(register);

          }

          if(Dialogs.cell(row, KIK_PROV_PRECIO).getValue() !== Dialogs.cell(row, KIK_PROV_PRECIO2).getValue()
            && Dialogs.cell(row, KIK_PROV_LPI_ID).getId() !== Cairo.Constants.NO_ID) {

            var register = new Cairo.Database.Register();
            register.setFieldId(Constants.PR_ID);
            register.setTable("UPDATED_PRICES");
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();
            fields.add(Constants.LPI_ID, Dialogs.cell(row, KIK_PROV_LPI_ID).getId(), Types.id);
            fields.add(Constants.LPI_ID, Dialogs.cell(row, KIK_PROV_PRECIO).getValue(), Types.double);
            fields.add(Constants.LPI_ID, Dialogs.cell(row, KIK_PROV_PRECIO_FECHA).getValue(), Types.date);

            updatePriceTransaction.addRegister(register);
          }

        }

        if(m_itemsDeletedProveedor !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedProveedor)
        }

        mainRegister.addTransaction(transaction);
        mainRegister.addTransaction(updatePriceTransaction);

        return true;
      };

      var saveItemsCMI = function(mainRegister) {
        var transaction = new Cairo.Database.Transaction();
        transaction.setTable(Constants.PRODUCTOCOMUNIDADINTERNET);

        var property = m_dialog.getProperties().item(C_CMI);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(Constants.PRCMI_ID);
          register.setTable(Constants.PRODUCTOCOMUNIDADINTERNET);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICMI_ID:
                if(!m_copy) {
                  register.setId(Cairo.Util.val(cell.getValue()));
                }
                break;

              case KICMI_CMI_ID:
                fields.add(Constants.CMI_ID, cell.getId(), Types.id);
                break;

              case KICMI_CODIGO:
                fields.add(Constants.PRCMI_CODE, cell.getValue(), Types.text);
                break;

              case KICMI_DESCRIP:
                fields.add(Constants.PRCMI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KICMI_PRECIO:
                fields.add(Constants.PRCMI_PRECIO, cell.getValue(), Types.double);
                break;

              case KICMI_FECHAALTA:
                fields.add(Constants.PRCMI_FECHA_ALTA, cell.getValue(), Types.date);
                break;

              case KICMI_FECHAVTO:
                fields.add(Constants.PRCMI_FECHA_VTO, cell.getValue(), Types.date);
                break;
            }
          }

          fields.add(Constants.PR_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedCMI !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedCMI)
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsLeyendas = function(mainRegister) {
        var transaction = new Cairo.Database.Transaction();
        transaction.setTable(Constants.PRODUCTOLEYENDA);

        var property = m_dialog.getProperties().item(C_LEYENDAS);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(Constants.PRL_ID);
          register.setTable(Constants.PRODUCTOLEYENDA);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICMI_ID:
                if(!m_copy) {
                  register.setId(Cairo.Util.val(cell.getValue()));
                }
                break;

              case KIPRL_NOMBRE:
                fields.add(Constants.PRL_NAME, cell.getValue(), Types.text);
                break;

              case KIPRL_TEXTO:
                fields.add(Constants.PRL_TEXTO, cell.getValue(), Types.text);
                break;

              case KIPRL_TAG:
                fields.add(Constants.PRL_TAG, cell.getValue(), Types.text);
                break;

              case KIPRL_ORDEN:
                fields.add(Constants.PRL_ORDEN, cell.getValue(), Types.text);
                break;
            }
          }

          fields.add(Constants.PR_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedLeyendas !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedLeyendas)
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsWebImages = function(mainRegister) {
        var transaction = new Cairo.Database.Transaction();
        transaction.setTable(Constants.PRODUCTOWEBIMAGE);

        var property = m_dialog.getProperties().item(C_WEB_IMAGES);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(Constants.PRWI_ID);
          register.setTable(Constants.PRODUCTOWEBIMAGE);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KIWI_PRWI_ID:
                if(!m_copy) {
                  register.setId(Cairo.Util.val(cell.getValue()));
                }
                break;

              case KIWI_IMAGE:
                fields.add(Constants.PRWI_ARCHIVO, cell.getValue(), Types.text);
                break;

              case KIWI_ALT:
                fields.add(Constants.PRWI_ALT, cell.getValue(), Types.text);
                break;

              case KIWI_IMAGE_TYPE:
                fields.add(Constants.PRWI_TIPO, cell.getId(), Types.integer);
                break;

              case KIWI_POSICION:
                fields.add(Constants.PRWI_POSICION, cell.getValue(), Types.double);
                break;
            }
          }

          fields.add(Constants.PR_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedWebImages !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedWebImages)
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsCliente = function(mainRegister) {
        var transaction = new Cairo.Database.Transaction();
        transaction.setTable(Constants.PRODUCTOCLIENTE);

        var property = m_dialog.getProperties().item(C_CLIENTE);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(Constants.PR_CLI_ID);
          register.setTable(Constants.PRODUCTOCLIENTE);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KIK_PRCLI_ID:
                if(!m_copy) {
                  register.setId(Cairo.Util.val(cell.getValue()));
                }
                break;

              case KIK_CLI_ID:
                fields.add(Constants.CLI_ID, cell.getId(), Types.id);
                break;

              case KIK_CLI_NOMBRE:
                fields.add(Constants.PR_CLI_NAME, cell.getValue(), Types.text);
                break;

              case KIK_CLI_CODIGO:
                fields.add(Constants.PR_CLI_CODE, cell.getValue(), Types.text);
                break;

              case KIK_CLI_CODBARRA:
                fields.add(Constants.PR_CLI_CODIGO_BARRA, cell.getValue(), Types.text);
                break;
            }
          }

          fields.add(Constants.PR_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedCliente !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedCliente)
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsTags = function(mainRegister) {
        var transaction = new Cairo.Database.Transaction();
        transaction.setTable(Constants.PRODUCTOTAG);

        var bPrIdTag = null;

        var property = m_dialog.getProperties().item(C_TAGS);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(Constants.PRT_ID);
          register.setTable(Constants.PRODUCTOTAG);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KIT_PRT_ID:
                if(!m_copy) {
                  register.setId(Cairo.Util.val(cell.getValue()));
                }
                break;

              case KIT_PR_ID_TAG:
                bPrIdTag = cell.getId() !== Cairo.Constants.NO_ID;
                fields.add(Constants.PR_ID_TAG, cell.getId(), Types.id);
                break;

              case KIT_TEXTO:

                if(bPrIdTag) {
                  fields.add(Constants.PRT_TEXTO, "", Types.text);
                }
                else {
                  fields.add(Constants.PRT_TEXTO, cell.getValue(), Types.text);
                }
                break;

              case KIT_EXPOCAIRO:
                fields.add(Constants.PRT_EXPO_CAIRO, cell.getValue(), Types.integer);
                break;

              case KIT_EXPOWEB:
                fields.add(Constants.PRT_EXPO_WEB, cell.getValue(), Types.integer);
                break;
            }
          }

          fields.add(Constants.PR_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedTag !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedTag)
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var validateRowProveedor = function(row,  rowIndex) {
        var cell = null;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIK_PROV_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1349, "", strRow)).then(function() {return false;}); // Debe indicar un proveedor
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var validateRowLeyendas = function(row,  rowIndex) {
        var cell = null;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIPRL_NOMBRE:
              if(Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                return Cairo.Modal.showInfo(Cairo.Constants.MUST_SET_A_NAME).then(function() {return false;});
              }
              break;

            case KIPRL_TEXTO:
              if(Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(5037, "", strRow)).then(function() {return false;}); // Debe indicar una texto
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var validateRowCMI = function(row,  rowIndex) {
        var cell = null;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KICMI_CMI_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.integer)) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(5028, "", strRow)).then(function() {return false;}); // Debe indicar una comunidad
              }
              break;

            case KICMI_CODIGO:
              if(Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                return Cairo.Modal.showInfo(Cairo.Constants.MUST_SET_A_CODE).then(function() {return false;});
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var validateRowWebImage = function(row,  rowIndex) {
        var cell = null;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIWI_IMAGE:
              if(Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(4574, "", strRow)).then(function() {return false;}); // Debe indicar el nombre de un archivo de imagen
              }
              break;

            case KIWI_IMAGE_TYPE:
              if(Cairo.Util.valEmpty(cell.getId(), Types.integer)) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(4575, "", strRow)).then(function() {return false;}); // Debe indicar el tipo de imagen
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var validateRowCliente = function(row,  rowIndex) {
        var cell = null;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIK_CLI_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1351, "", strRow)).then(function() {return false;}); // Debe indicar un cliente
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var isEmptyRowProveedor = function(row,  rowIndex) {
        var cell = null;
        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIK_PROV_ID:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;

            case KIK_PROV_NOMBRE:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;

            case KIK_PROV_CODIGO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;

            case KIK_PROV_CODBARRA:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;

            case KIK_PA_ID:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var isEmptyRowCliente = function(row,  rowIndex) {
        var cell = null;
        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIK_CLI_ID:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;

            case KIK_CLI_NOMBRE:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;

            case KIK_CLI_CODIGO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;

            case KIK_CLI_CODBARRA:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var isEmptyRowLeyendas = function(row,  rowIndex) {
        var cell = null;
        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIPRL_NOMBRE:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;

            case KIPRL_TEXTO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var isEmptyRowCMI = function(row,  rowIndex) {
        var cell = null;
        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KICMI_CMI_ID:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;

            case KICMI_CODIGO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var isEmptyRowWebImages = function(row,  rowIndex) {
        var cell = null;
        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIWI_IMAGE:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;

            case KIWI_ALT:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var isEmptyRowTags = function(row,  rowIndex) {
        var cell = null;
        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIT_TEXTO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;

            case KIT_EXPOWEB:
            case KIT_EXPOCAIRO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.integer)) {
                if(Cairo.Util.val(cell.getValue()) !== 50) {
                  bRowIsEmpty = false;
                }
              }
              break;

            case KIT_PR_ID_TAG:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var setGridProveedor = function(property) {

        var w_grid = property.getGrid();
        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIK_PRPROV_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1151, "")); // Proveedor
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVEEDOR);
        elem.setWidth(2500);
        elem.setKey(KIK_PROV_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1356, "")); // Fabricante
        elem.setType(Dialogs.PropertyType.check);
        elem.setWidth(100);
        elem.setKey(KIK_PROV_FABRICANTE);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIK_PROV_NOMBRE);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIK_PROV_CODIGO);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1306, "")); // Cód. Barra
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIK_PROV_CODBARRA);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1212, "")); // País
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PAIS);
        elem.setWidth(2000);
        elem.setKey(KIK_PA_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(2273, "")); // Lista de Precios
        elem.setWidth(2000);
        elem.setKey(KIK_PROV_LPI_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1586, "")); // Precio
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat("0.000");
        elem.setWidth(2000);
        elem.setKey(KIK_PROV_PRECIO);

        var elem = w_columns.add(null);
        elem.setKey(KIK_PROV_PRECIO2);
        elem.setVisible(false);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1569, "")); // Fecha
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(2000);
        elem.setKey(KIK_PROV_PRECIO_FECHA);

        var elem = w_columns.add(null);
        elem.setName("");
        elem.setType(Dialogs.PropertyType.check);
        elem.setWidth(500);
        elem.setKey(KIK_PROV_PRECIO_DEFAULT);

        var w_rows = w_grid.getRows();

        w_rows.clear();
      };

      var loadProveedor = function(property) {

        var fecha, precio;

        var w_grid = property.getGrid();
        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.proveedor.length; _i += 1) {

          var elem = w_rows.add(null);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.proveedor[_i], Constants.PR_PROV_ID));
          elem.setKey(KIK_PRPROV_ID);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.proveedor[_i], Constants.PROV_NAME));
          elem.setId(Cairo.Database.valField(m_data.proveedor[_i], Constants.PROV_ID));
          elem.setKey(KIK_PROV_ID);

          var elem = elem.add(null);
          elem.setId(Cairo.Database.valField(m_data.proveedor[_i], Constants.PR_PROV_FABRICANTE));
          elem.setKey(KIK_PROV_FABRICANTE);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.proveedor[_i], Constants.PR_PROV_NAME));
          elem.setKey(KIK_PROV_NOMBRE);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.proveedor[_i], Constants.PR_PROV_CODE));
          elem.setKey(KIK_PROV_CODIGO);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.proveedor[_i], Constants.PR_PROV_CODIGO_BARRA));
          elem.setKey(KIK_PROV_CODBARRA);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.proveedor[_i], Constants.PA_NAME));
          elem.setId(Cairo.Database.valField(m_data.proveedor[_i], Constants.PA_ID));
          elem.setKey(KIK_PA_ID);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.proveedor[_i], Constants.LP_NAME));
          elem.setId(Cairo.Database.valField(m_data.proveedor[_i], Constants.LPI_ID));
          elem.setKey(KIK_PROV_LPI_ID);

          precio = Cairo.Database.valField(m_data.proveedor[_i], Constants.LPI_PRECIO);

          var elem = elem.add(null);
          if(precio !== 0) {
            elem.setValue(precio);
          }
          elem.setKey(KIK_PROV_PRECIO);

          var elem = elem.add(null);
          if(precio !== 0) {
            elem.setValue(precio);
          }
          elem.setKey(KIK_PROV_PRECIO2);

          fecha = Cairo.Database.valField(m_data.proveedor[_i], Constants.LPI_FECHA);

          var elem = elem.add(null);
          if(fecha !== Cairo.Constants.cSNODATE) {
            elem.setValue(fecha);
          }
          elem.setKey(KIK_PROV_PRECIO_FECHA);

          var elem = elem.add(null);
          elem.setId(Cairo.Database.valField(m_data.proveedor[_i], "lpi_top"));
          elem.setKey(KIK_PROV_PRECIO_DEFAULT);

        }
      };

      var setGridCliente = function(property) {

        var w_grid = property.getGrid();
        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIK_PRCLI_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1150, "")); // Cliente
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setWidth(2500);
        elem.setKey(KIK_CLI_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIK_CLI_NOMBRE);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIK_CLI_CODIGO);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1306, "")); // Cód. Barra
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIK_CLI_CODBARRA);

        var w_rows = w_grid.getRows();

        w_rows.clear();
      };

      var loadCliente = function(property) {

        var w_grid = property.getGrid();
        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.cliente.length; _i += 1) {

          var row = w_rows.add(null, Cairo.Database.valField(m_data.cliente[_i], Constants.PR_CLI_ID));

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.cliente[_i], Constants.PR_CLI_ID));
          elem.setKey(KIK_PRCLI_ID);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.cliente[_i], Constants.CLI_NAME));
          elem.setId(Cairo.Database.valField(m_data.cliente[_i], Constants.CLI_ID));
          elem.setKey(KIK_CLI_ID);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.cliente[_i], Constants.PR_CLI_NAME));
          elem.setKey(KIK_CLI_NOMBRE);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.cliente[_i], Constants.PR_CLI_CODE));
          elem.setKey(KIK_CLI_CODIGO);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.cliente[_i], Constants.PR_CLI_CODIGO_BARRA));
          elem.setKey(KIK_CLI_CODBARRA);

        }
      };

      var setGridCMI = function(property) {

        var w_grid = property.getGrid();
        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setKey(KICMI_ID);
        elem.setVisible(false);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(5017, "")); // Comunidad
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.COMUNIDAD_DE_INTERNET);
        elem.setWidth(2500);
        elem.setKey(KICMI_CMI_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2000);
        elem.setKey(KICMI_CODIGO);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1586, "")); // Precio
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat("0.00");
        elem.setWidth(2000);
        elem.setKey(KICMI_PRECIO);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(5026, "")); // Publicado el
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(2000);
        elem.setKey(KICMI_FECHAALTA);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(5027, "")); // Vence el
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(2000);
        elem.setKey(KICMI_FECHAVTO);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(2000);
        elem.setKey(KICMI_DESCRIP);

        var w_rows = w_grid.getRows();

        w_rows.clear();
      };

      var loadCMI = function(property) {

        var w_grid = property.getGrid();
        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.cmi.length; _i += 1) {

          var row = w_rows.add(null, Cairo.Database.valField(m_data.cmi[_i], Constants.PRCMI_ID));

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.cmi[_i], Constants.PRCMI_ID));
          elem.setKey(KICMI_ID);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.cmi[_i], Constants.CMI_NAME));
          elem.setId(Cairo.Database.valField(m_data.cmi[_i], Constants.CMI_ID));
          elem.setKey(KICMI_ID);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.cmi[_i], Constants.PRCMI_CODE));
          elem.setKey(KICMI_CODIGO);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.cmi[_i], Constants.PRCMI_PRECIO));
          elem.setKey(KICMI_PRECIO);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.cmi[_i], Constants.PRCMI_FECHA_ALTA));
          elem.setKey(KICMI_FECHAALTA);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.cmi[_i], Constants.PRCMI_FECHA_VTO));
          elem.setKey(KICMI_FECHAVTO);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.cmi[_i], Constants.PRCMI_DESCRIP));
          elem.setKey(KICMI_DESCRIP);

        }
      };

      var setGridLeyendas = function(property) {

        var w_grid = property.getGrid();
        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setKey(KIPRL_ID);
        elem.setVisible(false);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2500);
        elem.setKey(KIPRL_NOMBRE);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(5003, "")); // Texto
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(2000);
        elem.setKey(KIPRL_TEXTO);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(5036, "")); // Tag
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2000);
        elem.setKey(KIPRL_TAG);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(5016, "")); // Orden
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2000);
        elem.setKey(KIPRL_ORDEN);

        var w_rows = w_grid.getRows();

        w_rows.clear();
      };

      var loadLeyendas = function(property) {

        var w_grid = property.getGrid();
        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.leyendas.length; _i += 1) {

          var row = w_rows.add(null, Cairo.Database.valField(m_data.leyendas[_i], Constants.PRL_ID));

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.leyendas[_i], Constants.PRL_ID));
          elem.setKey(KICMI_ID);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.leyendas[_i], Constants.PRL_NAME));
          elem.setKey(KIPRL_NOMBRE);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.leyendas[_i], Constants.PRL_TEXTO));
          elem.setKey(KIPRL_TEXTO);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.leyendas[_i], Constants.PRL_TAG));
          elem.setKey(KIPRL_TAG);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.leyendas[_i], Constants.PRL_ORDEN));
          elem.setKey(KIPRL_ORDEN);

        }
      };

      var setGridBOM = function(property) {

        var w_grid = property.getGrid();
        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1304, "")); // B.O.M.
        elem.setWidth(2500);
        elem.setKey(KIK_PBM_ID);

        var w_rows = w_grid.getRows();

        w_rows.clear();
      };

      var loadBOM = function(property) {

        var w_grid = property.getGrid();
        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.bom.length; _i += 1) {

          var row = w_rows.add(null, Cairo.Database.valField(m_data.bom[_i], Constants.PBM_ID));

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.bom[_i], Constants.PBM_NAME));
          elem.setId(Cairo.Database.valField(m_data.bom[_i], Constants.PBM_ID));
          elem.setKey(KIK_PBM_ID);

        }
      };

      var setGridTags = function(property) {

        var w_grid = property.getGrid();
        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIT_PRT_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1619, "")); // Producto
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.PRODUCTO);
        elem.setWidth(1000);
        elem.setKey(KIT_PR_ID_TAG);
        if(m_userConfig.getMultiSelect()) {
          elem.setSelectType(Cairo.Entities.Select.SelectType.tree);
        }

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(5016, "")); // Orden
        elem.setType(Dialogs.PropertyType.text);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(3968, "")); // Texto
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIT_TEXTO);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(3897, "")); // Expo Web
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIT_EXPOWEB);
        elem.setFormat("0");
        elem.setDefaultValue(Dialogs.Grids.createCell());
        elem.getDefaultValue().setValue(50);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(3898, "")); // Expo Cairo
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIT_EXPOCAIRO);
        elem.setFormat("0");
        elem.setDefaultValue(Dialogs.Grids.createCell());
        elem.getDefaultValue().setValue(50);

        var w_rows = w_grid.getRows();

        w_rows.clear();
      };

      var loadTags = function(property) {

        var w_grid = property.getGrid();
        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.tags.length; _i += 1) {

          var elem = w_rows.add(null, Cairo.Database.valField(m_data.tags[_i], Constants.PRT_ID));

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.tags[_i], Constants.PRT_ID));
          elem.setKey(KIT_PRT_ID);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.tags[_i], Constants.PR_NOMBRE_COMPRA));
          elem.setId(Cairo.Database.valField(m_data.tags[_i], Constants.PR_ID_TAG));
          elem.setKey(KIT_PR_ID_TAG);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.tags[_i], "orden"));

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.tags[_i], Constants.PRT_TEXTO));
          elem.setKey(KIT_TEXTO);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.tags[_i], Constants.PRT_EXPO_WEB));
          elem.setKey(KIT_EXPOWEB);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.tags[_i], Constants.PRT_EXPO_CAIRO));
          elem.setKey(KIT_EXPOCAIRO);

        }
      };

      var setGridCategoriasWeb = function(property) {

        var w_grid = property.getGrid();
        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KICWCI_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(4597, "")); // Categoria de Catalogo Web
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(4000);
        elem.setKey(KICWC_ID);

        var elem = w_columns.add(null);
        elem.setName("");
        elem.setType(Dialogs.PropertyType.check);
        elem.setWidth(600);
        elem.setKey(KICWC_SELECT);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(3268, "")); // Posición
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setKey(KICWCI_POSICION);

        var w_rows = w_grid.getRows();

        w_rows.clear();
      };

      var loadCategoriasWeb = function(property) {

        var w_grid = property.getGrid();
        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.categoriasWeb.length; _i += 1) {

          var elem = w_rows.add(null);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.categoriasWeb[_i], Constants.CATWCI_ID));
          elem.setKey(KICWCI_ID);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.categoriasWeb[_i], Constants.CATWC_NAME));
          elem.setId(Cairo.Database.valField(m_data.categoriasWeb[_i], Constants.CATWC_ID));
          elem.setKey(KICWC_ID);

          var elem = elem.add(null);
          elem.setId(Cairo.Database.valField(m_data.categoriasWeb[_i], Constants.CATWCI_ID));
          elem.setKey(KICWC_SELECT);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.categoriasWeb[_i], Constants.CATWCI_POSICION));
          elem.setKey(KICWCI_POSICION);

        }
      };

      var setGridCatalogosWeb = function(property) {

        var w_grid = property.getGrid();
        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KICWI_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(4598, "")); // Catalogo Web
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2000);
        elem.setKey(KICW_ID);

        var elem = w_columns.add(null);
        elem.setName("");
        elem.setType(Dialogs.PropertyType.check);
        elem.setWidth(600);
        elem.setKey(KICW_SELECT);

        var w_rows = w_grid.getRows();

        w_rows.clear();
      };

      var loadCatalogosWeb = function(property) {

        var w_grid = property.getGrid();
        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.catalogosWeb.length; _i += 1) {

          var elem = w_rows.add(null);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.catalogosWeb[_i], Constants.CATWI_ID));
          elem.setKey(KICWI_ID);

          var elem = elem.add(null);
          elem.setValue(Cairo.Database.valField(m_data.catalogosWeb[_i], Constants.CATW_NAME));
          elem.setId(Cairo.Database.valField(m_data.catalogosWeb[_i], Constants.CATW_ID));
          elem.setKey(KICW_ID);

          var elem = elem.add(null);
          elem.setId(Cairo.Database.valField(m_data.catalogosWeb[_i], Constants.CATWI_ID);
          elem.setKey(KICW_SELECT);

        }
      };

      var setGridWebImages = function(property) {

        var w_grid = property.getGrid();
        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIWI_PRWI_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(4573, "")); // Imagen
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2000);
        elem.setKey(KIWI_IMAGE);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1223, "")); // Tipo
        elem.setType(Dialogs.PropertyType.list);
        elem.setWidth(3000);
        elem.setKey(KIWI_IMAGE_TYPE);

        var w_list = elem.getList();

        var elem = w_list.add(null);
        elem.setId(Constants.ProductoWebImageType.webImageThumbnail);
        elem.setValue(Cairo.Language.getText(4572, "")); // Pequeña Principal

        var elem = w_list.add(null);
        elem.setId(Constants.ProductoWebImageType.webImageMedium);
        elem.setValue(Cairo.Language.getText(4571, "")); // Pequeña

        var elem = w_list.add(null);
        elem.setId(Constants.ProductoWebImageType.webImageBig);
        elem.setValue(Cairo.Language.getText(4570, "")); // Grande

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(4569, "")); // Texto Alternativo
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(3000);
        elem.setKey(KIWI_ALT);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(3268, "")); // Posición
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setWidth(800);
        elem.setKey(KIWI_POSICION);

        var w_rows = w_grid.getRows();

        w_rows.clear();
      };

      var loadWebImages = function(property) {

        var w_grid = property.getGrid();
        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.webImages.length; _i += 1) {

          var row = w_rows.add(null, Cairo.Database.valField(m_data.webImages[_i], Constants.PRWI_ID));

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.webImages[_i], Constants.PRWI_ID));
          elem.setKey(KIWI_PRWI_ID);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.webImages[_i], Constants.PRWI_ARCHIVO));
          elem.setKey(KIWI_IMAGE);

          var elem = row.add(null);
          elem.setId(Cairo.Database.valField(m_data.webImages[_i], Constants.PRWI_TIPO));
          elem.setKey(KIWI_IMAGE_TYPE);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.webImages[_i], Constants.PRWI_ALT));
          elem.setKey(KIWI_ALT);

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.webImages[_i], Constants.PRWI_POSICION));
          elem.setKey(KIWI_POSICION);

        }
      };

      var setGridKit = function(property) {

        var w_grid = property.getGrid();
        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1354, "")); // Fórmula
        elem.setWidth(2500);
        elem.setKey(KIK_PRFK_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1355, "")); // x Defecto
        elem.setWidth(2500);
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KIK_PRFK_DEFAULT);

        var w_rows = w_grid.getRows();

        w_rows.clear();
      };

      var loadKit = function(property) {

        var w_grid = property.getGrid();
        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.kit.length; _i += 1) {

          var row = w_rows.add(null, Cairo.Database.valField(m_data.kit[_i], Constants.PRFK_ID));

          var elem = row.add(null);
          elem.setValue(Cairo.Database.valField(m_data.kit[_i], Constants.PRFK_NAME));
          elem.setId(Cairo.Database.valField(m_data.kit[_i], Constants.PRFK_ID));
          elem.setKey(KIK_PRFK_ID);

          var elem = row.add(null);
          elem.setId(Cairo.Database.valField(m_data.kit[_i], Constants.PRFK_DEFAULT));
          elem.setKey(KIK_PRFK_ID);

        }
      };

      var pSetKitEnabled = function() {

        var properties = m_dialog.getProperties();
        var enabled = Cairo.Util.val(properties.item(Constants.PR_ESKIT).getValue());

        if(enabled) {
          enabled = properties.item(Constants.PR_KIT_RESUMIDO).getValue();
        }

        var property = properties.item(Constants.PR_KIT_IDENTIDAD);
        property.setEnabled(enabled);
        m_dialog.showValue(property);

        pSetKitSerieEnabled(enabled);
      };

      var pSetKitSerieEnabled = function(enabled) {
        var property = null;

        var properties = m_dialog.getProperties();

        if(enabled) {

          if(Cairo.Util.val(properties.item(Constants.PR_KIT_IDENTIDAD).getValue())) {

            property = properties.item(Constants.PR_KIT_IDENTIDAD_XITEM);
            property.setEnabled(true);
            m_dialog.showValue(property);

            var taEnabled = Cairo.Util.val(property.getValue()) === 0;

            property = properties.item(Constants.TA_ID_KIT_SERIE);
            property.setEnabled(taEnabled);
            m_dialog.showValue(property);

            property = properties.item(Constants.PR_KIT_LOTE);
            property.setEnabled(enabled);
            m_dialog.showValue(property);

          }
          else {

            property = properties.item(Constants.PR_KIT_IDENTIDAD_XITEM);
            property.setEnabled(false);
            m_dialog.showValue(property);

            property = properties.item(Constants.TA_ID_KIT_SERIE);
            property.setEnabled(false);
            m_dialog.showValue(property);

            property = properties.item(Constants.PR_KIT_LOTE);
            property.setEnabled(false);
            m_dialog.showValue(property);

          }

        }
        else {

          property = properties.item(Constants.PR_KIT_IDENTIDAD_XITEM);
          property.setEnabled(enabled);
          m_dialog.showValue(property);

          property = properties.item(Constants.PR_KIT_LOTE_XITEM);
          property.setEnabled(enabled);
          m_dialog.showValue(property);

          property = properties.item(Constants.PR_KIT_LOTE);
          property.setEnabled(enabled);
          m_dialog.showValue(property);

        }

        pSetKitLoteEnabled(enabled);

      };

      var pSetKitLoteEnabled = function(enabled) {
        var property = null;

        var properties = m_dialog.getProperties();

        /*
        *
        * This version only support lote in kits that
        * have identity
        *
        */

        if(enabled) {

          enabled = Cairo.Util.val(properties.item(Constants.PR_KIT_IDENTIDAD).getValue());

        }

        if(enabled) {

          if(Cairo.Util.val(properties.item(Constants.PR_KIT_LOTE).getValue())) {

            property = properties.item(Constants.PR_KIT_LOTE_XITEM);
            property.setEnabled(true);
            m_dialog.showValue(property);

            enabled = Cairo.Util.val(property.getValue()) === 0;

            property = properties.item(Constants.TA_ID_KIT_LOTE);
            property.setEnabled(enabled);
            m_dialog.showValue(property);
          }
          else {

            property = properties.item(Constants.PR_KIT_LOTE_XITEM);
            property.setEnabled(false);
            m_dialog.showValue(property);

            property = properties.item(Constants.TA_ID_KIT_LOTE);
            property.setEnabled(false);
            m_dialog.showValue(property);
          }
        }
        else {

          property = properties.item(Constants.TA_ID_KIT_SERIE);
          property.setEnabled(enabled);
          m_dialog.showValue(property);

          property = properties.item(Constants.TA_ID_KIT_LOTE);
          property.setEnabled(enabled);
          m_dialog.showValue(property);
        }
      };

      var setKitConfig = function(kitInfo) { 
        if(kitInfo.esKit) {

          if(kitInfo.kitResumido) {

            if(kitInfo.kitIdentidad) {

              if(kitInfo.kitIdentidadXItem) {
                kitInfo.taIdKitSerie = Cairo.Constants.NO_ID;
              }
              
              if(kitInfo.kitLote) {
                
                if(kitInfo.kitLoteXItem) {
                  kitInfo.taIdKitLote = Cairo.Constants.NO_ID;
                }
              }
              else {
                kitInfo.kitLoteXItem = false;
                kitInfo.taIdKitLote = Cairo.Constants.NO_ID;
              }
            }
            else {
              kitInfo.kitIdentidadXItem = false;
              kitInfo.kitLote = false;
              kitInfo.kitLoteXItem = false;
              kitInfo.taIdKitSerie = Cairo.Constants.NO_ID;
              kitInfo.taIdKitLote = Cairo.Constants.NO_ID;
            }
          }
          else {
            kitInfo.kitIdentidad = false;
            kitInfo.kitIdentidadXItem = false;
            kitInfo.kitLote = false;
            kitInfo.kitLoteXItem = false;
            kitInfo.taIdKitSerie = Cairo.Constants.NO_ID;
            kitInfo.taIdKitLote = Cairo.Constants.NO_ID;
          }

        }
        else {
          kitInfo.kitStockXItem = false;
          kitInfo.kitResumido = false;
          kitInfo.kitIdentidad = false;
          kitInfo.kitIdentidadXItem = false;
          kitInfo.kitLote = false;
          kitInfo.kitLoteXItem = false;
          kitInfo.taIdKitSerie = Cairo.Constants.NO_ID;
          kitInfo.taIdKitLote = Cairo.Constants.NO_ID;
        }
      };

      var createNameFromRubro = function() {

        if(pGetRubId() === Cairo.Constants.NO_ID) {

          return Cairo.Promises.resolvedPromise(false);
        }
        else {

          return Cairo.Modal.confirmViewYesDefault(
            "",
            Cairo.Language.getText(2539, "")
          ).then(
            function (answer) {
              if (answer === "yes") {

                var name = pGetRubro().getValue() + (Cairo.String.rtrim(" " + pGetMarca().getValue())).toString();
                var properties = m_dialog.getProperties();

                if (!properties.contains(Constants.RUBTIID1)) {
                  if (pGetRubro().getValue().toLowerCase() !== properties.item(Constants.RUBTIID1).getValue().toLowerCase()) {
                    name = name + (Cairo.String.rtrim(" " + properties.item(Constants.RUBTIID1).getValue())).toString();
                  }
                }
                if (properties.contains(Constants.RUBTIID2)) {
                  name = name + (Cairo.String.rtrim(" " + properties.item(Constants.RUBTIID2).getValue())).toString();
                }
                if (properties.contains(Constants.RUBTIID3)) {
                  name = name + (Cairo.String.rtrim(" " + properties.item(Constants.RUBTIID3).getValue())).toString();
                }
                if (properties.contains(Constants.RUBTIID4)) {
                  name = name + (Cairo.String.rtrim(" " + properties.item(Constants.RUBTIID4).getValue())).toString();
                }
                if (properties.contains(Constants.RUBTIID5)) {
                  name = name + (Cairo.String.rtrim(" " + properties.item(Constants.RUBTIID5).getValue())).toString();
                }
                if (properties.contains(Constants.RUBTIID6)) {
                  name = name + (Cairo.String.rtrim(" " + properties.item(Constants.RUBTIID6).getValue())).toString();
                }
                if (properties.contains(Constants.RUBTIID7)) {
                  name = name + (Cairo.String.rtrim(" " + properties.item(Constants.RUBTIID7).getValue())).toString();
                }
                if (properties.contains(Constants.RUBTIID8)) {
                  name = name + (Cairo.String.rtrim(" " + properties.item(Constants.RUBTIID8).getValue())).toString();
                }
                if (properties.contains(Constants.RUBTIID9)) {
                  name = name + (Cairo.String.rtrim(" " + properties.item(Constants.RUBTIID9).getValue())).toString();
                }
                if (properties.contains(Constants.RUBTIID10)) {
                  name = name + (Cairo.String.rtrim(" " + properties.item(Constants.RUBTIID10).getValue())).toString();
                }

                properties.item(Constants.PR_NOMBRE_COMPRA).setValue(name);
                m_dialog.showValue(properties.item(Constants.PR_NOMBRE_COMPRA));

                if (properties.item(Constants.PR_NOMBRE_VENTA).getValue() === "") {
                  properties.item(Constants.PR_NOMBRE_VENTA).setValue(name);
                  m_dialog.showValue(properties.item(Constants.PR_NOMBRE_VENTA));
                }

                return true;
              }
              else {
                return false;
              }
            }
          );
        }
      };

      var pGetRubId = function() {
        return pGetRubro().getSelectId();
      };

      var pGetRubro = function() {
        return m_dialog.getProperties().item(Constants.RUB_ID);
      };

      var pGetMarca = function() {
        return m_dialog.getProperties().item(Constants.MARC_ID);
      };

      var pGetTags = function() {
        return m_dialog.getProperties().item(C_TAGS);
      };

      var editPriceList = function(lpi_id) {
        try {

          /*

          TODO: implement this.

          var lp_id = null;

          if(!Cairo.Database.getData(Constants.LISTAPRECIOITEM, Constants.LPI_ID, lpi_id, Constants.LP_ID, lp_id)) { return; }

          var obj = null;
          obj = CSKernelClient2.cUtil.createObject("CSArticulo.cListaPrecio");
          obj.setObjABM(new cABMGeneric());

          obj.edit(lp_id);
          */
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "editPriceList", C_MODULE, "");
        }
      };

      //-------------------------------------------
      // if the row has any cell set it belongs to the user
      // if not it belongs to the system so it is discarded
      //
      var isRowProveedorFromUser = function(row) {

        if(Cairo.Util.val(Dialogs.cell(row, KIK_PRPROV_ID).getValue()) >= 0) { return true; }
        if(Dialogs.cell(row, KIK_PROV_FABRICANTE).getValue() !== "") { return true; }
        if(Dialogs.cell(row, KIK_PROV_NOMBRE).getValue() !== "") { return true; }
        if(Dialogs.cell(row, KIK_PROV_CODIGO).getValue() !== "") { return true; }
        if(Dialogs.cell(row, KIK_PROV_CODBARRA).getValue() !== "") { return true; }
        if(Dialogs.cell(row, KIK_PA_ID).getId() !== Cairo.Constants.NO_ID) { return true; }

        return false;
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("Producto.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.productoEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.productoEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Productos",
            entityName: "producto",
            entitiesName: "productos"
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
              var editor = Cairo.Producto.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_PRODUCTO)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/producto", id, Cairo.Constants.DELETE_FUNCTION, "Producto").success(
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
          Cairo.LoadingMessage.show("Productos", "Loading Productos from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ productoTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.PRODUCTO,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.productoTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Productos", "productoTreeRegion", "#general/productos", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());