(function() {
  "use strict";

  Cairo.module("Producto.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cProducto
      // 24-06-01

      var C_MODULE = "cProducto";

      var C_PRODUCTOKIT = "PRODKIT";
      var C_PROVEEDOR = "PROV";
      var C_CLIENTE = "CLI";
      var C_CMI = "CMI";
      var C_BOM = "BOM";
      var C_TAGS = "TAGS";
      var C_WEB_IMAGES = "WEB_IMAGES";
      var C_LEYENDAS = "LEYENDAS";

      var C_WEB_CATALOGS = "WEB_catalogs";
      var C_WEB_CATEGORIES = "WEB_categories";

      var CSEXPOGRUPOPRECIO = 22502;
      var CSEXPOFAMILIA = 22501;
      var CSCOMUNIDAD_INTERNET = 39001;

      var CSCURSO = 37005;
      var CSREPORTE = -7002;

      var K_NOMBRECOMPRA = 2;
      var K_NOMBREVENTA = 3;
      var K_NOMBREFACTURA = 179;
      var K_CODE = 4;
      var K_CODIGO_BARRA = 200;
      var K_CODIGO_BARRA_NOMBRE = 201;
      var K_ACTIVE = 5;
      var K_DESCRIPVENTA = 6;
      var K_DESCRIPCOMPRA = 7;
      var K_UN_ID_COMPRA = 8;
      var K_UN_ID_VENTA = 9;
      var K_UN_ID_STOCK = 10;
      var K_COMPRAVENTA = 11;
      var K_VENTASTOCK = 12;
      var K_COMPRASTOCK = 13;
      var K_LLEVASTOCK = 14;
      var K_SECOMPRA = 15;
      var K_SEVENDE = 16;
      var K_NO_REDONDEO = 520;
      var K_DINERARIO = 510;
      var K_ESKIT = 17;
      var K_ESLISTA = 18;
      var K_TI_ID_IVARICOMPRA = 19;
      //Private Const K_TI_ID_IVARNICOMPRA             As Integer = 20
      var K_TI_ID_IVARIVENTA = 21;
      //Private Const K_TI_ID_IVARNIVENTA              As Integer = 22
      var K_TI_ID_INTERNOSV = 23;
      var K_TI_ID_INTERNOSC = 24;
      var K_PORCINTERNOC = 25;
      var K_PORCINTERNOV = 26;
      var K_IBC_ID = 27;
      var K_CUEG_ID_COMPRA = 28;
      var K_CUEG_ID_VENTA = 29;
      var K_X = 30;
      var K_Y = 31;
      var K_Z = 32;
      var K_TIENEHIJO = 33;
      var K_ID_PADRE = 34;
      var K_EDITAPRECIOHIJO = 35;
      var K_PERMITEEDICION = 36;
      var K_BORRADO = 37;
      var K_STOCKMINIMO = 38;
      var K_STOCKMAXIMO = 39;
      var K_CODIGOEXTERNO = 40;
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
      var K_LLEVANROSERIE = 59;
      var K_LLEVANROLOTE = 60;
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
      var K_NOMBREWEB = 178;
      var K_ALIASWEB = 180;
      var K_CODIGOHTML = 181;
      var K_CODIGOHTMLDETALLE = 182;
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

      var K_RPT_ID_NOMBREVENTA = 550;
      var K_RPT_ID_NOMBRECOMPRA = 551;
      var K_RPT_ID_NOMBREFACTURA = 552;
      var K_RPT_ID_NOMBREWEB = 553;
      var K_RPT_ID_NOMBREIMG = 554;
      var K_RPT_ID_NOMBREIMGALT = 555;

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

      // pseudo-constantes
      var c_ErrorSave = "";

      var m_id = 0;
      var m_nombrecompra = "";
      var m_nombreventa = "";
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
      var m_compraventa = 0;
      var m_ventastock = 0;
      var m_comprastock = 0;
      var m_llevastock = 0;
      var m_seCompra = 0;
      var m_seVende = 0;
      var m_dinerario;
      var m_noRedondeo;
      var m_eskit;
      var m_kitStkXItem;
      var m_eslista;
      var m_ti_id_ivaricompra = 0;
      var m_tiIvaRiCompra = "";
      var m_ti_id_ivarnicompra = 0;
      var m_tiIvaRniCompra = "";
      var m_ti_id_ivariventa = 0;
      var m_tiIvaRiVenta = "";
      var m_ti_id_ivarniventa = 0;
      var m_tiIvaRniVenta = "";
      var m_ti_id_internosv = 0;
      var m_tiInternosv = "";
      var m_ti_id_internosc = 0;
      var m_tiInternosc = "";
      var m_porcinternoc = 0;
      var m_porcinternov = 0;
      var m_ibc_id = 0;
      var m_ingresosbrutos = "";
      var m_cueg_id_compra = 0;
      var m_cuentaGCompra = "";
      var m_marc_id = 0;
      var m_marca = "";
      var m_cueg_id_venta = 0;
      var m_cuentaGVenta = "";
      var m_x = 0;
      var m_y = 0;
      var m_z = 0;
      var m_tienehijo;
      var m_id_Padre = 0;
      var m_editarPrecioHijo;
      var m_permiteEdicion;
      var m_borrado;
      var m_stockminimo = 0;
      var m_stockmaximo = 0;
      var m_codigoexterno = "";
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
      var m_pr_id_webpadre = 0;
      var m_webImageUpdate;
      var m_esplantilla;
      var m_cur_id = 0;
      var m_curso = "";

      var m_rpt_id_nombreventa = 0;
      var m_rpt_nombreventa = "";

      var m_rpt_id_nombrecompra = 0;
      var m_rpt_nombrecompra = "";

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
      var m_bRubroChanged;

      // Preferencias del Usuario
      //
      var m_userCfg;

      var m_genericEdit;

      self.getId = function() {
        return m_id;
      };

      self.getName = function() {
        return m_nombrecompra;
      };

      self.getCode = function() {
        return m_code;
      };

      self.getData = function(id,  strField,  typeValue) {
        var data = null;

        switch (typeValue) {
          case Cairo.Constants.Types.boolean:
            data = false;
            break;

          case Cairo.Constants.Types.cuit:
          case Cairo.Constants.Types.text:
            data = "";
            break;

          case Cairo.Constants.Types.date:
          case Cairo.Constants.Types.dateornull:
            data = Cairo.Constants.cSNODATE;
            break;

          case Cairo.Constants.Types.currency:
          case Cairo.Constants.Types.double:
          case Cairo.Constants.Types.integer:
          case Cairo.Constants.Types.long:
          case Cairo.Constants.Types.single:
          case Cairo.Constants.Types.id:
            data = 0;
            break;

          case Cairo.Constants.Types.variant:
            data = Empty;
            break;
        }

        if(!Cairo.Database.getData(Cairo.General.Constants.PRODUCTO, Cairo.General.Constants.PR_ID, id, strField, data, "GetData", C_MODULE)) {
          switch (typeValue) {
            case Cairo.Constants.Types.boolean:
              data = false;
              break;

            case Cairo.Constants.Types.cuit:
            case Cairo.Constants.Types.text:
              data = "";
              break;

            case Cairo.Constants.Types.date:
            case Cairo.Constants.Types.dateornull:
              data = Cairo.Constants.cSNODATE;
              break;

            case Cairo.Constants.Types.currency:
            case Cairo.Constants.Types.double:
            case Cairo.Constants.Types.integer:
            case Cairo.Constants.Types.long:
            case Cairo.Constants.Types.single:
            case Cairo.Constants.Types.id:
              data = 0;
              break;

            case Cairo.Constants.Types.variant:
              data = Empty;
              break;
          }
        }

        return data;
      };

      self.copy = function() {

        if(m_esplantilla) {
          m_esplantilla = false;
          pRefreshProperties();
        }

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        var property = m_dialog.getProperties().item(Cairo.General.Constants.PR_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.PR_CODE));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        if(!pValidateAccessNewEdit(Cairo.Constants.NO_ID)) { return false; }

        load(Cairo.Constants.NO_ID);
        pRefreshProperties();

      };

      self.getApplication = function() {
        return Cairo.appName;
      };

      self.editDocumentsEnabled = function() {
        return m_id != Cairo.Constants.NO_ID;
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

          if(m_id == Cairo.Constants.NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(Cairo.General.Constants.PRODUCTO);
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

          case Dialogs.Message.MSG_DOC_REFRESH:
            pRefreshProperties();

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
        var _rtn = null;

        info.bAddRows = false;

        switch (info.Key) {
          case K_TAGS:
            var w_pGetTags = pGetTags();

            var row = null;
            row = w_pGetTags.getGrid().getProperties().item(info.lRow);

            if(row.item(info.lCol).getKey() == KIT_PR_ID_TAG) {

              var oCell = null;

              oCell = Dialogs.cell(row, KIT_PR_ID_TAG);

              if(LenB(oCell.getHelpValueProcess())) {
                if(oCell.getHelpValueProcess().indexOf(",", 1)) {
                  AddMultiRowsCompras(oCell.getHelpValueProcess(), info, -1);
                  _rtn = true;
                }
              }
            }
            break;
        }


        return _rtn;
      };

      //Private Sub pAddMultiRows(ByVal Ids As String, _
      //                          ByRef Info As Variant)
      //  Dim sqlstmt As String
      //  Dim rs      As ADODB.Recordset
      //
      //  sqlstmt = "select pr_nombrecompra, pr_id from Producto where pr_id in (" & Ids & ")"
      //  If Not gDB.OpenRs(sqlstmt, rs) Then Exit Sub
      //  If rs.EOF Then Exit Sub
      //
      //  Dim i As Long
      //  Dim j As Long
      //  Dim k As Long
      //  Dim Pr_id As Long
      //  Dim vIds  As Variant
      //  Dim vIds2 As Variant
      //  Dim bFound As Boolean
      //
      //  vIds2 = Split(Ids, ",")
      //
      //  ReDim vIds(UBound(vIds2))
      //
      //  For i = 0 To UBound(vIds2)
      //    bFound = False
      //    For j = 0 To UBound(vIds)
      //
      //      If vIds2(i) = vIds(j) Then
      //        bFound = True
      //        Exit For
      //      End If
      //
      //    Next
      //    If Not bFound Then
      //      vIds(k) = vIds2(i)
      //      k = k + 1
      //    End If
      //  Next
      //
      //  ReDim Preserve vIds(k - 1)
      //
      //  ' Ahora respeto el orden de seleccion
      //  '
      //  For i = 0 To UBound(vIds)
      //
      //    rs.MoveFirst
      //
      //    Do While Not rs.EOF
      //
      //      Pr_id = gDB.ValField(rs.fields, cscPrId)
      //
      //      If Val(vIds(i)) = Pr_id Then
      //        Info.NewId.Add Pr_id
      //        Info.NewValue.Add gDB.ValField(rs.fields, cscPrNombrecompra)
      //        Exit Do
      //      End If
      //
      //      rs.MoveNext
      //    Loop
      //
      //  Next
      //
      //  ' No lo toquen, es mas 1 :( o explota todooo :P
      //  ' ups al final no era jeje
      //  '
      //  Info.iAddRows = Info.NewId.Count '+ 1
      //
      //  Info.bAddRows = Info.iAddRows
      //
      //End Sub

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      var setEnabledCompra = function(status) {

        var properties = m_dialog.getProperties();
        properties.item(Cairo.General.Constants.PR_UN_ID_COMPRA).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_CUEG_ID_COMPRA).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_TI_ID_RI_COMPRA).setEnabled(status);
        //.Item(cscPrTiIdRniCompra).Enabled = Status
        properties.item(Cairo.General.Constants.PR_TI_ID_INTERNOS_COMPRA).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_PORCINTERNOC).setEnabled(status);
        properties.item(C_PROVEEDOR).setEnabled(status);

        m_dialog.refreshControls();

        m_seCompra = status;
      };

      var setEnabledVenta = function(status) {

        var properties = m_dialog.getProperties();
        properties.item(Cairo.General.Constants.PR_UN_ID_VENTA).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_CUEG_ID_VENTA).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_TI_ID_RI_VENTA).setEnabled(status);
        //.Item(cscPrTiIdRniVenta).Enabled = Status
        properties.item(Cairo.General.Constants.PR_NOMBRE_FACTURA).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_TI_ID_INTERNOS_VENTA).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_PORCINTERNOV).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_NOMBREVENTA).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_DESCRIPVENTA).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_VENTA_COMPRA).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_VENTA_STOCK).setEnabled(status);
        //.Item(cscPrEskit).Enabled = Status
        properties.item(Cairo.General.Constants.PR_ES_LISTA).setEnabled(status);
        properties.item(C_CLIENTE).setEnabled(status);

        m_dialog.refreshControls();

        m_seVende = status;
      };

      var setEnabledStock = function(status) {

        var properties = m_dialog.getProperties();
        properties.item(Cairo.General.Constants.PR_UN_ID_STOCK).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_STOCK_COMPRA).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_X).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_Y).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_Z).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_STOCKMINIMO).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_STOCKMAXIMO).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_REPOSICION).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_LLEVA_NRO_LOTE).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_LLEVA_NRO_SERIE).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_LOTE_FIFO).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_SE_PRODUCE).setEnabled(status);
        properties.item(Cairo.General.Constants.PR_ES_REPUESTO).setEnabled(status);

        m_dialog.refreshControls();

        m_llevastock = status;
      };

      var setEnabledPlantilla = function() {
        var iProp = null;
        var status = null;

        status = m_esplantilla == false;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          iProp = m_dialog.getProperties().item(_i);
          iProp.setEnabled(status);
        }

        if(!m_esplantilla) {

          setEnabledCompra(m_seCompra);
          setEnabledStock(m_llevastock);
          setEnabledVenta(m_seVende);

        }

        m_dialog.getProperties().item(Cairo.General.Constants.PR_ES_PLANTILLA).setEnabled(true);
        pGetTags().setEnabled(m_pr_id_webpadre == Cairo.Constants.NO_ID);

      };

      self.propertyChange = function(key) {
        var _rtn = null;

        var bEnabled = null;
        var iProp = null;
        var bSeVende = null;

        _rtn = true;

        switch (key) {
          case K_SECOMPRA:
            setEnabledCompra(Cairo.Util.val(m_dialog.getProperties().item(Cairo.General.Constants.PR_SECOMPRA).getValue()) != 0);

            break;

          case K_SEVENDE:

            bSeVende = Cairo.Util.val(m_dialog.getProperties().item(Cairo.General.Constants.PR_SEVENDE).getValue()) != 0;
            setEnabledVenta(bSeVende);

            iProp = m_dialog.getProperties().item(Cairo.General.Constants.PR_NOMBREVENTA);

            if(bSeVende) {

              if(iProp.getValue().Length == 0) {
                iProp.setValue(m_dialog.getProperties().item(Cairo.General.Constants.PR_NOMBRECOMPRA).getValue());
              }

            }
            else {

              if(iProp.getValue() == m_dialog.getProperties().item(Cairo.General.Constants.PR_NOMBRECOMPRA).getValue()) {
                iProp.setValue("");
              }

            }

            break;

          case K_LLEVASTOCK:
            setEnabledStock(Cairo.Util.val(m_dialog.getProperties().item(Cairo.General.Constants.PR_LLEVASTOCK).getValue()) != 0);

            break;

          case K_RUB_ID:
            var rubId = null;
            rubId = pGetRubId();
            if(m_lastRubId != rubId) {
              pSetRubro(rubId, true);
              m_lastRubId = rubId;
            }

            break;

          case K_NOMBRECOMPRA:

            var properties = m_dialog.getProperties();

            var nombre = null;
            var nombreventa = null;

            nombre = properties.item(Cairo.General.Constants.PR_NOMBRECOMPRA).getValue();
            nombreventa = properties.item(Cairo.General.Constants.PR_NOMBREVENTA).getValue();
            bSeVende = Cairo.Util.val(properties.item(Cairo.General.Constants.PR_SEVENDE).getValue());

            if(m_nombrecompra != nombre && nombre != nombreventa && bSeVende) {
              //Ha modificado el nombre de compras, desea aplicar el mismo nombre a ventas
              if(cWindow.ask(Cairo.Language.getText(1282, ""), vbYes)) {

                properties.item(Cairo.General.Constants.PR_NOMBREVENTA).setValue(nombre);
              }
            }

            break;

          case K_ESKIT:

            var properties = m_dialog.getProperties();

            bEnabled = Cairo.Util.val(properties.item(Cairo.General.Constants.PR_ESKIT).getValue());

            iProp = properties.item(Cairo.General.Constants.PR_KIT_STOCK_XITEM);
            iProp.setEnabled(bEnabled);
            m_dialog.showValue(iProp);

            iProp = properties.item(Cairo.General.Constants.PR_KIT_RESUMIDO);
            iProp.setEnabled(bEnabled);
            m_dialog.showValue(iProp);

            pSetKitEnabled();

            break;

          case K_KIT_RESUMIDO:
            pSetKitEnabled();

            break;

          case K_KIT_IDENTIDAD:
          case K_KIT_IDENTIDADXITEM:

            bEnabled = Cairo.Util.val(m_dialog.getProperties().item(Cairo.General.Constants.PR_KIT_RESUMIDO).getValue());
            pSetKitSerieEnabled(bEnabled);
            pSetKitLoteEnabled(bEnabled);

            break;

          case K_KIT_LOTE:
          case K_KIT_LOTEXITEM:

            pSetKitLoteEnabled(Cairo.Util.val(m_dialog.getProperties().item(Cairo.General.Constants.PR_KIT_RESUMIDO).getValue()));

            break;

          case K_PR_ID_WEB_PADRE:

            var c = null;
            c = pGetTags();

            c.setEnabled(m_dialog.getProperties().item(Cairo.General.Constants.PR_ID_WEB_PADRE).getSelectId() == Cairo.Constants.NO_ID);

            var abmGen = null;
            abmGen = m_dialog;
            abmGen.showValue(c, true);

            break;

          default:
            _rtn = false;
            break;
        }

        return _rtn;
      };

      self.save = function() {
        var _rtn = null;

        var bEsKit = null;
        var bKitStockXItem = null;
        var bKitResumido = null;
        var bKitIdentidad = null;
        var bKitIdentidadXItem = null;
        var taIdKitSerie = null;
        var bKitLote = null;
        var bKitLoteXItem = null;
        var taIdKitLote = null;

        var lastId = null;

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(Cairo.General.Constants.PR_ID);
        register.setTable(Cairo.General.Constants.PRODUCTO);

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
            case K_NOMBRECOMPRA:
              fields.add(Cairo.General.Constants.PR_NOMBRECOMPRA, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_NOMBREVENTA:
              fields.add(Cairo.General.Constants.PR_NOMBREVENTA, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_NOMBREFACTURA:
              fields.add(Cairo.General.Constants.PR_NOMBRE_FACTURA, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_NOMBREWEB:
              fields.add(Cairo.General.Constants.PR_NOMBRE_WEB, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ALIASWEB:
              fields.add(Cairo.General.Constants.PR_ALIAS_WEB, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_PR_ID_WEB_PADRE:
              fields.add(Cairo.General.Constants.PR_ID_WEB_PADRE, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_ACTIVOWEB:
              fields.add(Cairo.General.Constants.PR_ACTIVO_WEB, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_LEY_ID:
              fields.add(Cairo.General.Constants.LEY_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CODIGOHTML:
              fields.add(Cairo.General.Constants.PR_CODIGO_HTML, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODIGOHTMLDETALLE:
              fields.add(Cairo.General.Constants.PR_CODIGO_HTML_DETALLE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(Cairo.General.Constants.PR_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODIGO_BARRA:
              fields.add(Cairo.General.Constants.PR_CODIGO_BARRA, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODIGO_BARRA_NOMBRE:
              fields.add(Cairo.General.Constants.PR_CODIGO_BARRA_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_DESCRIPVENTA:
              fields.add(Cairo.General.Constants.PR_DESCRIPVENTA, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIPCOMPRA:
              fields.add(Cairo.General.Constants.PR_DESCRIPCOMPRA, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_UN_ID_COMPRA:
              fields.add(Cairo.General.Constants.PR_UN_ID_COMPRA, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_UN_ID_VENTA:
              fields.add(Cairo.General.Constants.PR_UN_ID_VENTA, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_UN_ID_STOCK:
              fields.add(Cairo.General.Constants.PR_UN_ID_STOCK, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_COMPRAVENTA:
              fields.add(Cairo.General.Constants.PR_VENTA_COMPRA, property.getValue(), Cairo.Constants.Types.double);
              break;

            case K_VENTASTOCK:
              fields.add(Cairo.General.Constants.PR_VENTA_STOCK, property.getValue(), Cairo.Constants.Types.double);
              break;

            case K_COMPRASTOCK:
              fields.add(Cairo.General.Constants.PR_STOCK_COMPRA, property.getValue(), Cairo.Constants.Types.double);
              break;

            case K_LLEVASTOCK:
              fields.add(Cairo.General.Constants.PR_LLEVASTOCK, property.getValue(), Cairo.Constants.Types.integer);
              break;

            case K_SECOMPRA:
              fields.add(Cairo.General.Constants.PR_SECOMPRA, property.getValue(), Cairo.Constants.Types.integer);
              break;

            case K_SEVENDE:
              fields.add(Cairo.General.Constants.PR_SEVENDE, property.getValue(), Cairo.Constants.Types.integer);
              break;

            case K_NO_REDONDEO:
              fields.add(Cairo.General.Constants.PR_NO_REDONDEO, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_DINERARIO:
              fields.add(Cairo.General.Constants.PR_DINERARIO, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_ESLISTA:
              fields.add(Cairo.General.Constants.PR_ES_LISTA, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_TI_ID_IVARICOMPRA:
              fields.add(Cairo.General.Constants.PR_TI_ID_RI_COMPRA, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_TI_ID_IVARIVENTA:
              fields.add(Cairo.General.Constants.PR_TI_ID_RI_VENTA, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_TI_ID_INTERNOSV:
              fields.add(Cairo.General.Constants.PR_TI_ID_INTERNOS_VENTA, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_TI_ID_INTERNOSC:
              fields.add(Cairo.General.Constants.PR_TI_ID_INTERNOS_COMPRA, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_PORCINTERNOC:
              fields.add(Cairo.General.Constants.PR_PORCINTERNOC, property.getValue(), Cairo.Constants.Types.double);
              break;

            case K_PORCINTERNOV:
              fields.add(Cairo.General.Constants.PR_PORCINTERNOV, property.getValue(), Cairo.Constants.Types.double);
              break;

            case K_IBC_ID:
              fields.add(Cairo.General.Constants.IBC_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CUEG_ID_COMPRA:
              fields.add(Cairo.General.Constants.PR_CUEG_ID_COMPRA, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CUEG_ID_VENTA:
              fields.add(Cairo.General.Constants.PR_CUEG_ID_VENTA, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_X:
              fields.add(Cairo.General.Constants.PR_X, property.getValue(), Cairo.Constants.Types.integer);
              break;

            case K_Y:
              fields.add(Cairo.General.Constants.PR_Y, property.getValue(), Cairo.Constants.Types.integer);
              break;

            case K_Z:
              fields.add(Cairo.General.Constants.PR_Z, property.getValue(), Cairo.Constants.Types.integer);
              break;

            case K_TIENEHIJO:
              fields.add(Cairo.General.Constants.PR_TIENEHIJO, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_STOCKMINIMO:
              fields.add(Cairo.General.Constants.PR_STOCKMINIMO, property.getValue(), Cairo.Constants.Types.double);
              break;

            case K_STOCKMAXIMO:
              fields.add(Cairo.General.Constants.PR_STOCKMAXIMO, property.getValue(), Cairo.Constants.Types.double);
              break;

            case K_LLEVANROSERIE:
              fields.add(Cairo.General.Constants.PR_LLEVA_NRO_SERIE, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_LLEVANROLOTE:
              fields.add(Cairo.General.Constants.PR_LLEVA_NRO_LOTE, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_ESREPUESTO:
              fields.add(Cairo.General.Constants.PR_ES_REPUESTO, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_LOTEFIFO:
              fields.add(Cairo.General.Constants.PR_LOTE_FIFO, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_FLETEEXPO:
              fields.add(Cairo.General.Constants.PR_FLETE_EXPO, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_SEPRODUCE:
              fields.add(Cairo.General.Constants.PR_SE_PRODUCE, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_CODIGOEXTERNO:
              fields.add(Cairo.General.Constants.PR_CODIGOEXTERNO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_MARC_ID:
              fields.add(Cairo.General.Constants.MARC_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_PESO_NETO:
              fields.add(Cairo.General.Constants.PR_PESO_NETO, property.getValue(), Cairo.Constants.Types.double);
              break;

            case K_PESO_TOTAL:
              fields.add(Cairo.General.Constants.PR_PESO_TOTAL, property.getValue(), Cairo.Constants.Types.double);
              break;

            case K_EGP_ID:
              fields.add(Cairo.General.Constants.EGP_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_EFM_ID:
              fields.add(Cairo.General.Constants.EFM_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_EMBL_ID:
              fields.add(Cairo.General.Constants.EMBL_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_TI_COMEX_GANANCIAS:
              fields.add(Cairo.General.Constants.TI_ID_COMEX_GANANCIAS, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_TI_COMEX_IGB:
              fields.add(Cairo.General.Constants.TI_ID_COMEX_IGB, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_TI_COMEX_IVA:
              fields.add(Cairo.General.Constants.TI_ID_COMEX_IVA, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_POAR_ID:
              fields.add(Cairo.General.Constants.POAR_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_UN_ID_PESO:
              fields.add(Cairo.General.Constants.UN_ID_PESO, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CANTIDAD_X_CAJA_EXPO:
              fields.add(Cairo.General.Constants.PR_CANT_XCAJA_EXPO, property.getValue(), Cairo.Constants.Types.integer);
              break;

            case K_REPOSICION:
              fields.add(Cairo.General.Constants.PR_REPOSICION, property.getValue(), Cairo.Constants.Types.double);
              break;

            case K_RUB_ID:
              fields.add(Cairo.General.Constants.RUB_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID1:
              fields.add(Cairo.General.Constants.RUBTIID1, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID2:
              fields.add(Cairo.General.Constants.RUBTIID2, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID3:
              fields.add(Cairo.General.Constants.RUBTIID3, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID4:
              fields.add(Cairo.General.Constants.RUBTIID4, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID5:
              fields.add(Cairo.General.Constants.RUBTIID5, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID6:
              fields.add(Cairo.General.Constants.RUBTIID6, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID7:
              fields.add(Cairo.General.Constants.RUBTIID7, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID8:
              fields.add(Cairo.General.Constants.RUBTIID8, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID9:
              fields.add(Cairo.General.Constants.RUBTIID9, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID10:
              fields.add(Cairo.General.Constants.RUBTIID10, property.getSelectId(), Cairo.Constants.Types.id);

              break;

            case K_EXPOWEB:
              fields.add(Cairo.General.Constants.PR_EXPO_WEB, property.getValue(), Cairo.Constants.Types.integer);
              break;

            case K_EXPOCAIRO:
              fields.add(Cairo.General.Constants.PR_EXPO_CAIRO, property.getValue(), Cairo.Constants.Types.integer);

              break;

            case K_VENTA_WEB_MAXIMA:
              fields.add(Cairo.General.Constants.PR_VENTA_WEB_MAXIMA, property.getValue(), Cairo.Constants.Types.double);
              break;

            case K_WEB_IMAGE_UPDATE:
              fields.add(Cairo.General.Constants.PR_WEB_IMAGE_UPDATE, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_WEB_IMAGE_FOLDER:
              fields.add(Cairo.General.Constants.PR_WEB_IMAGE_FOLDER, property.getValue(), Cairo.Constants.Types.text);

              //-----------------------------------------------------
              // Kit
              //
              break;

            case K_ESKIT:
              bEsKit = Cairo.Util.val(property.getValue());
              fields.add(Cairo.General.Constants.PR_ESKIT, property.getValue(), Cairo.Constants.Types.boolean);

              break;

            case K_KIT_STK_X_ITEM:
              bKitStockXItem = Cairo.Util.val(property.getValue());

              break;

            case K_KIT_RESUMIDO:
              bKitResumido = Cairo.Util.val(property.getValue());

              break;

            case K_KIT_IDENTIDAD:
              bKitIdentidad = Cairo.Util.val(property.getValue());

              break;

            case K_KIT_IDENTIDADXITEM:
              bKitIdentidadXItem = Cairo.Util.val(property.getValue());

              break;

            case K_TA_ID_KITSERIE:
              taIdKitSerie = property.getSelectId();

              break;

            case K_KIT_LOTE:
              bKitLote = Cairo.Util.val(property.getValue());

              break;

            case K_KIT_LOTEXITEM:
              bKitLoteXItem = Cairo.Util.val(property.getValue());

              break;

            case K_TA_ID_KITLOTE:
              taIdKitLote = property.getSelectId();

              break;

            case K_CCOS_ID_COMPRA:
              fields.add(Cairo.General.Constants.CCOS_ID_COMPRA, property.getSelectId(), Cairo.Constants.Types.id);

              break;

            case K_CCOS_ID_VENTA:
              fields.add(Cairo.General.Constants.CCOS_ID_VENTA, property.getSelectId(), Cairo.Constants.Types.id);

              break;

            case K_ESPLANTILLA:
              fields.add(Cairo.General.Constants.PR_ES_PLANTILLA, property.getValue(), Cairo.Constants.Types.boolean);

              break;

            case K_CUR_ID:
              fields.add(Cairo.General.Constants.CUR_ID, property.getSelectId(), Cairo.Constants.Types.id);

              break;

            case K_RPT_ID_NOMBRECOMPRA:
              fields.add(Cairo.General.Constants.RPT_ID_NOMBRE_COMPRA, property.getSelectId(), Cairo.Constants.Types.id);

              break;

            case K_RPT_ID_NOMBREVENTA:
              fields.add(Cairo.General.Constants.RPT_ID_NOMBRE_VENTA, property.getSelectId(), Cairo.Constants.Types.id);

              break;

            case K_RPT_ID_NOMBREFACTURA:
              fields.add(Cairo.General.Constants.RPT_ID_NOMBRE_FACTURA, property.getSelectId(), Cairo.Constants.Types.id);

              break;

            case K_RPT_ID_NOMBREWEB:
              fields.add(Cairo.General.Constants.RPT_ID_NOMBRE_WEB, property.getSelectId(), Cairo.Constants.Types.id);

              break;

            case K_RPT_ID_NOMBREIMG:
              fields.add(Cairo.General.Constants.RPT_ID_NOMBRE_IMG, property.getSelectId(), Cairo.Constants.Types.id);

              break;

            case K_RPT_ID_NOMBREIMGALT:
              fields.add(Cairo.General.Constants.RPT_ID_NOMBRE_IMG_ALT, property.getSelectId(), Cairo.Constants.Types.id);

              break;
          }
        }

        // IVA RNI
        //
        fields.add(Cairo.General.Constants.PR_TI_ID_RNI_VENTA, -1, Cairo.Constants.Types.id);
        fields.add(Cairo.General.Constants.PR_TI_ID_RNI_COMPRA, -2, Cairo.Constants.Types.id);

        //--------------------------
        // Kit
        //
        pSetKitConfig(bEsKit, bKitStockXItem, bKitResumido, bKitIdentidad, bKitIdentidadXItem, taIdKitSerie, bKitLote, bKitLoteXItem, taIdKitLote);

        fields.add(Cairo.General.Constants.PR_KIT_STOCK_XITEM, Cairo.Util.boolToInt(bKitStockXItem), Cairo.Constants.Types.boolean);
        fields.add(Cairo.General.Constants.PR_KIT_RESUMIDO, Cairo.Util.boolToInt(bKitResumido), Cairo.Constants.Types.boolean);
        fields.add(Cairo.General.Constants.PR_KIT_IDENTIDAD, Cairo.Util.boolToInt(bKitIdentidad), Cairo.Constants.Types.boolean);
        fields.add(Cairo.General.Constants.PR_KIT_IDENTIDAD_XITEM, Cairo.Util.boolToInt(bKitIdentidadXItem), Cairo.Constants.Types.boolean);
        fields.add(Cairo.General.Constants.TA_ID_KIT_SERIE, taIdKitSerie, Cairo.Constants.Types.id);
        fields.add(Cairo.General.Constants.PR_KIT_LOTE, Cairo.Util.boolToInt(bKitLote), Cairo.Constants.Types.boolean);
        fields.add(Cairo.General.Constants.PR_KIT_LOTE_XITEM, Cairo.Util.boolToInt(bKitLoteXItem), Cairo.Constants.Types.boolean);
        fields.add(Cairo.General.Constants.TA_ID_KIT_LOTE, taIdKitLote, Cairo.Constants.Types.id);

        if(!m_genericEdit.Save(m_dialog, register)) { return _rtn; }

        register.prepareTransaction();
        // save items
        lastId = m_id;
        m_id = register.getID();

        if(!pSaveItemsProveedor(register)) {  return false; }

        // TODO: Actualizar ListaPrecioItem y el cache de precios si corresponde
        //

        if(!pSaveItemsCliente(register)) {  return false; }
        if(!pSaveItemsCMI(register)) {  return false; }
        if(!pSaveItemsLeyendas(register)) {  return false; }
        if(!pSaveItemsTags(register)) {  return false; }
        if(!pSaveItemsWebImages(register)) {  return false; }

        if(!pSaveItemsWebCatalogos(register)) {  return false; }
        if(!pSaveItemsWebCategorias(register)) {  return false; }

        var sqlstmt = null;
        sqlstmt = "sp_ProductoSaveKit "+ m_id;
        if(!Cairo.Database.execute(sqlstmt)) {  return false; }

        var rs = null;
        sqlstmt = "sp_ProductoValidate "+ m_id;
        if(!Cairo.Database.openRs(sqlstmt, rs)) {  return false; }

        if(rs.isEOF()) {  return false; }

        if(cDataBase.valField(rs.getFields(), 0) == 0) {
          cWindow.msgWarning(cDataBase.valField(rs.getFields(), 1));
          // **TODO:** goto found: GoTo SaveError;
        }

        if(!pSaveNombres(m_id)) {  return false; }

        return Cairo.Database.saveTransaction(
            register,
            false,
            Cairo.General.Constants.PR_CODE,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            c_ErrorSave).then(

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
          });

        return _rtn;
        // **TODO:** label found: SaveError:;
        m_id = lastId;

        return _rtn;
      };

      var updateList = function() {
        if(m_id == Cairo.Constants.NO_ID) { return; }
        if(m_listController == null) { return; }

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
          if(m_listController != null) {
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
        //'Artículos
        return Cairo.Language.getText(1283, "");
      };

      self.validate = function() {

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
            case K_NOMBRECOMPRA:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {

                if(!pCreateFromRubro()) {

                  return Cairo.Modal.showInfo(Cairo.Constants.MUST_SET_A_NAME).then(function() {return false;});
                }
              }
              break;

            case K_NOMBREVENTA:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text) && m_seVende) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1293, "")).then(function() {return false;});
                //Debe indicar un nombre de venta
              }
              break;

            case K_CODE:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                property.setValue(Cairo.Constants.GET_CODE_FROM_ID);
              }
              break;

            case K_UN_ID_COMPRA:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id) && m_seCompra) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1284, "")).then(function() {return false;});
                //Debe indicar una unidad de compra
              }
              break;

            case K_UN_ID_VENTA:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id) && m_seVende) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1285, "")).then(function() {return false;});
                //Debe indicar una unidad de venta
              }
              break;

            case K_UN_ID_STOCK:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id) && m_llevastock) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1286, "")).then(function() {return false;});
                //Debe indicar una unidad de stock
              }
              break;

            case K_COMPRAVENTA:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.double) && m_seVende && m_seCompra) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1287, "")).then(function() {return false;});
                //Debe indicar una relación entre la unidad de compra y la unidad de venta
              }
              break;

            case K_VENTASTOCK:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.double) && m_seVende && m_llevastock) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1288, "")).then(function() {return false;});
                //Debe indicar una relación entre la unidad de venta y la unidad de stock
              }
              break;

            case K_COMPRASTOCK:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.double) && m_llevastock && m_seCompra) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1294, "")).then(function() {return false;});
                //Debe indicar una relación entre la unidad de compra y la unidad de stock
              }
              break;

            case K_TI_ID_IVARICOMPRA:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id) && m_seCompra) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1289, "")).then(function() {return false;});
                //Debe indicar una tasa impositiva de compras para Responsables Inscriptos
              }
              //        Case K_TI_ID_IVARNICOMPRA
              //          If ValEmpty(.HelpId, csId) And m_SeCompra Then
              //            MsgInfo Cairo.Language.getText(1290, vbNullString)
              //                              'Debe indicar una tasa impositiva de compras para Responsables No Inscriptos
              //            Exit Function
              //          End If
              break;

            case K_TI_ID_IVARIVENTA:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id) && m_seVende) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1291, "")).then(function() {return false;});
                //Debe indicar una tasa impositiva de ventas para Responsables Inscriptos
              }
              //        Case K_TI_ID_IVARNIVENTA
              //          If ValEmpty(.HelpId, csId) And m_SeVende Then
              //            MsgInfo Cairo.Language.getText(1292, vbNullString)
              //                              'Debe indicar una tasa impositiva de ventas para Responsables No Inscriptos
              //            Exit Function
              //          End If
              break;

            case K_CUEG_ID_COMPRA:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id) && m_seCompra) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1295, "")).then(function() {return false;});
                //Debe indicar un grupo de cuentas para compras
              }
              break;

            case K_CUEG_ID_VENTA:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id) && m_seVende) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1296, "")).then(function() {return false;});
                //Debe indicar un grupo de cuentas para ventas
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
              bNeedTalIdentidad = Cairo.Util.val(property.getValue()) == 0;
              break;

            case K_KIT_LOTEXITEM:
              bNeedTalLote = Cairo.Util.val(property.getValue()) == 0;
              break;

            case K_TA_ID_KITSERIE:
              bHaveTalIdentidad = property.getSelectId() != Cairo.Constants.NO_ID;
              break;

            case K_TA_ID_KITLOTE:
              bHaveTalLote = property.getSelectId() != Cairo.Constants.NO_ID;
              break;
          }
        }

        if(bIsResumido) {

          if(bValidateIdentidad && bNeedTalIdentidad && !bHaveTalIdentidad) {
            return Cairo.Modal.showInfo(Cairo.Language.getText(1297, "")).then(function() {return false;});
            //Debe indicar un talonario para la identidad del Kit
          }

          if(bValidateLote && bNeedTalLote && !bHaveTalLote) {
            return Cairo.Modal.showInfo(Cairo.Language.getText(1353, "")).then(function() {return false;});
            //Debe indicar un talonario para el lote del Kit
          }

        }

        if(!m_genericEdit.Validate(m_dialog)) { return false; }

        return Cairo.Promises.resolvedPromise(true);
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

      var pDeletePlantilla = function(pr_id) {
        var _rtn = null;
        var esPlantilla = null;
        if(!Cairo.Database.getData(Cairo.General.Constants.PRODUCTO, Cairo.General.Constants.PR_ID, pr_id, Cairo.General.Constants.PR_ES_PLANTILLA, esPlantilla)) { return _rtn; }
        if(esPlantilla) {
          _rtn = cWindow.ask(Cairo.Language.getText(4830, ""), vbNo);
          // Esta realmente seguro de borrar la plantilla
        }
        else {
          _rtn = true;
        }

        return _rtn;
      };

      self.edit = function(id,  inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(!pValidateAccessNewEdit(id)) { return p; }

          m_dialog.setInModalWindow(inModalWindow);

          m_genericEdit = new cGenericEdit();
          if(!m_genericEdit.init(Cairo.Tables.PRODUCTO)) { return p; }

          p = load(id).then(
            function(success) {
              if(success) {

                if(!loadCollection()) { return false; }

                m_editing = true;
                m_copy = false;

                if(inModalWindow) {
                  success = m_id != Cairo.Constants.NO_ID;
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
        if(id == Cairo.Constants.NO_ID) {
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

        var abmObj = null;
        abmObj = m_dialog;
        abmObj.setMinHeight(8600);
        abmObj.setMinWidth(12000);

        var c = null;
        var o = null;

        var tab_general = 0;
        var tab_compra = 1;
        var tab_stock = 2;
        var tab_venta = 3;
        var tab_rubro = 4;
        var tab_comex = 5;
        var tab_kit = 6;
        var tab_proveedor = 7;
        //Const tab_cliente = 8
        //Const tab_BOM = 9
        var tab_Web = 8;
        var tab_web2 = 9;

        var w_tabs = m_dialog.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Constants.c_strGeneral);

        var tab = w_tabs.add(null);
        //'Compras
        tab.setName(Cairo.Language.getText(1489, ""));
        tab.setIndex(tab_compra);

        var tab = w_tabs.add(null);
        tab.setIndex(tab_stock);
        //'Stock
        tab.setName(Cairo.Language.getText(1298, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(tab_venta);
        //'Venta
        tab.setName(Cairo.Language.getText(1059, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(tab_rubro);
        //'Rubro
        tab.setName(Cairo.Language.getText(1299, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(tab_comex);
        //'COMEX
        tab.setName(Cairo.Language.getText(3523, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(tab_kit);
        //'Kit
        tab.setName(Cairo.Language.getText(1301, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(tab_proveedor);
        //'Terceros
        tab.setName(Cairo.Language.getText(4595, ""));

        //With .Add(Nothing)
        //  .Index = tab_cliente
        //  .Name = Cairo.Language.getText(1303, vbNullString) 'Clientes
        //End With

        //With .Add(Nothing)
        //  .Index = tab_BOM
        //  .Name = Cairo.Language.getText(1304, vbNullString) 'B.O.M.
        //End With

        var tab = w_tabs.add(null);
        tab.setIndex(tab_Web);
        //'Web
        tab.setName(Cairo.Language.getText(1038, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(tab_web2);
        //'Cat. Web
        tab.setName(Cairo.Language.getText(4792, ""));

        m_dialog.setTitle(m_nombrecompra);

        var properties = m_dialog.getProperties();

        properties.clear();

        //////////////////////////////////////////////////////////////
        // General
        //
        var elem = properties.add(null, Cairo.General.Constants.PR_NOMBRECOMPRA);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setWidth(8000);
        elem.setKey(K_NOMBRECOMPRA);
        elem.setValue(m_nombrecompra);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTopFromProperty(Cairo.General.Constants.PR_NOMBRECOMPRA);
        elem.setLeftFromProperty(Cairo.General.Constants.PR_NOMBRECOMPRA);
        elem.setLeftToPrevious(8900);
        elem.setLeftLabel(-500);
        elem.setWidth(800);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.add(null, Cairo.General.Constants.PR_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setLeftFromProperty(Cairo.General.Constants.PR_NOMBRECOMPRA);
        elem.setTopFromProperty(Cairo.General.Constants.PR_NOMBRECOMPRA);
        elem.setTopToPrevious(440);
        elem.setSize(90);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        var elem = properties.add(null, Cairo.General.Constants.PR_CODIGOEXTERNO);
        elem.setType(Dialogs.PropertyType.text);
        //'Código Externo
        elem.setName(Cairo.Language.getText(1305, ""));
        elem.setSize(30);
        elem.setKey(K_CODIGOEXTERNO);
        elem.setValue(m_codigoexterno);

        var elem = properties.add(null, Cairo.General.Constants.PR_CODIGO_BARRA);
        elem.setType(Dialogs.PropertyType.text);
        //'Código de Barras
        elem.setName(Cairo.Language.getText(1177, ""));
        elem.setSize(255);
        elem.setKey(K_CODIGO_BARRA);
        elem.setValue(m_codigoBarra);

        var elem = properties.add(null, Cairo.General.Constants.PR_CODIGO_BARRA_NAME);
        elem.setType(Dialogs.PropertyType.text);
        //'Nombre Código de Barras
        elem.setName(Cairo.Language.getText(1307, ""));
        elem.setSize(255);
        elem.setKey(K_CODIGO_BARRA_NOMBRE);
        elem.setValue(m_codigoBarraNombre);

        var elem = properties.add(null, Cairo.General.Constants.IBC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.INGRESOSBRUTOSCATEGORIA);
        //'Categoría Ingresos Brutos
        elem.setName(Cairo.Language.getText(1308, ""));
        elem.setKey(K_IBC_ID);
        elem.setSelectId(m_ibc_id);
        elem.setValue(m_ingresosbrutos);
        elem.setTopFromProperty(Cairo.General.Constants.PR_CODE);
        elem.setLeft(5500);

        var elem = properties.add(null, Cairo.General.Constants.MARC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MARCA);
        //'Marca
        elem.setName(Cairo.Language.getText(1310, ""));
        elem.setKey(K_MARC_ID);
        elem.setValue(m_marca);
        elem.setSelectId(m_marc_id);
        elem.setWidth(4050);

        var elem = properties.add(null, Cairo.General.Constants.PR_EXPO_CAIRO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        //' Expo cairo
        elem.setName(Cairo.Language.getText(3898, ""));
        elem.setKey(K_EXPOCAIRO);
        elem.setValue(m_expoCairo);
        elem.setWidth(1000);

        var elem = properties.add(null, Cairo.General.Constants.PR_ES_PLANTILLA);
        elem.setType(Dialogs.PropertyType.check);
        //'Es Plantilla
        elem.setName(Cairo.Language.getText(4829, ""));
        elem.setKey(K_ESPLANTILLA);
        elem.setValue(Cairo.Util.boolToInt(m_esplantilla));
        elem.setTopFromProperty(Cairo.General.Constants.PR_EXPO_CAIRO);
        elem.setLeft(8500);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.CUR_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSCURSO);
        //'Curso
        elem.setName(Cairo.Language.getText(4828, ""));
        elem.setKey(K_CUR_ID);
        elem.setValue(m_curso);
        elem.setSelectId(m_cur_id);
        elem.setWidth(4050);

        var elem = properties.add(null, Cairo.General.Constants.PR_DESCRIPCOMPRA);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setHeight(660);
        elem.setWidth(8000);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setSize(2000);
        elem.setKey(K_DESCRIPCOMPRA);
        elem.setValue(m_descripcompra);
        elem.setLeftFromProperty(Cairo.General.Constants.PR_CODE);
        elem.setTopToPrevious(440);

        //-------------------------------------------------------------------------

        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        elem.setWidth(10500);
        elem.setHeight(10);
        elem.setBackColor(&HCCCCCC);
        elem.setLeft(300);
        elem.setTopToPrevious(840);

        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        elem.setFontBold(true);
        //'Generación Automática de Nombres
        elem.setValue(Cairo.Language.getText(4854, ""));
        elem.setLeft(300);
        elem.setWidth(5000);
        elem.setTopToPrevious(140);
        elem.setHeight(285);

        var elem = properties.add(null, Cairo.General.Constants.RPT_ID_NOMBRE_COMPRA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSREPORTE);
        //'Proceso Nombre Compra
        elem.setName(Cairo.Language.getText(4848, ""));
        elem.setKey(K_RPT_ID_NOMBRECOMPRA);
        elem.setValue(m_rpt_nombrecompra);
        elem.setSelectId(m_rpt_id_nombrecompra);
        elem.setLeft(4000);
        elem.setWidth(6050);
        elem.setLeftLabel(-3000);
        elem.setTopToPrevious(300);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.RPT_ID_NOMBRE_VENTA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSREPORTE);
        //'Proceso Nombre Venta
        elem.setName(Cairo.Language.getText(4849, ""));
        elem.setKey(K_RPT_ID_NOMBREVENTA);
        elem.setValue(m_rpt_nombreventa);
        elem.setSelectId(m_rpt_id_nombreventa);
        elem.setWidth(6050);
        elem.setLeftLabel(-3000);
        elem.setTopToPrevious(380);
        elem.setLeft(4000);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.RPT_ID_NOMBRE_FACTURA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSREPORTE);
        //'Proceso Nombre Factura
        elem.setName(Cairo.Language.getText(4850, ""));
        elem.setKey(K_RPT_ID_NOMBREFACTURA);
        elem.setValue(m_rpt_nombrefactura);
        elem.setSelectId(m_rpt_id_nombrefactura);
        elem.setWidth(6050);
        elem.setLeftLabel(-3000);
        elem.setTopToPrevious(380);
        elem.setLeft(4000);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.RPT_ID_NOMBRE_WEB);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSREPORTE);
        //'Proceso Nombre Web
        elem.setName(Cairo.Language.getText(4851, ""));
        elem.setKey(K_RPT_ID_NOMBREWEB);
        elem.setValue(m_rpt_nombreweb);
        elem.setSelectId(m_rpt_id_nombreweb);
        elem.setWidth(6050);
        elem.setLeftLabel(-3000);
        elem.setTopToPrevious(380);
        elem.setLeft(4000);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.RPT_ID_NOMBRE_IMG);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSREPORTE);
        //'Proceso Nombre Imagen
        elem.setName(Cairo.Language.getText(4852, ""));
        elem.setKey(K_RPT_ID_NOMBREIMG);
        elem.setValue(m_rpt_nombreimg);
        elem.setSelectId(m_rpt_id_nombreimg);
        elem.setWidth(6050);
        elem.setLeftLabel(-3000);
        elem.setTopToPrevious(380);
        elem.setLeft(4000);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.RPT_ID_NOMBRE_IMG_ALT);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSREPORTE);
        //'Proceso Nombre Imagen Alternativa
        elem.setName(Cairo.Language.getText(4853, ""));
        elem.setKey(K_RPT_ID_NOMBREIMGALT);
        elem.setValue(m_rpt_nombreimgalt);
        elem.setSelectId(m_rpt_id_nombreimgalt);
        elem.setWidth(6050);
        elem.setLeftLabel(-3000);
        elem.setTopToPrevious(380);
        elem.setLeft(4000);
        elem.setLeftNotChange(true);
        //-------------------------------------------------------------------------

        var elem = properties.add(null, Cairo.General.Constants.PR_SECOMPRA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_compra);
        elem.setTopFromProperty(Cairo.General.Constants.PR_NOMBRECOMPRA);
        //'Se Compra
        elem.setName(Cairo.Language.getText(1309, ""));
        elem.setKey(K_SECOMPRA);
        elem.setValue(Cairo.Util.boolToInt(m_seCompra));

        var elem = properties.add(null, Cairo.General.Constants.PR_UN_ID_COMPRA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.UNIDAD);
        //'Unidad
        elem.setName(Cairo.Language.getText(1165, ""));
        elem.setTabIndex(tab_compra);
        elem.setKey(K_UN_ID_COMPRA);
        elem.setSelectId(m_un_id_compra);
        elem.setValue(m_unidadCompra);

        var elem = properties.add(null, Cairo.General.Constants.PR_CUEG_ID_COMPRA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTAGRUPO);
        elem.setTabIndex(tab_compra);
        //'Grupo de Cuenta
        elem.setName(Cairo.Language.getText(1516, ""));
        elem.setKey(K_CUEG_ID_COMPRA);
        elem.setSelectId(m_cueg_id_compra);
        elem.setValue(m_cuentaGCompra);
        elem.setSelectFilter("cueg_tipo = "+ Cairo.General.Constants.AccountGroupType.productForPurchase.toString());

        var elem = properties.add(null, Cairo.General.Constants.PR_TI_ID_RI_COMPRA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTopFromProperty(Cairo.General.Constants.PR_UN_ID_COMPRA);
        elem.setLeft(6000);
        elem.setSelectTable(Cairo.Tables.TASAIMPOSITIVA);
        //'IVA Resp. Ins.
        elem.setName(Cairo.Language.getText(1317, ""));
        elem.setTabIndex(tab_compra);
        elem.setKey(K_TI_ID_IVARICOMPRA);
        elem.setSelectId(m_ti_id_ivaricompra);
        elem.setValue(m_tiIvaRiCompra);
        elem.setSelectFilter(Cairo.General.Constants.filterForPurchase);

        //      With .Add(Nothing, cscPrTiIdRniCompra)
        //        .PropertyType = cspHelp
        //        .LeftFromProperty = cscPrTiIdRiCompra
        //        .Table = csTasaImpositiva
        //        .TabIndex = tab_compra
        //        .Name = Cairo.Language.getText(1318, vbNullString) 'IVA Resp. No Ins.
        //        .Key = K_TI_ID_IVARNICOMPRA
        //        .HelpId = m_Ti_id_ivarnicompra
        //        .Value = m_TiIvaRniCompra
        //        .HelpFilter = Cairo.General.Constants.filterForPurchase
        //      End With

        var elem = properties.add(null, Cairo.General.Constants.PR_TI_ID_INTERNOS_COMPRA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TASAIMPOSITIVA);
        elem.setLeftFromProperty(Cairo.General.Constants.PR_TI_ID_RI_COMPRA);
        elem.setTabIndex(tab_compra);
        //'Tasa Internos
        elem.setName(Cairo.Language.getText(1319, ""));
        elem.setKey(K_TI_ID_INTERNOSC);
        elem.setSelectId(m_ti_id_internosc);
        elem.setValue(m_tiInternosc);
        elem.setSelectFilter(Cairo.General.Constants.filterForPurchase);

        var elem = properties.add(null, Cairo.General.Constants.PR_PORCINTERNOC);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_compra);
        //'Porcentaje Internos
        elem.setName(Cairo.Language.getText(1320, ""));
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setKey(K_PORCINTERNOC);
        elem.setValue(m_porcinternoc);

        var elem = properties.add(null, Cairo.General.Constants.CCOS_ID_COMPRA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setTabIndex(tab_compra);
        //'Centro de Costo
        elem.setName(Cairo.Language.getText(1057, ""));
        elem.setKey(K_CCOS_ID_COMPRA);
        elem.setValue(m_centroCostoCompra);
        elem.setSelectId(m_ccos_id_compra);

        //////////////////////////////////////////////////////////////
        // Stock
        //
        var elem = properties.add(null, Cairo.General.Constants.PR_LLEVASTOCK);
        elem.setType(Dialogs.PropertyType.check);
        //'Se tiene en Stock
        elem.setName(Cairo.Language.getText(1321, ""));
        elem.setTabIndex(tab_stock);
        elem.setKey(K_LLEVASTOCK);
        elem.setValue(Cairo.Util.boolToInt(m_llevastock));

        var elem = properties.add(null, Cairo.General.Constants.PR_UN_ID_STOCK);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.UNIDAD);
        elem.setTabIndex(tab_stock);
        //'Unidad
        elem.setName(Cairo.Language.getText(1165, ""));
        elem.setKey(K_UN_ID_STOCK);
        elem.setSelectId(m_un_id_stock);
        elem.setValue(m_unidadStock);

        var elem = properties.add(null, Cairo.General.Constants.PR_STOCK_COMPRA);
        elem.setType(Dialogs.PropertyType.numeric);
        //'Relación Stock-Compra
        elem.setName(Cairo.Language.getText(1322, ""));
        elem.setTabIndex(tab_stock);
        elem.setKey(K_COMPRASTOCK);
        elem.setValue(m_comprastock);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat("0.000000");

        var elem = properties.add(null, Cairo.General.Constants.PR_X);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_stock);
        //'Posición x
        elem.setName(Cairo.Language.getText(1323, ""));
        elem.setKey(K_X);
        elem.setValue(m_x);
        elem.setSubType(Dialogs.PropertySubType.Integer);

        var elem = properties.add(null, Cairo.General.Constants.PR_Y);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_stock);
        //'Posición y
        elem.setName(Cairo.Language.getText(1324, ""));
        elem.setKey(K_Y);
        elem.setValue(m_y);
        elem.setSubType(Dialogs.PropertySubType.Integer);

        var elem = properties.add(null, Cairo.General.Constants.PR_Z);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_stock);
        //'Posición z
        elem.setName(Cairo.Language.getText(1325, ""));
        elem.setKey(K_Z);
        elem.setValue(m_z);
        elem.setSubType(Dialogs.PropertySubType.Integer);

        var elem = properties.add(null, Cairo.General.Constants.PR_STOCKMINIMO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_stock);
        //'Stock Mínimo
        elem.setName(Cairo.Language.getText(1326, ""));
        elem.setKey(K_STOCKMINIMO);
        elem.setValue(m_stockminimo);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setTopFromProperty(Cairo.General.Constants.PR_UN_ID_STOCK);
        elem.setLeft(5700);

        var elem = properties.add(null, Cairo.General.Constants.PR_REPOSICION);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_stock);
        //'Punto de Reposición
        elem.setName(Cairo.Language.getText(1328, ""));
        elem.setKey(K_REPOSICION);
        elem.setValue(m_reposicion);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());

        var elem = properties.add(null, Cairo.General.Constants.PR_STOCKMAXIMO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_stock);
        //'Stock Máximo
        elem.setName(Cairo.Language.getText(1327, ""));
        elem.setKey(K_STOCKMAXIMO);
        elem.setValue(m_stockmaximo);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());

        var elem = properties.add(null, Cairo.General.Constants.PR_LLEVA_NRO_SERIE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_stock);
        //'Lleva Nro Serie
        elem.setName(Cairo.Language.getText(1329, ""));
        elem.setKey(K_LLEVANROSERIE);
        elem.setValue(Cairo.Util.boolToInt(m_llevaNroSerie));
        elem.setTopFromProperty(Cairo.General.Constants.PR_UN_ID_STOCK);
        elem.setLeft(10000);

        var elem = properties.add(null, Cairo.General.Constants.PR_LLEVA_NRO_LOTE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_stock);
        //'Lleva Nro. Lote
        elem.setName(Cairo.Language.getText(1330, ""));
        elem.setKey(K_LLEVANROLOTE);
        elem.setValue(Cairo.Util.boolToInt(m_llevaNroLote));

        var elem = properties.add(null, Cairo.General.Constants.PR_LOTE_FIFO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_stock);
        //'Consume Lotes X FIFO
        elem.setName(Cairo.Language.getText(1331, ""));
        elem.setKey(K_LOTEFIFO);
        elem.setValue(Cairo.Util.boolToInt(m_loteFifo));

        var elem = properties.add(null, Cairo.General.Constants.PR_SE_PRODUCE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_stock);
        //'Se Produce
        elem.setName(Cairo.Language.getText(1332, ""));
        elem.setKey(K_SEPRODUCE);
        elem.setValue(Cairo.Util.boolToInt(m_seProduce));

        var elem = properties.add(null, Cairo.General.Constants.PR_ES_REPUESTO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_stock);
        //'Es un Repuesto
        elem.setName(Cairo.Language.getText(1333, ""));
        elem.setKey(K_ESREPUESTO);
        elem.setValue(Cairo.Util.boolToInt(m_esRepuesto));

        //////////////////////////////////////////////////////////////
        // Ventas
        //
        var elem = properties.add(null, Cairo.General.Constants.PR_SEVENDE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_venta);
        //'Se Vende
        elem.setName(Cairo.Language.getText(1334, ""));
        elem.setKey(K_SEVENDE);
        elem.setValue(Cairo.Util.boolToInt(m_seVende));

        var elem = properties.add(null, Cairo.General.Constants.PR_NOMBREVENTA);
        elem.setType(Dialogs.PropertyType.text);
        elem.setTabIndex(tab_venta);
        elem.setTopFromProperty(Cairo.General.Constants.PR_SEVENDE);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);
        elem.setLeft(2800);
        elem.setWidth(4950);
        elem.setLeftLabel(-700);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(255);
        elem.setKey(K_NOMBREVENTA);
        elem.setValue(m_nombreventa);

        var elem = properties.add(null, Cairo.General.Constants.PR_NOMBRE_FACTURA);
        elem.setType(Dialogs.PropertyType.text);
        elem.setTabIndex(tab_venta);
        elem.setWidth(4950);
        //'Nombre Factura
        elem.setName(Cairo.Language.getText(3521, ""));
        elem.setSize(255);
        elem.setKey(K_NOMBREFACTURA);
        elem.setValue(m_nombreFactura);

        var elem = properties.add(null, Cairo.General.Constants.PR_UN_ID_VENTA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.UNIDAD);
        elem.setTabIndex(tab_venta);
        //'Unidad
        elem.setName(Cairo.Language.getText(1165, ""));
        elem.setKey(K_UN_ID_VENTA);
        elem.setSelectId(m_un_id_venta);
        elem.setValue(m_unidadVenta);

        var elem = properties.add(null, Cairo.General.Constants.PR_VENTA_COMPRA);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_venta);
        //'Relación Venta-Compra
        elem.setName(Cairo.Language.getText(1335, ""));
        elem.setKey(K_COMPRAVENTA);
        elem.setValue(m_compraventa);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat("0.000000");

        var elem = properties.add(null, Cairo.General.Constants.PR_VENTA_STOCK);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setTabIndex(tab_venta);
        //'Relación Venta-Stock
        elem.setName(Cairo.Language.getText(1336, ""));
        elem.setKey(K_VENTASTOCK);
        elem.setValue(m_ventastock);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat("0.000000");

        var elem = properties.add(null, Cairo.General.Constants.PR_CUEG_ID_VENTA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTAGRUPO);
        //'Grupo de Cuenta
        elem.setName(Cairo.Language.getText(1516, ""));
        elem.setKey(K_CUEG_ID_VENTA);
        elem.setTopFromProperty(Cairo.General.Constants.PR_UN_ID_VENTA);
        elem.setLeft(5500);
        elem.setTabIndex(tab_venta);
        elem.setSelectId(m_cueg_id_venta);
        elem.setValue(m_cuentaGVenta);
        elem.setSelectFilter("cueg_tipo = "+ Cairo.General.Constants.AccountGroupType.productForSale.toString());

        var elem = properties.add(null, Cairo.General.Constants.PR_ES_LISTA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_venta);
        //'Es una Lista
        elem.setName(Cairo.Language.getText(1337, ""));
        elem.setKey(K_ESLISTA);
        elem.setValue(Cairo.Util.boolToInt(m_eslista));

        var elem = properties.add(null, Cairo.General.Constants.PR_DINERARIO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_venta);
        //'Concepto Dinerario
        elem.setName(Cairo.Language.getText(2552, ""));
        elem.setKey(K_DINERARIO);
        elem.setValue(Cairo.Util.boolToInt(m_dinerario));

        var elem = properties.add(null, Cairo.General.Constants.PR_NO_REDONDEO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_venta);
        //'No Redondear
        elem.setName(Cairo.Language.getText(3651, ""));
        elem.setKey(K_NO_REDONDEO);
        elem.setValue(Cairo.Util.boolToInt(m_noRedondeo));
        elem.setTopNotChange(true);
        elem.setLeftNotChange(true);
        elem.setTopFromProperty(Cairo.General.Constants.PR_DINERARIO);
        elem.setLeftFromProperty(Cairo.General.Constants.PR_DINERARIO);
        elem.setLeftToPrevious(2000);

        var elem = properties.add(null, Cairo.General.Constants.PR_TI_ID_RI_VENTA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTopFromProperty(Cairo.General.Constants.PR_NOMBREVENTA);
        elem.setLeftFromProperty(Cairo.General.Constants.PR_CUEG_ID_VENTA);
        elem.setLeftToPrevious(3900);
        elem.setSelectTable(Cairo.Tables.TASAIMPOSITIVA);
        //'IVA Resp. Ins.
        elem.setName(Cairo.Language.getText(1317, ""));
        elem.setTabIndex(tab_venta);
        elem.setKey(K_TI_ID_IVARIVENTA);
        elem.setSelectId(m_ti_id_ivariventa);
        elem.setValue(m_tiIvaRiVenta);
        elem.setSelectFilter(Cairo.General.Constants.filterForSales);

        //      With .Add(Nothing, cscPrTiIdRniVenta)
        //        .PropertyType = cspHelp
        //        .LeftFromProperty = cscPrTiIdRiVenta
        //        .Table = csTasaImpositiva
        //        .Name = Cairo.Language.getText(1318, vbNullString) 'IVA Resp. No Ins.
        //        .TabIndex = tab_venta
        //        .Key = K_TI_ID_IVARNIVENTA
        //        .HelpId = m_Ti_id_ivarniventa
        //        .Value = m_TiIvaRniVenta
        //        .HelpFilter = Cairo.General.Constants.filterForSales
        //      End With

        var elem = properties.add(null, Cairo.General.Constants.PR_TI_ID_INTERNOS_VENTA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TASAIMPOSITIVA);
        elem.setLeftFromProperty(Cairo.General.Constants.PR_TI_ID_RI_VENTA);
        //'Tasa Internos
        elem.setName(Cairo.Language.getText(1319, ""));
        elem.setKey(K_TI_ID_INTERNOSV);
        elem.setTabIndex(tab_venta);
        elem.setSelectId(m_ti_id_internosv);
        elem.setValue(m_tiInternosv);
        elem.setSelectFilter(Cairo.General.Constants.filterForSales);

        var elem = properties.add(null, Cairo.General.Constants.PR_PORCINTERNOV);
        elem.setType(Dialogs.PropertyType.numeric);
        //'Porcentaje Internos
        elem.setName(Cairo.Language.getText(1320, ""));
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setKey(K_PORCINTERNOV);
        elem.setTabIndex(tab_venta);
        elem.setValue(m_porcinternov);

        var elem = properties.add(null, Cairo.General.Constants.CCOS_ID_VENTA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setTabIndex(tab_venta);
        //'Centro de Costo
        elem.setName(Cairo.Language.getText(1057, ""));
        elem.setKey(K_CCOS_ID_VENTA);
        elem.setValue(m_centroCostoVenta);
        elem.setSelectId(m_ccos_id_venta);

        var elem = properties.add(null, Cairo.General.Constants.PR_DESCRIPVENTA);
        elem.setType(Dialogs.PropertyType.text);
        elem.setTabIndex(tab_venta);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setLeftFromProperty(Cairo.General.Constants.PR_SEVENDE);
        elem.setTopFromProperty(Cairo.General.Constants.PR_VENTA_STOCK);
        elem.setTopToPrevious(440);
        elem.setHeight(880);
        elem.setWidth(10000);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setSize(2000);
        elem.setKey(K_DESCRIPVENTA);
        elem.setValue(m_descripventa);

        var elem = properties.add(null, Cairo.General.Constants.RUB_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RUBRO);
        elem.setTabIndex(tab_rubro);
        //'Rubro
        elem.setName(Cairo.Language.getText(1299, ""));
        elem.setKey(K_RUB_ID);
        elem.setValue(m_rubro);
        elem.setSelectId(m_rub_id);

        pSetRubro(m_rub_id, false);

        //////////////////////////////////////////////////////////////
        // COMEX
        //
        var elem = properties.add(null, Cairo.General.Constants.UN_ID_PESO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.UNIDAD);
        //'Unidad
        elem.setName(Cairo.Language.getText(1165, ""));
        elem.setKey(K_UN_ID_PESO);
        elem.setValue(m_unidadPeso);
        elem.setSelectId(m_un_id_peso);
        elem.setTabIndex(tab_comex);

        var elem = properties.add(null, Cairo.General.Constants.PR_PESO_NETO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        //'Peso Neto
        elem.setName(Cairo.Language.getText(1311, ""));
        elem.setKey(K_PESO_NETO);
        elem.setValue(m_pesoNeto);
        elem.setTabIndex(tab_comex);
        elem.setWidth(1000);

        var elem = properties.add(null, Cairo.General.Constants.PR_PESO_TOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        //'Peso Total
        elem.setName(Cairo.Language.getText(1312, ""));
        elem.setKey(K_PESO_TOTAL);
        elem.setValue(m_pesoTotal);
        elem.setTabIndex(tab_comex);
        elem.setWidth(1000);

        var elem = properties.add(null, Cairo.General.Constants.PR_CANT_XCAJA_EXPO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        //'Cantidad x Caja
        elem.setName(Cairo.Language.getText(1316, ""));
        elem.setKey(K_CANTIDAD_X_CAJA_EXPO);
        elem.setValue(m_cantXCajaExpo);
        elem.setTabIndex(tab_comex);
        elem.setWidth(1000);

        var elem = properties.add(null, Cairo.General.Constants.EMBL_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.EMBALAJE);
        //'Embalaje
        elem.setName(Cairo.Language.getText(1163, ""));
        elem.setKey(K_EMBL_ID);
        elem.setValue(m_embalaje);
        elem.setSelectId(m_embl_id);
        elem.setTabIndex(tab_comex);

        var elem = properties.add(null, Cairo.General.Constants.PR_FLETE_EXPO);
        elem.setType(Dialogs.PropertyType.check);
        //'Flete Expo
        elem.setName(Cairo.Language.getText(1315, ""));
        elem.setKey(K_FLETEEXPO);
        elem.setValue(Cairo.Util.boolToInt(m_fleteExpo));
        elem.setTabIndex(tab_comex);

        var elem = properties.add(null, Cairo.General.Constants.EGP_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSEXPOGRUPOPRECIO);
        //'Grupo Exportación
        elem.setName(Cairo.Language.getText(1313, ""));
        elem.setKey(K_EGP_ID);
        elem.setValue(m_grupoExpo);
        elem.setSelectId(m_egp_id);
        elem.setTabIndex(tab_comex);
        elem.setLeft(7000);
        elem.setLeftLabel(-2500);
        elem.setTopFromProperty(Cairo.General.Constants.UN_ID_PESO);
        elem.setWidth(3500);

        var elem = properties.add(null, Cairo.General.Constants.EFM_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSEXPOFAMILIA);
        //'Familia de Exportación
        elem.setName(Cairo.Language.getText(1314, ""));
        elem.setKey(K_EFM_ID);
        elem.setValue(m_familiaExpo);
        elem.setSelectId(m_efm_id);
        elem.setTabIndex(tab_comex);
        elem.setLeftLabel(-2500);
        elem.setWidth(3500);

        var elem = properties.add(null, Cairo.General.Constants.POAR_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.POSICIONARANCEL);
        //' Posición Arancelaria
        elem.setName(Cairo.Language.getText(3275, ""));
        elem.setSelectId(m_poar_id);
        elem.setValue(m_posicionArancel);
        elem.setKey(K_POAR_ID);
        elem.setTabIndex(tab_comex);
        elem.setLeftLabel(-2500);
        elem.setWidth(3500);

        var elem = properties.add(null, Cairo.General.Constants.TI_ID_COMEX_GANANCIAS);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TASAIMPOSITIVA);
        //' Tasa Ganacias 3543/92
        elem.setName(Cairo.Language.getText(4974, ""));
        elem.setSelectId(m_ti_id_comex_ganancias);
        elem.setValue(m_ti_comex_ganancias);
        elem.setKey(K_TI_COMEX_GANANCIAS);
        elem.setTabIndex(tab_comex);
        elem.setSelectFilter(Cairo.General.Constants.filterForPurchase);
        elem.setLeftLabel(-2500);
        elem.setWidth(3500);

        var elem = properties.add(null, Cairo.General.Constants.TI_ID_COMEX_IGB);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TASAIMPOSITIVA);
        //' Ingresos Brutos Importaciones
        elem.setName(Cairo.Language.getText(4975, ""));
        elem.setSelectId(m_ti_id_comex_igb);
        elem.setValue(m_ti_comex_igb);
        elem.setKey(K_TI_COMEX_IGB);
        elem.setTabIndex(tab_comex);
        elem.setSelectFilter(Cairo.General.Constants.filterForPurchase);
        elem.setLeftLabel(-2500);
        elem.setWidth(3500);

        var elem = properties.add(null, Cairo.General.Constants.TI_ID_COMEX_IVA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TASAIMPOSITIVA);
        //' Tasa IVA 3431/91
        elem.setName(Cairo.Language.getText(4976, ""));
        elem.setSelectId(m_ti_id_comex_iva);
        elem.setValue(m_ti_comex_iva);
        elem.setKey(K_TI_COMEX_IVA);
        elem.setTabIndex(tab_comex);
        elem.setSelectFilter(Cairo.General.Constants.filterForPurchase);
        elem.setLeftLabel(-2500);
        elem.setWidth(3500);

        //////////////////////////////////////////////////////////////
        // Kit
        //
        var elem = properties.add(null, Cairo.General.Constants.PR_ESKIT);
        elem.setType(Dialogs.PropertyType.check);
        elem.setLeft(1800);
        elem.setLeftLabel(-1500);
        elem.setTabIndex(tab_kit);
        //'Es un Kit
        elem.setName(Cairo.Language.getText(1338, ""));
        elem.setKey(K_ESKIT);
        elem.setValue(Cairo.Util.boolToInt(m_eskit));

        var elem = properties.add(null, Cairo.General.Constants.PR_KIT_STOCK_XITEM);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_kit);
        //'Kit Stock x Item
        elem.setName(Cairo.Language.getText(1339, ""));
        elem.setKey(K_KIT_STK_X_ITEM);
        elem.setValue(Cairo.Util.boolToInt(m_kitStkXItem));
        elem.setTopFromProperty(Cairo.General.Constants.PR_ESKIT);
        elem.setTopNotChange(true);
        elem.setLeft(3500);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.PR_KIT_RESUMIDO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_kit);
        //'Producción Resumida
        elem.setName(Cairo.Language.getText(1340, ""));
        elem.setKey(K_KIT_RESUMIDO);
        elem.setValue(Cairo.Util.boolToInt(m_kitResumido));
        elem.setTopToPrevious(100);

        var elem = properties.add(null, Cairo.General.Constants.PR_KIT_IDENTIDAD);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_kit);
        //'Posee Identidad
        elem.setName(Cairo.Language.getText(1341, ""));
        elem.setKey(K_KIT_IDENTIDAD);
        elem.setValue(Cairo.Util.boolToInt(m_kitIdentidad));
        elem.setEnabled(Cairo.Util.boolToInt(m_kitResumido));

        var elem = properties.add(null, Cairo.General.Constants.PR_KIT_IDENTIDAD_XITEM);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_kit);
        //'Identidad por Item
        elem.setName(Cairo.Language.getText(1342, ""));
        elem.setLeftLabel(-1400);
        elem.setKey(K_KIT_IDENTIDADXITEM);
        elem.setValue(Cairo.Util.boolToInt(m_kitIdentidadXItem));
        elem.setEnabled(Cairo.Util.boolToInt(m_kitIdentidad));

        elem.setTopFromProperty(Cairo.General.Constants.PR_KIT_IDENTIDAD);
        elem.setTopNotChange(true);
        elem.setLeft(4000);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.TA_ID_KIT_SERIE);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csTalonario);
        elem.setTabIndex(tab_kit);
        //'Talonario Serie
        elem.setName(Cairo.Language.getText(1343, ""));
        elem.setKey(K_TA_ID_KITSERIE);
        elem.setValue(m_talonarioKitSerie);
        elem.setSelectId(m_ta_id_kitSerie);
        elem.setEnabled(m_kitIdentidad && !m_kitIdentidadXItem);
        elem.setWidth(3000);

        var elem = properties.add(null, Cairo.General.Constants.PR_KIT_LOTE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_kit);
        //'Posee Lote
        elem.setName(Cairo.Language.getText(1344, ""));
        elem.setKey(K_KIT_LOTE);
        elem.setValue(Cairo.Util.boolToInt(m_kitLote));
        elem.setEnabled(Cairo.Util.boolToInt(m_kitResumido));

        var elem = properties.add(null, Cairo.General.Constants.PR_KIT_LOTE_XITEM);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTabIndex(tab_kit);
        //'Lote por Item
        elem.setName(Cairo.Language.getText(1345, ""));
        elem.setKey(K_KIT_LOTEXITEM);
        elem.setValue(Cairo.Util.boolToInt(m_kitLoteXItem));
        elem.setEnabled(Cairo.Util.boolToInt(m_kitLote));

        elem.setTopFromProperty(Cairo.General.Constants.PR_KIT_LOTE);
        elem.setTopNotChange(true);
        elem.setLeft(4000);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.TA_ID_KIT_LOTE);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csTalonario);
        elem.setTabIndex(tab_kit);
        //'Talonario Lote
        elem.setName(Cairo.Language.getText(1346, ""));
        elem.setKey(K_TA_ID_KITLOTE);
        elem.setValue(m_talonarioKitLote);
        elem.setSelectId(m_ta_id_kitLote);
        elem.setEnabled(m_kitLote && !m_kitLoteXItem);
        elem.setWidth(3000);

        var elem = properties.add(null);
        elem.setTopFromProperty(Cairo.General.Constants.PR_ESKIT);
        elem.setLeft(5000);
        elem.setLeftLabel(-1);
        elem.setWidth(3000);
        elem.setType(Dialogs.PropertyType.label);
        //'Fórmulas de Producción
        elem.setValue(Cairo.Language.getText(1347, ""));
        elem.setTabIndex(tab_kit);

        c = properties.add(null, C_PRODUCTOKIT);
        c.setTop(1500);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        if(!pLoadKit(c)) { return false; }
        c.setName(C_PRODUCTOKIT);
        c.setKey(K_PRODUCTO_KIT);
        c.setTabIndex(tab_kit);
        c.setHeight(1000);
        c.setWidth(5000);
        c.setGridAddEnabled(false);
        c.setGridEditEnabled(false);
        c.setGridRemoveEnabled(false);

        o = c.getGrid();
        o.setDontResize(true);

        //////////////////////////////////////////////////////////////
        // Proveedores
        //
        c = properties.add(null, C_PROVEEDOR);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        if(!pLoadProveedor(c)) { return false; }
        c.setName(C_PROVEEDOR);
        c.setKey(K_PROVEEDOR);
        c.setTabIndex(tab_proveedor);

        c.setTop(1000);
        c.setLeft(200);
        c.setHeight(1950);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        o = c.getGrid();

        m_itemsDeletedProveedor = "";

        //////////////////////////////////////////////////////////////
        // Clientes
        //
        c = properties.add(null, C_CLIENTE);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        if(!pLoadCliente(c)) { return false; }
        c.setName(C_CLIENTE);
        c.setKey(K_CLIENTE);
        c.setTop(3000);
        c.setLeft(200);
        c.setHeight(950);
        c.setTabIndex(tab_proveedor);

        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        o = c.getGrid();

        m_itemsDeletedCliente = "";

        //////////////////////////////////////////////////////////////
        // BOMs
        //
        c = properties.add(null, C_BOM);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        if(!pLoadBOM(c)) { return false; }
        c.setName(C_BOM);
        c.setKey(K_BOM);

        c.setTop(4000);
        c.setLeft(200);
        c.setHeight(950);
        c.setTabIndex(tab_proveedor);

        c.setGridAddEnabled(false);
        c.setGridEditEnabled(false);
        c.setGridRemoveEnabled(false);

        o = c.getGrid();

        //////////////////////////////////////////////////////////////
        // Comunidad de Internet
        //
        c = properties.add(null, C_CMI);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        if(!pLoadCMI(c)) { return false; }
        c.setName(C_CMI);
        c.setKey(K_CMI);
        c.setTop(5000);
        c.setLeft(200);
        c.setHeight(1050);
        c.setTabIndex(tab_proveedor);

        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        o = c.getGrid();

        m_itemsDeletedCMI = "";

        c = properties.add(null, C_LEYENDAS);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        if(!pLoadLeyendas(c)) { return false; }
        c.setName(C_LEYENDAS);
        c.setKey(K_LEYENDAS);
        c.setTop(6100);
        c.setLeft(200);
        c.setHeight(1050);
        c.setTabIndex(tab_proveedor);

        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        o = c.getGrid();

        m_itemsDeletedLeyendas = "";

        //////////////////////////////////////////////////////////////
        // Web
        //
        var elem = properties.add(null, Cairo.General.Constants.PR_NOMBRE_WEB);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(4950);
        elem.setLeftFromProperty(Cairo.General.Constants.PR_NOMBRECOMPRA);
        //' Nombre Web
        elem.setName(Cairo.Language.getText(3522, ""));
        elem.setSize(255);
        elem.setKey(K_NOMBREWEB);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_nombreWeb);

        var elem = properties.add(null, Cairo.General.Constants.PR_ALIAS_WEB);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1550);
        //' Alias Web
        elem.setName(Cairo.Language.getText(3539, ""));
        elem.setSize(255);
        elem.setKey(K_ALIASWEB);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_aliasWeb);

        var elem = properties.add(null, Cairo.General.Constants.PR_ID_WEB_PADRE);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTO);
        //' Producto Padre Web
        elem.setName(Cairo.Language.getText(5047, ""));
        elem.setKey(K_PR_ID_WEB_PADRE);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_productowebpadre);
        elem.setSelectId(m_pr_id_webpadre);
        elem.setLeft(4600);
        elem.setWidth(1900);
        elem.setTopFromProperty(Cairo.General.Constants.PR_ALIAS_WEB);
        elem.setLeftNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.PR_ACTIVO_WEB);
        elem.setType(Dialogs.PropertyType.check);
        //' Activo Web
        elem.setName(Cairo.Language.getText(3557, ""));
        elem.setKey(K_ACTIVOWEB);
        elem.setTabIndex(tab_Web);
        elem.setValue(Cairo.Util.boolToInt(m_activoWeb));
        elem.setTopFromProperty(Cairo.General.Constants.PR_NOMBRE_WEB);
        elem.setLeft(7800);
        elem.setLeftLabel(-1100);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.PR_WEB_IMAGE_UPDATE);
        elem.setType(Dialogs.PropertyType.check);
        //' Actualizar Imagenes
        elem.setName(Cairo.Language.getText(4576, ""));
        elem.setKey(K_WEB_IMAGE_UPDATE);
        elem.setTabIndex(tab_Web);
        elem.setValue(Cairo.Util.boolToInt(m_webImageUpdate));
        elem.setTopFromProperty(Cairo.General.Constants.PR_NOMBRE_WEB);
        elem.setLeft(10500);
        elem.setLeftLabel(-1700);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.PR_CODIGO_HTML);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(4950);
        //' Codigo Html Detalle
        elem.setName(Cairo.Language.getText(3538, ""));
        elem.setSize(255);
        elem.setKey(K_CODIGOHTML);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_codigoHtml);

        var elem = properties.add(null, Cairo.General.Constants.PR_CODIGO_HTML_DETALLE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(4950);
        //' Codigo Html Detalle
        elem.setName(Cairo.Language.getText(3900, ""));
        elem.setSize(255);
        elem.setKey(K_CODIGOHTMLDETALLE);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_codigoHtmlDetalle);

        var elem = properties.add(null, Cairo.General.Constants.PR_EXPO_WEB);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        //' Expo Web
        elem.setName(Cairo.Language.getText(3897, ""));
        elem.setKey(K_EXPOWEB);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_expoWeb);
        elem.setTopFromProperty(Cairo.General.Constants.PR_ALIAS_WEB);
        elem.setLeft(8000);
        elem.setWidth(1000);

        var elem = properties.add(null, Cairo.General.Constants.PR_VENTA_WEB_MAXIMA);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        //' Venta Máxima
        elem.setName(Cairo.Language.getText(3899, ""));
        elem.setKey(K_VENTA_WEB_MAXIMA);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_ventaWebMaxima);
        elem.setTopFromProperty(Cairo.General.Constants.PR_ALIAS_WEB);
        elem.setLeft(10500);
        elem.setWidth(1000);

        var elem = properties.add(null, Cairo.General.Constants.LEY_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LEYENDA);
        //' Leyenda
        elem.setName(Cairo.Language.getText(1240, ""));
        elem.setKey(K_LEY_ID);
        elem.setTabIndex(tab_Web);
        elem.setSelectId(m_ley_id);
        elem.setValue(m_leyenda);
        elem.setTopFromProperty(Cairo.General.Constants.PR_CODIGO_HTML);
        elem.setLeft(8000);
        elem.setWidth(3500);

        var elem = properties.add(null, Cairo.General.Constants.PR_WEB_IMAGE_FOLDER);
        elem.setType(Dialogs.PropertyType.folder);
        //' Carpeta de Imagenes
        elem.setName(Cairo.Language.getText(3587, ""));
        elem.setKey(K_WEB_IMAGE_FOLDER);
        elem.setTabIndex(tab_Web);
        elem.setValue(m_webImageFolder);
        elem.setLeft(8000);
        elem.setWidth(3500);

        c = properties.add(null, C_WEB_IMAGES);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        if(!pLoadWebImages(c)) { return false; }
        c.setName(C_WEB_IMAGES);
        c.setKey(K_WEB_IMAGES);
        c.setTabIndex(tab_Web);
        c.setTop(2900);
        c.setLeft(200);
        c.setHeight(1950);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        o = c.getGrid();

        m_itemsDeletedWebImages = "";

        c = properties.add(null, C_TAGS);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        if(!pLoadTags(c)) { return false; }
        c.setName(C_TAGS);
        c.setKey(K_TAGS);
        c.setTabIndex(tab_Web);
        c.setTop(5300);
        c.setLeft(200);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_itemsDeletedTag = "";

        //---------------------------------------------
        c = properties.add(null, C_WEB_CATALOGS);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        if(!pLoadCatalogosWeb(c)) { return false; }
        c.setName(C_WEB_CATALOGS);
        c.setKey(K_WEB_CATALOGOS);
        c.setTabIndex(tab_web2);
        c.setTop(1000);
        c.setLeft(200);
        c.setHeight(1950);
        c.setGridAddEnabled(false);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(false);

        o = c.getGrid();

        c = properties.add(null, C_WEB_CATEGORIES);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        if(!pLoadCategoriasWeb(c)) { return false; }
        c.setName(C_WEB_CATEGORIES);
        c.setKey(K_WEB_CATEGORIAS);
        c.setTabIndex(tab_web2);
        c.setTop(3000);
        c.setLeft(200);
        c.setGridAddEnabled(false);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(false);

        setEnabledCompra(m_seCompra);
        setEnabledStock(m_llevastock);
        setEnabledVenta(m_seVende);
        setEnabledPlantilla();

        if(!m_genericEdit.LoadCollection(m_dialog)) { return false; }

        // Uso ShowEx por que SetEnabledCompra fuerza
        // un show interno en abminterface que se encarga
        // de cargar los controles y para este momento
        // todas las propiedades ya tienen su ControlLoaded = True
        // y por tanto LoadControl no se ejecuta y todo queda OK
        //
        if(!abmObj.showEx(self, tab_general, true)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(Cairo.General.Constants.PR_NOMBRECOMPRA);
        elem.setValue(m_nombrecompra);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.item(Cairo.General.Constants.PR_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.General.Constants.PR_CODIGOEXTERNO);
        elem.setValue(m_codigoexterno);

        var elem = properties.item(Cairo.General.Constants.PR_CODIGO_BARRA);
        elem.setValue(m_codigoBarra);

        var elem = properties.item(Cairo.General.Constants.PR_CODIGO_BARRA_NAME);
        elem.setValue(m_codigoBarraNombre);

        var elem = properties.item(Cairo.General.Constants.IBC_ID);
        elem.setSelectId(m_ibc_id);
        elem.setValue(m_ingresosbrutos);

        var elem = properties.item(Cairo.General.Constants.MARC_ID);
        elem.setValue(m_marca);
        elem.setSelectId(m_marc_id);

        var elem = properties.item(Cairo.General.Constants.PR_EXPO_CAIRO);
        elem.setValue(m_expoCairo);

        var elem = properties.item(Cairo.General.Constants.PR_ES_PLANTILLA);
        elem.setValue(Cairo.Util.boolToInt(m_esplantilla));

        var elem = properties.item(Cairo.General.Constants.CUR_ID);
        elem.setValue(m_curso);
        elem.setSelectId(m_cur_id);

        var elem = properties.item(Cairo.General.Constants.PR_DESCRIPCOMPRA);
        elem.setValue(m_descripcompra);

        var elem = properties.add(null);

        var elem = properties.add(null);

        var elem = properties.item(Cairo.General.Constants.RPT_ID_NOMBRE_COMPRA);
        elem.setValue(m_rpt_nombrecompra);
        elem.setSelectId(m_rpt_id_nombrecompra);

        var elem = properties.item(Cairo.General.Constants.RPT_ID_NOMBRE_VENTA);
        elem.setValue(m_rpt_nombreventa);
        elem.setSelectId(m_rpt_id_nombreventa);

        var elem = properties.item(Cairo.General.Constants.RPT_ID_NOMBRE_FACTURA);
        elem.setValue(m_rpt_nombrefactura);
        elem.setSelectId(m_rpt_id_nombrefactura);

        var elem = properties.item(Cairo.General.Constants.RPT_ID_NOMBRE_WEB);
        elem.setValue(m_rpt_nombreweb);
        elem.setSelectId(m_rpt_id_nombreweb);

        var elem = properties.item(Cairo.General.Constants.RPT_ID_NOMBRE_IMG);
        elem.setValue(m_rpt_nombreimg);
        elem.setSelectId(m_rpt_id_nombreimg);

        var elem = properties.item(Cairo.General.Constants.RPT_ID_NOMBRE_IMG_ALT);
        elem.setValue(m_rpt_nombreimgalt);
        elem.setSelectId(m_rpt_id_nombreimgalt);

        var elem = properties.item(Cairo.General.Constants.PR_SECOMPRA);
        elem.setValue(Cairo.Util.boolToInt(m_seCompra));

        var elem = properties.item(Cairo.General.Constants.PR_UN_ID_COMPRA);
        elem.setSelectId(m_un_id_compra);
        elem.setValue(m_unidadCompra);

        var elem = properties.item(Cairo.General.Constants.PR_CUEG_ID_COMPRA);
        elem.setSelectId(m_cueg_id_compra);
        elem.setValue(m_cuentaGCompra);

        var elem = properties.item(Cairo.General.Constants.PR_TI_ID_RI_COMPRA);
        elem.setSelectId(m_ti_id_ivaricompra);
        elem.setValue(m_tiIvaRiCompra);

        var elem = properties.item(Cairo.General.Constants.PR_TI_ID_INTERNOS_COMPRA);
        elem.setSelectId(m_ti_id_internosc);
        elem.setValue(m_tiInternosc);

        var elem = properties.item(Cairo.General.Constants.PR_PORCINTERNOC);
        elem.setValue(m_porcinternoc);

        var elem = properties.item(Cairo.General.Constants.CCOS_ID_COMPRA);
        elem.setValue(m_centroCostoCompra);
        elem.setSelectId(m_ccos_id_compra);

        var elem = properties.item(Cairo.General.Constants.PR_LLEVASTOCK);
        elem.setValue(Cairo.Util.boolToInt(m_llevastock));

        var elem = properties.item(Cairo.General.Constants.PR_UN_ID_STOCK);
        elem.setSelectId(m_un_id_stock);
        elem.setValue(m_unidadStock);

        var elem = properties.item(Cairo.General.Constants.PR_STOCK_COMPRA);
        elem.setValue(m_comprastock);

        var elem = properties.item(Cairo.General.Constants.PR_X);
        elem.setValue(m_x);

        var elem = properties.item(Cairo.General.Constants.PR_Y);
        elem.setValue(m_y);

        var elem = properties.item(Cairo.General.Constants.PR_Z);
        elem.setValue(m_z);

        var elem = properties.item(Cairo.General.Constants.PR_STOCKMINIMO);
        elem.setValue(m_stockminimo);

        var elem = properties.item(Cairo.General.Constants.PR_REPOSICION);
        elem.setValue(m_reposicion);

        var elem = properties.item(Cairo.General.Constants.PR_STOCKMAXIMO);
        elem.setValue(m_stockmaximo);

        var elem = properties.item(Cairo.General.Constants.PR_LLEVA_NRO_SERIE);
        elem.setValue(Cairo.Util.boolToInt(m_llevaNroSerie));

        var elem = properties.item(Cairo.General.Constants.PR_LLEVA_NRO_LOTE);
        elem.setValue(Cairo.Util.boolToInt(m_llevaNroLote));

        var elem = properties.item(Cairo.General.Constants.PR_LOTE_FIFO);
        elem.setValue(Cairo.Util.boolToInt(m_loteFifo));

        var elem = properties.item(Cairo.General.Constants.PR_SE_PRODUCE);
        elem.setValue(Cairo.Util.boolToInt(m_seProduce));

        var elem = properties.item(Cairo.General.Constants.PR_ES_REPUESTO);
        elem.setValue(Cairo.Util.boolToInt(m_esRepuesto));

        var elem = properties.item(Cairo.General.Constants.PR_SEVENDE);
        elem.setValue(Cairo.Util.boolToInt(m_seVende));

        var elem = properties.item(Cairo.General.Constants.PR_NOMBREVENTA);
        elem.setValue(m_nombreventa);

        var elem = properties.item(Cairo.General.Constants.PR_NOMBRE_FACTURA);
        elem.setValue(m_nombreFactura);

        var elem = properties.item(Cairo.General.Constants.PR_UN_ID_VENTA);
        elem.setSelectId(m_un_id_venta);
        elem.setValue(m_unidadVenta);

        var elem = properties.item(Cairo.General.Constants.PR_VENTA_COMPRA);
        elem.setValue(m_compraventa);

        var elem = properties.item(Cairo.General.Constants.PR_VENTA_STOCK);
        elem.setValue(m_ventastock);

        var elem = properties.item(Cairo.General.Constants.PR_CUEG_ID_VENTA);
        elem.setSelectId(m_cueg_id_venta);
        elem.setValue(m_cuentaGVenta);

        var elem = properties.item(Cairo.General.Constants.PR_ES_LISTA);
        elem.setValue(Cairo.Util.boolToInt(m_eslista));

        var elem = properties.item(Cairo.General.Constants.PR_DINERARIO);
        elem.setValue(Cairo.Util.boolToInt(m_dinerario));

        var elem = properties.item(Cairo.General.Constants.PR_NO_REDONDEO);
        elem.setValue(Cairo.Util.boolToInt(m_noRedondeo));

        var elem = properties.item(Cairo.General.Constants.PR_TI_ID_RI_VENTA);
        elem.setSelectId(m_ti_id_ivariventa);
        elem.setValue(m_tiIvaRiVenta);

        var elem = properties.item(Cairo.General.Constants.PR_TI_ID_INTERNOS_VENTA);
        elem.setSelectId(m_ti_id_internosv);
        elem.setValue(m_tiInternosv);

        var elem = properties.item(Cairo.General.Constants.PR_PORCINTERNOV);
        elem.setValue(m_porcinternov);

        var elem = properties.item(Cairo.General.Constants.CCOS_ID_VENTA);
        elem.setValue(m_centroCostoVenta);
        elem.setSelectId(m_ccos_id_venta);

        var elem = properties.item(Cairo.General.Constants.PR_DESCRIPVENTA);
        elem.setValue(m_descripventa);

        var elem = properties.item(Cairo.General.Constants.RUB_ID);
        elem.setValue(m_rubro);
        elem.setSelectId(m_rub_id);

        var elem = properties.item(Cairo.General.Constants.UN_ID_PESO);
        elem.setValue(m_unidadPeso);
        elem.setSelectId(m_un_id_peso);

        var elem = properties.item(Cairo.General.Constants.PR_PESO_NETO);
        elem.setValue(m_pesoNeto);

        var elem = properties.item(Cairo.General.Constants.PR_PESO_TOTAL);
        elem.setValue(m_pesoTotal);

        var elem = properties.item(Cairo.General.Constants.PR_CANT_XCAJA_EXPO);
        elem.setValue(m_cantXCajaExpo);

        var elem = properties.item(Cairo.General.Constants.EMBL_ID);
        elem.setValue(m_embalaje);
        elem.setSelectId(m_embl_id);

        var elem = properties.item(Cairo.General.Constants.PR_FLETE_EXPO);
        elem.setValue(Cairo.Util.boolToInt(m_fleteExpo));

        var elem = properties.item(Cairo.General.Constants.EGP_ID);
        elem.setValue(m_grupoExpo);
        elem.setSelectId(m_egp_id);

        var elem = properties.item(Cairo.General.Constants.EFM_ID);
        elem.setValue(m_familiaExpo);
        elem.setSelectId(m_efm_id);

        var elem = properties.item(Cairo.General.Constants.POAR_ID);
        elem.setSelectId(m_poar_id);
        elem.setValue(m_posicionArancel);

        var elem = properties.item(Cairo.General.Constants.TI_ID_COMEX_GANANCIAS);
        elem.setSelectId(m_ti_id_comex_ganancias);
        elem.setValue(m_ti_comex_ganancias);

        var elem = properties.item(Cairo.General.Constants.TI_ID_COMEX_IGB);
        elem.setSelectId(m_ti_id_comex_igb);
        elem.setValue(m_ti_comex_igb);

        var elem = properties.item(Cairo.General.Constants.TI_ID_COMEX_IVA);
        elem.setSelectId(m_ti_id_comex_iva);
        elem.setValue(m_ti_comex_iva);

        var elem = properties.item(Cairo.General.Constants.PR_ESKIT);
        elem.setValue(Cairo.Util.boolToInt(m_eskit));

        var elem = properties.item(Cairo.General.Constants.PR_KIT_STOCK_XITEM);
        elem.setValue(Cairo.Util.boolToInt(m_kitStkXItem));

        var elem = properties.item(Cairo.General.Constants.PR_KIT_RESUMIDO);
        elem.setValue(Cairo.Util.boolToInt(m_kitResumido));

        var elem = properties.item(Cairo.General.Constants.PR_KIT_IDENTIDAD);
        elem.setValue(Cairo.Util.boolToInt(m_kitIdentidad));

        var elem = properties.item(Cairo.General.Constants.PR_KIT_IDENTIDAD_XITEM);
        elem.setValue(Cairo.Util.boolToInt(m_kitIdentidadXItem));

        var elem = properties.item(Cairo.General.Constants.TA_ID_KIT_SERIE);
        elem.setValue(m_talonarioKitSerie);
        elem.setSelectId(m_ta_id_kitSerie);

        var elem = properties.item(Cairo.General.Constants.PR_KIT_LOTE);
        elem.setValue(Cairo.Util.boolToInt(m_kitLote));

        var elem = properties.item(Cairo.General.Constants.PR_KIT_LOTE_XITEM);
        elem.setValue(Cairo.Util.boolToInt(m_kitLoteXItem));

        var elem = properties.item(Cairo.General.Constants.TA_ID_KIT_LOTE);
        elem.setValue(m_talonarioKitLote);
        elem.setSelectId(m_ta_id_kitLote);

        var elem = properties.add(null);

        var elem = properties.item(Cairo.General.Constants.PR_NOMBRE_WEB);
        elem.setValue(m_nombreWeb);

        var elem = properties.item(Cairo.General.Constants.PR_ALIAS_WEB);
        elem.setValue(m_aliasWeb);

        var elem = properties.item(Cairo.General.Constants.PR_ID_WEB_PADRE);
        elem.setValue(m_productowebpadre);
        elem.setSelectId(m_pr_id_webpadre);

        var elem = properties.item(Cairo.General.Constants.PR_ACTIVO_WEB);
        elem.setValue(Cairo.Util.boolToInt(m_activoWeb));

        var elem = properties.item(Cairo.General.Constants.PR_WEB_IMAGE_UPDATE);
        elem.setValue(Cairo.Util.boolToInt(m_webImageUpdate));

        var elem = properties.item(Cairo.General.Constants.PR_CODIGO_HTML);
        elem.setValue(m_codigoHtml);

        var elem = properties.item(Cairo.General.Constants.PR_CODIGO_HTML_DETALLE);
        elem.setValue(m_codigoHtmlDetalle);

        var elem = properties.item(Cairo.General.Constants.PR_EXPO_WEB);
        elem.setValue(m_expoWeb);

        var elem = properties.item(Cairo.General.Constants.PR_VENTA_WEB_MAXIMA);
        elem.setValue(m_ventaWebMaxima);

        var elem = properties.item(Cairo.General.Constants.LEY_ID);
        elem.setSelectId(m_ley_id);
        elem.setValue(m_leyenda);

        var elem = properties.item(Cairo.General.Constants.PR_WEB_IMAGE_FOLDER);
        elem.setValue(m_webImageFolder);

        return m_dialog.showValues(properties);
      };

      var pSetRubro = function(rub_ID,  showProperties,  tab_rubro) {

        var c = null;
        var rubro = null;
        var abmGen = null;

        rubro = new cRubro();
        rubro.self.load(rub_ID);

        abmGen = m_dialog;

        var properties = m_dialog.getProperties();

        if(!properties.item(Cairo.General.Constants.RUBTIID1) == null) {
          abmGen.unloadControl(properties.item(Cairo.General.Constants.RUBTIID1));
          properties.remove(Cairo.General.Constants.RUBTIID1);
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID2) == null) {
          abmGen.unloadControl(properties.item(Cairo.General.Constants.RUBTIID2));
          properties.remove(Cairo.General.Constants.RUBTIID2);
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID3) == null) {
          abmGen.unloadControl(properties.item(Cairo.General.Constants.RUBTIID3));
          properties.remove(Cairo.General.Constants.RUBTIID3);
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID4) == null) {
          abmGen.unloadControl(properties.item(Cairo.General.Constants.RUBTIID4));
          properties.remove(Cairo.General.Constants.RUBTIID4);
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID5) == null) {
          abmGen.unloadControl(properties.item(Cairo.General.Constants.RUBTIID5));
          properties.remove(Cairo.General.Constants.RUBTIID5);
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID6) == null) {
          abmGen.unloadControl(properties.item(Cairo.General.Constants.RUBTIID6));
          properties.remove(Cairo.General.Constants.RUBTIID6);
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID7) == null) {
          abmGen.unloadControl(properties.item(Cairo.General.Constants.RUBTIID7));
          properties.remove(Cairo.General.Constants.RUBTIID7);
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID8) == null) {
          abmGen.unloadControl(properties.item(Cairo.General.Constants.RUBTIID8));
          properties.remove(Cairo.General.Constants.RUBTIID8);
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID9) == null) {
          abmGen.unloadControl(properties.item(Cairo.General.Constants.RUBTIID9));
          properties.remove(Cairo.General.Constants.RUBTIID9);
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID10) == null) {
          abmGen.unloadControl(properties.item(Cairo.General.Constants.RUBTIID10));
          properties.remove(Cairo.General.Constants.RUBTIID10);
        }

        if(rubro.self.getRubt_id1() != Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Cairo.General.Constants.RUBTIID1);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Cairo.General.Constants.RUBTID+ " = "+ rubro.self.getRubt_id1().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.self.getTabla1());
          elem.setKey(K_RUBTI_ID1);

          elem.setTop(1800);
          elem.setLeft(2500);
          elem.setLeftLabel(-1800);

          if(rubro.self.getRubti_id1() != Cairo.Constants.NO_ID) {
            elem.setValue(rubro.self.getTablaItem1());
            elem.setSelectId(rubro.self.getRubti_id1());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem1);
            elem.setSelectId(m_rubti_id1);
          }

        }

        if(rubro.self.getRubt_id2() != Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Cairo.General.Constants.RUBTIID2);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Cairo.General.Constants.RUBTID+ " = "+ rubro.self.getRubt_id2().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.self.getTabla2());
          elem.setKey(K_RUBTI_ID2);

          elem.setLeftLabel(-1800);

          if(rubro.self.getRubti_id2() != Cairo.Constants.NO_ID) {
            elem.setValue(rubro.self.getTablaItem2());
            elem.setSelectId(rubro.self.getRubti_id2());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem2);
            elem.setSelectId(m_rubti_id2);
          }

        }

        if(rubro.self.getRubt_id3() != Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Cairo.General.Constants.RUBTIID3);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Cairo.General.Constants.RUBTID+ " = "+ rubro.self.getRubt_id3().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.self.getTabla3());
          elem.setKey(K_RUBTI_ID3);

          elem.setLeftLabel(-1800);

          if(rubro.self.getRubti_id3() != Cairo.Constants.NO_ID) {
            elem.setValue(rubro.self.getTablaItem3());
            elem.setSelectId(rubro.self.getRubti_id3());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem3);
            elem.setSelectId(m_rubti_id3);
          }

        }

        if(rubro.self.getRubt_id4() != Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Cairo.General.Constants.RUBTIID4);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Cairo.General.Constants.RUBTID+ " = "+ rubro.self.getRubt_id4().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.self.getTabla4());
          elem.setKey(K_RUBTI_ID4);

          elem.setLeftLabel(-1800);

          if(rubro.self.getRubti_id4() != Cairo.Constants.NO_ID) {
            elem.setValue(rubro.self.getTablaItem4());
            elem.setSelectId(rubro.self.getRubti_id4());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem4);
            elem.setSelectId(m_rubti_id4);
          }
        }

        if(rubro.self.getRubt_id5() != Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Cairo.General.Constants.RUBTIID5);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Cairo.General.Constants.RUBTID+ " = "+ rubro.self.getRubt_id5().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.self.getTabla5());
          elem.setKey(K_RUBTI_ID5);

          elem.setLeftLabel(-1800);

          if(rubro.self.getRubti_id5() != Cairo.Constants.NO_ID) {
            elem.setValue(rubro.self.getTablaItem5());
            elem.setSelectId(rubro.self.getRubti_id5());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem5);
            elem.setSelectId(m_rubti_id5);
          }

        }

        if(rubro.self.getRubt_id6() != Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Cairo.General.Constants.RUBTIID6);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Cairo.General.Constants.RUBTID+ " = "+ rubro.self.getRubt_id6().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.self.getTabla6());
          elem.setKey(K_RUBTI_ID6);

          elem.setTop(1800);
          elem.setLeft(7200);
          elem.setLeftLabel(-1800);

          if(rubro.self.getRubti_id6() != Cairo.Constants.NO_ID) {
            elem.setValue(rubro.self.getTablaItem6());
            elem.setSelectId(rubro.self.getRubti_id6());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem6);
            elem.setSelectId(m_rubti_id6);
          }
        }

        if(rubro.self.getRubt_id7() != Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Cairo.General.Constants.RUBTIID7);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Cairo.General.Constants.RUBTID+ " = "+ rubro.self.getRubt_id7().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.self.getTabla7());
          elem.setKey(K_RUBTI_ID7);

          elem.setLeftLabel(-1800);

          if(rubro.self.getRubti_id7() != Cairo.Constants.NO_ID) {
            elem.setValue(rubro.self.getTablaItem7());
            elem.setSelectId(rubro.self.getRubti_id7());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem7);
            elem.setSelectId(m_rubti_id7);
          }

        }

        if(rubro.self.getRubt_id8() != Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Cairo.General.Constants.RUBTIID8);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Cairo.General.Constants.RUBTID+ " = "+ rubro.self.getRubt_id8().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.self.getTabla8());
          elem.setKey(K_RUBTI_ID8);

          elem.setLeftLabel(-1800);

          if(rubro.self.getRubti_id8() != Cairo.Constants.NO_ID) {
            elem.setValue(rubro.self.getTablaItem8());
            elem.setSelectId(rubro.self.getRubti_id8());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem8);
            elem.setSelectId(m_rubti_id8);
          }

        }

        if(rubro.self.getRubt_id9() != Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Cairo.General.Constants.RUBTIID9);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Cairo.General.Constants.RUBTID+ " = "+ rubro.self.getRubt_id9().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.self.getTabla9());
          elem.setKey(K_RUBTI_ID9);

          elem.setLeftLabel(-1800);

          if(rubro.self.getRubti_id9() != Cairo.Constants.NO_ID) {
            elem.setValue(rubro.self.getTablaItem9());
            elem.setSelectId(rubro.self.getRubti_id9());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem9);
            elem.setSelectId(m_rubti_id9);
          }

        }

        if(rubro.self.getRubt_id10() != Cairo.Constants.NO_ID) {
          var elem = properties.add(null, Cairo.General.Constants.RUBTIID10);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RUBROTABLAITEM);
          elem.setSelectFilter(Cairo.General.Constants.RUBTID+ " = "+ rubro.self.getRubt_id10().toString());
          elem.setTabIndex(tab_rubro);
          elem.setName(rubro.self.getTabla10());
          elem.setKey(K_RUBTI_ID10);

          elem.setLeftLabel(-1800);

          if(rubro.self.getRubti_id10() != Cairo.Constants.NO_ID) {
            elem.setValue(rubro.self.getTablaItem10());
            elem.setSelectId(rubro.self.getRubti_id10());
            elem.setEnabled(false);
          }
          else {
            elem.setValue(m_tablaItem10);
            elem.setSelectId(m_rubti_id10);
          }

        }

        if(!showProperties) { return; }

        if(!abmGen.showEx(self, tab_rubro, true)) { return; }

        m_bRubroChanged = false;

      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/producto]", id).then(
          function(response) {

            if(!rs.isEOF()) {

              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_ID);
              m_nombrecompra = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_NOMBRECOMPRA);
              m_nombreventa = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_NOMBREVENTA);
              m_nombreFactura = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_NOMBRE_FACTURA);
              m_nombreWeb = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_NOMBRE_WEB);
              m_aliasWeb = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_ALIAS_WEB);
              m_activoWeb = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_ACTIVO_WEB);
              m_codigoHtml = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_CODIGO_HTML);
              m_codigoHtmlDetalle = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_CODIGO_HTML_DETALLE);
              m_code = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_CODE);
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_descripventa = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_DESCRIPVENTA);
              m_descripcompra = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_DESCRIPCOMPRA);
              m_compraventa = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_VENTA_COMPRA);
              m_ventastock = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_VENTA_STOCK);
              m_comprastock = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_STOCK_COMPRA);
              m_llevastock = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_LLEVASTOCK);
              m_seCompra = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_SECOMPRA);
              m_seVende = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_SEVENDE);
              m_dinerario = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_DINERARIO);
              m_noRedondeo = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_NO_REDONDEO);
              m_eskit = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_ESKIT);

              m_kitResumido = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_KIT_RESUMIDO);
              m_kitIdentidad = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_KIT_IDENTIDAD);
              m_kitIdentidadXItem = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_KIT_IDENTIDAD_XITEM);
              m_kitLote = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_KIT_LOTE);
              m_kitLoteXItem = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_KIT_LOTE_XITEM);
              m_talonarioKitSerie = Cairo.Database.valField(response.data, "TalonarioSerie");
              m_talonarioKitLote = Cairo.Database.valField(response.data, "TalonarioLote");
              m_ta_id_kitSerie = Cairo.Database.valField(response.data, Cairo.General.Constants.TA_ID_KIT_SERIE);
              m_ta_id_kitLote = Cairo.Database.valField(response.data, Cairo.General.Constants.TA_ID_KIT_LOTE);

              m_kitStkXItem = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_KIT_STOCK_XITEM);
              m_eslista = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_ES_LISTA);

              m_un_id_compra = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_UN_ID_COMPRA);
              m_un_id_venta = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_UN_ID_VENTA);
              m_un_id_stock = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_UN_ID_STOCK);
              m_ti_id_ivaricompra = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_TI_ID_RI_COMPRA);
              m_ti_id_ivarnicompra = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_TI_ID_RNI_COMPRA);
              m_ti_id_ivariventa = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_TI_ID_RI_VENTA);
              m_ti_id_ivarniventa = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_TI_ID_RNI_VENTA);
              m_ti_id_internosv = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_TI_ID_INTERNOS_VENTA);
              m_ti_id_internosc = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_TI_ID_INTERNOS_COMPRA);
              m_ibc_id = Cairo.Database.valField(response.data, Cairo.General.Constants.IBC_ID);
              m_cueg_id_compra = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_CUEG_ID_COMPRA);
              m_cueg_id_venta = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_CUEG_ID_VENTA);
              m_porcinternoc = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_PORCINTERNOC);
              m_porcinternov = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_PORCINTERNOV);
              m_marca = Cairo.Database.valField(response.data, Cairo.General.Constants.MARC_NAME);
              m_marc_id = Cairo.Database.valField(response.data, Cairo.General.Constants.MARC_ID);

              m_tiIvaRiCompra = Cairo.Database.valField(response.data, "ric");
              m_tiIvaRniCompra = Cairo.Database.valField(response.data, "rnic");
              m_tiIvaRiVenta = Cairo.Database.valField(response.data, "riv");
              m_tiIvaRniVenta = Cairo.Database.valField(response.data, "rniv");
              m_tiInternosv = Cairo.Database.valField(response.data, "iv");
              m_tiInternosc = Cairo.Database.valField(response.data, "ic");
              m_ingresosbrutos = Cairo.Database.valField(response.data, Cairo.General.Constants.IBC_NAME);
              m_cuentaGCompra = Cairo.Database.valField(response.data, "cc");
              m_cuentaGVenta = Cairo.Database.valField(response.data, "cv");
              m_unidadCompra = Cairo.Database.valField(response.data, "uc");
              m_unidadVenta = Cairo.Database.valField(response.data, "uv");
              m_unidadStock = Cairo.Database.valField(response.data, "us");

              m_x = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_X);
              m_y = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_Y);
              m_z = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_Z);
              m_tienehijo = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_TIENEHIJO);
              m_id_Padre = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_ID_PADRE);
              m_editarPrecioHijo = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_EDITAR_PRECIOHIJO);
              m_permiteEdicion = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_PERMITEEDICION);
              m_borrado = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_BORRADO);
              m_stockminimo = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_STOCKMINIMO);
              m_stockmaximo = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_STOCKMAXIMO);
              m_codigoexterno = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_CODIGOEXTERNO);
              m_codigoBarra = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_CODIGO_BARRA);
              m_codigoBarraNombre = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_CODIGO_BARRA_NAME);
              m_reposicion = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_REPOSICION);
              m_llevaNroLote = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_LLEVA_NRO_LOTE);
              m_loteFifo = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_LOTE_FIFO);
              m_esRepuesto = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_ES_REPUESTO);
              m_llevaNroSerie = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_LLEVA_NRO_SERIE);
              m_seProduce = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_SE_PRODUCE);
              m_rub_id = Cairo.Database.valField(response.data, Cairo.General.Constants.RUB_ID);
              m_rubro = Cairo.Database.valField(response.data, Cairo.General.Constants.RUB_NAME);

              m_rubti_id1 = Cairo.Database.valField(response.data, Cairo.General.Constants.RUBTIID1);
              m_rubti_id2 = Cairo.Database.valField(response.data, Cairo.General.Constants.RUBTIID2);
              m_rubti_id3 = Cairo.Database.valField(response.data, Cairo.General.Constants.RUBTIID3);
              m_rubti_id4 = Cairo.Database.valField(response.data, Cairo.General.Constants.RUBTIID4);
              m_rubti_id5 = Cairo.Database.valField(response.data, Cairo.General.Constants.RUBTIID5);
              m_rubti_id6 = Cairo.Database.valField(response.data, Cairo.General.Constants.RUBTIID6);
              m_rubti_id7 = Cairo.Database.valField(response.data, Cairo.General.Constants.RUBTIID7);
              m_rubti_id8 = Cairo.Database.valField(response.data, Cairo.General.Constants.RUBTIID8);
              m_rubti_id9 = Cairo.Database.valField(response.data, Cairo.General.Constants.RUBTIID9);
              m_rubti_id10 = Cairo.Database.valField(response.data, Cairo.General.Constants.RUBTIID10);

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

              m_pesoNeto = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_PESO_NETO);
              m_pesoTotal = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_PESO_TOTAL);

              m_fleteExpo = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_FLETE_EXPO);

              m_egp_id = Cairo.Database.valField(response.data, Cairo.General.Constants.EGP_ID);
              m_grupoExpo = Cairo.Database.valField(response.data, Cairo.General.Constants.EGP_NAME);

              m_efm_id = Cairo.Database.valField(response.data, Cairo.General.Constants.EFM_ID);
              m_familiaExpo = Cairo.Database.valField(response.data, Cairo.General.Constants.EFM_NAME);

              m_cantXCajaExpo = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_CANT_XCAJA_EXPO);
              m_un_id_peso = Cairo.Database.valField(response.data, Cairo.General.Constants.UN_ID_PESO);
              m_unidadPeso = Cairo.Database.valField(response.data, "up");

              m_embl_id = Cairo.Database.valField(response.data, Cairo.General.Constants.EMBL_ID);
              m_embalaje = Cairo.Database.valField(response.data, Cairo.General.Constants.EMBL_NAME);

              m_expoCairo = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_EXPO_CAIRO);
              m_expoWeb = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_EXPO_WEB);
              m_ventaWebMaxima = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_VENTA_WEB_MAXIMA);
              m_ley_id = Cairo.Database.valField(response.data, Cairo.General.Constants.LEY_ID);
              m_leyenda = Cairo.Database.valField(response.data, Cairo.General.Constants.LEY_NAME);
              m_webImageFolder = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_WEB_IMAGE_FOLDER);
              m_webImageUpdate = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_WEB_IMAGE_UPDATE);

              m_centroCostoCompra = Cairo.Database.valField(response.data, "centro_costo_compra");
              m_ccos_id_compra = Cairo.Database.valField(response.data, Cairo.General.Constants.CCOS_ID_COMPRA);

              m_centroCostoVenta = Cairo.Database.valField(response.data, "centro_costo_venta");
              m_ccos_id_venta = Cairo.Database.valField(response.data, Cairo.General.Constants.CCOS_ID_VENTA);

              m_esplantilla = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_ES_PLANTILLA);
              m_cur_id = Cairo.Database.valField(response.data, Cairo.General.Constants.CUR_ID);
              m_curso = Cairo.Database.valField(response.data, Cairo.General.Constants.CUR_NAME);

              m_rpt_id_nombrecompra = Cairo.Database.valField(response.data, Cairo.General.Constants.RPT_ID_NOMBRE_COMPRA);
              m_rpt_nombrecompra = Cairo.Database.valField(response.data, "rpt_nombrecompra");

              m_rpt_id_nombreventa = Cairo.Database.valField(response.data, Cairo.General.Constants.RPT_ID_NOMBRE_VENTA);
              m_rpt_nombreventa = Cairo.Database.valField(response.data, "rpt_nombreventa");

              m_rpt_id_nombrefactura = Cairo.Database.valField(response.data, Cairo.General.Constants.RPT_ID_NOMBRE_FACTURA);
              m_rpt_nombrefactura = Cairo.Database.valField(response.data, "rpt_nombrefactura");

              m_rpt_id_nombreweb = Cairo.Database.valField(response.data, Cairo.General.Constants.RPT_ID_NOMBRE_WEB);
              m_rpt_nombreweb = Cairo.Database.valField(response.data, "rpt_nombreweb");

              m_rpt_id_nombreimg = Cairo.Database.valField(response.data, Cairo.General.Constants.RPT_ID_NOMBRE_IMG);
              m_rpt_nombreimg = Cairo.Database.valField(response.data, "rpt_nombreimg");

              m_rpt_id_nombreimgalt = Cairo.Database.valField(response.data, Cairo.General.Constants.RPT_ID_NOMBRE_IMG_ALT);
              m_rpt_nombreimgalt = Cairo.Database.valField(response.data, "rpt_nombreimgalt");

              m_ti_id_comex_ganancias = Cairo.Database.valField(response.data, Cairo.General.Constants.TI_ID_COMEX_GANANCIAS);
              m_ti_comex_ganancias = Cairo.Database.valField(response.data, "tiComexGanancias");

              m_ti_id_comex_igb = Cairo.Database.valField(response.data, Cairo.General.Constants.TI_ID_COMEX_IGB);
              m_ti_comex_igb = Cairo.Database.valField(response.data, "tiComexIGB");

              m_ti_id_comex_iva = Cairo.Database.valField(response.data, Cairo.General.Constants.TI_ID_COMEX_IVA);
              m_ti_comex_iva = Cairo.Database.valField(response.data, "tiComexIVA");

              m_poar_id = Cairo.Database.valField(response.data, Cairo.General.Constants.POAR_ID);
              m_posicionArancel = Cairo.Database.valField(response.data, Cairo.General.Constants.POAR_NAME);

              m_productowebpadre = Cairo.Database.valField(response.data, "webpadre");
              m_pr_id_webpadre = Cairo.Database.valField(response.data, Cairo.General.Constants.PR_ID_WEB_PADRE);

            }
            else {

              m_id = Cairo.Constants.NO_ID;
              m_nombrecompra = "";
              m_nombreventa = "";
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
              m_compraventa = 0;
              m_ventastock = 0;
              m_comprastock = 0;
              m_llevastock = 0;
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
              m_eslista = false;
              m_ti_id_ivaricompra = Cairo.Constants.NO_ID;
              m_ti_id_ivarnicompra = Cairo.Constants.NO_ID;
              m_ti_id_ivariventa = Cairo.Constants.NO_ID;
              m_ti_id_ivarniventa = Cairo.Constants.NO_ID;
              m_ti_id_internosv = Cairo.Constants.NO_ID;
              m_ti_id_internosc = Cairo.Constants.NO_ID;
              m_porcinternoc = 0;
              m_porcinternov = 0;
              m_ibc_id = Cairo.Constants.NO_ID;
              m_cueg_id_compra = Cairo.Constants.NO_ID;
              m_cueg_id_venta = Cairo.Constants.NO_ID;
              m_x = 0;
              m_y = 0;
              m_z = 0;
              m_tienehijo = false;
              m_id_Padre = Cairo.Constants.NO_ID;
              m_editarPrecioHijo = false;
              m_permiteEdicion = false;
              m_borrado = false;
              m_stockminimo = 0;
              m_stockmaximo = 0;
              m_codigoexterno = "";
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
              m_ingresosbrutos = "";
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

              m_esplantilla = 0;
              m_cur_id = Cairo.Constants.NO_ID;
              m_curso = "";

              m_rpt_id_nombrecompra = Cairo.Constants.NO_ID;
              m_rpt_nombrecompra = "";

              m_rpt_id_nombreventa = Cairo.Constants.NO_ID;
              m_rpt_nombreventa = "";

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
              m_pr_id_webpadre = Cairo.Constants.NO_ID;

            }

            m_bRubroChanged = m_lastRubId != m_rub_id;
            m_lastRubId = m_rub_id;

            if(!m_genericEdit.Load(m_id)) { return false; }

            return true;
          });
      };

      var pRefreshProperties = function() {
        var c = null;
        var abmGen = null;
        var filter = null;

        setEnabledPlantilla();

        m_dialog.setTitle(m_nombrecompra);

        var properties = m_dialog.getProperties();

        //////////////////////////////////////////////////////////////
        // Compras
        //
        var property = properties.item(Cairo.General.Constants.PR_NOMBRECOMPRA);
        property.setValue(m_nombrecompra);

        var property = properties.item(Cairo.Constants.ACTIVE);
        property.setValue(m_active === true ? 1 : 0);

        var property = properties.item(Cairo.General.Constants.PR_CODE);
        property.setValue(m_code);

        var property = properties.item(Cairo.General.Constants.PR_CODIGOEXTERNO);
        property.setValue(m_codigoexterno);

        var property = properties.item(Cairo.General.Constants.PR_CODIGO_BARRA);
        property.setValue(m_codigoBarra);

        var property = properties.item(Cairo.General.Constants.PR_CODIGO_BARRA_NAME);
        property.setValue(m_codigoBarraNombre);

        var property = properties.item(Cairo.General.Constants.IBC_ID);
        property.setSelectId(m_ibc_id);
        property.setValue(m_ingresosbrutos);

        var property = properties.item(Cairo.General.Constants.PR_ES_PLANTILLA);
        property.setValue(m_esplantilla);

        var property = properties.item(Cairo.General.Constants.CUR_ID);
        property.setValue(m_curso);
        property.setSelectId(m_cur_id);

        var property = properties.item(Cairo.General.Constants.PR_DESCRIPCOMPRA);
        property.setValue(m_descripcompra);

        var property = properties.item(Cairo.General.Constants.RPT_ID_NOMBRE_COMPRA);
        property.setValue(m_rpt_nombrecompra);
        property.setSelectId(m_rpt_id_nombrecompra);

        var property = properties.item(Cairo.General.Constants.RPT_ID_NOMBRE_VENTA);
        property.setValue(m_rpt_nombreventa);
        property.setSelectId(m_rpt_id_nombreventa);

        var property = properties.item(Cairo.General.Constants.RPT_ID_NOMBRE_FACTURA);
        property.setValue(m_rpt_nombrefactura);
        property.setSelectId(m_rpt_id_nombrefactura);

        var property = properties.item(Cairo.General.Constants.RPT_ID_NOMBRE_WEB);
        property.setValue(m_rpt_nombreweb);
        property.setSelectId(m_rpt_id_nombreweb);

        var property = properties.item(Cairo.General.Constants.RPT_ID_NOMBRE_IMG);
        property.setValue(m_rpt_nombreimg);
        property.setSelectId(m_rpt_id_nombreimg);

        var property = properties.item(Cairo.General.Constants.RPT_ID_NOMBRE_IMG_ALT);
        property.setValue(m_rpt_nombreimgalt);
        property.setSelectId(m_rpt_id_nombreimgalt);

        var property = properties.item(Cairo.General.Constants.PR_SECOMPRA);
        property.setValue(Integer.parseInt(m_seCompra));

        var property = properties.item(Cairo.General.Constants.PR_UN_ID_COMPRA);
        property.setSelectId(m_un_id_compra);
        property.setValue(m_unidadCompra);

        var property = properties.item(Cairo.General.Constants.PR_CUEG_ID_COMPRA);
        property.setSelectId(m_cueg_id_compra);
        property.setValue(m_cuentaGCompra);

        var property = properties.item(Cairo.General.Constants.CCOS_ID_COMPRA);
        property.setSelectId(m_ccos_id_compra);
        property.setValue(m_centroCostoCompra);

        var property = properties.item(Cairo.General.Constants.MARC_ID);
        property.setValue(m_marca);
        property.setSelectId(m_marc_id);

        var property = properties.item(Cairo.General.Constants.UN_ID_PESO);
        property.setValue(m_unidadPeso);
        property.setSelectId(m_un_id_peso);

        var property = properties.item(Cairo.General.Constants.PR_PESO_NETO);
        property.setValue(m_pesoNeto);

        var property = properties.item(Cairo.General.Constants.PR_PESO_TOTAL);
        property.setValue(m_pesoTotal);

        var property = properties.item(Cairo.General.Constants.EGP_ID);
        property.setValue(m_grupoExpo);
        property.setSelectId(m_egp_id);

        var property = properties.item(Cairo.General.Constants.EFM_ID);
        property.setValue(m_familiaExpo);
        property.setSelectId(m_efm_id);

        var property = properties.item(Cairo.General.Constants.PR_FLETE_EXPO);
        property.setValue(Integer.parseInt(m_fleteExpo));

        var property = properties.item(Cairo.General.Constants.PR_CANT_XCAJA_EXPO);
        property.setValue(m_cantXCajaExpo);

        var property = properties.item(Cairo.General.Constants.EMBL_ID);
        property.setValue(m_embalaje);
        property.setSelectId(m_embl_id);

        var property = properties.item(Cairo.General.Constants.TI_ID_COMEX_GANANCIAS);
        property.setSelectId(m_ti_id_comex_ganancias);
        property.setValue(m_ti_comex_ganancias);

        var property = properties.item(Cairo.General.Constants.TI_ID_COMEX_IGB);
        property.setSelectId(m_ti_id_comex_igb);
        property.setValue(m_ti_comex_igb);

        var property = properties.item(Cairo.General.Constants.TI_ID_COMEX_IVA);
        property.setSelectId(m_ti_id_comex_iva);
        property.setValue(m_ti_comex_iva);

        var property = properties.item(Cairo.General.Constants.POAR_ID);
        property.setSelectId(m_poar_id);
        property.setValue(m_posicionArancel);

        var property = properties.item(Cairo.General.Constants.PR_EXPO_WEB);
        property.setValue(m_expoWeb);

        var property = properties.item(Cairo.General.Constants.PR_EXPO_CAIRO);
        property.setValue(m_expoCairo);

        var property = properties.item(Cairo.General.Constants.PR_VENTA_WEB_MAXIMA);
        property.setValue(m_ventaWebMaxima);

        var property = properties.item(Cairo.General.Constants.LEY_ID);
        property.setValue(m_leyenda);
        property.setSelectId(m_ley_id);

        var property = properties.item(Cairo.General.Constants.PR_WEB_IMAGE_FOLDER);
        property.setValue(m_webImageFolder);

        var property = properties.item(Cairo.General.Constants.PR_WEB_IMAGE_UPDATE);
        property.setValue(Integer.parseInt(m_webImageUpdate));

        var property = properties.item(Cairo.General.Constants.PR_TI_ID_RI_COMPRA);
        property.setValue(m_tiIvaRiCompra);
        property.setSelectId(m_ti_id_ivaricompra);

        //      With .Item(cscPrTiIdRniCompra)
        //        .Value = m_TiIvaRniCompra
        //        .HelpId = m_Ti_id_ivarnicompra
        //      End With

        var property = properties.item(Cairo.General.Constants.PR_TI_ID_INTERNOS_COMPRA);
        property.setValue(m_tiInternosc);
        property.setSelectId(m_ti_id_internosc);

        var property = properties.item(Cairo.General.Constants.PR_PORCINTERNOC);
        property.setValue(m_porcinternoc);

        //////////////////////////////////////////////////////////////
        // Stock
        //
        var property = properties.item(Cairo.General.Constants.PR_LLEVASTOCK);
        property.setValue(Integer.parseInt(m_llevastock));

        var property = properties.item(Cairo.General.Constants.PR_UN_ID_STOCK);
        property.setValue(m_unidadStock);
        property.setSelectId(m_un_id_stock);

        var property = properties.item(Cairo.General.Constants.PR_STOCK_COMPRA);
        property.setValue(m_comprastock);

        var property = properties.item(Cairo.General.Constants.PR_X);
        property.setValue(m_x);

        var property = properties.item(Cairo.General.Constants.PR_Y);
        property.setValue(m_y);

        var property = properties.item(Cairo.General.Constants.PR_Z);
        property.setValue(m_z);

        var property = properties.item(Cairo.General.Constants.PR_STOCKMINIMO);
        property.setValue(m_stockminimo);

        var property = properties.item(Cairo.General.Constants.PR_STOCKMAXIMO);
        property.setValue(m_stockmaximo);

        var property = properties.item(Cairo.General.Constants.PR_REPOSICION);
        property.setValue(m_reposicion);

        var property = properties.item(Cairo.General.Constants.PR_LLEVA_NRO_SERIE);
        property.setValue(Integer.parseInt(m_llevaNroSerie));

        var property = properties.item(Cairo.General.Constants.PR_LLEVA_NRO_LOTE);
        property.setValue(Integer.parseInt(m_llevaNroLote));

        var property = properties.item(Cairo.General.Constants.PR_LOTE_FIFO);
        property.setValue(Integer.parseInt(m_loteFifo));

        var property = properties.item(Cairo.General.Constants.PR_SE_PRODUCE);
        property.setValue(Integer.parseInt(m_seProduce));

        var property = properties.item(Cairo.General.Constants.PR_ES_REPUESTO);
        property.setValue(Integer.parseInt(m_esRepuesto));

        //////////////////////////////////////////////////////////////
        // Ventas
        //
        var property = properties.item(Cairo.General.Constants.PR_SEVENDE);
        property.setValue(Integer.parseInt(m_seVende));

        var property = properties.item(Cairo.General.Constants.PR_NOMBREVENTA);
        property.setValue(m_nombreventa);

        var property = properties.item(Cairo.General.Constants.PR_NOMBRE_FACTURA);
        property.setValue(m_nombreFactura);

        var property = properties.item(Cairo.General.Constants.PR_UN_ID_VENTA);
        property.setValue(m_unidadVenta);
        property.setSelectId(m_un_id_venta);

        var property = properties.item(Cairo.General.Constants.PR_VENTA_COMPRA);
        property.setValue(m_compraventa);

        var property = properties.item(Cairo.General.Constants.PR_VENTA_STOCK);
        property.setValue(m_ventastock);

        var property = properties.item(Cairo.General.Constants.PR_CUEG_ID_VENTA);
        property.setSelectId(m_cueg_id_venta);
        property.setValue(m_cuentaGVenta);

        var property = properties.item(Cairo.General.Constants.PR_ES_LISTA);
        property.setValue(Integer.parseInt(m_eslista));

        var property = properties.item(Cairo.General.Constants.PR_TI_ID_RI_VENTA);
        property.setValue(m_tiIvaRiVenta);
        property.setSelectId(m_ti_id_ivariventa);

        //      With .Item(cscPrTiIdRniVenta)
        //        .Value = m_TiIvaRniVenta
        //        .HelpId = m_Ti_id_ivarniventa
        //      End With

        var property = properties.item(Cairo.General.Constants.PR_TI_ID_INTERNOS_VENTA);
        property.setValue(m_tiInternosv);
        property.setSelectId(m_ti_id_internosv);

        var property = properties.item(Cairo.General.Constants.PR_PORCINTERNOV);
        property.setValue(m_porcinternov);

        var property = properties.item(Cairo.General.Constants.PR_DINERARIO);
        property.setValue(Integer.parseInt(m_dinerario));

        var property = properties.item(Cairo.General.Constants.PR_NO_REDONDEO);
        property.setValue(Integer.parseInt(m_noRedondeo));

        var property = properties.item(Cairo.General.Constants.CCOS_ID_VENTA);
        property.setSelectId(m_ccos_id_venta);
        property.setValue(m_centroCostoVenta);

        var property = properties.item(Cairo.General.Constants.PR_DESCRIPVENTA);
        property.setValue(m_descripventa);

        var property = properties.item(Cairo.General.Constants.RUB_ID);
        property.setValue(m_rubro);
        property.setSelectId(m_rub_id);

        //////////////////////////////////////////////////////////////
        // Kit
        //
        var property = properties.item(Cairo.General.Constants.PR_ESKIT);
        property.setValue(Integer.parseInt(m_eskit));

        var property = properties.item(Cairo.General.Constants.PR_KIT_STOCK_XITEM);
        property.setValue(Integer.parseInt(m_kitStkXItem));

        var property = properties.item(Cairo.General.Constants.PR_KIT_RESUMIDO);
        property.setValue(Integer.parseInt(m_kitResumido));

        var property = properties.item(Cairo.General.Constants.PR_KIT_IDENTIDAD);
        property.setValue(Integer.parseInt(m_kitIdentidad));

        var property = properties.item(Cairo.General.Constants.PR_KIT_IDENTIDAD_XITEM);
        property.setValue(Integer.parseInt(m_kitIdentidadXItem));

        var property = properties.item(Cairo.General.Constants.TA_ID_KIT_SERIE);
        property.setValue(m_talonarioKitSerie);
        property.setSelectId(m_ta_id_kitSerie);

        var property = properties.item(Cairo.General.Constants.PR_KIT_LOTE);
        property.setValue(Integer.parseInt(m_kitLote));

        var property = properties.item(Cairo.General.Constants.PR_KIT_LOTE_XITEM);
        property.setValue(Integer.parseInt(m_kitLoteXItem));

        var property = properties.item(Cairo.General.Constants.TA_ID_KIT_LOTE);
        property.setValue(m_talonarioKitLote);
        property.setSelectId(m_ta_id_kitLote);

        c = properties.item(C_PRODUCTOKIT);
        if(!pLoadKit(c)) { return; }

        //////////////////////////////////////////////////////////////
        // Proveedores
        //
        c = properties.item(C_PROVEEDOR);
        if(!pLoadProveedor(c)) { return; }
        m_itemsDeletedProveedor = "";

        //////////////////////////////////////////////////////////////
        // Clientes
        //
        c = properties.item(C_CLIENTE);
        if(!pLoadCliente(c)) { return; }
        m_itemsDeletedCliente = "";

        //////////////////////////////////////////////////////////////
        // BOMs
        //
        c = properties.item(C_BOM);
        if(!pLoadBOM(c)) { return; }

        //////////////////////////////////////////////////////////////
        // CMI
        //
        c = properties.item(C_CMI);
        if(!pLoadCMI(c)) { return; }
        m_itemsDeletedCMI = "";

        //////////////////////////////////////////////////////////////
        // Leyendas
        //
        c = properties.item(C_LEYENDAS);
        if(!pLoadLeyendas(c)) { return; }
        m_itemsDeletedLeyendas = "";

        //////////////////////////////////////////////////////////////
        // Tags
        //
        var property = properties.item(Cairo.General.Constants.PR_NOMBRE_WEB);
        property.setValue(m_nombreWeb);

        var property = properties.item(Cairo.General.Constants.PR_ALIAS_WEB);
        property.setValue(m_aliasWeb);

        var property = properties.item(Cairo.General.Constants.PR_ID_WEB_PADRE);
        property.setValue(m_productowebpadre);
        property.setSelectId(m_pr_id_webpadre);

        var property = properties.item(Cairo.General.Constants.PR_ACTIVO_WEB);
        property.setValue(Integer.parseInt(m_activoWeb));

        var property = properties.item(Cairo.General.Constants.PR_CODIGO_HTML);
        property.setValue(m_codigoHtml);

        var property = properties.item(Cairo.General.Constants.PR_CODIGO_HTML_DETALLE);
        property.setValue(m_codigoHtmlDetalle);

        c = properties.item(C_WEB_IMAGES);
        if(!pLoadWebImages(c)) { return; }
        m_itemsDeletedWebImages = "";

        c = properties.item(C_TAGS);
        if(!pLoadTags(c)) { return; }
        m_itemsDeletedTag = "";

        //////////////////////////////////////////////////////////////
        // Catalogos
        //
        c = properties.item(C_WEB_CATALOGS);
        if(!pLoadCatalogosWeb(c)) { return; }

        //////////////////////////////////////////////////////////////
        // Categorias
        //
        c = properties.item(C_WEB_CATEGORIES);
        if(!pLoadCategoriasWeb(c)) { return; }

        m_genericEdit.RefreshProperties(m_dialog);

        // Si cambio el rubro, me veo
        // obligado a llamar a RefreshRubro
        // para que actualice los controles
        // y como esta rutina obliga un loadcontrol
        // de toda la ventana, no me gasto llamando
        // a ShowValues
        //
        if(m_bRubroChanged) {

          pSetRubro(m_rub_id, true);

        }
        else {
          pRefreshRubro(m_rub_id);

          abmGen = m_dialog;
          abmGen.showValues(m_dialog.getProperties());

        }

      };

      var pRefreshRubro = function(rub_ID) {
        var rubro = null;
        rubro = new cRubro();
        rubro.self.load(rub_ID);

        var properties = m_dialog.getProperties();

        if(rubro.self.getRubt_id1() != Cairo.Constants.NO_ID) {
          var property = properties.item(Cairo.General.Constants.RUBTIID1);
          property.setValue(m_tablaItem1);
          property.setSelectId(m_rubti_id1);
        }

        if(rubro.self.getRubt_id2() != Cairo.Constants.NO_ID) {
          var property = properties.item(Cairo.General.Constants.RUBTIID2);
          property.setValue(m_tablaItem2);
          property.setSelectId(m_rubti_id2);
        }

        if(rubro.self.getRubt_id3() != Cairo.Constants.NO_ID) {
          var property = properties.item(Cairo.General.Constants.RUBTIID3);
          property.setValue(m_tablaItem3);
          property.setSelectId(m_rubti_id3);
        }

        if(rubro.self.getRubt_id4() != Cairo.Constants.NO_ID) {
          var property = properties.item(Cairo.General.Constants.RUBTIID4);
          property.setValue(m_tablaItem4);
          property.setSelectId(m_rubti_id4);
        }

        if(rubro.self.getRubt_id5() != Cairo.Constants.NO_ID) {
          var property = properties.item(Cairo.General.Constants.RUBTIID5);
          property.setValue(m_tablaItem5);
          property.setSelectId(m_rubti_id5);
        }

        if(rubro.self.getRubt_id6() != Cairo.Constants.NO_ID) {
          var property = properties.item(Cairo.General.Constants.RUBTIID6);
          property.setValue(m_tablaItem6);
          property.setSelectId(m_rubti_id6);
        }

        if(rubro.self.getRubt_id7() != Cairo.Constants.NO_ID) {
          var property = properties.item(Cairo.General.Constants.RUBTIID7);
          property.setValue(m_tablaItem7);
          property.setSelectId(m_rubti_id7);
        }

        if(rubro.self.getRubt_id8() != Cairo.Constants.NO_ID) {
          var property = properties.item(Cairo.General.Constants.RUBTIID8);
          property.setValue(m_tablaItem8);
          property.setSelectId(m_rubti_id8);
        }

        if(rubro.self.getRubt_id9() != Cairo.Constants.NO_ID) {
          var property = properties.item(Cairo.General.Constants.RUBTIID9);
          property.setValue(m_tablaItem9);
          property.setSelectId(m_rubti_id9);
        }

        if(rubro.self.getRubt_id10() != Cairo.Constants.NO_ID) {
          var property = properties.item(Cairo.General.Constants.RUBTIID10);
          property.setValue(m_tablaItem10);
          property.setSelectId(m_rubti_id10);
        }

      };

      self.initialize = function() {
        // **TODO:** on error resume next found !!!
        //'Error al grabar el Artículo
        c_ErrorSave = Cairo.Language.getText(1352, "");

        // Preferencias del Usuario
        //
        m_userCfg = new cUsuarioConfig();
        m_userCfg.Load;

      };

      self.destroy = function() {
        m_dialog = null;
        m_listController = null;

        // Preferencias del Usuario
        //
        m_userCfg = null;
      };

      /////////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////////
      var cIABMClientGrid_ColumnAfterEdit = function(key,  lRow,  lCol,  newValue,  newValueID) {
        return true;
      };

      var cIABMClientGrid_ColumnBeforeEdit = function(key,  lRow,  lCol,  iKeyAscii) {
        var _rtn = null;
        switch (key) {
          case K_WEB_CATALOGOS:
          case K_WEB_CATEGORIAS:
            _rtn = lCol == 4 || lCol == 5;
            break;

          default:
            _rtn = true;
            break;
        }

        return _rtn;
      };

      var cIABMClientGrid_ColumnButtonClick = function(key,  lRow,  lCol,  iKeyAscii) {

      };

      var cIABMClientGrid_ColumnCancelEdit = function(key) {

      };

      var cIABMClientGrid_DeleteRow = function(key,  row,  lRow) {
        var id = null;

        switch (key) {

          case K_PROVEEDOR:
            id = Cairo.Util.val(Dialogs.cell(row, KIK_PRPROV_ID).getValue());
            if(id != Cairo.Constants.NO_ID) { m_itemsDeletedProveedor = m_itemsDeletedProveedor+ id.toString()+ C_StrColon; }

            break;

          case K_CLIENTE:
            id = Cairo.Util.val(Dialogs.cell(row, KIK_PRCLI_ID).getValue());
            if(id != Cairo.Constants.NO_ID) { m_itemsDeletedCliente = m_itemsDeletedCliente+ id.toString()+ C_StrColon; }

            break;

          case K_TAGS:
            id = Cairo.Util.val(Dialogs.cell(row, KIT_PRT_ID).getValue());
            if(id != Cairo.Constants.NO_ID) { m_itemsDeletedTag = m_itemsDeletedTag+ id.toString()+ C_StrColon; }

            break;

          case K_WEB_IMAGES:
            id = Cairo.Util.val(Dialogs.cell(row, KIWI_PRWI_ID).getValue());
            if(id != Cairo.Constants.NO_ID) { m_itemsDeletedWebImages = m_itemsDeletedWebImages+ id.toString()+ C_StrColon; }

            break;

          case K_CMI:
            id = Cairo.Util.val(Dialogs.cell(row, KICMI_ID).getValue());
            if(id != Cairo.Constants.NO_ID) { m_itemsDeletedCMI = m_itemsDeletedCMI+ id.toString()+ C_StrColon; }

            break;

          case K_LEYENDAS:
            id = Cairo.Util.val(Dialogs.cell(row, KIPRL_ID).getValue());
            if(id != Cairo.Constants.NO_ID) { m_itemsDeletedLeyendas = m_itemsDeletedLeyendas+ id.toString()+ C_StrColon; }

            break;
        }

        return true;
      };

      var listAdHock = function(key,  row,  colIndex,  list) {

      };

      var newRow = function(key,  rows) {

      };

      var validateRow = function(key,  row,  rowIndex) {
        var _rtn = null;
        try {

          switch (key) {
            case K_PRODUCTO_KIT:
              _rtn = true;
              break;

            case K_PROVEEDOR:
              _rtn = pValidateRowProveedor(row, rowIndex);
              break;

            case K_CLIENTE:
              _rtn = pValidateRowCliente(row, rowIndex);
              break;

            case K_TAGS:
              _rtn = true;
              break;

            case K_BOM:
              _rtn = true;
              break;

            case K_WEB_IMAGES:
              _rtn = pValidateRowWebImage(row, rowIndex);
              break;

            case K_CMI:
              _rtn = pValidateRowCMI(row, rowIndex);
              break;

            case K_LEYENDAS:
              _rtn = pValidateRowLeyendas(row, rowIndex);
              break;

            case K_WEB_CATALOGOS:
            case K_WEB_CATEGORIAS:
              _rtn = true;
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, C_ValidateRow, C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var columnAfterUpdate = function(key,  lRow,  lCol) {
        return true;
      };

      var columnClick = function(key,  lRow,  lCol) {

      };

      var dblClick = function(key,  lRow,  lCol) {
        switch (key) {
          case K_PROVEEDOR:
            var property = m_dialog.getProperties().item(C_PROVEEDOR);
            pEditLP(Dialogs.cell(property.getGrid().getRows().getProperties().item(lRow), KIK_PROV_LPI_ID).getID());
            break;
        }
      };

      var isEmptyRow = function(key,  row,  rowIndex) {
        var _rtn = null;
        try {

          switch (key) {
            case K_PROVEEDOR:
              _rtn = pIsEmptyRowProveedor(row, rowIndex);
              break;

            case K_CLIENTE:
              _rtn = pIsEmptyRowCliente(row, rowIndex);
              break;

            case K_TAGS:
              _rtn = pIsEmptyRowTags(row, rowIndex);
              break;

            case K_WEB_IMAGES:
              _rtn = pIsEmptyRowWebImages(row, rowIndex);
              break;

            case K_CMI:
              _rtn = pIsEmptyRowCMI(row, rowIndex);
              break;

            case K_LEYENDAS:
              _rtn = pIsEmptyRowLeyendas(row, rowIndex);
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, C_ValidateRow, C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      // funciones privadas
      var pSaveItemsWebCatalogos = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();

        if(!Cairo.Database.execute(sqlstmt)) { return false; }

        var property = m_dialog.getProperties().item(C_WEB_CATALOGS);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          if(Dialogs.cell(row, KICW_SELECT).getID()) {

            var register = new Cairo.Database.Register();

            var fields = register.getFields();
            register.setFieldId(Cairo.General.Constants.CATWI_ID);
            register.setTable(Cairo.General.Constants.CATALOGOWEBITEM);
            register.setId(Cairo.Constants.NEW_ID);

            var _count = row.size();
            for (var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {

                case KICW_ID:
                  fields.add(Cairo.General.Constants.CATW_ID, cell.getId(), Cairo.Constants.Types.id);

                  break;
              }
            }

            fields.add(Cairo.General.Constants.CATWI_ACTIVO, 1, Cairo.Constants.Types.boolean);
            fields.add(Cairo.General.Constants.PR_ID, m_id, Cairo.Constants.Types.id);

            transaction.addRegister(register);

          }

        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pSaveItemsWebCategorias = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();

        if(!Cairo.Database.execute(sqlstmt)) { return false; }

        var property = m_dialog.getProperties().item(C_WEB_CATEGORIES);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          if(Dialogs.cell(row, KICWC_SELECT).getID()) {

            var register = new Cairo.Database.Register();

            var fields = register.getFields();
            register.setFieldId(Cairo.General.Constants.CATWCI_ID);
            register.setTable(Cairo.General.Constants.CATALOGOWEBCATEGORIAITEM);
            register.setId(Cairo.Constants.NEW_ID);

            var _count = row.size();
            for (var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {

                case KICWC_ID:
                  fields.add(Cairo.General.Constants.CATWC_ID, cell.getId(), Cairo.Constants.Types.id);

                  break;

                case KICWCI_POSICION:
                  fields.add(Cairo.General.Constants.CATWCI_POSICION, cell.getValue(), Cairo.Constants.Types.integer);

                  break;
              }
            }

            fields.add(Cairo.General.Constants.CATWCI_ACTIVO, 1, Cairo.Constants.Types.boolean);
            fields.add(Cairo.General.Constants.PR_ID, m_id, Cairo.Constants.Types.id);

            transaction.addRegister(register);

          }

        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pSaveItemsProveedor = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();

        var property = m_dialog.getProperties().item(C_PROVEEDOR);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          if(pIsRowProveedorFromUser(row)) {

            var register = new Cairo.Database.Register();

            var fields = register.getFields();
            register.setFieldId(Cairo.General.Constants.PR_PROV_ID);
            register.setTable(Cairo.General.Constants.PRODUCTOPROVEEDOR);
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
                  fields.add(Cairo.General.Constants.PROV_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIK_PROV_FABRICANTE:
                  fields.add(Cairo.General.Constants.PR_PROV_FABRICANTE, cell.getId(), Cairo.Constants.Types.boolean);
                  break;

                case KIK_PROV_NOMBRE:
                  fields.add(Cairo.General.Constants.PR_PROV_NAME, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIK_PROV_CODIGO:
                  fields.add(Cairo.General.Constants.PR_PROV_CODE, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIK_PROV_CODBARRA:
                  fields.add(Cairo.General.Constants.PR_PROV_CODIGO_BARRA, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIK_PA_ID:
                  fields.add(Cairo.General.Constants.PA_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;
              }
            }

            fields.add(Cairo.General.Constants.PR_ID, m_id, Cairo.Constants.Types.id);

            transaction.addRegister(register);

          }

          if(Dialogs.cell(row, KIK_PROV_PRECIO).getValue() != Dialogs.cell(row, KIK_PROV_PRECIO2).getValue() && Dialogs.cell(row, KIK_PROV_LPI_ID).getID() != Cairo.Constants.NO_ID) {

            sqlstmt = "sp_ProductoSavePrecio "+ m_id+ ","+ Dialogs.cell(row, KIK_PROV_LPI_ID).getID().toString()+ ","+ Cairo.Database.sqlNumber(Dialogs.cell(row, KIK_PROV_PRECIO).getValue())+ ","+ Cairo.Database.sqlDate(Dialogs.cell(row, KIK_PROV_PRECIO_FECHA).getValue());

            if(!Cairo.Database.execute(sqlstmt)) { return false; }

          }

        }

        if(m_itemsDeletedProveedor != "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedProveedor )
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pSaveItemsCMI = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();

        var property = m_dialog.getProperties().item(C_CMI);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(Cairo.General.Constants.PRCMI_ID);
          register.setTable(Cairo.General.Constants.PRODUCTOCOMUNIDADINTERNET);
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
                fields.add(Cairo.General.Constants.CMI_ID, cell.getId(), Cairo.Constants.Types.id);

                break;

              case KICMI_CODIGO:
                fields.add(Cairo.General.Constants.PRCMI_CODE, cell.getValue(), Cairo.Constants.Types.text);

                break;

              case KICMI_DESCRIP:
                fields.add(Cairo.General.Constants.PRCMI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);

                break;

              case KICMI_PRECIO:
                fields.add(Cairo.General.Constants.PRCMI_PRECIO, cell.getValue(), Cairo.Constants.Types.double);

                break;

              case KICMI_FECHAALTA:
                fields.add(Cairo.General.Constants.PRCMI_FECHA_ALTA, cell.getValue(), Cairo.Constants.Types.date);

                break;

              case KICMI_FECHAVTO:
                fields.add(Cairo.General.Constants.PRCMI_FECHA_VTO, cell.getValue(), Cairo.Constants.Types.date);

                break;
            }
          }

          fields.add(Cairo.General.Constants.PR_ID, m_id, Cairo.Constants.Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedCMI != "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedCMI )
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pSaveItemsLeyendas = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();

        var property = m_dialog.getProperties().item(C_LEYENDAS);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(Cairo.General.Constants.PRL_ID);
          register.setTable(Cairo.General.Constants.PRODUCTOLEYENDA);
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
                fields.add(Cairo.General.Constants.PRL_NAME, cell.getValue(), Cairo.Constants.Types.text);

                break;

              case KIPRL_TEXTO:
                fields.add(Cairo.General.Constants.PRL_TEXTO, cell.getValue(), Cairo.Constants.Types.text);

                break;

              case KIPRL_TAG:
                fields.add(Cairo.General.Constants.PRL_TAG, cell.getValue(), Cairo.Constants.Types.text);

                break;

              case KIPRL_ORDEN:
                fields.add(Cairo.General.Constants.PRL_ORDEN, cell.getValue(), Cairo.Constants.Types.text);

                break;
            }
          }

          fields.add(Cairo.General.Constants.PR_ID, m_id, Cairo.Constants.Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedLeyendas != "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedLeyendas )
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pSaveItemsWebImages = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();

        var property = m_dialog.getProperties().item(C_WEB_IMAGES);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(Cairo.General.Constants.PRWI_ID);
          register.setTable(Cairo.General.Constants.PRODUCTOWEBIMAGE);
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
                fields.add(Cairo.General.Constants.PRWI_ARCHIVO, cell.getValue(), Cairo.Constants.Types.text);

                break;

              case KIWI_ALT:
                fields.add(Cairo.General.Constants.PRWI_ALT, cell.getValue(), Cairo.Constants.Types.text);

                break;

              case KIWI_IMAGE_TYPE:
                fields.add(Cairo.General.Constants.PRWI_TIPO, cell.getId(), Cairo.Constants.Types.integer);

                break;

              case KIWI_POSICION:
                fields.add(Cairo.General.Constants.PRWI_POSICION, cell.getValue(), Cairo.Constants.Types.double);
                break;
            }
          }

          fields.add(Cairo.General.Constants.PR_ID, m_id, Cairo.Constants.Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedWebImages != "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedWebImages )
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pSaveItemsCliente = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();

        var property = m_dialog.getProperties().item(C_CLIENTE);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(Cairo.General.Constants.PR_CLI_ID);
          register.setTable(Cairo.General.Constants.PRODUCTOCLIENTE);
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
                fields.add(Cairo.General.Constants.CLI_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIK_CLI_NOMBRE:
                fields.add(Cairo.General.Constants.PR_CLI_NAME, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KIK_CLI_CODIGO:
                fields.add(Cairo.General.Constants.PR_CLI_CODE, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KIK_CLI_CODBARRA:
                fields.add(Cairo.General.Constants.PR_CLI_CODIGO_BARRA, cell.getValue(), Cairo.Constants.Types.text);
                break;
            }
          }

          fields.add(Cairo.General.Constants.PR_ID, m_id, Cairo.Constants.Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedCliente != "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedCliente )
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pSaveItemsTags = function(mainTransaction) {
        var transaction = new Cairo.Database.Transaction();
        var bPrIdTag = null;

        var property = m_dialog.getProperties().item(C_TAGS);
        var row = null;
        var cell = null;

        var _count = property.getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = property.getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(Cairo.General.Constants.PRT_ID);
          register.setTable(Cairo.General.Constants.PRODUCTOTAG);
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
                bPrIdTag = cell.getId() != Cairo.Constants.NO_ID;
                fields.add(Cairo.General.Constants.PR_ID_TAG, cell.getId(), Cairo.Constants.Types.id);

                break;

              case KIT_TEXTO:

                if(bPrIdTag) {
                  fields.add(Cairo.General.Constants.PRT_TEXTO, "", Cairo.Constants.Types.text);
                }
                else {
                  fields.add(Cairo.General.Constants.PRT_TEXTO, cell.getValue(), Cairo.Constants.Types.text);
                }

                break;

              case KIT_EXPOCAIRO:
                fields.add(Cairo.General.Constants.PRT_EXPO_CAIRO, cell.getValue(), Cairo.Constants.Types.integer);

                break;

              case KIT_EXPOWEB:
                fields.add(Cairo.General.Constants.PRT_EXPO_WEB, cell.getValue(), Cairo.Constants.Types.integer);

                break;
            }
          }

          fields.add(Cairo.General.Constants.PR_ID, m_id, Cairo.Constants.Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedTag != "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedTag )
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pValidateRowProveedor = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIK_PROV_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                cWindow.msgInfo(Cairo.Language.getText(1349, "", strRow));
                //Debe indicar un proveedor
                return null;
              }
              break;
          }
        }

        return true;
      };

      var pValidateRowLeyendas = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIPRL_NOMBRE:
              if(Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                cWindow.msgInfo(Cairo.Constants.MUST_SET_A_NAME);
                return null;
              }
              break;

            case KIPRL_TEXTO:
              if(Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                cWindow.msgInfo(Cairo.Language.getText(5037, "", strRow));
                //Debe indicar una texto
                return null;
              }
              break;
          }
        }

        return true;

      };

      var pValidateRowCMI = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KICMI_CMI_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Cairo.Constants.Types.integer)) {
                cWindow.msgInfo(Cairo.Language.getText(5028, "", strRow));
                //Debe indicar una comunidad
                return null;
              }
              break;

            case KICMI_CODIGO:
              if(Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                cWindow.msgInfo(Cairo.Constants.c_DebeIndicarCodigo);
                return null;
              }
              break;
          }
        }

        return true;
      };

      var pValidateRowWebImage = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIWI_IMAGE:
              if(Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                cWindow.msgInfo(Cairo.Language.getText(4574, "", strRow));
                //Debe indicar el nombre de un archivo de imagen
                return null;
              }
              break;

            case KIWI_IMAGE_TYPE:
              if(Cairo.Util.valEmpty(cell.getId(), Cairo.Constants.Types.integer)) {
                cWindow.msgInfo(Cairo.Language.getText(4575, "", strRow));
                //Debe indicar el tipo de imagen
                return null;
              }
              break;
          }
        }

        return true;
      };

      var pValidateRowCliente = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIK_CLI_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                cWindow.msgInfo(Cairo.Language.getText(1351, "", strRow));
                //Debe indicar un cliente
                return null;
              }
              break;
          }
        }

        return true;
      };

      var pIsEmptyRowProveedor = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pIsEmptyRowProveedor(ByRef row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bRowIsEmpty = null;

        bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIK_PROV_ID:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KIK_PROV_NOMBRE:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KIK_PROV_CODIGO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KIK_PROV_CODBARRA:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KIK_PA_ID:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }

              break;
          }
        }

        return bRowIsEmpty;
      };

      var pIsEmptyRowCliente = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pIsEmptyRowCliente(ByRef row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bRowIsEmpty = null;

        bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIK_CLI_ID:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KIK_CLI_NOMBRE:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KIK_CLI_CODIGO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KIK_CLI_CODBARRA:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pIsEmptyRowLeyendas = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pIsEmptyRowLeyendas(ByRef row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bRowIsEmpty = null;

        bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIPRL_NOMBRE:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KIPRL_TEXTO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pIsEmptyRowCMI = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pIsEmptyRowCMI(ByRef row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bRowIsEmpty = null;

        bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KICMI_CMI_ID:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KICMI_CODIGO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pIsEmptyRowWebImages = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pIsEmptyRowWebImages(ByRef row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bRowIsEmpty = null;

        bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIWI_IMAGE:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KIWI_ALT:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pIsEmptyRowTags = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pIsEmptyRowTags(ByRef row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bRowIsEmpty = null;

        bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIT_TEXTO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KIT_EXPOWEB:
            case KIT_EXPOCAIRO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.integer)) {
                if(Cairo.Util.val(cell.getValue()) != 50) {
                  bRowIsEmpty = false;
                  break;
                }
              }
              break;

            case KIT_PR_ID_TAG:
              if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pLoadProveedor = function(propiedad) { // TODO: Use of ByRef founded Private Function pLoadProveedor(ByRef Propiedad As cIABMProperty) As Boolean

        var sqlstmt = null;
        var rs = null;
        var fecha = null;
        var precio = null;

        sqlstmt = "sp_productoGetProveedores "+ m_id;

        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadProveedor", C_MODULE)) { return false; }

        var w_grid = propiedad.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIK_PRPROV_ID);

        var elem = w_columns.add(null);
        //'Proveedor
        elem.setName(Cairo.Language.getText(1151, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVEEDOR);
        elem.setWidth(2500);
        elem.setKey(KIK_PROV_ID);

        var elem = w_columns.add(null);
        //'Fabricante
        elem.setName(Cairo.Language.getText(1356, ""));
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
        //'Cód. Barra
        elem.setName(Cairo.Language.getText(1306, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIK_PROV_CODBARRA);

        var elem = w_columns.add(null);
        //'País
        elem.setName(Cairo.Language.getText(1212, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PAIS);
        elem.setWidth(2000);
        elem.setKey(KIK_PA_ID);

        var elem = w_columns.add(null);
        //'Lista de Precios
        elem.setName(Cairo.Language.getText(2273, ""));
        elem.setWidth(2000);
        elem.setKey(KIK_PROV_LPI_ID);

        var elem = w_columns.add(null);
        //'Precio
        elem.setName(Cairo.Language.getText(1586, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat("0.000");
        elem.setWidth(2000);
        elem.setKey(KIK_PROV_PRECIO);

        var elem = w_columns.add(null);
        elem.setKey(KIK_PROV_PRECIO2);
        elem.setVisible(false);

        var elem = w_columns.add(null);
        //'Fecha
        elem.setName(Cairo.Language.getText(1569, ""));
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

        while (!rs.isEOF()) {

          var property = w_rows.getProperties().LinkedMap.get(null);

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PR_PROV_ID);
          w___TYPE_NOT_FOUND.Key = KIK_PRPROV_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PROV_NAME);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PROV_ID);
          w___TYPE_NOT_FOUND.Key = KIK_PROV_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PR_PROV_FABRICANTE);
          w___TYPE_NOT_FOUND.Key = KIK_PROV_FABRICANTE;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PR_PROV_NAME);
          w___TYPE_NOT_FOUND.Key = KIK_PROV_NOMBRE;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PR_PROV_CODE);
          w___TYPE_NOT_FOUND.Key = KIK_PROV_CODIGO;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PR_PROV_CODIGO_BARRA);
          w___TYPE_NOT_FOUND.Key = KIK_PROV_CODBARRA;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PA_NAME);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PA_ID);
          w___TYPE_NOT_FOUND.Key = KIK_PA_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.LP_NAME);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.LPI_ID);
          w___TYPE_NOT_FOUND.Key = KIK_PROV_LPI_ID;

          precio = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.LPI_PRECIO);

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          if(precio != 0) {
            w___TYPE_NOT_FOUND.Value = precio;
          }
          w___TYPE_NOT_FOUND.Key = KIK_PROV_PRECIO;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          if(precio != 0) {
            w___TYPE_NOT_FOUND.Value = precio;
          }
          w___TYPE_NOT_FOUND.Key = KIK_PROV_PRECIO2;

          fecha = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.LPI_FECHA);

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          if(fecha != Cairo.Constants.cSNODATE) {
            w___TYPE_NOT_FOUND.Value = fecha;
          }
          w___TYPE_NOT_FOUND.Key = KIK_PROV_PRECIO_FECHA;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), "lpi_top");
          w___TYPE_NOT_FOUND.Key = KIK_PROV_PRECIO_DEFAULT;

          rs.MoveNext;

        }

        return true;
      };

      var pLoadCliente = function(propiedad) { // TODO: Use of ByRef founded Private Function pLoadCliente(ByRef Propiedad As cIABMProperty) As Boolean

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_productoGetClientes "+ m_id;

        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadCliente", C_MODULE)) { return false; }

        var w_grid = propiedad.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIK_PRCLI_ID);

        var elem = w_columns.add(null);
        //'Cliente
        elem.setName(Cairo.Language.getText(1150, ""));
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
        //'Cód. Barra
        elem.setName(Cairo.Language.getText(1306, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIK_CLI_CODBARRA);

        var w_rows = w_grid.getRows();

        w_rows.clear();

        while (!rs.isEOF()) {

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null, rs(Cairo.General.Constants.PR_CLI_ID).Value)
          var w___TYPE_NOT_FOUND = w_rows.getProperties().item(null, rs(Cairo.General.Constants.PR_CLI_ID).Value);

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = rs(Cairo.General.Constants.PR_CLI_ID).Value;
          w___TYPE_NOT_FOUND.Key = KIK_PRCLI_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.CLI_NAME);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.CLI_ID);
          w___TYPE_NOT_FOUND.Key = KIK_CLI_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PR_CLI_NAME);
          w___TYPE_NOT_FOUND.Key = KIK_CLI_NOMBRE;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PR_CLI_CODE);
          w___TYPE_NOT_FOUND.Key = KIK_CLI_CODIGO;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PR_CLI_CODIGO_BARRA);
          w___TYPE_NOT_FOUND.Key = KIK_CLI_CODBARRA;

          rs.MoveNext;

        }

        return true;
      };

      var pLoadCMI = function(propiedad) { // TODO: Use of ByRef founded Private Function pLoadCMI(ByRef Propiedad As cIABMProperty) As Boolean

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_ProductoGetCMI "+ m_id;

        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadBOM", C_MODULE)) { return false; }

        var w_grid = propiedad.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setKey(KICMI_ID);
        elem.setVisible(false);

        var elem = w_columns.add(null);
        //'Comunidad
        elem.setName(Cairo.Language.getText(5017, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSCOMUNIDAD_INTERNET);
        elem.setWidth(2500);
        elem.setKey(KICMI_CMI_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2000);
        elem.setKey(KICMI_CODIGO);

        var elem = w_columns.add(null);
        //'Precio
        elem.setName(Cairo.Language.getText(1586, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat("0.00");
        elem.setWidth(2000);
        elem.setKey(KICMI_PRECIO);

        var elem = w_columns.add(null);
        //'Publicado el
        elem.setName(Cairo.Language.getText(5026, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(2000);
        elem.setKey(KICMI_FECHAALTA);

        var elem = w_columns.add(null);
        //'Vence el
        elem.setName(Cairo.Language.getText(5027, ""));
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

        while (!rs.isEOF()) {

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null, rs(Cairo.General.Constants.PRCMI_ID).Value)
          var w___TYPE_NOT_FOUND = w_rows.getProperties().item(null, rs(Cairo.General.Constants.PRCMI_ID).Value);

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = rs(Cairo.General.Constants.PRCMI_ID).Value;
          w___TYPE_NOT_FOUND.Key = KICMI_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.CMI_NAME);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.CMI_ID);
          w___TYPE_NOT_FOUND.Key = KICMI_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRCMI_CODE);
          w___TYPE_NOT_FOUND.Key = KICMI_CODIGO;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRCMI_PRECIO);
          w___TYPE_NOT_FOUND.Key = KICMI_PRECIO;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRCMI_FECHA_ALTA);
          w___TYPE_NOT_FOUND.Key = KICMI_FECHAALTA;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRCMI_FECHA_VTO);
          w___TYPE_NOT_FOUND.Key = KICMI_FECHAVTO;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRCMI_DESCRIP);
          w___TYPE_NOT_FOUND.Key = KICMI_DESCRIP;

          rs.MoveNext;
        }

        return true;
      };

      var pLoadLeyendas = function(propiedad) { // TODO: Use of ByRef founded Private Function pLoadLeyendas(ByRef Propiedad As cIABMProperty) As Boolean

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_ProductoGetLeyendas "+ m_id;

        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "sp_ProductoGetLeyendas", C_MODULE)) { return false; }

        var w_grid = propiedad.getGrid();

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
        //'Texto
        elem.setName(Cairo.Language.getText(5003, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(2000);
        elem.setKey(KIPRL_TEXTO);

        var elem = w_columns.add(null);
        //'Tag
        elem.setName(Cairo.Language.getText(5036, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2000);
        elem.setKey(KIPRL_TAG);

        var elem = w_columns.add(null);
        //'Orden
        elem.setName(Cairo.Language.getText(5016, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2000);
        elem.setKey(KIPRL_ORDEN);

        var w_rows = w_grid.getRows();

        w_rows.clear();

        while (!rs.isEOF()) {

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null, rs(Cairo.General.Constants.PRL_ID).Value)
          var w___TYPE_NOT_FOUND = w_rows.getProperties().item(null, rs(Cairo.General.Constants.PRL_ID).Value);

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = rs(Cairo.General.Constants.PRL_ID).Value;
          w___TYPE_NOT_FOUND.Key = KICMI_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRL_NAME);
          w___TYPE_NOT_FOUND.Key = KIPRL_NOMBRE;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRL_TEXTO);
          w___TYPE_NOT_FOUND.Key = KIPRL_TEXTO;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRL_TAG);
          w___TYPE_NOT_FOUND.Key = KIPRL_TAG;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRL_ORDEN);
          w___TYPE_NOT_FOUND.Key = KIPRL_ORDEN;

          rs.MoveNext;
        }

        return true;
      };

      var pLoadBOM = function(propiedad) { // TODO: Use of ByRef founded Private Function pLoadBOM(ByRef Propiedad As cIABMProperty) As Boolean

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_ProductoGetBOMs "+ m_id;

        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadBOM", C_MODULE)) { return false; }

        var w_grid = propiedad.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        //'B.O.M.
        elem.setName(Cairo.Language.getText(1304, ""));
        elem.setWidth(2500);
        elem.setKey(KIK_PBM_ID);

        var w_rows = w_grid.getRows();

        w_rows.clear();

        while (!rs.isEOF()) {

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null, rs(Cairo.General.Constants.PBM_ID).Value)
          var w___TYPE_NOT_FOUND = w_rows.getProperties().item(null, rs(Cairo.General.Constants.PBM_ID).Value);

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PBM_NAME);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PBM_ID);
          w___TYPE_NOT_FOUND.Key = KIK_PBM_ID;

          rs.MoveNext;
        }

        return true;
      };

      var pLoadTags = function(propiedad) { // TODO: Use of ByRef founded Private Function pLoadTags(ByRef Propiedad As cIABMProperty) As Boolean

        var oCol = null;
        var iCol = null;

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_ProductoGetTag "+ m_id;

        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadTags", C_MODULE)) { return false; }

        var w_grid = propiedad.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIT_PRT_ID);

        iCol = w_columns.add(null);
        oCol = iCol;
        //' Producto
        iCol.setName(Cairo.Language.getText(1619, ""));
        iCol.setType(Dialogs.PropertyType.select);
        iCol.setTable(Cairo.Tables.PRODUCTO);
        iCol.setWidth(1000);
        iCol.setKey(KIT_PR_ID_TAG);
        if(m_userCfg.getMultiSelect()) {
          oCol.setHelpType(csHelpType.cSMULTISELECT);
        }
        iCol = null;
        oCol = null;

        var elem = w_columns.add(null);
        //' Orden
        elem.setName(Cairo.Language.getText(5016, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //' Texto
        elem.setName(Cairo.Language.getText(3968, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIT_TEXTO);

        var elem = w_columns.add(null);
        //' Expo Web
        elem.setName(Cairo.Language.getText(3897, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIT_EXPOWEB);
        elem.setFormat("0");
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(50);

        var elem = w_columns.add(null);
        //' Expo Cairo
        elem.setName(Cairo.Language.getText(3898, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIT_EXPOCAIRO);
        elem.setFormat("0");
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(50);

        var w_rows = w_grid.getRows();

        w_rows.clear();

        while (!rs.isEOF()) {

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null, rs(Cairo.General.Constants.PRT_ID).Value)
          var w___TYPE_NOT_FOUND = w_rows.getProperties().item(null, rs(Cairo.General.Constants.PRT_ID).Value);

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = rs(Cairo.General.Constants.PRT_ID).Value;
          w___TYPE_NOT_FOUND.Key = KIT_PRT_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PR_NOMBRECOMPRA);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PR_ID_TAG);
          w___TYPE_NOT_FOUND.Key = KIT_PR_ID_TAG;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), "orden");

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRT_TEXTO);
          w___TYPE_NOT_FOUND.Key = KIT_TEXTO;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRT_EXPO_WEB);
          w___TYPE_NOT_FOUND.Key = KIT_EXPOWEB;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRT_EXPO_CAIRO);
          w___TYPE_NOT_FOUND.Key = KIT_EXPOCAIRO;

          rs.MoveNext;

        }

        return true;
      };

      var pLoadCategoriasWeb = function(propiedad) { // TODO: Use of ByRef founded Private Function pLoadCategoriasWeb(ByRef Propiedad As cIABMProperty) As Boolean

        var oCol = null;
        var iCol = null;

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_ProductoGetCatalogoCategoriasWeb "+ m_id;

        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadCategoriasWeb", C_MODULE)) { return false; }

        var w_grid = propiedad.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KICWCI_ID);

        var elem = w_columns.add(null);
        //' Categoria de Catalogo Web
        elem.setName(Cairo.Language.getText(4597, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(4000);
        elem.setKey(KICWC_ID);

        var elem = w_columns.add(null);
        elem.setName("");
        elem.setType(Dialogs.PropertyType.check);
        elem.setWidth(600);
        elem.setKey(KICWC_SELECT);

        var elem = w_columns.add(null);
        //'Posición
        elem.setName(Cairo.Language.getText(3268, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        elem.setKey(KICWCI_POSICION);

        var w_rows = w_grid.getRows();

        w_rows.clear();

        while (!rs.isEOF()) {

          var property = w_rows.getProperties().LinkedMap.get(null);

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.CATWCI_ID);
          w___TYPE_NOT_FOUND.Key = KICWCI_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.CATWC_NAME);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.CATWC_ID);
          w___TYPE_NOT_FOUND.Key = KICWC_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.CATWCI_ID);
          w___TYPE_NOT_FOUND.Key = KICWC_SELECT;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.CATWCI_POSICION);
          w___TYPE_NOT_FOUND.Key = KICWCI_POSICION;

          rs.MoveNext;

        }

        return true;
      };

      var pLoadCatalogosWeb = function(propiedad) { // TODO: Use of ByRef founded Private Function pLoadCatalogosWeb(ByRef Propiedad As cIABMProperty) As Boolean

        var oCol = null;
        var iCol = null;

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_ProductoGetCatalogosWeb "+ m_id;

        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadCatalogosWeb", C_MODULE)) { return false; }

        var w_grid = propiedad.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KICWI_ID);

        var elem = w_columns.add(null);
        //' Catalogo Web
        elem.setName(Cairo.Language.getText(4598, ""));
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

        while (!rs.isEOF()) {

          var property = w_rows.getProperties().LinkedMap.get(null);

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.CATWI_ID);
          w___TYPE_NOT_FOUND.Key = KICWI_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.CATW_NAME);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.CATW_ID);
          w___TYPE_NOT_FOUND.Key = KICW_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = property.Add(null);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.CATWI_ID);
          w___TYPE_NOT_FOUND.Key = KICW_SELECT;

          rs.MoveNext;

        }

        return true;
      };

      var pLoadWebImages = function(propiedad) { // TODO: Use of ByRef founded Private Function pLoadWebImages(ByRef Propiedad As cIABMProperty) As Boolean

        var oCol = null;
        var iCol = null;

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "select * from ProductoWebImage where pr_id = "+ m_id;

        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadWebImages", C_MODULE)) { return false; }

        var w_grid = propiedad.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIWI_PRWI_ID);

        var elem = w_columns.add(null);
        //' Imagen
        elem.setName(Cairo.Language.getText(4573, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2000);
        elem.setKey(KIWI_IMAGE);

        var elem = w_columns.add(null);
        //' Tipo
        elem.setName(Cairo.Language.getText(1223, ""));
        elem.setType(Dialogs.PropertyType.list);
        elem.setWidth(3000);
        elem.setKey(KIWI_IMAGE_TYPE);

        var w_list = elem.getList();

        var elem = w_list.add(null);
        elem.Id = csE_ProductoWebImageType.cSE_PRWEBIMAGETHUMBNAIL;
        //' Pequeña Principal
        elem.Value = Cairo.Language.getText(4572, "");

        var elem = w_list.add(null);
        elem.Id = csE_ProductoWebImageType.cSE_PRWEBIMAGEMEDIUM;
        //' Pequeña
        elem.Value = Cairo.Language.getText(4571, "");

        var elem = w_list.add(null);
        elem.Id = csE_ProductoWebImageType.cSE_PRWEBIMAGEBIG;
        //' Grande
        elem.Value = Cairo.Language.getText(4570, "");

        var elem = w_columns.add(null);
        //' Texto Alternativo
        elem.setName(Cairo.Language.getText(4569, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(3000);
        elem.setKey(KIWI_ALT);

        var elem = w_columns.add(null);
        //' Posición
        elem.setName(Cairo.Language.getText(3268, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        elem.setWidth(800);
        elem.setKey(KIWI_POSICION);

        var w_rows = w_grid.getRows();

        w_rows.clear();

        while (!rs.isEOF()) {

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null, rs(Cairo.General.Constants.PRWI_ID).Value)
          var w___TYPE_NOT_FOUND = w_rows.getProperties().item(null, rs(Cairo.General.Constants.PRWI_ID).Value);

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = rs(Cairo.General.Constants.PRWI_ID).Value;
          w___TYPE_NOT_FOUND.Key = KIWI_PRWI_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRWI_ARCHIVO);
          w___TYPE_NOT_FOUND.Key = KIWI_IMAGE;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRWI_TIPO);
          w___TYPE_NOT_FOUND.Key = KIWI_IMAGE_TYPE;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRWI_ALT);
          w___TYPE_NOT_FOUND.Key = KIWI_ALT;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRWI_POSICION);
          w___TYPE_NOT_FOUND.Key = KIWI_POSICION;

          rs.MoveNext;

        }

        return true;
      };

      var pLoadKit = function(propiedad) { // TODO: Use of ByRef founded Private Function pLoadKit(ByRef Propiedad As cIABMProperty) As Boolean

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_ProductoGetKits "+ m_id;

        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadBOM", C_MODULE)) { return false; }

        var w_grid = propiedad.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        //'Fórmula
        elem.setName(Cairo.Language.getText(1354, ""));
        elem.setWidth(2500);
        elem.setKey(KIK_PRFK_ID);

        var elem = w_columns.add(null);
        //'x Defecto
        elem.setName(Cairo.Language.getText(1355, ""));
        elem.setWidth(2500);
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KIK_PRFK_DEFAULT);

        var w_rows = w_grid.getRows();

        w_rows.clear();

        while (!rs.isEOF()) {

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null, rs(Cairo.General.Constants.PRFK_ID).Value)
          var w___TYPE_NOT_FOUND = w_rows.getProperties().item(null, rs(Cairo.General.Constants.PRFK_ID).Value);

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRFK_NAME);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRFK_ID);
          w___TYPE_NOT_FOUND.Key = KIK_PRFK_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(rs.getFields(), Cairo.General.Constants.PRFK_DEFAULT);
          w___TYPE_NOT_FOUND.Key = KIK_PRFK_ID;

          rs.MoveNext;
        }

        return true;
      };

      var pSetKitEnabled = function() {
        var bEnabled = null;
        var iProp = null;

        var properties = m_dialog.getProperties();

        bEnabled = Cairo.Util.val(properties.item(Cairo.General.Constants.PR_ESKIT).getValue());

        if(bEnabled) {
          bEnabled = properties.item(Cairo.General.Constants.PR_KIT_RESUMIDO).getValue();
        }

        iProp = properties.item(Cairo.General.Constants.PR_KIT_IDENTIDAD);
        iProp.setEnabled(bEnabled);
        m_dialog.showValue(iProp);

        pSetKitSerieEnabled(bEnabled);

      };

      var pSetKitSerieEnabled = function(bEnabled) {
        var iProp = null;
        var bEnabledTa = null;

        var properties = m_dialog.getProperties();

        if(bEnabled) {

          if(Cairo.Util.val(properties.item(Cairo.General.Constants.PR_KIT_IDENTIDAD).getValue())) {

            iProp = properties.item(Cairo.General.Constants.PR_KIT_IDENTIDAD_XITEM);
            iProp.setEnabled(true);
            m_dialog.showValue(iProp);

            bEnabledTa = Cairo.Util.val(iProp.getValue()) == 0;

            iProp = properties.item(Cairo.General.Constants.TA_ID_KIT_SERIE);
            iProp.setEnabled(bEnabledTa);
            m_dialog.showValue(iProp);

            iProp = properties.item(Cairo.General.Constants.PR_KIT_LOTE);
            iProp.setEnabled(bEnabled);
            m_dialog.showValue(iProp);

          }
          else {

            iProp = properties.item(Cairo.General.Constants.PR_KIT_IDENTIDAD_XITEM);
            iProp.setEnabled(false);
            m_dialog.showValue(iProp);

            iProp = properties.item(Cairo.General.Constants.TA_ID_KIT_SERIE);
            iProp.setEnabled(false);
            m_dialog.showValue(iProp);

            iProp = properties.item(Cairo.General.Constants.PR_KIT_LOTE);
            iProp.setEnabled(false);
            m_dialog.showValue(iProp);

          }

        }
        else {

          iProp = properties.item(Cairo.General.Constants.PR_KIT_IDENTIDAD_XITEM);
          iProp.setEnabled(bEnabled);
          m_dialog.showValue(iProp);

          iProp = properties.item(Cairo.General.Constants.PR_KIT_LOTE_XITEM);
          iProp.setEnabled(bEnabled);
          m_dialog.showValue(iProp);

          iProp = properties.item(Cairo.General.Constants.PR_KIT_LOTE);
          iProp.setEnabled(bEnabled);
          m_dialog.showValue(iProp);

        }

        pSetKitLoteEnabled(bEnabled);

      };

      var pSetKitLoteEnabled = function(bEnabled) {
        var iProp = null;

        var properties = m_dialog.getProperties();

        // En esta version y de acuerdo a la documentacion
        // vamos a soportar lote solo en aquellos kits que
        // tienen identidad.
        //
        // En el futuro agregaremos soporte a los kits
        // para que incluyan lote sin tener identidad
        //
        if(bEnabled) {

          bEnabled = Cairo.Util.val(properties.item(Cairo.General.Constants.PR_KIT_IDENTIDAD).getValue());

        }

        if(bEnabled) {

          if(Cairo.Util.val(properties.item(Cairo.General.Constants.PR_KIT_LOTE).getValue())) {

            iProp = properties.item(Cairo.General.Constants.PR_KIT_LOTE_XITEM);
            iProp.setEnabled(true);
            m_dialog.showValue(iProp);

            bEnabled = Cairo.Util.val(iProp.getValue()) == 0;

            iProp = properties.item(Cairo.General.Constants.TA_ID_KIT_LOTE);
            iProp.setEnabled(bEnabled);
            m_dialog.showValue(iProp);

          }
          else {

            iProp = properties.item(Cairo.General.Constants.PR_KIT_LOTE_XITEM);
            iProp.setEnabled(false);
            m_dialog.showValue(iProp);

            iProp = properties.item(Cairo.General.Constants.TA_ID_KIT_LOTE);
            iProp.setEnabled(false);
            m_dialog.showValue(iProp);

          }

        }
        else {

          iProp = properties.item(Cairo.General.Constants.TA_ID_KIT_SERIE);
          iProp.setEnabled(bEnabled);
          m_dialog.showValue(iProp);

          iProp = properties.item(Cairo.General.Constants.TA_ID_KIT_LOTE);
          iProp.setEnabled(bEnabled);
          m_dialog.showValue(iProp);
        }

      };

      var pSetKitConfig = function(bEsKit,  bKitStockXItem,  bKitResumido,  bKitIdentidad,  bKitIdentidadXItem,  taIdKitSerie,  bKitLote,  bKitLoteXItem,  taIdKitLote) { // TODO: Use of ByRef founded Private Sub pSetKitConfig(ByVal bEsKit As Boolean, ByRef bKitStockXItem As Boolean, ByRef bKitResumido As Boolean, ByRef bKitIdentidad As Boolean, ByRef bKitIdentidadXItem As Boolean, ByRef TaIdKitSerie As Long, ByRef bKitLote As Boolean, ByRef bKitLoteXItem As Boolean, ByRef TaIdKitLote As Long)
        if(bEsKit) {

          if(bKitResumido) {

            if(bKitIdentidad) {

              if(bKitIdentidadXItem) {
                taIdKitSerie = Cairo.Constants.NO_ID;
              }

              if(bKitLote) {
                if(bKitLoteXItem) {
                  taIdKitLote = Cairo.Constants.NO_ID;
                }

              }
              else {
                bKitLoteXItem = false;
                taIdKitLote = Cairo.Constants.NO_ID;
              }
            }
            else {
              bKitIdentidadXItem = false;
              bKitLote = false;
              bKitLoteXItem = false;
              taIdKitSerie = Cairo.Constants.NO_ID;
              taIdKitLote = Cairo.Constants.NO_ID;
            }
          }
          else {
            bKitIdentidad = false;
            bKitIdentidadXItem = false;
            bKitLote = false;
            bKitLoteXItem = false;
            taIdKitSerie = Cairo.Constants.NO_ID;
            taIdKitLote = Cairo.Constants.NO_ID;
          }

        }
        else {

          bKitStockXItem = false;
          bKitResumido = false;
          bKitIdentidad = false;
          bKitIdentidadXItem = false;
          bKitLote = false;
          bKitLoteXItem = false;
          taIdKitSerie = Cairo.Constants.NO_ID;
          taIdKitLote = Cairo.Constants.NO_ID;
        }

      };

      var pCreateFromRubro = function() {

        if(pGetRubId() == Cairo.Constants.NO_ID) { return false; }

        if(!cWindow.ask(Cairo.Language.getText(2539, ""), vbYes)) {
          return null;
        }

        var nombre = null;

        nombre = pGetRubro().getValue()+ (Cairo.String.rtrim(" "+ pGetMarca().getValue())).toString();

        var properties = m_dialog.getProperties();

        if(!properties.item(Cairo.General.Constants.RUBTIID1) == null) {
          if(pGetRubro().getValue().toLowerCase() != properties.item(Cairo.General.Constants.RUBTIID1).getValue().toLowerCase()) {
            nombre = nombre+ (Cairo.String.rtrim(" "+ properties.item(Cairo.General.Constants.RUBTIID1).getValue())).toString();
          }
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID2) == null) {
          nombre = nombre+ (Cairo.String.rtrim(" "+ properties.item(Cairo.General.Constants.RUBTIID2).getValue())).toString();
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID3) == null) {
          nombre = nombre+ (Cairo.String.rtrim(" "+ properties.item(Cairo.General.Constants.RUBTIID3).getValue())).toString();
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID4) == null) {
          nombre = nombre+ (Cairo.String.rtrim(" "+ properties.item(Cairo.General.Constants.RUBTIID4).getValue())).toString();
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID5) == null) {
          nombre = nombre+ (Cairo.String.rtrim(" "+ properties.item(Cairo.General.Constants.RUBTIID5).getValue())).toString();
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID6) == null) {
          nombre = nombre+ (Cairo.String.rtrim(" "+ properties.item(Cairo.General.Constants.RUBTIID6).getValue())).toString();
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID7) == null) {
          nombre = nombre+ (Cairo.String.rtrim(" "+ properties.item(Cairo.General.Constants.RUBTIID7).getValue())).toString();
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID8) == null) {
          nombre = nombre+ (Cairo.String.rtrim(" "+ properties.item(Cairo.General.Constants.RUBTIID8).getValue())).toString();
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID9) == null) {
          nombre = nombre+ (Cairo.String.rtrim(" "+ properties.item(Cairo.General.Constants.RUBTIID9).getValue())).toString();
        }
        if(!properties.item(Cairo.General.Constants.RUBTIID10) == null) {
          nombre = nombre+ (Cairo.String.rtrim(" "+ properties.item(Cairo.General.Constants.RUBTIID10).getValue())).toString();
        }

        properties.item(Cairo.General.Constants.PR_NOMBRECOMPRA).setValue(nombre);
        m_dialog.showValue(properties.item(Cairo.General.Constants.PR_NOMBRECOMPRA));

        if(LenB(properties.item(Cairo.General.Constants.PR_NOMBREVENTA).getValue()) == 0) {
          properties.item(Cairo.General.Constants.PR_NOMBREVENTA).setValue(nombre);
          m_dialog.showValue(properties.item(Cairo.General.Constants.PR_NOMBREVENTA));
        }

        return true;
      };

      var pGetRubId = function() {
        return pGetRubro().getSelectId();
      };

      var pGetRubro = function() {
        return m_dialog.getProperties().item(Cairo.General.Constants.RUB_ID);
      };

      var pGetMarca = function() {
        return m_dialog.getProperties().item(Cairo.General.Constants.MARC_ID);
      };

      var pGetTags = function() {
        return m_dialog.getProperties().item(C_TAGS);
      };

      var pSaveNombres = function(pr_id) {
        var sqlstmt = null;
        sqlstmt = "sp_ProductoSaveNombres "+ Cairo.Database.getUserId().toString()+ ","+ pr_id.toString();
        return Cairo.Database.execute(sqlstmt);
      };

      var pEditLP = function(lpi_id) {
        try {

          var lp_id = null;

          if(!Cairo.Database.getData(Cairo.General.Constants.LISTAPRECIOITEM, Cairo.General.Constants.LPI_ID, lpi_id, Cairo.General.Constants.LP_ID, lp_id)) { return; }

          var obj = null;
          obj = CSKernelClient2.cUtil.createObject("CSArticulo.cListaPrecio");
          obj.setObjABM(new cABMGeneric());

          obj.edit(lp_id);

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pEditLP", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      //-------------------------------------------
      // Si la fila tiene datos en alguna columna
      // es del usuario
      // Sino es del sistema y no se guarda
      //
      var pIsRowProveedorFromUser = function(row) { // TODO: Use of ByRef founded Private Function pIsRowProveedorFromUser(ByRef row As cIABMGridRow) As Boolean
        var _rtn = null;

        _rtn = true;

        if(Cairo.Util.val(Dialogs.cell(row, KIK_PRPROV_ID).getValue()) >= 0) { return _rtn; }
        if(LenB(Dialogs.cell(row, KIK_PROV_FABRICANTE).getValue())) { return _rtn; }
        if(LenB(Dialogs.cell(row, KIK_PROV_NOMBRE).getValue())) { return _rtn; }
        if(LenB(Dialogs.cell(row, KIK_PROV_CODIGO).getValue())) { return _rtn; }
        if(LenB(Dialogs.cell(row, KIK_PROV_CODBARRA).getValue())) { return _rtn; }
        if(Dialogs.cell(row, KIK_PA_ID).getID()) { return _rtn; }

        _rtn = false;


        return _rtn;
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
          Cairo.LoadingMessage.show("Productos", "Loading producto from Crowsoft Cairo server.");

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