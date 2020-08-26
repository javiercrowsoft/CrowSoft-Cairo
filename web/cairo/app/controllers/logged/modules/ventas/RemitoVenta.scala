package controllers.logged.modules.ventas

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.ventas._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.{Recordset, DBHelper}
import formatters.json.DateFormatter
import formatters.json.DateFormatter._
import scala.util.control.NonFatal

import Global.{getJsValueAsMap, getParamsJsonRequestFor, preprocessFormParams, doubleFormat, getParamsFromJsonRequest}

case class RemitoVentaIdData(
                               docId: Int,
                               numero: Int,
                               nroDoc: String
                             )

case class RemitoVentaBaseData(
                                 cliId: Int,
                                 estId: Int,
                                 ccosId: Int,
                                 sucId: Int,
                                 cpgId: Int,
                                 lgjId: Int,
                                 venId: Int,
                                 clisId: Int,
                                 ordenCompra: String,
                                 descrip: String
                               )

case class RemitoVentaCotizacionData(
                                       cotizacion: Double
                                     )

case class RemitoVentaPreciosData(
                                    desc1: Double,
                                    desc2: Double,
                                    lpId: Int,
                                    ldId: Int
                                  )

case class RemitoVentaDatesData(
                                  fecha: String,
                                  fechaEntrega: String
                                )

case class RemitoVentaStockData(
                                  proIdOrigen: Int,
                                  proIdDestino: Int,
                                  deplId: Int,
                                  transId: Int
                                )

case class RemitoVentaTotalsData(
                                   neto: Double,
                                   ivaRi: Double,
                                   ivaRni: Double,
                                   subTotal: Double,
                                   importeDesc1: Double,
                                   importeDesc2: Double,
                                   total: Double
                                 )

case class RemitoVentaItemDataBase(
                                     descrip: String,
                                     prId: Int,
                                     ccosId: Int,
                                     stlId: Int,
                                     orden: Int
                                   )

case class RemitoVentaItemDataTotals(
                                       cantidad: Double,
                                       precio: Double,
                                       precioLista: Double,
                                       precioUser: Double,
                                       neto: Double,
                                       ivaRi: Double,
                                       ivaRni: Option[Double],
                                       ivaRiPorc: Double,
                                       ivaRniPorc: Double,
                                       importe: Double
                                     )

case class RemitoVentaItemDataSerie(
                                      id: Int,
                                      code: String,
                                      descrip: String,
                                      fechaVto: String
                                    )

case class RemitoVentaItemData(
                                 id: Int,
                                 base: RemitoVentaItemDataBase,
                                 totals: RemitoVentaItemDataTotals,
                                 series: List[RemitoVentaItemDataSerie]
                               )

case class RemitoVentaData(
                            id: Option[Int],
                            ids: RemitoVentaIdData,
                            base: RemitoVentaBaseData,
                            dates: RemitoVentaDatesData,
                            precios: RemitoVentaPreciosData,
                            cotizacion: RemitoVentaCotizacionData,
                            stock: RemitoVentaStockData,
                            totals: RemitoVentaTotalsData,
                            items: List[RemitoVentaItemData],

                            itemDeleted: String,

                            /* applications */
                            pedidos: List[RemitoVentaPedidoData]
                           )

case class RemitoVentaPedidoData(
                                  pviId: Int,
                                  cantidad: Double,
                                  rviId: Int
                                 )

case class RemitoVentaParamsData(
                                   from: String,
                                   to: String,
                                   cliId: String,
                                   estId: String,
                                   ccosId: String,
                                   sucId: String,
                                   venId: String,
                                   docId: String,
                                   cpgId: String,
                                   empId: String
                                 )

object RemitoVentas extends Controller with ProvidesUser {

  val GC = models.cairo.modules.general.C
  val TC = models.cairo.modules.tesoreria.C

  val remitoVentaParamsForm: Form[RemitoVentaParamsData] = Form(
    mapping(
      GC.FROM -> text,
      GC.TO -> text,
      GC.CLI_ID -> text,
      GC.EST_ID -> text,
      GC.CCOS_ID -> text,
      GC.SUC_ID -> text,
      GC.VEN_ID -> text,
      GC.DOC_ID -> text,
      GC.CPG_ID -> text,
      GC.EMP_ID -> text
    )(RemitoVentaParamsData.apply)(RemitoVentaParamsData.unapply)
  )

  val remitoIdFields = List(GC.DOC_ID, C.RV_NUMERO, C.RV_NRODOC)

  val remitoBaseFields = List(GC.CLI_ID, GC.EST_ID, GC.CCOS_ID, GC.SUC_ID, GC.CPG_ID, GC.LGJ_ID,
    GC.VEN_ID, GC.CLIS_ID, C.RV_ORDEN_COMPRA, C.RV_DESCRIP)

  val remitoDatesFields = List(C.RV_FECHA, C.RV_FECHA_ENTREGA)

  val remitoPreciosFields = List(C.RV_DESCUENTO1, C.RV_DESCUENTO2, GC.LP_ID, GC.LD_ID)

  val remitoCotizacionFields = List(C.RV_COTIZACION)

  val remitoStockFields = List(C.PRO_ID_ORIGEN, C.PRO_ID_DESTINO, GC.DEPL_ID, GC.TRANS_ID)

  val remitoTotalsFields = List(C.RV_NETO, C.RV_IVA_RI, C.RV_IVA_RNI, C.RV_SUBTOTAL,
    C.RV_IMPORTE_DESC_1, C.RV_IMPORTE_DESC_2, C.RV_TOTAL)

  val remitoItemBase = List(C.RVI_DESCRIP, GC.PR_ID, GC.CCOS_ID,
    GC.CUE_ID, C.CUE_ID_IVA_RI, C.CUE_ID_IVA_RNI, GC.STL_ID, C.RVI_ORDEN)

  val remitoItemTotals = List(C.RVI_CANTIDAD, C.RVI_PRECIO, C.RVI_PRECIO_LISTA, C.RVI_PRECIO_USR, C.RVI_NETO,
    C.RVI_IVA_RI, C.RVI_IVA_RNI, C.RVI_IVA_RI_PORC, C.RVI_IVA_RNI_PORC, C.RVI_IMPORTE)

  val remitoPedido = List(C.PVI_ID, C.PV_RV_CANTIDAD, C.PVI_ID)

  val pedidoVenta = List(C.PVI_ID, C.RVI_ID, C.PV_RV_CANTIDAD, C.PV_RV_ID)

  val remitoVentaAplicForm: Form[RemitoVentaAplic] = Form(
    mapping(
      C.RV_ID -> number,
      GC.DOC_ID -> number,
      C.PEDIDO_REMITO_VENTA_TMP -> Forms.list[RemitoVentaPedidoVentaItem](
        mapping(
          C.PVI_ID -> number,
          C.RVI_ID -> number,
          C.PV_RV_CANTIDAD -> of(doubleFormat),
          C.PV_RV_ID -> number
        )(RemitoVentaPedidoVentaItem.apply)(RemitoVentaPedidoVentaItem.unapply)
      )
    )(RemitoVentaAplic.apply)(RemitoVentaAplic.unapply)
  )

  val remitoVentaForm: Form[RemitoVentaData] = Form(
    mapping(
      "id" -> optional(number),
      C.REMITO_ID -> mapping(
        GC.DOC_ID -> number,
        C.RV_NUMERO -> number,
        C.RV_NRODOC -> text)
      (RemitoVentaIdData.apply)(RemitoVentaIdData.unapply),
      C.REMITO_BASE -> mapping(
        GC.CLI_ID -> number,
        GC.EST_ID -> number,
        GC.CCOS_ID -> number,
        GC.SUC_ID -> number,
        GC.CPG_ID -> number,
        GC.LGJ_ID -> number,
        GC.VEN_ID -> number,
        GC.CLIS_ID -> number,
        C.RV_ORDEN_COMPRA -> text,
        C.RV_DESCRIP -> text)
      (RemitoVentaBaseData.apply)(RemitoVentaBaseData.unapply),
      C.REMITO_DATES -> mapping (
        C.RV_FECHA -> text,
        C.RV_FECHA_ENTREGA -> text)
      (RemitoVentaDatesData.apply)(RemitoVentaDatesData.unapply),
      C.REMITO_PRECIOS -> mapping (
        C.RV_DESCUENTO1 -> of(doubleFormat),
        C.RV_DESCUENTO2 -> of(doubleFormat),
        GC.LP_ID -> number,
        GC.LD_ID -> number)
      (RemitoVentaPreciosData.apply)(RemitoVentaPreciosData.unapply),
      C.REMITO_COTIZACION -> mapping (
        C.RV_COTIZACION -> of(doubleFormat))
      (RemitoVentaCotizacionData.apply)(RemitoVentaCotizacionData.unapply),
      C.REMITO_STOCK -> mapping (
        C.PRO_ID_ORIGEN -> number,
        C.PRO_ID_DESTINO -> number,
        GC.DEPL_ID -> number,
        GC.TRANS_ID -> number)
      (RemitoVentaStockData.apply)(RemitoVentaStockData.unapply),
      C.REMITO_TOTALS -> mapping (
        C.RV_NETO -> of(doubleFormat),
        C.RV_IVA_RI -> of(doubleFormat),
        C.RV_IVA_RNI -> of(doubleFormat),
        C.RV_SUBTOTAL -> of(doubleFormat),
        C.RV_IMPORTE_DESC_1 -> of(doubleFormat),
        C.RV_IMPORTE_DESC_2 -> of(doubleFormat),
        C.RV_TOTAL -> of(doubleFormat)
      )(RemitoVentaTotalsData.apply)(RemitoVentaTotalsData.unapply),
      C.REMITO_VENTA_ITEM_TMP -> Forms.list[RemitoVentaItemData](
        mapping(
          C.RVI_ID -> number,
          C.REMITO_ITEM_BASE -> mapping (
            C.RVI_DESCRIP -> text,
            GC.PR_ID -> number,
            GC.CCOS_ID -> number,
            GC.STL_ID -> number,
            C.RVI_ORDEN -> number)
          (RemitoVentaItemDataBase.apply)(RemitoVentaItemDataBase.unapply),
          C.REMITO_ITEM_TOTALS -> mapping (
            C.RVI_CANTIDAD -> of(doubleFormat),
            C.RVI_PRECIO -> of(doubleFormat),
            C.RVI_PRECIO_LISTA -> of(doubleFormat),
            C.RVI_PRECIO_USR -> of(doubleFormat),
            C.RVI_NETO -> of(doubleFormat),
            C.RVI_IVA_RI -> of(doubleFormat),
            C.RVI_IVA_RNI -> optional(of(doubleFormat)),
            C.RVI_IVA_RI_PORC -> of(doubleFormat),
            C.RVI_IVA_RNI_PORC -> of(doubleFormat),
            C.RVI_IMPORTE -> of(doubleFormat))
          (RemitoVentaItemDataTotals.apply)(RemitoVentaItemDataTotals.unapply),
          C.REMITO_VENTA_ITEM_SERIE_TMP -> Forms.list[RemitoVentaItemDataSerie](
            mapping (
              GC.PRNS_ID -> number,
              GC.PRNS_CODE -> text,
              GC.PRNS_DESCRIP -> text,
              GC.PRNS_FECHA_VTO -> text)
            (RemitoVentaItemDataSerie.apply)(RemitoVentaItemDataSerie.unapply)
          ))
        (RemitoVentaItemData.apply)(RemitoVentaItemData.unapply)
      ),
      C.REMITO_ITEM_DELETED -> text,
      C.PEDIDO_REMITO_VENTA_TMP -> Forms.list[RemitoVentaPedidoData](
        mapping (
          C.RVI_ID -> number,
          C.PV_RV_CANTIDAD -> of(doubleFormat),
          C.RVI_ID -> number)
        (RemitoVentaPedidoData.apply)(RemitoVentaPedidoData.unapply)
      )
    )(RemitoVentaData.apply)(RemitoVentaData.unapply)
  )

  implicit val remitoVentaParamsWrites = new Writes[RemitoVentaParams] {
    def writes(remitoVentaParams: RemitoVentaParams) = Json.obj(
      GC.FROM -> Json.toJson(remitoVentaParams.from),
      GC.TO -> Json.toJson(remitoVentaParams.to),
      GC.CLI_ID -> Json.toJson(remitoVentaParams.cliId),
      GC.CLI_NAME -> Json.toJson(remitoVentaParams.cliName),
      GC.EST_ID -> Json.toJson(remitoVentaParams.estId),
      GC.EST_NAME -> Json.toJson(remitoVentaParams.estName),
      GC.CCOS_ID -> Json.toJson(remitoVentaParams.ccosId),
      GC.CCOS_NAME -> Json.toJson(remitoVentaParams.ccosName),
      GC.SUC_ID -> Json.toJson(remitoVentaParams.sucId),
      GC.SUC_NAME -> Json.toJson(remitoVentaParams.sucName),
      GC.VEN_ID -> Json.toJson(remitoVentaParams.venId),
      GC.VEN_NAME -> Json.toJson(remitoVentaParams.venName),
      GC.DOC_ID -> Json.toJson(remitoVentaParams.docId),
      GC.DOC_NAME -> Json.toJson(remitoVentaParams.docName),
      GC.CPG_ID -> Json.toJson(remitoVentaParams.cpgId),
      GC.CPG_NAME -> Json.toJson(remitoVentaParams.cpgName),
      GC.EMP_ID -> Json.toJson(remitoVentaParams.empId),
      GC.EMP_NAME -> Json.toJson(remitoVentaParams.empName)
    )
  }

  implicit val remitoVentaWrites = new Writes[RemitoVenta] {
    def writes(remitoVenta: RemitoVenta) = Json.obj(
      "id" -> Json.toJson(remitoVenta.id),
      C.RV_ID -> Json.toJson(remitoVenta.id),

      GC.DOC_ID -> Json.toJson(remitoVenta.ids.docId),
      GC.DOC_NAME -> Json.toJson(remitoVenta.ids.docName),
      C.RV_NRODOC -> Json.toJson(remitoVenta.ids.nroDoc),
      C.RV_NUMERO -> Json.toJson(remitoVenta.ids.numero),

      C.RV_FECHA -> Json.toJson(remitoVenta.dates.fecha),
      C.RV_FECHA_ENTREGA -> Json.toJson(remitoVenta.dates.fechaEntrega),

      GC.CLI_ID -> Json.toJson(remitoVenta.base.cliId),
      GC.CLI_NAME -> Json.toJson(remitoVenta.base.cliName),
      GC.EST_ID -> Json.toJson(remitoVenta.base.estId),
      GC.EST_NAME -> Json.toJson(remitoVenta.base.estName),
      GC.SUC_ID -> Json.toJson(remitoVenta.base.sucId),
      GC.SUC_NAME -> Json.toJson(remitoVenta.base.sucName),
      GC.CPG_ID -> Json.toJson(remitoVenta.base.cpgId),
      GC.CPG_NAME -> Json.toJson(remitoVenta.base.cpgName),
      GC.CCOS_ID -> Json.toJson(remitoVenta.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(remitoVenta.base.ccosName),
      GC.LGJ_ID -> Json.toJson(remitoVenta.base.lgjId),
      GC.LGJ_CODE -> Json.toJson(remitoVenta.base.lgjCode),
      GC.VEN_ID -> Json.toJson(remitoVenta.base.venId),
      GC.VEN_NAME -> Json.toJson(remitoVenta.base.venName),
      GC.CLIS_ID -> Json.toJson(remitoVenta.base.clisId),
      GC.CLIS_NAME -> Json.toJson(remitoVenta.base.clisName),
      C.RV_ORDEN_COMPRA -> Json.toJson(remitoVenta.base.ordenCompra),
      C.RV_DESCRIP -> Json.toJson(remitoVenta.base.descrip),

      GC.DOCT_ID -> Json.toJson(remitoVenta.references.doctId),
      GC.DOCT_NAME -> Json.toJson(remitoVenta.references.doctName),
      GC.MON_ID -> Json.toJson(remitoVenta.references.monId),
      GC.MON_NAME -> Json.toJson(remitoVenta.references.monName),
      GC.TA_MASCARA -> Json.toJson(remitoVenta.references.taMascara),
      GC.TA_PROPUESTO -> Json.toJson(remitoVenta.references.taPropuesto),
      C.RV_FIRMADO -> Json.toJson(remitoVenta.references.firmado),
      GC.DOC_MUEVE_STOCK -> Json.toJson(remitoVenta.references.docMueveStock),
      C.ST_ID -> Json.toJson(remitoVenta.references.stId),
      GC.HAS_IVA_RI -> Json.toJson(remitoVenta.references.hasIvaRi),
      GC.HAS_IVA_RNI -> Json.toJson(remitoVenta.references.hasIvaRni),
      GC.EDITABLE -> Json.toJson(remitoVenta.references.editable),
      GC.EDIT_MSG -> Json.toJson(remitoVenta.references.editMsg),

      C.RV_COTIZACION -> Json.toJson(remitoVenta.cotizacion.cotizacion),

      C.RV_DESCUENTO1 -> Json.toJson(remitoVenta.precios.desc1),
      C.RV_DESCUENTO2 -> Json.toJson(remitoVenta.precios.desc2),
      GC.LP_ID -> Json.toJson(remitoVenta.precios.lpId),
      GC.LP_NAME -> Json.toJson(remitoVenta.precios.lpName),
      GC.LD_ID -> Json.toJson(remitoVenta.precios.ldId),
      GC.LD_NAME -> Json.toJson(remitoVenta.precios.ldName),

      GC.DEPL_ID -> Json.toJson(remitoVenta.stock.deplId),
      GC.DEPL_NAME -> Json.toJson(remitoVenta.stock.deplName),
      GC.TRANS_ID -> Json.toJson(remitoVenta.stock.transId),
      GC.TRANS_NAME -> Json.toJson(remitoVenta.stock.transName),
      C.PRO_ID_ORIGEN -> Json.toJson(remitoVenta.stock.proIdOrigen),
      C.PRO_ORIGEN_NAME -> Json.toJson(remitoVenta.stock.proNameOrigen),
      C.PRO_ID_DESTINO -> Json.toJson(remitoVenta.stock.proIdOrigen),
      C.PRO_DESTINO_NAME -> Json.toJson(remitoVenta.stock.proNameOrigen),

      C.RV_NETO -> Json.toJson(remitoVenta.totals.neto),
      C.RV_IVA_RI -> Json.toJson(remitoVenta.totals.ivaRi),
      C.RV_IVA_RNI -> Json.toJson(remitoVenta.totals.ivaRni),
      C.RV_SUBTOTAL -> Json.toJson(remitoVenta.totals.subTotal),
      C.RV_IMPORTE_DESC_1 -> Json.toJson(remitoVenta.totals.importeDesc1),
      C.RV_IMPORTE_DESC_2 -> Json.toJson(remitoVenta.totals.importeDesc2),
      C.RV_TOTAL -> Json.toJson(remitoVenta.totals.total),

      // Items
      "items" -> Json.toJson(writeRemitoVentaItems(remitoVenta.items.items)),
      "serialNumbers" -> Json.toJson(writeRemitoVentaItemSeries(remitoVenta.items.series)),
      "kitDefinitions" -> Json.toJson(writeRemitoVentaItemKits(remitoVenta.items.kits))
    )
    def remitoVentaItemWrites(i: RemitoVentaItem) = Json.obj(
      C.RVI_ID -> Json.toJson(i.id),
      C.RVI_DESCRIP -> Json.toJson(i.base.descrip),
      C.RVI_DESCUENTO -> Json.toJson(i.base.descuento),
      GC.PR_ID -> Json.toJson(i.base.prId),
      GC.PR_NAME_VENTA -> Json.toJson(i.base.prName),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.STL_ID -> Json.toJson(i.base.stlId),
      GC.STL_CODE -> Json.toJson(i.base.stlCode),
      C.RVI_ORDEN -> Json.toJson(i.base.orden),
      GC.PR_LLEVA_NRO_SERIE -> Json.toJson(i.base.llevaNroSerie),
      GC.PR_LLEVA_NRO_LOTE -> Json.toJson(i.base.llevaNroLote),
      GC.UN_NAME -> Json.toJson(i.base.unName),
      C.RVI_CANTIDAD -> Json.toJson(i.totals.cantidad),
      C.RVI_PRECIO -> Json.toJson(i.totals.precio),
      C.RVI_PRECIO_LISTA -> Json.toJson(i.totals.precioLista),
      C.RVI_PRECIO_USR -> Json.toJson(i.totals.precioUser),
      C.RVI_NETO -> Json.toJson(i.totals.neto),
      C.RVI_IVA_RI -> Json.toJson(i.totals.ivaRi),
      C.RVI_IVA_RNI -> Json.toJson(i.totals.ivaRni),
      C.RVI_IVA_RI_PORC -> Json.toJson(i.totals.ivaRiPorc),
      C.RVI_IVA_RNI_PORC -> Json.toJson(i.totals.ivaRniPorc),
      C.RVI_IMPORTE -> Json.toJson(i.totals.importe)
    )
    def remitoVentaItemSerieWrites(i: RemitoVentaItemSerie) = Json.obj(
      C.RVI_ID -> Json.toJson(i.rviId),
      GC.PRNS_ID -> Json.toJson(i.id),
      GC.PRNS_CODE -> Json.toJson(i.code),
      GC.PRNS_DESCRIP -> Json.toJson(i.descrip),
      GC.PRNS_FECHA_VTO -> Json.toJson(i.fechaVto)
    )
    def remitoVentaItemKitWrites(p: RemitoVentaItemKit) = Json.obj(
      GC.PR_ID -> Json.toJson(p.id),
      GC.PR_NAME_VENTA -> Json.toJson(p.name),
      GC.PRK_CANTIDAD -> Json.toJson(p.amount),
      GC.PR_LLEVA_NRO_SERIE -> Json.toJson(p.hasSerial)
    )
    def writeRemitoVentaItems(items: List[RemitoVentaItem]) = items.map(item => remitoVentaItemWrites(item))
    def writeRemitoVentaItemSeries(items: List[RemitoVentaItemSerie]) = items.map(item => remitoVentaItemSerieWrites(item))
    def writeRemitoVentaItemKits(items: List[RemitoVentaItemKit]) = items.map(item => remitoVentaItemKitWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_REMITO_VENTA), { user =>
      Ok(Json.toJson(RemitoVenta.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a RemitoData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in RemitoVenta/Data, RemitoVentaItem/Data, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def preprocessSeriesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case jsArray: JsArray => Map(group -> jsArray)
      case _ => Map(group -> JsArray(List()))
    }

    def preprocessItemParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for RemitoVentaItemData
      //
      val remitoItem = preprocessFormParams(List(C.RVI_ID), "", params)
      val remitoItemBaseGroup = preprocessFormParams(remitoItemBase, C.REMITO_ITEM_BASE, params)
      val remitoItemTotalsGroup = preprocessFormParams(remitoItemTotals, C.REMITO_ITEM_TOTALS, params)

      // in the POSTED JSON we have this structure:
      //
      //     RemitoVentaItemSerieTMP: {
      //          items: [],
      //          deletedList: ""
      //      }
      //
      // we need to convert it into
      //
      //      deletedList: "",
      //      RemitoVentaItemSerieTMP: []
      //
      // NOTICE that deletedList is a field of RemitoVentaItemSerieTMP but in the converted structure
      // it is move up to the parent node ( the RemitoVentaItem )
      //
      // this is done because in database.js we have one Transaction object to manage items in a Master-Detail
      // relation like RemitoVentaItem -> RemitoVentaItemSerie or RemitoVenta -> RemitoVentaItem
      //
      // this Transaction object is an intermediary object which doesn't exists here
      //
      // so RemitoVentaItemData has deletedList field called serieDeleted and RemitoVentaData has four deletedList
      // fields: itemDeleted and percepcionDeleted
      //

      val serieInfo = getJsValueAsMap(getParamsJsonRequestFor(C.REMITO_VENTA_ITEM_SERIE_TMP, params))
      val serieRows = getParamsJsonRequestFor(GC.ITEMS, serieInfo)
      val deletedList: Map[String, JsValue] = getParamsJsonRequestFor(GC.DELETED_LIST, serieInfo).toList match {
        case Nil => Map(GC.DELETED_LIST -> Json.toJson(""))
        case deletedList :: t => Map(deletedList)
      }
      val serieItems = serieRows.toList match {
        case (k: String, item: JsValue) :: t => preprocessSeriesParam(item, C.REMITO_VENTA_ITEM_SERIE_TMP)
        case _ => Map(C.REMITO_VENTA_ITEM_SERIE_TMP -> JsArray(List()))
      }

      val item = JsObject(
        (remitoItem ++ remitoItemBaseGroup ++ remitoItemTotalsGroup ++ serieItems ++ deletedList).toSeq)
      item
    }

    def preprocessPedidoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(remitoPedido, "", params).toSeq)
    }

    def preprocessItemsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessItemParam(_))))
      case _ => Map.empty
    }

    def preprocessPedidosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessPedidoParam(_))))
      case _ => Map.empty
    }

    val params = getParamsFromJsonRequest

    // groups for RemitoVentaData
    //
    val remitoId = preprocessFormParams(List("id"), "", params)
    val remitoIdGroup = preprocessFormParams(remitoIdFields, C.REMITO_ID, params)
    val remitoBaseGroup = preprocessFormParams(remitoBaseFields, C.REMITO_BASE, params)
    val remitoDatesGroup = preprocessFormParams(remitoDatesFields, C.REMITO_DATES, params)
    val remitoPreciosGroup = preprocessFormParams(remitoPreciosFields, C.REMITO_PRECIOS, params)
    val remitoCotizacionGroup = preprocessFormParams(remitoCotizacionFields, C.REMITO_COTIZACION, params)
    val remitoStockGroup = preprocessFormParams(remitoStockFields, C.REMITO_STOCK, params)
    val remitoTotalGroup = preprocessFormParams(remitoTotalsFields, C.REMITO_TOTALS, params)

    // items
    //
    val itemsInfo = getJsValueAsMap(getParamsJsonRequestFor(C.REMITO_VENTA_ITEM_TMP, params))
    val itemRows = getParamsJsonRequestFor(GC.ITEMS, itemsInfo)
    val itemDeleted: Map[String, JsValue] = getParamsJsonRequestFor(GC.DELETED_LIST, itemsInfo).toList match {
      case Nil => Map(C.REMITO_ITEM_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.REMITO_ITEM_DELETED -> Json.toJson(deletedList._2))
    }
    val remitoItems = preprocessItemsParam(itemRows.head._2, C.REMITO_VENTA_ITEM_TMP)

    // pedidos
    //
    val pedidosInfo = getJsValueAsMap(getParamsJsonRequestFor(C.PEDIDO_REMITO_VENTA_TMP, params))
    val pedidoRows = getParamsJsonRequestFor(GC.ITEMS, pedidosInfo)
    val remitoPedidos = pedidoRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessPedidosParam(item, C.PEDIDO_REMITO_VENTA_TMP)
      case _ => Map(C.PEDIDO_REMITO_VENTA_TMP -> JsArray(List()))
    }

    JsObject(
      (remitoId ++ remitoIdGroup ++ remitoBaseGroup ++ remitoDatesGroup ++ remitoPreciosGroup
        ++ remitoCotizacionGroup ++ remitoStockGroup ++ remitoTotalGroup
        ++ remitoItems ++ itemDeleted ++ remitoPedidos).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in SAVE_APLIC into a RemitoVentaAplic structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in RemitoVenta/Aplic, RemitoVenta/NotaCredito/Cobranza, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessAplicParams(implicit request:Request[AnyContent]): JsObject = {

    def preprocessPedidoVentaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(preprocessFormParams(pedidoVenta, "", params).toSeq)
    }

    def preprocessPedidosVentaParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessPedidoVentaParam(_))))
      case _ => Map.empty
    }

    val params = getParamsFromJsonRequest

    // groups for RemitoVentaData
    //
    val remitoId = preprocessFormParams(List(C.RV_ID, GC.DOC_ID), "", params)

    // pedidos de venta
    //
    val pedidosVentaInfo = getJsValueAsMap(getParamsJsonRequestFor(C.PEDIDO_REMITO_VENTA_TMP, params))
    val pedidosVentaRows = getParamsJsonRequestFor(GC.ITEMS, pedidosVentaInfo)
    val pedidosVenta = pedidosVentaRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessPedidosVentaParam(item, C.PEDIDO_REMITO_VENTA_TMP)
      case _ => Map(C.PEDIDO_REMITO_VENTA_TMP -> JsArray(List()))
    }

    JsObject((remitoId ++ pedidosVenta).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getItems(items: List[RemitoVentaItemData]): List[RemitoVentaItem] = {
    items.map(item => {
      RemitoVentaItem(
        item.id,
        RemitoVentaItemBase(
          item.base.descrip,
          "",
          item.base.prId,
          item.base.ccosId,
          item.base.stlId,
          item.base.orden
        ),
        RemitoVentaItemTotals(
          item.totals.cantidad,
          item.totals.precio,
          item.totals.precioLista,
          item.totals.precioUser,
          item.totals.neto,
          item.totals.ivaRi,
          item.totals.ivaRni.getOrElse(0.0),
          item.totals.ivaRiPorc,
          item.totals.ivaRniPorc,
          item.totals.importe
        ),
        item.series.map(serie => {
          RemitoVentaItemSerie(
            serie.id,
            serie.code,
            serie.descrip,
            DateFormatter.parse(serie.fechaVto),
            DBHelper.NoId
          )
        })
      )
    })
  }

  def getPedidos(pedidos: List[RemitoVentaPedidoData]): List[RemitoVentaPedido] = {
    pedidos.map(pedido => {
      RemitoVentaPedido(
        pedido.pviId,
        pedido.cantidad,
        pedido.rviId
      )
    })
  }

  def getRemitoVentaItems(remitoVenta: RemitoVentaData): RemitoVentaItems = {
    RemitoVentaItems(
      getItems(remitoVenta.items),

      List(), /* only used when loading a delivery note to respond a get RemitoVenta */

      List(), /* only used when loading a delivery note to respond a get RemitoVenta */

      remitoVenta.itemDeleted,

      getPedidos(remitoVenta.pedidos)
    )
  }

  def getRemitoVenta(remitoVenta: RemitoVentaData, id: Int): RemitoVenta = {
    RemitoVenta(
      id,
      RemitoVentaId(
        remitoVenta.ids.docId,
        remitoVenta.ids.numero,
        remitoVenta.ids.nroDoc),
      RemitoVentaBase(
        remitoVenta.base.cliId,
        remitoVenta.base.estId,
        remitoVenta.base.ccosId,
        remitoVenta.base.sucId,
        remitoVenta.base.cpgId,
        remitoVenta.base.lgjId,
        remitoVenta.base.venId,
        remitoVenta.base.clisId,
        remitoVenta.base.ordenCompra,
        remitoVenta.base.descrip),
      RemitoVenta.emptyRemitoVentaReferences,
      RemitoVentaDates(
        DateFormatter.parse(remitoVenta.dates.fecha),
        DateFormatter.parse(remitoVenta.dates.fechaEntrega)),
      RemitoVentaPrecios(
        remitoVenta.precios.desc1,
        remitoVenta.precios.desc2,
        remitoVenta.precios.lpId,
        remitoVenta.precios.ldId),
      RemitoVentaCotizacion(
        remitoVenta.cotizacion.cotizacion),
      RemitoVentaStock(
        remitoVenta.stock.proIdOrigen,
        remitoVenta.stock.proIdDestino,
        remitoVenta.stock.deplId,
        remitoVenta.stock.transId),
      RemitoVentaTotals(
        remitoVenta.totals.neto,
        remitoVenta.totals.ivaRi,
        remitoVenta.totals.ivaRni,
        remitoVenta.totals.subTotal,
        remitoVenta.totals.importeDesc1,
        remitoVenta.totals.importeDesc2,
        remitoVenta.totals.total),
      getRemitoVentaItems(remitoVenta)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in RemitoVentas.update")

    remitoVentaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      remitoVenta => {
        Logger.debug(s"form: ${remitoVenta.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_REMITO_VENTA), { user =>
          try {
            Ok(
              Json.toJson(
                RemitoVenta.update(user,
                  getRemitoVenta(remitoVenta, id)
                )
              )
            )
          } catch {
            case NonFatal(e) => {
              responseError(e)
            }
          }
        })
      }
    )
  }

  def createFromRemito = PostAction { implicit request =>
    Logger.debug("in RemitoVentas.create")
    remitoVentaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      remitoVenta => {
        Logger.debug(s"form: ${remitoVenta.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_REMITO_VENTA), { user =>
          try {
            Ok(
              Json.toJson(
                RemitoVenta.createFromRemito(user,
                  getRemitoVenta(remitoVenta, DBHelper.NoId)
                )
              )
            )
          } catch {
            case NonFatal(e) => {
              responseError(e)
            }
          }
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in RemitoVentas.create")
    remitoVentaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      remitoVenta => {
        Logger.debug(s"form: ${remitoVenta.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_REMITO_VENTA), { user =>
          try {
            Ok(
              Json.toJson(
                RemitoVenta.create(user,
                  getRemitoVenta(remitoVenta, DBHelper.NoId)
                )
              )
            )
          } catch {
            case NonFatal(e) => {
              responseError(e)
            }
          }
        })
      }
    )
  }

  def responseError(e: Throwable): SimpleResult = {
    if (e.getMessage.contains("@@ERROR_SP:"))
      Ok(
        Json.obj(
          "id" -> 0,
          "errors" -> Json.obj("message" -> e.getMessage.split("@@ERROR_SP:")(1))
        )
      )
    else
      throw e
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in RemitoVentas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_REMITO_VENTA), { user =>
      try {
        RemitoVenta.delete(user, id)
        // Backbonejs requires at least an empty json object in the response
        // if not it will call errorHandler even when we responded with 200 OK :P
        Ok(JsonUtil.emptyJson)
      } catch {
        case NonFatal(e) => {
          responseError(e)
        }
      }
    })
  }

  def list(
            from: Option[String],
            to: Option[String],
            cliId: Option[String],
            estId: Option[String],
            ccosId: Option[String],
            sucId: Option[String],
            venId: Option[String],
            docId: Option[String],
            cpgId: Option[String],
            empId: Option[String]
          ) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_REMITO_VENTA), { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            RemitoVenta.list(
              user,
              DateFormatter.parse(from.getOrElse("")), DateFormatter.parse(to.getOrElse("")),
              cliId, estId, ccosId, sucId, venId, docId, cpgId, empId))))
    })
  }

  def parameters = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_REMITO_VENTA), { user =>
      Ok(Json.toJson(RemitoVenta.loadParams(user)))
    })
  }

  def saveParameters = PostAction { implicit request =>
    Logger.debug("in RemitoVentas.saveParameters")
    remitoVentaParamsForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      remitoVentaParams => {
        Logger.debug(s"form: ${remitoVentaParams.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_REMITO_VENTA), { user =>
          Ok(
            Json.toJson(
              RemitoVenta.saveParams(user,
                RemitoVentaParams(
                  remitoVentaParams.from,
                  remitoVentaParams.to,
                  remitoVentaParams.cliId,
                  remitoVentaParams.estId,
                  remitoVentaParams.ccosId,
                  remitoVentaParams.sucId,
                  remitoVentaParams.venId,
                  remitoVentaParams.docId,
                  remitoVentaParams.cpgId,
                  remitoVentaParams.empId
                )
              )
            )
          )
        })
      }
    )
  }

  def notes(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_REMITO_VENTA), { user =>
      Ok(Json.toJson(""))
    })
  }

  def listRemitos(cliId: Int, currencyId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_REMITO_VENTA), { user =>
      Ok(Recordset.getAsJson(RemitoVenta.listRemitos(user, cliId, currencyId)))
    })
  }

  def listRemitosItems(ids: Option[String]) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_REMITO_VENTA), { user =>
      Ok(Json.toJson(Recordset.getAsJson(RemitoVenta.listRemitosItems(user, ids.getOrElse("")))))
    })
  }

  def getAplic(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.MODIFY_APLIC_VENTA), { user =>
      Ok(Json.obj(
        "items" -> Recordset.getAsJson(RemitoVenta.getAplic(user, id, 4)),
        "itemsAplicados" -> Recordset.getAsJson(RemitoVenta.getAplic(user, id, 5)),
        "itemsParaAplicar" -> Recordset.getAsJson(RemitoVenta.getAplic(user, id, 6))
      ))
    })
  }

  def saveAplic(id: Int) = GetAction { implicit request =>
    remitoVentaAplicForm.bind(preprocessAplicParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      remitoVentaAplic => {
        Logger.debug(s"form: ${remitoVentaAplic.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.MODIFY_APLIC_VENTA), { user =>
          try {
            Ok(
              Json.toJson(
                RemitoVenta.saveAplic(user, remitoVentaAplic)
              )
            )
          } catch {
            case NonFatal(e) => {
              responseError(e)
            }
          }
        })
      }
    )
  }

}