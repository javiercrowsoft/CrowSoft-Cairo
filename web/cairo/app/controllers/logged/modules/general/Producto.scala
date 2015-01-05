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
                            rubtiId1: Int,
                            rubtiId2: Int,
                            rubtiId3: Int,
                            rubtiId4: Int,
                            rubtiId5: Int,
                            rubtiId6: Int,
                            rubtiId7: Int,
                            rubtiId8: Int,
                            rubtiId9: Int,
                            rubtiId10: Int
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
                         names: ProductoNombresData
                         )

object Productos extends Controller with ProvidesUser {

  val productoForm = Form(
    mapping(
      "id" -> optional(number),
      DBHelper.ACTIVE -> boolean,
      C.PR_CODE -> text,
      C.PRODUCTO_COMPRA -> mapping(
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
        C.RUBTI_ID_1 -> number,
        C.RUBTI_ID_2 -> number,
        C.RUBTI_ID_3 -> number,
        C.RUBTI_ID_4 -> number,
        C.RUBTI_ID_5 -> number,
        C.RUBTI_ID_6 -> number,
        C.RUBTI_ID_7 -> number,
        C.RUBTI_ID_8 -> number,
        C.RUBTI_ID_9 -> number,
        C.RUBTI_ID_10 -> number)(ProductoRubroData.apply)(ProductoRubroData.unapply),
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
        C.RPT_ID_NOMBRE_IMG_ALT -> number)(ProductoNombresData.apply)(ProductoNombresData.unapply)
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
      C.TI_NAME_RI_VENTA -> Json.toJson(producto.venta.tiIdRiVenta),
      C.TI_ID_INTERNOS_VENTA -> Json.toJson(producto.venta.tiIdInternosVenta),
      C.TI_NAME_INT_VENTA -> Json.toJson(producto.venta.tiNameIntVenta),
      C.PR_PORC_INTERNO_V -> Json.toJson(producto.venta.porcInternoV),
      C.CCOS_ID_VENTA -> Json.toJson(producto.venta.ccosIdVenta),
      C.CCOS_NAME_VENTA -> Json.toJson(producto.venta.ccosNameVenta),

      C.RUB_ID -> Json.toJson(producto.rubro.rubId),
      C.RUB_NAME -> Json.toJson(producto.rubro.rubName),

      // TODO: implement this
      C.RUBT_ID_1 -> 0,
      C.RUBT_NAME_1 -> "",
      C.RUBT_ID_2 -> 0,
      C.RUBT_NAME_2 -> "",
      C.RUBT_ID_3 -> 0,
      C.RUBT_NAME_3 -> "",
      C.RUBT_ID_4 -> 0,
      C.RUBT_NAME_4 -> "",
      C.RUBT_ID_5 -> 0,
      C.RUBT_NAME_5 -> "",
      C.RUBT_ID_6 -> 0,
      C.RUBT_NAME_6 -> "",
      C.RUBT_ID_7 -> 0,
      C.RUBT_NAME_7 -> "",
      C.RUBT_ID_8 -> 0,
      C.RUBT_NAME_8 -> "",
      C.RUBT_ID_9 -> 0,
      C.RUBT_NAME_9 -> "",
      C.RUBT_ID_10 -> 0,
      C.RUBT_NAME_10 -> "",

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
      C.RPT_NAME -> Json.toJson(producto.names.rptNameCompra),
      C.RPT_ID_NOMBRE_VENTA -> Json.toJson(producto.names.rptIdNombreVenta),
      C.RPT_NAME -> Json.toJson(producto.names.rptNameVenta),
      C.RPT_ID_NOMBRE_FACTURA -> Json.toJson(producto.names.rptIdNombreFactura),
      C.RPT_NAME -> Json.toJson(producto.names.rptNameFactura),
      C.RPT_ID_NOMBRE_WEB -> Json.toJson(producto.names.rptIdNombreWeb),
      C.RPT_NAME -> Json.toJson(producto.names.rptNameWeb),
      C.RPT_ID_NOMBRE_IMG -> Json.toJson(producto.names.rptIdNombreImg),
      C.RPT_NAME -> Json.toJson(producto.names.rptNameImg),
      C.RPT_ID_NOMBRE_IMG_ALT -> Json.toJson(producto.names.rptIdNombreImgAlt),
      C.RPT_NAME -> Json.toJson(producto.names.rptNameImgAlt),

      // Items
      "proveedor" -> Json.toJson(writeEmptyCols(List())),
      "cliente" -> Json.toJson(writeEmptyCols(List())),
      "cmi" -> Json.toJson(writeEmptyCols(List())),
      "leyendas" -> Json.toJson(writeEmptyCols(List())),
      "tags" -> Json.toJson(writeEmptyCols(List())),
      "categoriasWeb" -> Json.toJson(writeEmptyCols(List())),
      "catalogosWeb" -> Json.toJson(writeEmptyCols(List())),
      "webImages" -> Json.toJson(writeEmptyCols(List())),
      "kit" -> Json.toJson(writeEmptyCols(List())),
      "bom" -> Json.toJson(writeEmptyCols(List())),
      "additionalFields" -> Json.toJson(additionalFieldsWrites)
    )
    def additionalFieldsWrites() = Json.obj(
      "fields" -> Json.toJson(writeEmptyCols(List())),
      "values" -> Json.toJson(writeEmptyCols(List()))
    )
    def itemWrites(item: Any) = Json.obj(
      "dummy" -> Json.toJson("")
    )
    def writeEmptyCols(items: List[Any]) = items.map(item => itemWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PRODUCTO), { user =>
      Ok(Json.toJson(Producto.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Productos.update")
    productoForm.bindFromRequest.fold(
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
                    producto.rubro.rubtiId1,
                    producto.rubro.rubtiId2,
                    producto.rubro.rubtiId3,
                    producto.rubro.rubtiId4,
                    producto.rubro.rubtiId5,
                    producto.rubro.rubtiId6,
                    producto.rubro.rubtiId7,
                    producto.rubro.rubtiId8,
                    producto.rubro.rubtiId9,
                    producto.rubro.rubtiId10),
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
                    producto.names.rptIdNombreImgAlt)
              ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Productos.create")
    productoForm.bindFromRequest.fold(
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
                Producto(
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
                    producto.rubro.rubtiId1,
                    producto.rubro.rubtiId2,
                    producto.rubro.rubtiId3,
                    producto.rubro.rubtiId4,
                    producto.rubro.rubtiId5,
                    producto.rubro.rubtiId6,
                    producto.rubro.rubtiId7,
                    producto.rubro.rubtiId8,
                    producto.rubro.rubtiId9,
                    producto.rubro.rubtiId10),
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
                    producto.names.rptIdNombreImgAlt)
                ))))
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

}