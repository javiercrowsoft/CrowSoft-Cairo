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
import java.util.Date
import formatters.json.DateFormatter
import formatters.json.DateFormatter._
import scala.util.control.NonFatal
import models.cairo.modules.general.VentaModo

case class PedidoVentaIdData(
                                docId: Int,
                                numero: Int,
                                nroDoc: String
                                )

case class PedidoVentaBaseData(
                                  cliId: Int,
                                  estId: Int,
                                  ccosId: Int,
                                  sucId: Int,
                                  cpgId: Int,
                                  lgjId: Int,
                                  venId: Int,
                                  clisId: Int,
                                  destinatario: String,
                                  ordenCompra: String,
                                  descrip: String
                                  )

case class PedidoVentaPreciosData(
                                     desc1: Double,
                                     desc2: Double,
                                     lpId: Int,
                                     ldId: Int
                                     )

case class PedidoVentaDatesData(
                                   fecha: String,
                                   fechaEntrega: String
                                   )

case class PedidoVentaStockData(
                                 proIdOrigen: Int,
                                 proIdDestino: Int,
                                 ramIdStock: String,
                                 transId: Int,
                                 chofId: Int,
                                 camId: Int,
                                 semiId: Int
                               )

case class PedidoVentaTotalsData(
                                    neto: Double,
                                    ivaRi: Double,
                                    ivaRni: Double,
                                    subTotal: Double,
                                    importeDesc1: Double,
                                    importeDesc2: Double,
                                    total: Double
                                    )

case class PedidoVentaItemDataBase(
                                      descrip: String,
                                      prId: Int,
                                      ccosId: Int,
                                      orden: Int
                                      )

case class PedidoVentaItemDataTotals(
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

case class PedidoVentaItemData(
                                  id: Int,
                                  base: PedidoVentaItemDataBase,
                                  totals: PedidoVentaItemDataTotals
                                  )

case class PedidoVentaData(
                              id: Option[Int],
                              ids: PedidoVentaIdData,
                              base: PedidoVentaBaseData,
                              dates: PedidoVentaDatesData,
                              precios: PedidoVentaPreciosData,
                              stock: PedidoVentaStockData,
                              totals: PedidoVentaTotalsData,
                              items: List[PedidoVentaItemData],

                              itemDeleted: String,

                              /* applications */
                              presupuestos: List[PedidoVentaPresupuestoData]
                              )

case class PedidoVentaPresupuestoData(
                                    prviId: Int,
                                    cantidad: Double,
                                    pviId: Int
                                    )

case class PedidoVentaParamsData(
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

object PedidoVentas extends Controller with ProvidesUser {

  val GC = models.cairo.modules.general.C

  val pedidoVentaParamsForm: Form[PedidoVentaParamsData] = Form(
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
    )(PedidoVentaParamsData.apply)(PedidoVentaParamsData.unapply)
  )

  val pedidoIdFields = List(GC.DOC_ID, C.PV_NUMERO, C.PV_NRODOC)

  val pedidoBaseFields = List(GC.CLI_ID, GC.EST_ID, GC.CCOS_ID, GC.SUC_ID, GC.CPG_ID, GC.LGJ_ID,
    GC.VEN_ID, GC.CLIS_ID, C.PV_DESTINATARIO, C.PV_ORDEN_COMPRA, C.PV_DESCRIP)

  val pedidoDatesFields = List(C.PV_FECHA, C.PV_FECHA_ENTREGA)

  val pedidoPreciosFields = List(C.PV_DESCUENTO1, C.PV_DESCUENTO2, GC.LP_ID, GC.LD_ID)

  val pedidoStockFields = List(C.PRO_ID_ORIGEN, C.PRO_ID_DESTINO, C.RAM_ID_STOCK, GC.TRANS_ID, GC.CHOF_ID, GC.CAM_ID, GC.CAM_ID_SEMI)

  val pedidoTotalsFields = List(C.PV_NETO, C.PV_IVA_RI, C.PV_IVA_RNI, C.PV_SUBTOTAL,
    C.PV_IMPORTE_DESC_1, C.PV_IMPORTE_DESC_2, C.PV_TOTAL)

  val pedidoItemBase = List(C.PVI_DESCRIP, GC.PR_ID, GC.CCOS_ID, C.PVI_ORDEN)

  val pedidoItemTotals = List(C.PVI_CANTIDAD, C.PVI_PRECIO, C.PVI_PRECIO_LISTA, C.PVI_PRECIO_USR, C.PVI_NETO,
    C.PVI_IVA_RI, C.PVI_IVA_RNI, C.PVI_IVA_RIPORC, C.PVI_IVA_RNIPORC, C.PVI_IMPORTE)

  val pedidoPresupuesto = List(C.PRVI_ID, C.PRV_PV_CANTIDAD, C.PVI_ID)

  val pedidoVentaForm: Form[PedidoVentaData] = Form(
    mapping(
      "id" -> optional(number),
      C.PEDIDO_ID -> mapping(
        GC.DOC_ID -> number,
        C.PV_NUMERO -> number,
        C.PV_NRODOC -> text)
        (PedidoVentaIdData.apply)(PedidoVentaIdData.unapply),
      C.PEDIDO_BASE -> mapping(
        GC.CLI_ID -> number,
        GC.EST_ID -> number,
        GC.CCOS_ID -> number,
        GC.SUC_ID -> number,
        GC.CPG_ID -> number,
        GC.LGJ_ID -> number,
        GC.VEN_ID -> number,
        GC.CLIS_ID -> number,
        C.PV_DESTINATARIO -> text,
        C.PV_ORDEN_COMPRA -> text,
        C.PV_DESCRIP -> text)
        (PedidoVentaBaseData.apply)(PedidoVentaBaseData.unapply),
      C.PEDIDO_DATES -> mapping (
        C.PV_FECHA -> text,
        C.PV_FECHA_ENTREGA -> text)
        (PedidoVentaDatesData.apply)(PedidoVentaDatesData.unapply),
      C.PEDIDO_PRECIOS -> mapping (
        C.PV_DESCUENTO1 -> of(Global.doubleFormat),
        C.PV_DESCUENTO2 -> of(Global.doubleFormat),
        GC.LP_ID -> number,
        GC.LD_ID -> number)
        (PedidoVentaPreciosData.apply)(PedidoVentaPreciosData.unapply),
      C.PEDIDO_STOCK -> mapping (
        C.PRO_ID_ORIGEN -> number,
        C.PRO_ID_DESTINO -> number,
        C.RAM_ID_STOCK -> text,
        GC.TRANS_ID -> number,
        GC.CHOF_ID -> number,
        GC.CAM_ID -> number,
        GC.CAM_ID_SEMI -> number)
        (PedidoVentaStockData.apply)(PedidoVentaStockData.unapply),
      C.PEDIDO_TOTALS -> mapping (
        C.PV_NETO -> of(Global.doubleFormat),
        C.PV_IVA_RI -> of(Global.doubleFormat),
        C.PV_IVA_RNI -> of(Global.doubleFormat),
        C.PV_SUBTOTAL -> of(Global.doubleFormat),
        C.PV_IMPORTE_DESC_1 -> of(Global.doubleFormat),
        C.PV_IMPORTE_DESC_2 -> of(Global.doubleFormat),
        C.PV_TOTAL -> of(Global.doubleFormat))
        (PedidoVentaTotalsData.apply)(PedidoVentaTotalsData.unapply),
      C.PEDIDO_VENTA_ITEM_TMP -> Forms.list[PedidoVentaItemData](
        mapping(
          C.PVI_ID -> number,
          C.PEDIDO_ITEM_BASE -> mapping (
            C.PVI_DESCRIP -> text,
            GC.PR_ID -> number,
            GC.CCOS_ID -> number,
            C.PVI_ORDEN -> number)
            (PedidoVentaItemDataBase.apply)(PedidoVentaItemDataBase.unapply),
          C.PEDIDO_ITEM_TOTALS -> mapping (
            C.PVI_CANTIDAD -> of(Global.doubleFormat),
            C.PVI_PRECIO -> of(Global.doubleFormat),
            C.PVI_PRECIO_LISTA -> of(Global.doubleFormat),
            C.PVI_PRECIO_USR -> of(Global.doubleFormat),
            C.PVI_NETO -> of(Global.doubleFormat),
            C.PVI_IVA_RI -> of(Global.doubleFormat),
            C.PVI_IVA_RNI -> optional(of(Global.doubleFormat)),
            C.PVI_IVA_RIPORC -> of(Global.doubleFormat),
            C.PVI_IVA_RNIPORC -> of(Global.doubleFormat),
            C.PVI_IMPORTE -> of(Global.doubleFormat))
            (PedidoVentaItemDataTotals.apply)(PedidoVentaItemDataTotals.unapply))
          (PedidoVentaItemData.apply)(PedidoVentaItemData.unapply)
      ),
      C.PEDIDO_ITEM_DELETED -> text,
      C.PRESUPUESTO_PEDIDO_VENTA_TMP -> Forms.list[PedidoVentaPresupuestoData](
        mapping (
          C.PRVI_ID -> number,
          C.PRV_PV_CANTIDAD -> of(Global.doubleFormat),
          C.PVI_ID -> number)
          (PedidoVentaPresupuestoData.apply)(PedidoVentaPresupuestoData.unapply)
      )
    )(PedidoVentaData.apply)(PedidoVentaData.unapply)
  )

  implicit val pedidoVentaParamsWrites = new Writes[PedidoVentaParams] {
    def writes(pedidoVentaParams: PedidoVentaParams) = Json.obj(
      GC.FROM -> Json.toJson(pedidoVentaParams.from),
      GC.TO -> Json.toJson(pedidoVentaParams.to),
      GC.CLI_ID -> Json.toJson(pedidoVentaParams.cliId),
      GC.CLI_NAME -> Json.toJson(pedidoVentaParams.cliName),
      GC.EST_ID -> Json.toJson(pedidoVentaParams.estId),
      GC.EST_NAME -> Json.toJson(pedidoVentaParams.estName),
      GC.CCOS_ID -> Json.toJson(pedidoVentaParams.ccosId),
      GC.CCOS_NAME -> Json.toJson(pedidoVentaParams.ccosName),
      GC.SUC_ID -> Json.toJson(pedidoVentaParams.sucId),
      GC.SUC_NAME -> Json.toJson(pedidoVentaParams.sucName),
      GC.VEN_ID -> Json.toJson(pedidoVentaParams.venId),
      GC.VEN_NAME -> Json.toJson(pedidoVentaParams.venName),
      GC.DOC_ID -> Json.toJson(pedidoVentaParams.docId),
      GC.DOC_NAME -> Json.toJson(pedidoVentaParams.docName),
      GC.CPG_ID -> Json.toJson(pedidoVentaParams.cpgId),
      GC.CPG_NAME -> Json.toJson(pedidoVentaParams.cpgName),
      GC.EMP_ID -> Json.toJson(pedidoVentaParams.empId),
      GC.EMP_NAME -> Json.toJson(pedidoVentaParams.empName),

      // VentaModos
      "ventaModos" -> Json.toJson(writeVentaModos(pedidoVentaParams.ventaModos))
    )
    def ventaModoWrites(i: VentaModo) = Json.obj(
      GC.VM_ID -> Json.toJson(i.id),
      GC.VM_NAME -> Json.toJson(i.name),
      GC.VM_CTA_CTE -> Json.toJson(i.ctaCte),
      GC.CUE_ID -> Json.toJson(i.cueId)
    )
    def writeVentaModos(items: List[VentaModo]) = items.map(item => ventaModoWrites(item))
  }

  implicit val pedidoVentaWrites = new Writes[PedidoVenta] {
    def writes(pedidoVenta: PedidoVenta) = Json.obj(
      "id" -> Json.toJson(pedidoVenta.id),
      C.PV_ID -> Json.toJson(pedidoVenta.id),

      GC.DOC_ID -> Json.toJson(pedidoVenta.ids.docId),
      GC.DOC_NAME -> Json.toJson(pedidoVenta.ids.docName),
      C.PV_NRODOC -> Json.toJson(pedidoVenta.ids.nroDoc),
      C.PV_NUMERO -> Json.toJson(pedidoVenta.ids.numero),

      C.PV_FECHA -> Json.toJson(pedidoVenta.dates.fecha),
      C.PV_FECHA_ENTREGA -> Json.toJson(pedidoVenta.dates.fechaEntrega),

      GC.CLI_ID -> Json.toJson(pedidoVenta.base.cliId),
      GC.CLI_NAME -> Json.toJson(pedidoVenta.base.cliName),
      GC.EST_ID -> Json.toJson(pedidoVenta.base.estId),
      GC.EST_NAME -> Json.toJson(pedidoVenta.base.estName),
      GC.SUC_ID -> Json.toJson(pedidoVenta.base.sucId),
      GC.SUC_NAME -> Json.toJson(pedidoVenta.base.sucName),
      GC.CPG_ID -> Json.toJson(pedidoVenta.base.cpgId),
      GC.CPG_NAME -> Json.toJson(pedidoVenta.base.cpgName),
      GC.CCOS_ID -> Json.toJson(pedidoVenta.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(pedidoVenta.base.ccosName),
      GC.LGJ_ID -> Json.toJson(pedidoVenta.base.lgjId),
      GC.LGJ_CODE -> Json.toJson(pedidoVenta.base.lgjCode),
      GC.VEN_ID -> Json.toJson(pedidoVenta.base.venId),
      GC.VEN_NAME -> Json.toJson(pedidoVenta.base.venName),
      GC.CLIS_ID -> Json.toJson(pedidoVenta.base.clisId),
      GC.CLIS_NAME -> Json.toJson(pedidoVenta.base.clisName),
      C.PV_DESTINATARIO -> Json.toJson(pedidoVenta.base.ordenCompra),
      C.PV_ORDEN_COMPRA -> Json.toJson(pedidoVenta.base.ordenCompra),
      C.PV_DESCRIP -> Json.toJson(pedidoVenta.base.descrip),

      GC.DOCT_ID -> Json.toJson(pedidoVenta.references.doctId),
      GC.DOCT_NAME -> Json.toJson(pedidoVenta.references.doctName),
      GC.MON_ID -> Json.toJson(pedidoVenta.references.monId),
      GC.MON_NAME -> Json.toJson(pedidoVenta.references.monName),
      GC.TA_MASCARA -> Json.toJson(pedidoVenta.references.taMascara),
      GC.TA_PROPUESTO -> Json.toJson(pedidoVenta.references.taPropuesto),
      C.PV_FIRMADO -> Json.toJson(pedidoVenta.references.firmado),
      GC.DOC_TIPO_PEDIDO -> Json.toJson(pedidoVenta.references.docTipoPedido),
      GC.HAS_IVA_RI -> Json.toJson(pedidoVenta.references.hasIvaRi),
      GC.HAS_IVA_RNI -> Json.toJson(pedidoVenta.references.hasIvaRni),
      GC.EDITABLE -> Json.toJson(pedidoVenta.references.editable),
      GC.EDIT_MSG -> Json.toJson(pedidoVenta.references.editMsg),

      C.PV_DESCUENTO1 -> Json.toJson(pedidoVenta.precios.desc1),
      C.PV_DESCUENTO2 -> Json.toJson(pedidoVenta.precios.desc2),
      GC.LP_ID -> Json.toJson(pedidoVenta.precios.lpId),
      GC.LP_NAME -> Json.toJson(pedidoVenta.precios.lpName),
      GC.LD_ID -> Json.toJson(pedidoVenta.precios.ldId),
      GC.LD_NAME -> Json.toJson(pedidoVenta.precios.ldName),

      C.RAM_ID_STOCK -> Json.toJson(pedidoVenta.stock.ramIdStock),
      C.RAMA_STOCK -> Json.toJson(pedidoVenta.stock.ramNameStock),
      GC.TRANS_ID -> Json.toJson(pedidoVenta.stock.transId),
      GC.TRANS_NAME -> Json.toJson(pedidoVenta.stock.transName),
      GC.CHOF_ID -> Json.toJson(pedidoVenta.stock.chofId),
      GC.CHOF_NAME -> Json.toJson(pedidoVenta.stock.chofName),
      GC.CAM_ID -> Json.toJson(pedidoVenta.stock.camId),
      GC.CAM_PATENTE -> Json.toJson(pedidoVenta.stock.camPatente),
      GC.CAM_ID_SEMI -> Json.toJson(pedidoVenta.stock.camIdSemi),
      GC.CAM_PATENTE_SEMI -> Json.toJson(pedidoVenta.stock.camPatenteSemi),
      C.PRO_ID_ORIGEN -> Json.toJson(pedidoVenta.stock.proIdOrigen),
      C.PRO_ORIGEN_NAME -> Json.toJson(pedidoVenta.stock.proNameOrigen),
      C.PRO_ID_DESTINO -> Json.toJson(pedidoVenta.stock.proIdOrigen),
      C.PRO_DESTINO_NAME -> Json.toJson(pedidoVenta.stock.proNameOrigen),

      C.PV_NETO -> Json.toJson(pedidoVenta.totals.neto),
      C.PV_IVA_RI -> Json.toJson(pedidoVenta.totals.ivaRi),
      C.PV_IVA_RNI -> Json.toJson(pedidoVenta.totals.ivaRni),
      C.PV_SUBTOTAL -> Json.toJson(pedidoVenta.totals.subTotal),
      C.PV_IMPORTE_DESC_1 -> Json.toJson(pedidoVenta.totals.importeDesc1),
      C.PV_IMPORTE_DESC_2 -> Json.toJson(pedidoVenta.totals.importeDesc2),
      C.PV_TOTAL -> Json.toJson(pedidoVenta.totals.total),

      // Items
      "items" -> Json.toJson(writePedidoVentaItems(pedidoVenta.items.items))
    )
    def pedidoVentaItemWrites(i: PedidoVentaItem) = Json.obj(
      C.PVI_ID -> Json.toJson(i.id),
      C.PVI_DESCRIP -> Json.toJson(i.base.descrip),
      C.PVI_DESCUENTO -> Json.toJson(i.base.descuento),
      GC.PR_ID -> Json.toJson(i.base.prId),
      GC.PR_NAME_VENTA -> Json.toJson(i.base.prName),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      C.PVI_ORDEN -> Json.toJson(i.base.orden),
      GC.UN_NAME -> Json.toJson(i.base.unName),
      C.PVI_CANTIDAD -> Json.toJson(i.totals.cantidad),
      C.PVI_PRECIO -> Json.toJson(i.totals.precio),
      C.PVI_PRECIO_LISTA -> Json.toJson(i.totals.precioLista),
      C.PVI_PRECIO_USR -> Json.toJson(i.totals.precioUser),
      C.PVI_NETO -> Json.toJson(i.totals.neto),
      C.PVI_IVA_RI -> Json.toJson(i.totals.ivaRi),
      C.PVI_IVA_RNI -> Json.toJson(i.totals.ivaRni),
      C.PVI_IVA_RIPORC -> Json.toJson(i.totals.ivaRiPorc),
      C.PVI_IVA_RNIPORC -> Json.toJson(i.totals.ivaRniPorc),
      C.PVI_IMPORTE -> Json.toJson(i.totals.importe)
    )
    def writePedidoVentaItems(items: List[PedidoVentaItem]) = items.map(item => pedidoVentaItemWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PEDIDO_VENTA), { user =>
      Ok(Json.toJson(PedidoVenta.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a PedidoData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in PedidoVenta/Data, PedidoVentaItem/Data, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def getJsValueAsMap(list: Map[String, JsValue]): Map[String, JsValue] = list.toList match {
      case (key: String, jsValue: JsValue) :: t => jsValue.as[Map[String, JsValue]]
      case _ => Map.empty
    }

    def preprocessSeriesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case jsArray: JsArray => Map(group -> jsArray)
      case _ => Map(group -> JsArray(List()))
    }

    def preprocessItemParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]

      // groups for PedidoVentaItemData
      //
      val pedidoItem = Global.preprocessFormParams(List(C.PVI_ID), "", params)
      val pedidoItemBaseGroup = Global.preprocessFormParams(pedidoItemBase, C.PEDIDO_ITEM_BASE, params)
      val pedidoItemTotalsGroup = Global.preprocessFormParams(pedidoItemTotals, C.PEDIDO_ITEM_TOTALS, params)

      val item = JsObject(
        (pedidoItem ++ pedidoItemBaseGroup ++ pedidoItemTotalsGroup).toSeq)
      item
    }

    def preprocessPresupuestoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(pedidoPresupuesto, "", params).toSeq)
    }

    def preprocessItemsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessItemParam(_))))
      case _ => Map.empty
    }

    def preprocessPresupuestosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessPresupuestoParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for PedidoVentaData
    //
    val pedidoId = Global.preprocessFormParams(List("id"), "", params)
    val pedidoIdGroup = Global.preprocessFormParams(pedidoIdFields, C.PEDIDO_ID, params)
    val pedidoBaseGroup = Global.preprocessFormParams(pedidoBaseFields, C.PEDIDO_BASE, params)
    val pedidoDatesGroup = Global.preprocessFormParams(pedidoDatesFields, C.PEDIDO_DATES, params)
    val pedidoPreciosGroup = Global.preprocessFormParams(pedidoPreciosFields, C.PEDIDO_PRECIOS, params)
    val pedidoStockGroup = Global.preprocessFormParams(pedidoStockFields, C.PEDIDO_STOCK, params)
    val pedidoTotalGroup = Global.preprocessFormParams(pedidoTotalsFields, C.PEDIDO_TOTALS, params)

    // items
    //
    val itemsInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.PEDIDO_VENTA_ITEM_TMP, params))
    val itemRows = Global.getParamsJsonRequestFor(GC.ITEMS, itemsInfo)
    val itemDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, itemsInfo).toList match {
      case Nil => Map(C.PEDIDO_ITEM_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.PEDIDO_ITEM_DELETED -> Json.toJson(deletedList._2))
    }
    val pedidoItems = preprocessItemsParam(itemRows.head._2, C.PEDIDO_VENTA_ITEM_TMP)

    // presupuestos
    //
    val presupuestosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.PRESUPUESTO_PEDIDO_VENTA_TMP, params))
    val remitoRows = Global.getParamsJsonRequestFor(GC.ITEMS, presupuestosInfo)
    val pedidoPresupuestos = remitoRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessPresupuestosParam(item, C.PRESUPUESTO_PEDIDO_VENTA_TMP)
      case _ => Map(C.PRESUPUESTO_PEDIDO_VENTA_TMP -> JsArray(List()))
    }

    JsObject(
      (pedidoId ++ pedidoIdGroup ++ pedidoBaseGroup ++ pedidoDatesGroup ++ pedidoPreciosGroup
        ++ pedidoStockGroup ++ pedidoTotalGroup ++ pedidoItems ++ itemDeleted ++ pedidoPresupuestos).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getItems(items: List[PedidoVentaItemData]): List[PedidoVentaItem] = {
    items.map(item => {
      PedidoVentaItem(
        item.id,
        PedidoVentaItemBase(
          item.base.descrip,
          "",
          item.base.prId,
          item.base.ccosId,
          item.base.orden
        ),
        PedidoVentaItemTotals(
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
        )
      )
    })
  }

  def getPresupuestos(presupuestos: List[PedidoVentaPresupuestoData]): List[PedidoVentaPresupuesto] = {
    presupuestos.map(remito => {
      PedidoVentaPresupuesto(
        remito.prviId,
        remito.cantidad,
        remito.pviId
      )
    })
  }

  def getPedidoVentaItems(pedidoVenta: PedidoVentaData): PedidoVentaItems = {
    PedidoVentaItems(
      getItems(pedidoVenta.items),
      pedidoVenta.itemDeleted,
      getPresupuestos(pedidoVenta.presupuestos)
    )
  }

  def getPedidoVenta(pedidoVenta: PedidoVentaData, id: Int): PedidoVenta = {
    PedidoVenta(
      id,
      PedidoVentaId(
        pedidoVenta.ids.docId,
        pedidoVenta.ids.numero,
        pedidoVenta.ids.nroDoc),
      PedidoVentaBase(
        pedidoVenta.base.cliId,
        pedidoVenta.base.estId,
        pedidoVenta.base.ccosId,
        pedidoVenta.base.sucId,
        pedidoVenta.base.cpgId,
        pedidoVenta.base.lgjId,
        pedidoVenta.base.venId,
        pedidoVenta.base.clisId,
        pedidoVenta.base.destinatario,
        pedidoVenta.base.ordenCompra,
        pedidoVenta.base.descrip),
      PedidoVenta.emptyPedidoVentaReferences,
      PedidoVentaDates(
        DateFormatter.parse(pedidoVenta.dates.fecha),
        DateFormatter.parse(pedidoVenta.dates.fechaEntrega)),
      PedidoVentaPrecios(
        pedidoVenta.precios.desc1,
        pedidoVenta.precios.desc2,
        pedidoVenta.precios.lpId,
        pedidoVenta.precios.ldId),
      PedidoVentaStock(
        pedidoVenta.stock.proIdOrigen,
        pedidoVenta.stock.proIdDestino,
        pedidoVenta.stock.ramIdStock,
        pedidoVenta.stock.transId,
        pedidoVenta.stock.chofId,
        pedidoVenta.stock.camId,
        pedidoVenta.stock.semiId),
      PedidoVentaTotals(
        pedidoVenta.totals.neto,
        pedidoVenta.totals.ivaRi,
        pedidoVenta.totals.ivaRni,
        pedidoVenta.totals.subTotal,
        pedidoVenta.totals.importeDesc1,
        pedidoVenta.totals.importeDesc2,
        pedidoVenta.totals.total),
      getPedidoVentaItems(pedidoVenta)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in PedidoVentas.update")

    pedidoVentaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      pedidoVenta => {
        Logger.debug(s"form: ${pedidoVenta.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PEDIDO_VENTA), { user =>
          try {
            Ok(
              Json.toJson(
                PedidoVenta.update(user,
                  getPedidoVenta(pedidoVenta, id)
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

  def createFromPresupuesto = PostAction { implicit request =>
    Logger.debug("in PedidoVentas.create")
    pedidoVentaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      pedidoVenta => {
        Logger.debug(s"form: ${pedidoVenta.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PEDIDO_VENTA), { user =>
          try {
            Ok(
              Json.toJson(
                PedidoVenta.createFromPresupuesto(user,
                  getPedidoVenta(pedidoVenta, DBHelper.NoId)
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
    Logger.debug("in PedidoVentas.create")
    pedidoVentaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      pedidoVenta => {
        Logger.debug(s"form: ${pedidoVenta.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PEDIDO_VENTA), { user =>
          try {
            Ok(
              Json.toJson(
                PedidoVenta.create(user,
                  getPedidoVenta(pedidoVenta, DBHelper.NoId)
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
    Logger.debug("in PedidoVentas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PEDIDO_VENTA), { user =>
      try {
        PedidoVenta.delete(user, id)
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
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PEDIDO_VENTA), { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            PedidoVenta.list(
              user,
              DateFormatter.parse(from.getOrElse("")), DateFormatter.parse(to.getOrElse("")),
              cliId, estId, ccosId, sucId, venId, docId, cpgId, empId))))
    })
  }

  def parameters = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PEDIDO_VENTA), { user =>
      Ok(Json.toJson(PedidoVenta.loadParams(user)))
    })
  }

  def saveParameters = PostAction { implicit request =>
    Logger.debug("in PedidoVentas.saveParameters")
    pedidoVentaParamsForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      pedidoVentaParams => {
        Logger.debug(s"form: ${pedidoVentaParams.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PEDIDO_VENTA), { user =>
          Ok(
            Json.toJson(
              PedidoVenta.saveParams(user,
                PedidoVentaParams(
                  pedidoVentaParams.from,
                  pedidoVentaParams.to,
                  pedidoVentaParams.cliId,
                  pedidoVentaParams.estId,
                  pedidoVentaParams.ccosId,
                  pedidoVentaParams.sucId,
                  pedidoVentaParams.venId,
                  pedidoVentaParams.docId,
                  pedidoVentaParams.cpgId,
                  pedidoVentaParams.empId
                )
              )
            )
          )
        })
      }
    )
  }

  def notes(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PEDIDO_VENTA), { user =>
      Ok(Json.toJson(""))
    })
  }

  def listPresupuestos(cliId: Int, currencyId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PEDIDO_VENTA), { user =>
      Ok(Recordset.getAsJson(PedidoVenta.listPresupuestos(user, cliId, currencyId)))
    })
  }

  def listPresupuestosItems(ids: Option[String]) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PEDIDO_VENTA), { user =>
      Ok(Json.toJson(Recordset.getAsJson(PedidoVenta.listPresupuestosItems(user, ids.getOrElse("")))))
    })
  }
}