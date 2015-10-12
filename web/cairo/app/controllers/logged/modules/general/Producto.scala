package controllers.logged.modules.general

import controllers._
import formatters.json.DateFormatter
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.general._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.DBHelper
import formatters.json.DateFormatter._


case class ProductoBaseData(
                             codigoExterno: String,
                             codigoBarra: String,
                             codigoBarraName: String,
                             ibcId: Int,
                             marcId: Int,
                             expoCairo: Int,
                             esPlantilla: Boolean,
                             curId: Int
                             )

case class ProductoCompraData(
                            seCompra: Boolean,
                            nombreCompra: String,
                            descripCompra: String,
                            unIdCompra: Int,
                            cuegIdCompra: Int,
                            tiIdRiCompra: Int,
                            tiIdInternosCompra: Int,
                            porcInternoC: Double,
                            ccosIdCompra: Int
                          )

case class ProductoStockData(
                            llevaStock: Boolean,
                            unIdStock: Int,
                            stockCompra: Double,
                            x: Int,
                            y: Int,
                            z: Int,
                            stockMinimo: Double,
                            reposicion: Double,
                            stockMaximo: Double,
                            llevaNroSerie: Boolean,
                            llevaNroLote: Boolean,
                            loteFifo: Boolean,
                            seProduce: Boolean,
                            esRepuesto: Boolean
                          )

case class ProductoVentaData(
                            seVende: Boolean,
                            nombreVenta: String,
                            nombreFactura: String,
                            descripVenta: String,
                            unIdVenta: Int,
                            ventaCompra: Double,
                            ventaStock: Double,
                            cuegIdVenta: Int,
                            esLista: Boolean,
                            dinerario: Boolean,
                            noRedondeo: Boolean,
                            tiIdRiVenta: Int,
                            tiIdInternosVenta: Int,
                            porcInternoV: Double,
                            ccosIdVenta: Int
                          )

case class ProductoRubroData(
                            rubId: Int,
                            rubtiId1: Option[Int],
                            rubtiId2: Option[Int],
                            rubtiId3: Option[Int],
                            rubtiId4: Option[Int],
                            rubtiId5: Option[Int],
                            rubtiId6: Option[Int],
                            rubtiId7: Option[Int],
                            rubtiId8: Option[Int],
                            rubtiId9: Option[Int],
                            rubtiId10: Option[Int]
                          )

case class ProductoComexData(
                            unIdPeso: Int,
                            pesoNeto: Double,
                            pesoTotal: Double,
                            cantXCajaExpo: Int,
                            emblId: Int,
                            fleteExpo: Boolean,
                            egpId: Int,
                            efmId: Int,
                            poarId: Int,
                            tiIdComexGanancias: Int,
                            tiIdComexIgb: Int,
                            tiIdComexIva: Int
                          )

case class ProductoKitData(
                            esKit: Boolean,
                            kitStockXItem: Boolean,
                            kitResumido: Boolean,
                            kitIdentidad: Boolean,
                            kitIdentidadXItem: Boolean,
                            taIdKitSerie: Int,
                            kitLote: Boolean,
                            kitLoteXItem: Boolean,
                            taIdKitLote: Int
                         )

case class ProductoWebData(
                            nombreWeb: String,
                            aliasWeb: String,
                            prIdWebPadre: Int,
                            activoWeb: Boolean,
                            webImageUpdate: Boolean,
                            codigoHtml: String,
                            codigoHtmlDetalle: String,
                            expoWeb: Int,
                            ventaWebMaxima: Double,
                            leyId: Int,
                            webImageFolder: String
                         )

case class ProductoNombresData(
                            rptIdNombreCompra: Int,
                            rptIdNombreVenta: Int,
                            rptIdNombreFactura: Int,
                            rptIdNombreWeb: Int,
                            rptIdNombreImg: Int,
                            rptIdNombreImgAlt: Int
                          )

case class ProductoProveedorData(
                              id: Int,
                              provId: Int,
                              maker: Boolean,
                              name: String,
                              code: String,
                              barCode: String,
                              paId: Int,
                              lpId: Int,
                              price: Double,
                              priceDate: String,
                              priceDefault: Boolean
                              )

case class ProductoClienteData(
                            id: Int,
                            cliId: Int,
                            code: String,
                            barCode: String
                            )

case class ProductoCMIData(
                        id: Int,
                        code: String,
                        descrip: String,
                        createdAt: String,
                        expireDate: String,
                        price: Double
                        )

case class ProductoLeyendaData(
                            id: Int,
                            name: String,
                            text: String,
                            tag: String,
                            order: String
                            )

case class ProductoTagData(
                        id: Int,
                        text: String,
                        prIdTag: Int,
                        order: Int,
                        expoWeb: Int,
                        expoCairo: Int
                        )

case class ProductoCategoriaWebData(
                                 catwcId: Int,
                                 position: Int
                                 )

case class ProductoCatalogoWebData(
                                catwId: Int
                                )

case class ProductoWebImageData(
                             id: Int,
                             file: String,
                             imageType: Int,
                             alt: String,
                             position: Int
                             )

case class ProductoItemsData(
                             proveedores: List[ProductoProveedorData],
                             clientes: List[ProductoClienteData],
                             CMIs: List[ProductoCMIData],
                             leyendas: List[ProductoLeyendaData],
                             tags: List[ProductoTagData],
                             categoriasWeb: List[ProductoCategoriaWebData],
                             catalogosWeb: List[ProductoCatalogoWebData],
                             webImages: List[ProductoWebImageData],

                             /* only used in save */
                             proveedorDeleted: String,
                             clienteDeleted: String,
                             cmiDeleted: String,
                             leyendaDeleted: String,
                             tagDeleted: String,
                             webImageDeleted: String
                              )

case class ProductoData(
                         id: Option[Int],
                         active: Boolean,
                         code: String,

                         base: ProductoBaseData,

                         compra: ProductoCompraData,
                         stock: ProductoStockData,
                         venta: ProductoVentaData,

                         rubro: ProductoRubroData,

                         comex: ProductoComexData,
                         kit: ProductoKitData,
                         web: ProductoWebData,
                         names: ProductoNombresData,

                         /* only used in save */
                         items: ProductoItemsData
                         )

object Productos extends Controller with ProvidesUser {

  val productoBaseFields = List(C.PR_CODIGO_EXTERNO, C.PR_CODIGO_BARRA, C.PR_CODIGO_BARRA_NAME, C.IBC_ID, C.MARC_ID,
    C.PR_EXPO_CAIRO, C.PR_ES_PLANTILLA, C.CUR_ID)

  val productoCompraFields = List(C.PR_SE_COMPRA, C.PR_NAME_COMPRA, C.PR_DESCRIP_COMPRA, C.UN_ID_COMPRA,
    C.CUEG_ID_COMPRA, C.TI_ID_RI_COMPRA, C.TI_ID_INTERNOS_COMPRA, C.PR_PORC_INTERNO_C, C.CCOS_ID_COMPRA)

  val productoStockFields = List(C.PR_LLEVA_STOCK, C.UN_ID_STOCK, C.PR_STOCK_COMPRA, C.PR_X, C.PR_Y, C.PR_Z,
    C.PR_STOCK_MINIMO, C.PR_REPOSICION, C.PR_STOCK_MAXIMO, C.PR_LLEVA_NRO_SERIE, C.PR_LLEVA_NRO_LOTE, C.PR_LOTE_FIFO,
    C.PR_SE_PRODUCE, C.PR_ES_REPUESTO)

  val productoVentaFields = List(C.PR_SE_VENDE, C.PR_NAME_VENTA, C.PR_NAME_FACTURA, C.PR_DESCRIP_VENTA, C.UN_ID_VENTA,
    C.PR_VENTA_COMPRA, C.PR_VENTA_STOCK, C.CUEG_ID_VENTA, C.PR_ES_LISTA, C.PR_DINERARIO, C.PR_NO_REDONDEO, C.TI_ID_RI_VENTA,
    C.TI_ID_INTERNOS_VENTA, C.PR_PORC_INTERNO_V, C.CCOS_ID_VENTA)

  val productoRubroFields = List(C.RUB_ID, C.RUBTI_ID_1, C.RUBTI_ID_2, C.RUBTI_ID_3, C.RUBTI_ID_4, C.RUBTI_ID_5,
    C.RUBTI_ID_6, C.RUBTI_ID_7, C.RUBTI_ID_8, C.RUBTI_ID_9, C.RUBTI_ID_10)

  val productoComexFields = List(C.UN_ID_PESO, C.PR_PESO_NETO, C.PR_PESO_TOTAL, C.PR_CANT_X_CAJA_EXPO, C.EMBL_ID,
    C.PR_FLETE_EXPO, C.EGP_ID, C.EFM_ID, C.POAR_ID, C.TI_ID_COMEX_GANANCIAS, C.TI_ID_COMEX_IGB, C.TI_ID_COMEX_IVA)

  val productoKitFields = List(C.PR_ES_KIT, C.PR_KIT_STOCK_X_ITEM, C.PR_KIT_RESUMIDO, C.PR_KIT_IDENTIDAD,
    C.PR_KIT_IDENTIDAD_X_ITEM, C.TA_ID_KIT_SERIE, C.PR_KIT_LOTE, C.PR_KIT_LOTE_X_ITEM, C.TA_ID_KIT_LOTE)

  val productoWebFields = List(C.PR_NAME_WEB, C.PR_ALIAS_WEB, C.PR_ID_WEB_PADRE, C.PR_ACTIVO_WEB, C.PR_WEB_IMAGE_UPDATE,
    C.PR_CODIGO_HTML, C.PR_CODIGO_HTML_DETALLE, C.PR_EXPO_WEB, C.PR_VENTA_WEB_MAXIMA, C.LEY_ID, C.PR_WEB_IMAGE_FOLDER)

  val productoNombresFields = List(C.RPT_ID_NOMBRE_COMPRA, C.RPT_ID_NOMBRE_VENTA, C.RPT_ID_NOMBRE_FACTURA,
    C.RPT_ID_NOMBRE_WEB, C.RPT_ID_NOMBRE_IMG, C.RPT_ID_NOMBRE_IMG_ALT)

  val productoProveedorFields = List(C.PRPROV_ID, C.PROV_ID, C.PRPROV_FABRICANTE, C.PRPROV_NAME, C.PRPROV_CODE, C.PRPROV_CODIGO_BARRA,
    C.LPI_PRECIO, C.LPI_FECHA, C.PRPROV_LPI_TOP)

  val productoClienteFields = List(C.PRCLI_ID, C.CLI_ID, C.PRCLI_CODE, C.PRCLI_CODIGO_BARRA)

  val productoCMIFields = List(C.PRCMI_ID, C.PRCMI_CODE, C.PRCMI_DESCRIP, C.PRCMI_FECHA_ALTA, C.PRCMI_FECHA_VTO, C.PRCMI_PRECIO)

  val productoLeyendaFields = List(C.PRL_ID, C.PRL_NAME, C.PRL_TEXTO, C.PRL_TAG, C.PRL_ORDEN)

  val productoTagFields = List(C.PRT_ID, C.PRT_TEXTO, C.PR_ID_TAG, C.PRT_ORDEN, C.PRT_EXPO_WEB, C.PRT_EXPO_CAIRO)

  val productoCategoriaWebFields = List(C.CATWCI_ID, C.CATWC_ID, C.CATWCI_POSICION)

  val productoCatalogoWebFields = List(C.CATWI_ID, C.CATW_ID)

  val productoWebImageFields = List(C.PRWI_ID, C.PRWI_ARCHIVO, C.PRWI_TIPO, C.PRWI_ALT, C.PRWI_POSICION)

  val productoForm = Form(
    mapping(
      "id" -> optional(number),
      DBHelper.ACTIVE -> boolean,
      C.PR_CODE -> text,
      C.PRODUCTO_BASE -> mapping(
        C.PR_CODIGO_EXTERNO -> text,
        C.PR_CODIGO_BARRA -> text,
        C.PR_CODIGO_BARRA_NAME -> text,
        C.IBC_ID -> number,
        C.MARC_ID -> number,
        C.PR_EXPO_CAIRO -> number,
        C.PR_ES_PLANTILLA -> boolean,
        C.CUR_ID -> number)(ProductoBaseData.apply)(ProductoBaseData.unapply),
      C.PRODUCTO_COMPRA -> mapping(
        C.PR_SE_COMPRA -> boolean,
        C.PR_NAME_COMPRA -> text,
        C.PR_DESCRIP_COMPRA -> text,
        C.UN_ID_COMPRA -> number,
        C.CUEG_ID_COMPRA -> number,
        C.TI_ID_RI_COMPRA -> number,
        C.TI_ID_INTERNOS_COMPRA -> number,
        C.PR_PORC_INTERNO_C -> of(Global.doubleFormat),
        C.CCOS_ID_COMPRA -> number)(ProductoCompraData.apply)(ProductoCompraData.unapply),
      C.PRODUCTO_STOCK -> mapping(
        C.PR_LLEVA_STOCK -> boolean,
        C.UN_ID_STOCK -> number,
        C.PR_STOCK_COMPRA -> of(Global.doubleFormat),
        C.PR_X -> number,
        C.PR_Y -> number,
        C.PR_Z -> number,
        C.PR_STOCK_MINIMO -> of(Global.doubleFormat),
        C.PR_REPOSICION -> of(Global.doubleFormat),
        C.PR_STOCK_MAXIMO -> of(Global.doubleFormat),
        C.PR_LLEVA_NRO_SERIE -> boolean,
        C.PR_LLEVA_NRO_LOTE -> boolean,
        C.PR_LOTE_FIFO -> boolean,
        C.PR_SE_PRODUCE -> boolean,
        C.PR_ES_REPUESTO -> boolean)(ProductoStockData.apply)(ProductoStockData.unapply),
      C.PRODUCTO_VENTA -> mapping(
        C.PR_SE_VENDE -> boolean,
        C.PR_NAME_VENTA -> text,
        C.PR_NAME_FACTURA -> text,
        C.PR_DESCRIP_VENTA -> text,
        C.UN_ID_VENTA -> number,
        C.PR_VENTA_COMPRA -> of(Global.doubleFormat),
        C.PR_VENTA_STOCK -> of(Global.doubleFormat),
        C.CUEG_ID_VENTA -> number,
        C.PR_ES_LISTA -> boolean,
        C.PR_DINERARIO -> boolean,
        C.PR_NO_REDONDEO -> boolean,
        C.TI_ID_RI_VENTA -> number,
        C.TI_ID_INTERNOS_VENTA -> number,
        C.PR_PORC_INTERNO_V -> of(Global.doubleFormat),
        C.CCOS_ID_VENTA -> number)(ProductoVentaData.apply)(ProductoVentaData.unapply),
      C.PRODUCTO_RUBRO -> mapping(
        C.RUB_ID -> number,
        C.RUBTI_ID_1 -> optional(number),
        C.RUBTI_ID_2 -> optional(number),
        C.RUBTI_ID_3 -> optional(number),
        C.RUBTI_ID_4 -> optional(number),
        C.RUBTI_ID_5 -> optional(number),
        C.RUBTI_ID_6 -> optional(number),
        C.RUBTI_ID_7 -> optional(number),
        C.RUBTI_ID_8 -> optional(number),
        C.RUBTI_ID_9 -> optional(number),
        C.RUBTI_ID_10 -> optional(number))(ProductoRubroData.apply)(ProductoRubroData.unapply),
      C.PRODUCTO_COMEX -> mapping(
        C.UN_ID_PESO -> number,
        C.PR_PESO_NETO -> of(Global.doubleFormat),
        C.PR_PESO_TOTAL -> of(Global.doubleFormat),
        C.PR_CANT_X_CAJA_EXPO -> number,
        C.EMBL_ID -> number,
        C.PR_FLETE_EXPO -> boolean,
        C.EGP_ID -> number,
        C.EFM_ID -> number,
        C.POAR_ID -> number,
        C.TI_ID_COMEX_GANANCIAS -> number,
        C.TI_ID_COMEX_IGB -> number,
        C.TI_ID_COMEX_IVA -> number)(ProductoComexData.apply)(ProductoComexData.unapply),
      C.PRODUCTO_KIT_GROUP -> mapping(
        C.PR_ES_KIT -> boolean,
        C.PR_KIT_STOCK_X_ITEM -> boolean,
        C.PR_KIT_RESUMIDO -> boolean,
        C.PR_KIT_IDENTIDAD -> boolean,
        C.PR_KIT_IDENTIDAD_X_ITEM -> boolean,
        C.TA_ID_KIT_SERIE -> number,
        C.PR_KIT_LOTE -> boolean,
        C.PR_KIT_LOTE_X_ITEM -> boolean,
        C.TA_ID_KIT_LOTE -> number)(ProductoKitData.apply)(ProductoKitData.unapply),
      C.PRODUCTO_WEB -> mapping(
        C.PR_NAME_WEB -> text,
        C.PR_ALIAS_WEB -> text,
        C.PR_ID_WEB_PADRE -> number,
        C.PR_ACTIVO_WEB -> boolean,
        C.PR_WEB_IMAGE_UPDATE -> boolean,
        C.PR_CODIGO_HTML -> text,
        C.PR_CODIGO_HTML_DETALLE -> text,
        C.PR_EXPO_WEB -> number,
        C.PR_VENTA_WEB_MAXIMA -> of(Global.doubleFormat),
        C.LEY_ID -> number,
        C.PR_WEB_IMAGE_FOLDER -> text)(ProductoWebData.apply)(ProductoWebData.unapply),
      C.PRODUCTO_NOMBRES -> mapping(
        C.RPT_ID_NOMBRE_COMPRA -> number,
        C.RPT_ID_NOMBRE_VENTA -> number,
        C.RPT_ID_NOMBRE_FACTURA -> number,
        C.RPT_ID_NOMBRE_WEB -> number,
        C.RPT_ID_NOMBRE_IMG -> number,
        C.RPT_ID_NOMBRE_IMG_ALT -> number)(ProductoNombresData.apply)(ProductoNombresData.unapply),
      C.PRODUCTO_ITEMS -> mapping(
        C.PRODUCTO_PROVEEDOR -> Forms.list[ProductoProveedorData](
          mapping(
            C.PRPROV_ID -> number,
            C.PROV_ID -> number,
            C.PRPROV_FABRICANTE -> boolean,
            C.PRPROV_NAME -> text,
            C.PRPROV_CODE -> text,
            C.PRPROV_CODIGO_BARRA -> text,
            C.PA_ID -> number,
            C.LP_ID -> number,
            C.LPI_PRECIO -> of(Global.doubleFormat),
            C.LPI_FECHA -> text,
            C.PRPROV_LPI_TOP -> boolean)(ProductoProveedorData.apply)(ProductoProveedorData.unapply)
        ),
        C.PRODUCTO_CLIENTE -> Forms.list[ProductoClienteData](
          mapping(
            C.PRCLI_ID -> number,
            C.CLI_ID -> number,
            C.PRCLI_CODE -> text,
            C.PRCLI_CODIGO_BARRA -> text)(ProductoClienteData.apply)(ProductoClienteData.unapply)
        ),
        C.PRODUCTO_COMUNIDAD_INTERNET -> Forms.list[ProductoCMIData](
          mapping(
            C.PRCMI_ID -> number,
            C.PRCMI_CODE -> text,
            C.PRCMI_DESCRIP -> text,
            C.PRCMI_FECHA_ALTA -> text,
            C.PRCMI_FECHA_VTO -> text,
            C.PRCMI_PRECIO -> of(Global.doubleFormat))(ProductoCMIData.apply)(ProductoCMIData.unapply)
        ),
        C.PRODUCTO_LEYENDA -> Forms.list[ProductoLeyendaData](
          mapping(
            C.PRL_ID -> number,
            C.PRL_NAME -> text,
            C.PRL_TEXTO -> text,
            C.PRL_TAG -> text,
            C.PRL_ORDEN -> text)(ProductoLeyendaData.apply)(ProductoLeyendaData.unapply)
        ),
        C.PRODUCTO_TAG -> Forms.list[ProductoTagData](
          mapping(
            C.PRT_ID -> number,
            C.PRT_TEXTO -> text,
            C.PR_ID_TAG -> number,
            C.PRT_ORDEN -> number,
            C.PRT_EXPO_WEB -> number,
            C.PRT_EXPO_CAIRO -> number)(ProductoTagData.apply)(ProductoTagData.unapply)
        ),
        C.CATALOGO_WEB_CATEGORIA_ITEM -> Forms.list[ProductoCategoriaWebData](
          mapping(
            C.CATWC_ID -> number,
            C.CATWCI_POSICION -> number)(ProductoCategoriaWebData.apply)(ProductoCategoriaWebData.unapply)
        ),
        C.CATALOGO_WEB_ITEM -> Forms.list[ProductoCatalogoWebData](
          mapping(
            C.CATW_ID -> number)(ProductoCatalogoWebData.apply)(ProductoCatalogoWebData.unapply)
        ),
        C.PRODUCTO_WEB_IMAGE -> Forms.list[ProductoWebImageData](
          mapping(
            C.PRWI_ID -> number,
            C.PRWI_ARCHIVO -> text,
            C.PRWI_TIPO -> number,
            C.PRWI_ALT -> text,
            C.PRWI_POSICION -> number)(ProductoWebImageData.apply)(ProductoWebImageData.unapply)
        ),
        C.PRODUCTO_PROVEEDOR_DELETED -> text,
        C.PRODUCTO_CLIENTE_DELETED -> text,
        C.PRODUCTO_CMI_DELETED -> text,
        C.PRODUCTO_LEYENDA_DELETED -> text,
        C.PRODUCTO_TAG_DELETED -> text,
        C.PRODUCTO_WEB_IMAGE_DELETED -> text
      )(ProductoItemsData.apply)(ProductoItemsData.unapply)
    )(ProductoData.apply)(ProductoData.unapply))

  implicit val productoWrites = new Writes[Producto] {
    def writes(producto: Producto) = Json.obj(
      "id" -> Json.toJson(producto.id),
      C.PR_ID -> Json.toJson(producto.id),
      DBHelper.ACTIVE -> Json.toJson(producto.active),
      C.PR_CODE -> Json.toJson(producto.code),

      C.PR_CODIGO_EXTERNO -> Json.toJson(producto.base.codigoExterno),
      C.PR_CODIGO_BARRA -> Json.toJson(producto.base.codigoBarra),
      C.PR_CODIGO_BARRA_NAME -> Json.toJson(producto.base.codigoBarraName),
      C.IBC_ID -> Json.toJson(producto.base.ibcId),
      C.IBC_NAME -> Json.toJson(producto.base.ibcName),
      C.MARC_ID -> Json.toJson(producto.base.marcId),
      C.MARC_NAME -> Json.toJson(producto.base.marcName),
      C.PR_EXPO_CAIRO -> Json.toJson(producto.base.expoCairo),
      C.PR_ES_PLANTILLA -> Json.toJson(producto.base.esPlantilla),
      C.CUR_ID -> Json.toJson(producto.base.curId),
      C.CUR_NAME -> Json.toJson(producto.base.curName),

      C.PR_SE_COMPRA -> Json.toJson(producto.compra.seCompra),
      C.PR_NAME_COMPRA -> Json.toJson(producto.compra.nombreCompra),
      C.PR_DESCRIP_COMPRA -> Json.toJson(producto.compra.descripCompra),
      C.UN_ID_COMPRA -> Json.toJson(producto.compra.unIdCompra),
      C.UN_NAME_COMPRA -> Json.toJson(producto.compra.unNameCompra),
      C.CUEG_ID_COMPRA -> Json.toJson(producto.compra.cuegIdCompra),
      C.CUEG_NAME_COMPRA -> Json.toJson(producto.compra.cuegNameCompra),
      C.TI_ID_RI_COMPRA -> Json.toJson(producto.compra.tiIdRiCompra),
      C.TI_NAME_RI_COMPRA -> Json.toJson(producto.compra.tiNameRiCompra),
      C.TI_ID_INTERNOS_COMPRA -> Json.toJson(producto.compra.tiIdInternosCompra),
      C.TI_NAME_INT_COMPRA -> Json.toJson(producto.compra.tiNameIntCompra),
      C.PR_PORC_INTERNO_C -> Json.toJson(producto.compra.porcInternoC),
      C.CCOS_ID_COMPRA -> Json.toJson(producto.compra.ccosIdCompra),
      C.CCOS_NAME_COMPRA -> Json.toJson(producto.compra.ccosNameCompra),

      C.PR_LLEVA_STOCK -> Json.toJson(producto.stock.llevaStock),
      C.UN_ID_STOCK -> Json.toJson(producto.stock.unIdStock),
      C.UN_NAME_STOCK -> Json.toJson(producto.stock.unNameStock),
      C.PR_STOCK_COMPRA -> Json.toJson(producto.stock.stockCompra),
      C.PR_X -> Json.toJson(producto.stock.x),
      C.PR_Y -> Json.toJson(producto.stock.y),
      C.PR_Z -> Json.toJson(producto.stock.z),
      C.PR_STOCK_MINIMO -> Json.toJson(producto.stock.stockMinimo),
      C.PR_REPOSICION -> Json.toJson(producto.stock.reposicion),
      C.PR_STOCK_MAXIMO -> Json.toJson(producto.stock.stockMaximo),
      C.PR_LLEVA_NRO_SERIE -> Json.toJson(producto.stock.llevaNroSerie),
      C.PR_LLEVA_NRO_LOTE -> Json.toJson(producto.stock.llevaNroLote),
      C.PR_LOTE_FIFO -> Json.toJson(producto.stock.loteFifo),
      C.PR_SE_PRODUCE -> Json.toJson(producto.stock.seProduce),
      C.PR_ES_REPUESTO -> Json.toJson(producto.stock.esRepuesto),

      C.PR_SE_VENDE -> Json.toJson(producto.venta.seVende),
      C.PR_NAME_VENTA -> Json.toJson(producto.venta.nombreVenta),
      C.PR_NAME_FACTURA -> Json.toJson(producto.venta.nombreFactura),
      C.PR_DESCRIP_VENTA -> Json.toJson(producto.venta.descripVenta),
      C.UN_ID_VENTA -> Json.toJson(producto.venta.unIdVenta),
      C.UN_NAME_VENTA -> Json.toJson(producto.venta.unNameVenta),
      C.PR_VENTA_COMPRA -> Json.toJson(producto.venta.ventaCompra),
      C.PR_VENTA_STOCK -> Json.toJson(producto.venta.ventaStock),
      C.CUEG_ID_VENTA -> Json.toJson(producto.venta.cuegIdVenta),
      C.CUEG_NAME_VENTA -> Json.toJson(producto.venta.cuegNameVenta),
      C.PR_ES_LISTA -> Json.toJson(producto.venta.esLista),
      C.PR_DINERARIO -> Json.toJson(producto.venta.dinerario),
      C.PR_NO_REDONDEO -> Json.toJson(producto.venta.noRedondeo),
      C.TI_ID_RI_VENTA -> Json.toJson(producto.venta.tiIdRiVenta),
      C.TI_NAME_RI_VENTA -> Json.toJson(producto.venta.tiNameRiVenta),
      C.TI_ID_INTERNOS_VENTA -> Json.toJson(producto.venta.tiIdInternosVenta),
      C.TI_NAME_INT_VENTA -> Json.toJson(producto.venta.tiNameIntVenta),
      C.PR_PORC_INTERNO_V -> Json.toJson(producto.venta.porcInternoV),
      C.CCOS_ID_VENTA -> Json.toJson(producto.venta.ccosIdVenta),
      C.CCOS_NAME_VENTA -> Json.toJson(producto.venta.ccosNameVenta),

      C.RUB_ID -> Json.toJson(producto.rubro.rubId),
      C.RUB_NAME -> Json.toJson(producto.rubro.rubName),

      C.RUBT_ID_1 -> Json.toJson(producto.rubroTables.rubtId1),
      C.RUBT_NAME_1 -> Json.toJson(producto.rubroTables.rubtName1),
      C.RUBT_ID_2 -> Json.toJson(producto.rubroTables.rubtId2),
      C.RUBT_NAME_2 -> Json.toJson(producto.rubroTables.rubtName2),
      C.RUBT_ID_3 -> Json.toJson(producto.rubroTables.rubtId3),
      C.RUBT_NAME_3 -> Json.toJson(producto.rubroTables.rubtName3),
      C.RUBT_ID_4 -> Json.toJson(producto.rubroTables.rubtId4),
      C.RUBT_NAME_4 -> Json.toJson(producto.rubroTables.rubtName4),
      C.RUBT_ID_5 -> Json.toJson(producto.rubroTables.rubtId5),
      C.RUBT_NAME_5 -> Json.toJson(producto.rubroTables.rubtName5),
      C.RUBT_ID_6 -> Json.toJson(producto.rubroTables.rubtId6),
      C.RUBT_NAME_6 -> Json.toJson(producto.rubroTables.rubtName6),
      C.RUBT_ID_7 -> Json.toJson(producto.rubroTables.rubtId7),
      C.RUBT_NAME_7 -> Json.toJson(producto.rubroTables.rubtName7),
      C.RUBT_ID_8 -> Json.toJson(producto.rubroTables.rubtId8),
      C.RUBT_NAME_8 -> Json.toJson(producto.rubroTables.rubtName8),
      C.RUBT_ID_9 -> Json.toJson(producto.rubroTables.rubtId9),
      C.RUBT_NAME_9 -> Json.toJson(producto.rubroTables.rubtName9),
      C.RUBT_ID_10 -> Json.toJson(producto.rubroTables.rubtId10),
      C.RUBT_NAME_10 -> Json.toJson(producto.rubroTables.rubtName10),

      C.RUBTI_ID_1 -> Json.toJson(producto.rubro.rubtiId1),
      C.RUBTI_NAME_1 -> Json.toJson(producto.rubro.rubtiName1),
      C.RUBTI_ID_2 -> Json.toJson(producto.rubro.rubtiId2),
      C.RUBTI_NAME_2 -> Json.toJson(producto.rubro.rubtiName2),
      C.RUBTI_ID_3 -> Json.toJson(producto.rubro.rubtiId3),
      C.RUBTI_NAME_3 -> Json.toJson(producto.rubro.rubtiName3),
      C.RUBTI_ID_4 -> Json.toJson(producto.rubro.rubtiId4),
      C.RUBTI_NAME_4 -> Json.toJson(producto.rubro.rubtiName4),
      C.RUBTI_ID_5 -> Json.toJson(producto.rubro.rubtiId5),
      C.RUBTI_NAME_5 -> Json.toJson(producto.rubro.rubtiName5),
      C.RUBTI_ID_6 -> Json.toJson(producto.rubro.rubtiId6),
      C.RUBTI_NAME_6 -> Json.toJson(producto.rubro.rubtiName6),
      C.RUBTI_ID_7 -> Json.toJson(producto.rubro.rubtiId7),
      C.RUBTI_NAME_7 -> Json.toJson(producto.rubro.rubtiName7),
      C.RUBTI_ID_8 -> Json.toJson(producto.rubro.rubtiId8),
      C.RUBTI_NAME_8 -> Json.toJson(producto.rubro.rubtiName8),
      C.RUBTI_ID_9 -> Json.toJson(producto.rubro.rubtiId9),
      C.RUBTI_NAME_9 -> Json.toJson(producto.rubro.rubtiName9),
      C.RUBTI_ID_10 -> Json.toJson(producto.rubro.rubtiId10),
      C.RUBTI_NAME_10 -> Json.toJson(producto.rubro.rubtiName10),

      C.UN_ID_PESO -> Json.toJson(producto.comex.unIdPeso),
      C.UN_NAME_PESO -> Json.toJson(producto.comex.unNamePeso),
      C.PR_PESO_NETO -> Json.toJson(producto.comex.pesoNeto),
      C.PR_PESO_TOTAL -> Json.toJson(producto.comex.pesoTotal),
      C.PR_CANT_X_CAJA_EXPO -> Json.toJson(producto.comex.cantXCajaExpo),
      C.EMBL_ID -> Json.toJson(producto.comex.emblId),
      C.EMBL_NAME -> Json.toJson(producto.comex.emblName),
      C.PR_FLETE_EXPO -> Json.toJson(producto.comex.fleteExpo),
      C.EGP_ID -> Json.toJson(producto.comex.egpId),
      C.EGP_NAME -> Json.toJson(producto.comex.egpName),
      C.EFM_ID -> Json.toJson(producto.comex.efmId),
      C.EFM_NAME -> Json.toJson(producto.comex.efmName),
      C.POAR_ID -> Json.toJson(producto.comex.poarId),
      C.POAR_NAME -> Json.toJson(producto.comex.poarName),
      C.TI_ID_COMEX_GANANCIAS -> Json.toJson(producto.comex.tiIdComexGanancias),
      C.TI_NAME_COMEX_GANANCIAS -> Json.toJson(producto.comex.tiNameComexGanancias),
      C.TI_ID_COMEX_IGB -> Json.toJson(producto.comex.tiIdComexIgb),
      C.TI_NAME_COMEX_IGB -> Json.toJson(producto.comex.tiNameComexIgb),
      C.TI_ID_COMEX_IVA -> Json.toJson(producto.comex.tiIdComexIva),
      C.TI_NAME_COMEX_IVA -> Json.toJson(producto.comex.tiNameComexIva),

      C.PR_ES_KIT -> Json.toJson(producto.kit.esKit),
      C.PR_KIT_STOCK_X_ITEM -> Json.toJson(producto.kit.kitStockXItem),
      C.PR_KIT_RESUMIDO -> Json.toJson(producto.kit.kitResumido),
      C.PR_KIT_IDENTIDAD -> Json.toJson(producto.kit.kitIdentidad),
      C.PR_KIT_IDENTIDAD_X_ITEM -> Json.toJson(producto.kit.kitIdentidadXItem),
      C.TA_ID_KIT_SERIE -> Json.toJson(producto.kit.taIdKitSerie),
      C.TA_NAME_KIT_SERIE -> Json.toJson(producto.kit.taNameKitSerie),
      C.PR_KIT_LOTE -> Json.toJson(producto.kit.kitLote),
      C.PR_KIT_LOTE_X_ITEM -> Json.toJson(producto.kit.kitLoteXItem),
      C.TA_ID_KIT_LOTE -> Json.toJson(producto.kit.taIdKitLote),
      C.TA_NAME_KIT_LOTE -> Json.toJson(producto.kit.taNameKitLote),

      C.PR_NAME_WEB -> Json.toJson(producto.web.nombreWeb),
      C.PR_ALIAS_WEB -> Json.toJson(producto.web.aliasWeb),
      C.PR_ID_WEB_PADRE -> Json.toJson(producto.web.prIdWebPadre),
      C.PR_NAME_WEB_PADRE -> Json.toJson(producto.web.prNameWebPadre),
      C.PR_ACTIVO_WEB -> Json.toJson(producto.web.activoWeb),
      C.PR_WEB_IMAGE_UPDATE -> Json.toJson(producto.web.webImageUpdate),
      C.PR_CODIGO_HTML -> Json.toJson(producto.web.codigoHtml),
      C.PR_CODIGO_HTML_DETALLE -> Json.toJson(producto.web.codigoHtmlDetalle),
      C.PR_EXPO_WEB -> Json.toJson(producto.web.expoWeb),
      C.PR_VENTA_WEB_MAXIMA -> Json.toJson(producto.web.ventaWebMaxima),
      C.LEY_ID -> Json.toJson(producto.web.leyId),
      C.LEY_NAME -> Json.toJson(producto.web.leyName),
      C.PR_WEB_IMAGE_FOLDER -> Json.toJson(producto.web.webImageFolder),

      C.RPT_ID_NOMBRE_COMPRA -> Json.toJson(producto.names.rptIdNombreCompra),
      C.RPT_NAME_COMPRA -> Json.toJson(producto.names.rptNameCompra),
      C.RPT_ID_NOMBRE_VENTA -> Json.toJson(producto.names.rptIdNombreVenta),
      C.RPT_NAME_VENTA -> Json.toJson(producto.names.rptNameVenta),
      C.RPT_ID_NOMBRE_FACTURA -> Json.toJson(producto.names.rptIdNombreFactura),
      C.RPT_NAME_FACTURA -> Json.toJson(producto.names.rptNameFactura),
      C.RPT_ID_NOMBRE_WEB -> Json.toJson(producto.names.rptIdNombreWeb),
      C.RPT_NAME_WEB -> Json.toJson(producto.names.rptNameWeb),
      C.RPT_ID_NOMBRE_IMG -> Json.toJson(producto.names.rptIdNombreImg),
      C.RPT_NAME_IMG -> Json.toJson(producto.names.rptNameImg),
      C.RPT_ID_NOMBRE_IMG_ALT -> Json.toJson(producto.names.rptIdNombreImgAlt),
      C.RPT_NAME_IMG_ALT -> Json.toJson(producto.names.rptNameImgAlt),

      // Items
      "proveedores" -> Json.toJson(writeProductoProveedores(producto.items.proveedores)),
      "clientes" -> Json.toJson(writeProductoClientes(producto.items.clientes)),
      "cmi" -> Json.toJson(writeProductoCMIs(producto.items.cmi)),
      "leyendas" -> Json.toJson(writeProductoLeyendas(producto.items.leyendas)),
      "tags" -> Json.toJson(writeProductoTags(producto.items.tags)),
      "categoriasWeb" -> Json.toJson(writeProductoCategoriasWeb(producto.items.categoriasWeb)),
      "catalogosWeb" -> Json.toJson(writeProductoCatalogosWeb(producto.items.catalogosWeb)),
      "webImages" -> Json.toJson(writeProductoWebImages(producto.items.webImages)),
      "kit" -> Json.toJson(writeProductoKits(producto.items.kit)),
      "bom" -> Json.toJson(writeProductoBOMs(producto.items.bom)),
      "additionalFields" -> Json.toJson(additionalFieldsWrites)
    )
    def additionalFieldsWrites() = Json.obj(
      "fields" -> Json.toJson(writeEmptyCols(List())),
      "values" -> Json.toJson(writeEmptyCols(List()))
    )
    def itemWrites(item: Any) = Json.obj(
      "dummy" -> Json.toJson("")
    )
    def productoProveedorWrites(p: ProductoProveedor) = Json.obj(
      C.PRPROV_ID -> Json.toJson(p.id),
      C.PRPROV_NAME -> Json.toJson(p.name),
      C.PRPROV_CODE -> Json.toJson(p.code),
      C.PRPROV_CODIGO_BARRA -> Json.toJson(p.barCode),
      C.PRPROV_FABRICANTE -> Json.toJson(p.maker),
      C.PROV_ID -> Json.toJson(p.provId),
      C.PROV_NAME -> Json.toJson(p.provName),
      C.PA_ID -> Json.toJson(p.paId),
      C.PA_NAME -> Json.toJson(p.paName),
      C.LP_ID -> Json.toJson(p.lpId),
      C.LP_NAME -> Json.toJson(p.lpName),
      C.LPI_PRECIO -> Json.toJson(p.price),
      C.LPI_FECHA -> Json.toJson(p.priceDate),
      C.PRPROV_LPI_TOP -> Json.toJson(p.priceDefault)
    )
    def productoClienteWrites(p: ProductoCliente) = Json.obj(
      C.PRCLI_ID -> Json.toJson(p.id),
      C.CLI_ID -> Json.toJson(p.cliId),
      C.CLI_NAME -> Json.toJson(p.name),
      C.PRCLI_CODE -> Json.toJson(p.code),
      C.PRCLI_CODIGO_BARRA -> Json.toJson(p.barCode)
    )
    def productoCMIWrites(p: ProductoCMI) = Json.obj(
      C.PRCMI_ID -> Json.toJson(p.id),
      C.PRCMI_CODE -> Json.toJson(p.code),
      C.PRCMI_DESCRIP -> Json.toJson(p.descrip),
      C.PRCMI_FECHA_ALTA -> Json.toJson(p.createdAt),
      C.PRCMI_FECHA_VTO -> Json.toJson(p.expireDate)
    )
    def productoLeyendaWrites(p: ProductoLeyenda) = Json.obj(
      C.PRL_ID -> Json.toJson(p.id),
      C.PRL_NAME -> Json.toJson(p.name),
      C.PRL_TEXTO -> Json.toJson(p.text),
      C.PRL_TAG -> Json.toJson(p.tag),
      C.PRL_ORDEN -> Json.toJson(p.order)
    )
    def productoTagWrites(p: ProductoTag) = Json.obj(
      C.PRT_ID -> Json.toJson(p.id),
      C.PRT_TEXTO -> Json.toJson(p.text),
      C.PR_ID_TAG -> Json.toJson(p.prIdTag),
      C.PR_NAME_COMPRA -> Json.toJson(p.prName),
      C.PRT_EXPO_WEB -> Json.toJson(p.expoWeb),
      C.PRT_EXPO_CAIRO -> Json.toJson(p.expoCairo),
      C.PRT_ORDEN -> Json.toJson(p.order)
    )
    def productoCategoriaWebWrites(p: ProductoCategoriaWeb) = Json.obj(
      C.CATWCI_ID -> Json.toJson(p.id),
      C.CATWC_ID -> Json.toJson(p.catwcId),
      C.CATWC_NAME -> Json.toJson(p.name),
      C.CATWCI_POSICION -> Json.toJson(p.position)
    )
    def productoCatalogoWebWrites(p: ProductoCatalogoWeb) = Json.obj(
      C.CATWI_ID -> Json.toJson(p.id),
      C.CATW_ID -> Json.toJson(p.catwId),
      C.CATW_NAME -> Json.toJson(p.name)
    )
    def productoWebImageWrites(p: ProductoWebImage) = Json.obj(
      C.PRWI_ID -> Json.toJson(p.id),
      C.PRWI_ARCHIVO -> Json.toJson(p.file),
      C.PRWI_TIPO -> Json.toJson(p.imageType),
      C.PRWI_ALT -> Json.toJson(p.alt),
      C.PRWI_POSICION -> Json.toJson(p.position)
    )
    def productoKitWrites(p: ProductoKitItem) = Json.obj(
      C.PRFK_ID -> Json.toJson(p.id),
      C.PRFK_NAME -> Json.toJson(p.name),
      C.PRFK_DEFAULT -> Json.toJson(p.default)
    )
    def productoBOMWrites(p: ProductoBOMItemRow) = Json.obj(
      C.PBM_ID -> Json.toJson(p.id),
      C.PBM_NAME -> Json.toJson(p.name)
    )
    def writeEmptyCols(items: List[Any]) = items.map(item => itemWrites(item))
    def writeProductoProveedores(items: List[ProductoProveedor]) = items.map(item => productoProveedorWrites(item))
    def writeProductoClientes(items: List[ProductoCliente]) = items.map(item => productoClienteWrites(item))
    def writeProductoCMIs(items: List[ProductoCMI]) = items.map(item => productoCMIWrites(item))
    def writeProductoLeyendas(items: List[ProductoLeyenda]) = items.map(item => productoLeyendaWrites(item))
    def writeProductoTags(items: List[ProductoTag]) = items.map(item => productoTagWrites(item))
    def writeProductoCategoriasWeb(items: List[ProductoCategoriaWeb]) = items.map(item => productoCategoriaWebWrites(item))
    def writeProductoCatalogosWeb(items: List[ProductoCatalogoWeb]) = items.map(item => productoCatalogoWebWrites(item))
    def writeProductoWebImages(items: List[ProductoWebImage]) = items.map(item => productoWebImageWrites(item))
    def writeProductoKits(items: List[ProductoKitItem]) = items.map(item => productoKitWrites(item))
    def writeProductoBOMs(items: List[ProductoBOMItemRow]) = items.map(item => productoBOMWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PRODUCTO), { user =>
      Ok(Json.toJson(Producto.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a ProductoData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in Producto/Data, ProductoItem/Data, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def getJsValueAsMap(list: Map[String, JsValue]): Map[String, JsValue] = list.toList match {
      case (key: String, jsValue: JsValue) :: t => jsValue.as[Map[String, JsValue]]
      case _ => Map.empty
    }

    def preprocessProveedorParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(productoProveedorFields, "", params).toSeq)
    }

    def preprocessClienteParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(productoClienteFields, "", params).toSeq)
    }

    def preprocessCMIParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(productoCMIFields, "", params).toSeq)
    }

    def preprocessLeyendaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(productoLeyendaFields, "", params).toSeq)
    }

    def preprocessTagParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(productoTagFields, "", params).toSeq)
    }

    def preprocessCategoriaWebParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(productoCategoriaWebFields, "", params).toSeq)
    }

    def preprocessCatalogoWebParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(productoCatalogoWebFields, "", params).toSeq)
    }

    def preprocessWebImageParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(productoWebImageFields, "", params).toSeq)
    }

    def preprocessProveedoresParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessProveedorParam(_))))
      case _ => Map.empty
    }

    def preprocessClientesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessClienteParam(_))))
      case _ => Map.empty
    }

    def preprocessCMIsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessCMIParam(_))))
      case _ => Map.empty
    }

    def preprocessLeyendasParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessLeyendaParam(_))))
      case _ => Map.empty
    }

    def preprocessTagsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessTagParam(_))))
      case _ => Map.empty
    }

    def preprocessCategoriasWebParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessCategoriaWebParam(_))))
      case _ => Map.empty
    }

    def preprocessCatalogosWebParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessCatalogoWebParam(_))))
      case _ => Map.empty
    }

    def preprocessWebImagesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessWebImageParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for productoData
    //
    val productoId = Global.preprocessFormParams(List("id", DBHelper.ACTIVE, C.PR_CODE), "", params)
    val productoBaseGroup = Global.preprocessFormParams(productoBaseFields, C.PRODUCTO_BASE, params)
    val productoCompraGroup = Global.preprocessFormParams(productoCompraFields, C.PRODUCTO_COMPRA, params)
    val productoStockGroup = Global.preprocessFormParams(productoStockFields, C.PRODUCTO_STOCK, params)
    val productoVentaGroup = Global.preprocessFormParams(productoVentaFields, C.PRODUCTO_VENTA, params)
    val productoRubroGroup = Global.preprocessFormParams(productoRubroFields, C.PRODUCTO_RUBRO, params)
    val productoComexGroup = Global.preprocessFormParams(productoComexFields, C.PRODUCTO_COMEX, params)
    val productoKitGroup = Global.preprocessFormParams(productoKitFields, C.PRODUCTO_KIT_GROUP, params)
    val productoWebGroup = Global.preprocessFormParams(productoWebFields, C.PRODUCTO_WEB, params)
    val productoNombreGroup = Global.preprocessFormParams(productoNombresFields, C.PRODUCTO_NOMBRES, params)

    // proveedores
    //
    val proveedoresInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.PRODUCTO_PROVEEDOR, params))
    val proveedorRows = Global.getParamsJsonRequestFor(C.ITEMS, proveedoresInfo)
    val proveedorDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, proveedoresInfo).toList match {
      case Nil => Map(C.PRODUCTO_PROVEEDOR_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.PRODUCTO_PROVEEDOR_DELETED -> Json.toJson(deletedList._2))
    }
    val productoProveedores = proveedorRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessProveedoresParam(item, C.PRODUCTO_PROVEEDOR)
      case _ => Map(C.PRODUCTO_PROVEEDOR -> JsArray(List()))
    }

    // clientes
    //
    val clientesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.PRODUCTO_CLIENTE, params))
    val clienteRows = Global.getParamsJsonRequestFor(C.ITEMS, clientesInfo)
    val clienteDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, clientesInfo).toList match {
      case Nil => Map(C.PRODUCTO_CLIENTE_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.PRODUCTO_CLIENTE_DELETED -> Json.toJson(deletedList._2))
    }
    val productoClientes = clienteRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessClientesParam(item, C.PRODUCTO_CLIENTE)
      case _ => Map(C.PRODUCTO_CLIENTE -> JsArray(List()))
    }

    // cmi
    //
    val cmisInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.PRODUCTO_COMUNIDAD_INTERNET, params))
    val cmiRows = Global.getParamsJsonRequestFor(C.ITEMS, cmisInfo)
    val cmiDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, cmisInfo).toList match {
      case Nil => Map(C.PRODUCTO_CMI_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.PRODUCTO_CMI_DELETED -> Json.toJson(deletedList._2))
    }
    val productoCMIs = cmiRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessCMIsParam(item, C.PRODUCTO_COMUNIDAD_INTERNET)
      case _ => Map(C.PRODUCTO_COMUNIDAD_INTERNET -> JsArray(List()))
    }

    // leyendas
    //
    val leyendasInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.PRODUCTO_LEYENDA, params))
    val leyendaRows = Global.getParamsJsonRequestFor(C.ITEMS, leyendasInfo)
    val leyendaDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, leyendasInfo).toList match {
      case Nil => Map(C.PRODUCTO_LEYENDA_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.PRODUCTO_LEYENDA_DELETED -> Json.toJson(deletedList._2))
    }
    val productoLeyendas = leyendaRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessLeyendasParam(item, C.PRODUCTO_LEYENDA)
      case _ => Map(C.PRODUCTO_LEYENDA -> JsArray(List()))
    }

    // tags
    //
    val tagsInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.PRODUCTO_TAG, params))
    val tagRows = Global.getParamsJsonRequestFor(C.ITEMS, tagsInfo)
    val tagDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, tagsInfo).toList match {
      case Nil => Map(C.PRODUCTO_TAG_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.PRODUCTO_TAG_DELETED -> Json.toJson(deletedList._2))
    }
    val productoTags = tagRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessTagsParam(item, C.PRODUCTO_TAG)
      case _ => Map(C.PRODUCTO_TAG -> JsArray(List()))
    }

    // categoriasWeb
    //
    val categoriasWebInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.CATALOGO_WEB_CATEGORIA_ITEM, params))
    val categoriaWebRows = Global.getParamsJsonRequestFor(C.ITEMS, categoriasWebInfo)
    val productoCategoriasWeb = categoriaWebRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessCategoriasWebParam(item, C.CATALOGO_WEB_CATEGORIA_ITEM)
      case _ => Map(C.CATALOGO_WEB_CATEGORIA_ITEM -> JsArray(List()))
    }

    // catalogosWeb
    //
    val catalogosWebInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.CATALOGO_WEB_ITEM, params))
    val catalogoWebRows = Global.getParamsJsonRequestFor(C.ITEMS, catalogosWebInfo)
    val productoCatalogosWeb = catalogoWebRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessCatalogosWebParam(item, C.CATALOGO_WEB_ITEM)
      case _ => Map(C.CATALOGO_WEB_ITEM -> JsArray(List()))
    }

    // webImages
    //
    val webImagesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.PRODUCTO_WEB_IMAGE, params))
    val webImageRows = Global.getParamsJsonRequestFor(C.ITEMS, webImagesInfo)
    val webImageDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, webImagesInfo).toList match {
      case Nil => Map(C.PRODUCTO_WEB_IMAGE_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.PRODUCTO_WEB_IMAGE_DELETED -> Json.toJson(deletedList._2))
    }
    val productoWebImages = webImageRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessWebImagesParam(item, C.PRODUCTO_WEB_IMAGE)
      case _ => Map(C.PRODUCTO_WEB_IMAGE -> JsArray(List()))
    }

    val productoItems = Map(C.PRODUCTO_ITEMS -> JsObject((
           productoProveedores ++ proveedorDeleted ++ productoClientes ++ clienteDeleted ++ productoCMIs ++ cmiDeleted
        ++ productoLeyendas ++ leyendaDeleted ++ productoWebImages ++ webImageDeleted ++ productoTags ++ tagDeleted
        ++ productoCategoriasWeb ++ productoCatalogosWeb ++ productoWebImages ++ webImageDeleted).toSeq
    ))

    JsObject(
      (productoId ++ productoBaseGroup ++ productoCompraGroup ++ productoStockGroup ++ productoVentaGroup
        ++ productoRubroGroup ++ productoComexGroup ++ productoKitGroup ++ productoWebGroup ++ productoNombreGroup
        ++ productoItems).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getProveedores(proveedores: List[ProductoProveedorData]): List[ProductoProveedor] = {
    proveedores.map(proveedor => {
      ProductoProveedor(
        proveedor.id,
        proveedor.provId,
        proveedor.maker,
        proveedor.name,
        proveedor.code,
        proveedor.barCode,
        proveedor.paId,
        proveedor.lpId,
        proveedor.price,
        DateFormatter.parse(proveedor.priceDate),
        proveedor.priceDefault
      )
    })
  }

  def getClientes(clientes: List[ProductoClienteData]): List[ProductoCliente] = {
    clientes.map(cliente => {
      ProductoCliente(
        cliente.id,
        cliente.cliId,
        cliente.code,
        cliente.barCode
      )
    })
  }

  def getCMIs(cmis: List[ProductoCMIData]): List[ProductoCMI] = {
    cmis.map(cmi => {
      ProductoCMI(
        cmi.id,
        cmi.code,
        cmi.descrip,
        DateFormatter.parse(cmi.createdAt),
        DateFormatter.parse(cmi.expireDate),
        cmi.price
      )
    })
  }

  def getLeyendas(leyendas: List[ProductoLeyendaData]): List[ProductoLeyenda] = {
    leyendas.map(leyenda => {
      ProductoLeyenda(
        leyenda.id,
        leyenda.name,
        leyenda.text,
        leyenda.tag,
        leyenda.order
      )
    })
  }

  def getTags(tags: List[ProductoTagData]): List[ProductoTag] = {
    tags.map(tag => {
      ProductoTag(
        tag.id,
        tag.text,
        tag.prIdTag,
        tag.order,
        tag.expoWeb,
        tag.expoCairo
      )
    })
  }

  def getCategoriasWeb(categoriasWeb: List[ProductoCategoriaWebData]): List[ProductoCategoriaWeb] = {
    categoriasWeb.map(categoriaWeb => {
      ProductoCategoriaWeb(
        DBHelper.NoId,
        categoriaWeb.catwcId,
        categoriaWeb.position
      )
    })
  }

  def getCatalogosWeb(catalogosWeb: List[ProductoCatalogoWebData]): List[ProductoCatalogoWeb] = {
    catalogosWeb.map(catalogoWeb => {
      ProductoCatalogoWeb(
        DBHelper.NoId,
        catalogoWeb.catwId
      )
    })
  }

  def getWebImages(webImages: List[ProductoWebImageData]): List[ProductoWebImage] = {
    webImages.map(webImage => {
      ProductoWebImage(
        webImage.id,
        webImage.file,
        webImage.imageType,
        webImage.alt,
        webImage.position
      )
    })
  }
  
  def getProductoItems(producto: ProductoItemsData): ProductoItems = {
    ProductoItems(
      getProveedores(producto.proveedores),
      getClientes(producto.clientes),
      getCMIs(producto.CMIs),
      getLeyendas(producto.leyendas),
      getTags(producto.tags),
      getCategoriasWeb(producto.categoriasWeb),
      getCatalogosWeb(producto.catalogosWeb),
      getWebImages(producto.webImages),
      List(),
      List(),
      List(),
      producto.proveedorDeleted,
      producto.clienteDeleted,
      producto.cmiDeleted,
      producto.leyendaDeleted,
      producto.tagDeleted,
      producto.webImageDeleted
    )
  }

  def getProducto(producto: ProductoData, id: Int): Producto = {
    Producto(
      id,
      producto.active,
      producto.code,
      ProductoBase(
        producto.base.codigoExterno,
        producto.base.codigoBarra,
        producto.base.codigoBarraName,
        producto.base.ibcId,
        producto.base.marcId,
        producto.base.expoCairo,
        producto.base.esPlantilla,
        producto.base.curId),
      ProductoCompra(
        producto.compra.seCompra,
        producto.compra.nombreCompra,
        producto.compra.descripCompra,
        producto.compra.unIdCompra,
        producto.compra.cuegIdCompra,
        producto.compra.tiIdRiCompra,
        producto.compra.tiIdInternosCompra,
        producto.compra.porcInternoC,
        producto.compra.ccosIdCompra),
      ProductoStock(
        producto.stock.llevaStock,
        producto.stock.unIdStock,
        producto.stock.stockCompra,
        producto.stock.x,
        producto.stock.y,
        producto.stock.z,
        producto.stock.stockMinimo,
        producto.stock.reposicion,
        producto.stock.stockMaximo,
        producto.stock.llevaNroSerie,
        producto.stock.llevaNroLote,
        producto.stock.loteFifo,
        producto.stock.seProduce,
        producto.stock.esRepuesto),
      ProductoVenta(
        producto.venta.seVende,
        producto.venta.nombreVenta,
        producto.venta.nombreFactura,
        producto.venta.descripVenta,
        producto.venta.unIdVenta,
        producto.venta.ventaCompra,
        producto.venta.ventaStock,
        producto.venta.cuegIdVenta,
        producto.venta.esLista,
        producto.venta.dinerario,
        producto.venta.noRedondeo,
        producto.venta.tiIdRiVenta,
        producto.venta.tiIdInternosVenta,
        producto.venta.porcInternoV,
        producto.venta.ccosIdVenta),
      ProductoRubro(
        producto.rubro.rubId,
        producto.rubro.rubtiId1.getOrElse(0),
        producto.rubro.rubtiId2.getOrElse(0),
        producto.rubro.rubtiId3.getOrElse(0),
        producto.rubro.rubtiId4.getOrElse(0),
        producto.rubro.rubtiId5.getOrElse(0),
        producto.rubro.rubtiId6.getOrElse(0),
        producto.rubro.rubtiId7.getOrElse(0),
        producto.rubro.rubtiId8.getOrElse(0),
        producto.rubro.rubtiId9.getOrElse(0),
        producto.rubro.rubtiId10.getOrElse(0)),
      Producto.emptyProductoRubroTables,
      ProductoComex(
        producto.comex.unIdPeso,
        producto.comex.pesoNeto,
        producto.comex.pesoTotal,
        producto.comex.cantXCajaExpo,
        producto.comex.emblId,
        producto.comex.fleteExpo,
        producto.comex.egpId,
        producto.comex.efmId,
        producto.comex.poarId,
        producto.comex.tiIdComexGanancias,
        producto.comex.tiIdComexIgb,
        producto.comex.tiIdComexIva),
      ProductoKit(
        producto.kit.esKit,
        producto.kit.kitStockXItem,
        producto.kit.kitResumido,
        producto.kit.kitIdentidad,
        producto.kit.kitIdentidadXItem,
        producto.kit.taIdKitSerie,
        producto.kit.kitLote,
        producto.kit.kitLoteXItem,
        producto.kit.taIdKitLote),
      ProductoWeb(
        producto.web.nombreWeb,
        producto.web.aliasWeb,
        producto.web.prIdWebPadre,
        producto.web.activoWeb,
        producto.web.webImageUpdate,
        producto.web.codigoHtml,
        producto.web.codigoHtmlDetalle,
        producto.web.expoWeb,
        producto.web.ventaWebMaxima,
        producto.web.leyId,
        producto.web.webImageFolder),
      ProductoNombres(
        producto.names.rptIdNombreCompra,
        producto.names.rptIdNombreVenta,
        producto.names.rptIdNombreFactura,
        producto.names.rptIdNombreWeb,
        producto.names.rptIdNombreImg,
        producto.names.rptIdNombreImgAlt),
      getProductoItems(producto.items)
    )
  }
  
  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Productos.update")
    productoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      producto => {
        Logger.debug(s"form: ${producto.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PRODUCTO), { user =>
          Ok(
            Json.toJson(
              Producto.update(user,
                getProducto(producto, id)
              )
            )
          )
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Productos.create")
    productoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      producto => {
        Logger.debug(s"form: ${producto.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PRODUCTO), { user =>
          Ok(
            Json.toJson(
              Producto.create(user,
                getProducto(producto, DBHelper.NoId)
              )
            )
          )
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Productos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PRODUCTO), { user =>
      Producto.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

  implicit val productoStockInfoWrites = new Writes[ProductoStockInfo] {
    def writes(info: ProductoStockInfo) = Json.obj(

      C.UN_NAME -> Json.toJson(info.unName),
      C.UN_NAME_COMPRA -> Json.toJson(info.unNameCompra),
      C.UN_NAME_VENTA -> Json.toJson(info.unNameVenta),
      C.PR_LLEVA_NRO_SERIE -> Json.toJson(info.llevaNroSerie),
      C.PR_LLEVA_NRO_LOTE -> Json.toJson(info.llevaNroLote),
      C.PR_LOTE_FIFO -> Json.toJson(info.loteFifo),
      C.PR_ES_KIT -> Json.toJson(info.loteFifo),
      C.RUB_ID -> Json.toJson(info.rubId),
      C.CUE_ID_COMPRA -> Json.toJson(info.cueIdCompra),
      C.CUE_ID_VENTA -> Json.toJson(info.cueIdVenta),
      C.CCOS_ID_COMPRA -> Json.toJson(info.ccosIdCompra),
      C.CCOS_NAME_COMPRA -> Json.toJson(info.ccosNameCompra),
      C.CCOS_ID_VENTA -> Json.toJson(info.ccosIdVenta),
      C.CCOS_NAME_VENTA -> Json.toJson(info.ccosNameVenta)
    )
  }

  def getProveedorStockInfo(id: Int, provId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Json.toJson(Producto.getStockInfo(user, id, None, Some(provId))))
    })
  }

  def getClienteStockInfo(id: Int, cliId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Json.toJson(Producto.getStockInfo(user, id, Some(cliId), None)))
    })
  }
  
  def getPrice(id: Int, lpId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val price = Producto.getPrice(user, id, lpId)
      Ok(Json.toJson(Json.obj("price" -> Json.toJson(price))))
    })
  }

  def getDiscount(id: Int, ldId: Int, price: Double) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val discount = Producto.getDiscount(user, id, ldId, price)
      val discountDesc = Producto.getDiscountDescription(user, id, ldId)
      Ok(Json.toJson(Json.obj("discount" -> Json.toJson(discount), "desc" -> Json.toJson(discountDesc))))
    })
  }

  implicit val productoTaxInfoWrites = new Writes[ProductoTaxInfo] {
    def writes(info: ProductoTaxInfo) = Json.obj(
      C.TI_ID_RI_COMPRA -> Json.toJson(info.tiIdIvaRiCompra),
      C.TI_RI_PORC_COMPRA -> Json.toJson(info.tiPorcIvaRiCompra),
      C.CUE_ID_RI_COMPRA -> Json.toJson(info.cueIdIvaRiCompra),

      C.TI_ID_RNI_COMPRA -> Json.toJson(info.tiIdIvaRniCompra),
      C.TI_RNI_PORC_COMPRA -> Json.toJson(info.tiPorcIvaRniCompra),
      C.CUE_ID_RNI_COMPRA -> Json.toJson(info.cueIdIvaRiCompra),


      C.TI_ID_RI_VENTA -> Json.toJson(info.tiIdIvaRiVenta),
      C.TI_RI_PORC_VENTA -> Json.toJson(info.tiPorcIvaRiVenta),
      C.CUE_ID_RI_VENTA -> Json.toJson(info.cueIdIvaRiVenta),

      C.TI_ID_RNI_VENTA -> Json.toJson(info.tiIdIvaRniVenta),
      C.TI_RNI_PORC_VENTA -> Json.toJson(info.tiPorcIvaRniVenta),
      C.CUE_ID_RNI_VENTA -> Json.toJson(info.cueIdIvaRniVenta),


      C.TI_ID_INTERNOS_COMPRA -> Json.toJson(info.tiIdInternosC),
      C.TI_PORC_INTERNOS_COMPRA -> Json.toJson(info.tiPorcInternosC),

      C.TI_ID_INTERNOS_VENTA -> Json.toJson(info.tiIdInternosV),
      C.TI_PORC_INTERNOS_VENTA -> Json.toJson(info.tiPorcInternosV),

      C.PR_PORC_INTERNO_C -> Json.toJson(info.prPorcInternoC),
      C.PR_PORC_INTERNO_V -> Json.toJson(info.prPorcInternoV)
    )
  }

  def getTaxes(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Json.toJson(Producto.getTaxes(user, id)))
    })
  }

}