package controllers.logged.modules.tesoreria

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.tesoreria._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.{Recordset, DBHelper}
import formatters.json.DateFormatter
import formatters.json.DateFormatter._

import scala.util.control.NonFatal

case class CobranzaIdData(
                           docId: Int,
                           numero: Int,
                           nroDoc: String
                           )

case class CobranzaBaseData(
                             cliId: Int,
                             estId: Int,
                             ccosId: Int,
                             sucId: Int,
                             cpgId: Int,
                             lgjId: Int,
                             cai: String,
                             tipoComprobante: Int,
                             descrip: String,
                             grabarAsiento: Boolean
                             )

case class CobranzaTotalsData(
                               neto: Double,
                               totalOtros: Double,
                               total: Double
                               )

case class CobranzaItemDataBase(
                                 descrip: String,
                                 descuento: String,
                                 prId: Int,
                                 ccosId: Int,
                                 toId: Int,
                                 cueId: Int,
                                 orden: Int
                                 )

case class CobranzaItemDataTotals(
                                   importe: Double,
                                   importeOrigen: Double
                                   )

case class CobranzaItemData(
                             id: Int,
                             base: CobranzaItemDataBase,
                             totals: CobranzaItemDataTotals
                             )

case class CobranzaData(
                         id: Option[Int],
                         ids: CobranzaIdData,
                         base: CobranzaBaseData,
                         fecha: String,
                         cotizacion: Double,
                         totals: CobranzaTotalsData,
                         items: List[CobranzaItemData],

                         /* only used in save */
                         itemDeleted: String,

                         /* applications */
                         facturas: List[FacturaCobranzaData]
                         )

case class FacturaCobranzaData(
                               rciId: Int,
                               cantidad: Double,
                               fciId: Int
                               )

case class CobranzaParamsData(
                               from: String,
                               to: String,
                               cliId: String,
                               estId: String,
                               ccosId: String,
                               sucId: String,
                               cobId: String,
                               docId: String,
                               cpgId: String,
                               empId: String
                               )

object Cobranzas extends Controller with ProvidesUser {

  val GC = models.cairo.modules.general.C

  val cobranzaParamsForm: Form[CobranzaParamsData] = Form(
    mapping(
      GC.FROM -> text,
      GC.TO -> text,
      GC.CLI_ID -> text,
      GC.EST_ID -> text,
      GC.CCOS_ID -> text,
      GC.SUC_ID -> text,
      GC.COB_ID -> text,
      GC.DOC_ID -> text,
      GC.CPG_ID -> text,
      GC.EMP_ID -> text
    )(CobranzaParamsData.apply)(CobranzaParamsData.unapply)
  )

  val cobranzaIdFields = List(GC.DOC_ID, C.COBZ_NUMERO, C.COBZ_NRODOC)

  val cobranzaBaseFields = List(GC.CLI_ID, GC.EST_ID, GC.CCOS_ID, GC.SUC_ID, GC.LGJ_ID, C.COBZ_DESCRIP, C.COBZ_GRABAR_ASIENTO)

  val facturaTotalsFields = List(C.COBZ_NETO, C.COBZ_TOTAL)

  val facturaItemBase = List(C.COBZI_DESCRIP, GC.PR_ID, GC.CCOS_ID, GC.TO_ID,
    GC.CUE_ID, C.COBZI_ORDEN)

  val facturaItemTotals = List(C.COBZI_IMPORTE, C.COBZI_IMPORTE_ORIGEN)

  val facturaCobranza = List(C.FVD_ID, C.FVP_ID, C.FV_COBZ_IMPORTE, C.COBZI_ID)

  val cobranzaForm: Form[CobranzaData] = Form(
    mapping(
      "id" -> optional(number),
      C.COBRANZA_ID -> mapping(
        GC.DOC_ID -> number,
        C.COBZ_NUMERO -> number,
        C.COBZ_NRODOC -> text)
        (CobranzaIdData.apply)(CobranzaIdData.unapply),
      C.COBRANZA_BASE -> mapping(
        GC.CLI_ID -> number,
        GC.EST_ID -> number,
        GC.CCOS_ID -> number,
        GC.SUC_ID -> number,
        GC.CPG_ID -> number,
        GC.LGJ_ID -> number,
        C.COBZ_DESCRIP -> text,
        C.COBZ_GRABAR_ASIENTO -> boolean)
        (CobranzaBaseData.apply)(CobranzaBaseData.unapply),
      C.COBZ_FECHA -> text,
      C.COBZ_COTIZACION -> of(Global.doubleFormat),
      C.COBRANZA_TOTALS -> mapping (
        C.COBZ_NETO -> of(Global.doubleFormat),
        C.COBZ_OTROS -> of(Global.doubleFormat),
        C.COBZ_TOTAL -> of(Global.doubleFormat)
      )(CobranzaTotalsData.apply)(CobranzaTotalsData.unapply),
      C.COBRANZA_ITEM_TMP -> Forms.list[CobranzaItemData](
        mapping(
          C.COBZI_ID -> number,
          C.COBRANZA_ITEM_BASE -> mapping (
            C.COBZI_DESCRIP -> text,
            GC.PR_ID -> number,
            GC.CCOS_ID -> number,
            GC.TO_ID -> number,
            GC.CUE_ID -> number,
            C.COBZI_ORDEN -> number)
            (CobranzaItemDataBase.apply)(CobranzaItemDataBase.unapply),
          C.COBRANZA_ITEM_TOTALS -> mapping (
            C.COBZI_IMPORTE -> of(Global.doubleFormat),
            C.COBZI_IMPORTE_ORIGEN -> of(Global.doubleFormat))
            (CobranzaItemDataTotals.apply)(CobranzaItemDataTotals.unapply)
      ),
      C.COBRANZA_ITEM_DELETED -> text,
      C.FACTURA_VENTA_COBRANZA_TMP -> Forms.list[FacturaCobranzaData](
        mapping (
          C.FVD_ID -> number,
          C.FVP_ID -> number,
          C.FV_COBZ_IMPORTE -> of(Global.doubleFormat),
          C.FV_COBZ_IMPORTE_ORIGEN -> of(Global.doubleFormat),
          C.COBZ_ID -> number)
          (FacturaCobranzaData.apply)(FacturaCobranzaData.unapply)
      )
    )(CobranzaData.apply)(CobranzaData.unapply)
  )

  implicit val cobranzaParamsWrites = new Writes[CobranzaParams] {
    def writes(cobranzaParams: CobranzaParams) = Json.obj(
      GC.FROM -> Json.toJson(cobranzaParams.from),
      GC.TO -> Json.toJson(cobranzaParams.to),
      GC.CLI_ID -> Json.toJson(cobranzaParams.cliId),
      GC.PROV_NAME -> Json.toJson(cobranzaParams.provName),
      GC.EST_ID -> Json.toJson(cobranzaParams.estId),
      GC.EST_NAME -> Json.toJson(cobranzaParams.estName),
      GC.CCOS_ID -> Json.toJson(cobranzaParams.ccosId),
      GC.CCOS_NAME -> Json.toJson(cobranzaParams.ccosName),
      GC.SUC_ID -> Json.toJson(cobranzaParams.sucId),
      GC.SUC_NAME -> Json.toJson(cobranzaParams.sucName),
      GC.DOC_ID -> Json.toJson(cobranzaParams.docId),
      GC.DOC_NAME -> Json.toJson(cobranzaParams.docName),
      GC.CPG_ID -> Json.toJson(cobranzaParams.cpgId),
      GC.CPG_NAME -> Json.toJson(cobranzaParams.cpgName),
      GC.EMP_ID -> Json.toJson(cobranzaParams.empId),
      GC.EMP_NAME -> Json.toJson(cobranzaParams.empName)
    )
  }

  implicit val cobranzaWrites = new Writes[Cobranza] {
    def writes(cobranza: Cobranza) = Json.obj(
      "id" -> Json.toJson(cobranza.id),
      C.COBZ_ID -> Json.toJson(cobranza.id),

      GC.DOC_ID -> Json.toJson(cobranza.ids.docId),
      GC.DOC_NAME -> Json.toJson(cobranza.ids.docName),
      C.COBZ_NRODOC -> Json.toJson(cobranza.ids.nroDoc),
      C.COBZ_NUMERO -> Json.toJson(cobranza.ids.numero),

      C.COBZ_FECHA -> Json.toJson(cobranza.dates.fecha),
      C.COBZ_FECHA_ENTREGA -> Json.toJson(cobranza.dates.fechaEntrega),
      C.COBZ_FECHA_IVA -> Json.toJson(cobranza.dates.fechaIva),
      C.COBZ_FECHA_VTO -> Json.toJson(cobranza.dates.fechaVto),

      GC.CLI_ID -> Json.toJson(cobranza.base.cliId),
      GC.PROV_NAME -> Json.toJson(cobranza.base.provName),
      GC.EST_ID -> Json.toJson(cobranza.base.estId),
      GC.EST_NAME -> Json.toJson(cobranza.base.estName),
      GC.SUC_ID -> Json.toJson(cobranza.base.sucId),
      GC.SUC_NAME -> Json.toJson(cobranza.base.sucName),
      GC.CPG_ID -> Json.toJson(cobranza.base.cpgId),
      GC.CPG_NAME -> Json.toJson(cobranza.base.cpgName),
      GC.CCOS_ID -> Json.toJson(cobranza.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(cobranza.base.ccosName),
      GC.LGJ_ID -> Json.toJson(cobranza.base.lgjId),
      GC.LGJ_CODE -> Json.toJson(cobranza.base.lgjCode),
      C.COBZ_CAI -> Json.toJson(cobranza.base.cai),
      C.COBZ_DESCRIP -> Json.toJson(cobranza.base.descrip),
      C.COBZ_TIPO_COMPROBANTE -> Json.toJson(cobranza.base.tipoComprobante),
      C.COBZ_GRABAR_ASIENTO -> Json.toJson(cobranza.base.grabarAsiento),

      GC.DOCT_ID -> Json.toJson(cobranza.references.doctId),
      GC.DOCT_NAME -> Json.toJson(cobranza.references.doctName),
      GC.MON_ID -> Json.toJson(cobranza.references.monId),
      GC.MON_NAME -> Json.toJson(cobranza.references.monName),
      GC.TA_MASCARA -> Json.toJson(cobranza.references.taMascara),
      GC.TA_PROPUESTO -> Json.toJson(cobranza.references.taPropuesto),
      C.COBZ_FIRMADO -> Json.toJson(cobranza.references.firmado),
      GC.DOC_MUEVE_STOCK -> Json.toJson(cobranza.references.docMueveStock),
      GC.DOC_TIPO_FACTURA -> Json.toJson(cobranza.references.docTipoFactura),
      C.AS_ID -> Json.toJson(cobranza.references.stId),
      C.ST_ID -> Json.toJson(cobranza.references.asId),
      GC.HAS_IVA_RI -> Json.toJson(cobranza.references.hasIvaRi),
      GC.HAS_IVA_RNI -> Json.toJson(cobranza.references.hasIvaRni),
      GC.EDITABLE -> Json.toJson(cobranza.references.editable),
      GC.EDIT_MSG -> Json.toJson(cobranza.references.editMsg),

      C.COBZ_COTIZACION -> Json.toJson(cobranza.cotizacion.cotizacion),
      C.COBZ_COTIZACION_PROV -> Json.toJson(cobranza.cotizacion.cotizacionProveedor),

      C.COBZ_DESCUENTO1 -> Json.toJson(cobranza.precios.desc1),
      C.COBZ_DESCUENTO2 -> Json.toJson(cobranza.precios.desc2),
      GC.LP_ID -> Json.toJson(cobranza.precios.lpId),
      GC.LP_NAME -> Json.toJson(cobranza.precios.lpName),
      GC.LD_ID -> Json.toJson(cobranza.precios.ldId),
      GC.LD_NAME -> Json.toJson(cobranza.precios.ldName),

      GC.DEPL_ID -> Json.toJson(cobranza.stock.deplId),
      GC.DEPL_NAME -> Json.toJson(cobranza.stock.deplName),
      C.PRO_ID_ORIGEN -> Json.toJson(cobranza.stock.proIdOrigen),
      C.PRO_ORIGEN_NAME -> Json.toJson(cobranza.stock.proNameOrigen),
      C.PRO_ID_DESTINO -> Json.toJson(cobranza.stock.proIdOrigen),
      C.PRO_DESTINO_NAME -> Json.toJson(cobranza.stock.proNameOrigen),

      C.COBZ_NETO -> Json.toJson(cobranza.totals.neto),
      C.COBZ_IVA_RI -> Json.toJson(cobranza.totals.ivaRi),
      C.COBZ_IVA_RNI -> Json.toJson(cobranza.totals.ivaRni),
      C.COBZ_INTERNOS -> Json.toJson(cobranza.totals.internos),
      C.COBZ_SUBTOTAL -> Json.toJson(cobranza.totals.subTotal),
      C.COBZ_IMPORTE_DESC_1 -> Json.toJson(cobranza.totals.importeDesc1),
      C.COBZ_IMPORTE_DESC_2 -> Json.toJson(cobranza.totals.importeDesc2),
      C.COBZ_TOTAL_OTROS -> Json.toJson(cobranza.totals.totalOtros),
      C.COBZ_TOTAL_PERCEPCIONES -> Json.toJson(cobranza.totals.totalPercepciones),
      C.COBZ_TOTAL -> Json.toJson(cobranza.totals.total),
      C.COBZ_TOTAL_ORIGEN -> Json.toJson(cobranza.totals.totalOrigen),

      // Items
      "items" -> Json.toJson(writeCobranzaItems(cobranza.items.items)),
      "serialNumbers" -> Json.toJson(writeCobranzaItemSeries(cobranza.items.series)),
      "otros" -> Json.toJson(writeCobranzaOtros(cobranza.items.otros)),
      "legajos" -> Json.toJson(writeCobranzaLegajos(cobranza.items.legajos)),
      "percepciones" -> Json.toJson(writeCobranzaPercepciones(cobranza.items.percepciones))
    )
    def cobranzaItemWrites(i: CobranzaItem) = Json.obj(
      C.COBZI_ID -> Json.toJson(i.id),
      C.COBZI_DESCRIP -> Json.toJson(i.base.descrip),
      C.COBZI_DESCUENTO -> Json.toJson(i.base.descuento),
      GC.PR_ID -> Json.toJson(i.base.prId),
      GC.PR_NAME_COMPRA -> Json.toJson(i.base.prName),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      GC.TO_ID -> Json.toJson(i.base.toId),
      GC.TO_NAME -> Json.toJson(i.base.toName),
      GC.CUE_ID -> Json.toJson(i.base.cueId),
      C.CUE_ID_IVA_RI -> Json.toJson(i.base.cueIdIvaRi),
      C.CUE_ID_IVA_RNI -> Json.toJson(i.base.cueIdIvaRni),
      C.STL_ID -> Json.toJson(i.base.stlId),
      C.STL_CODE -> Json.toJson(i.base.stlCode),
      C.COBZI_ORDEN -> Json.toJson(i.base.orden),
      GC.PR_LLEVA_NRO_SERIE -> Json.toJson(i.base.llevaNroSerie),
      GC.PR_LLEVA_NRO_LOTE -> Json.toJson(i.base.llevaNroLote),
      GC.UN_NAME -> Json.toJson(i.base.unName),
      C.COBZI_CANTIDAD -> Json.toJson(i.totals.cantidad),
      C.COBZI_PRECIO -> Json.toJson(i.totals.precio),
      C.COBZI_PRECIO_LISTA -> Json.toJson(i.totals.precioLista),
      C.COBZI_PRECIO_USR -> Json.toJson(i.totals.precioUser),
      C.COBZI_NETO -> Json.toJson(i.totals.neto),
      C.COBZI_IVA_RI -> Json.toJson(i.totals.ivaRi),
      C.COBZI_IVA_RNI -> Json.toJson(i.totals.ivaRni),
      C.COBZI_INTERNOS -> Json.toJson(i.totals.internos),
      C.COBZI_IVA_RIPORC -> Json.toJson(i.totals.ivaRiPorc),
      C.COBZI_IVA_RNIPORC -> Json.toJson(i.totals.ivaRniPorc),
      C.COBZI_INTERNOS_PORC -> Json.toJson(i.totals.internosPorc),
      GC.PR_PORC_INTERNO_C -> Json.toJson(i.totals.prInternosPorc),
      C.COBZI_IMPORTE -> Json.toJson(i.totals.importe),
      C.COBZI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen)
    )
    def cobranzaItemSerieWrites(i: CobranzaItemSerie) = Json.obj(
      C.COBZI_ID -> Json.toJson(i.fciId),
      GC.PRNS_ID -> Json.toJson(i.id),
      GC.PRNS_CODE -> Json.toJson(i.code),
      GC.PRNS_DESCRIP -> Json.toJson(i.descrip),
      GC.PRNS_FECHA_VTO -> Json.toJson(i.fechaVto)
    )
    def cobranzaOtroWrites(o: CobranzaOtro) = Json.obj(
      C.FCOT_ID -> Json.toJson(o.id),
      GC.CUE_ID -> Json.toJson(o.cueId),
      GC.CUE_NAME -> Json.toJson(o.cueName),
      C.FCOT_DEBE -> Json.toJson(o.debe),
      C.FCOT_HABER -> Json.toJson(o.haber),
      GC.CCOS_ID -> Json.toJson(o.ccosId),
      GC.CCOS_NAME -> Json.toJson(o.ccosName),
      C.FCOT_DESCRIP -> Json.toJson(o.descrip),
      C.FCOT_ORIGEN -> Json.toJson(o.origen),
      C.FCOT_ORDEN -> Json.toJson(o.orden)
    )
    def cobranzaLegajoWrites(l: CobranzaLegajo) = Json.obj(
      C.FCLGJ_ID -> Json.toJson(l.id),
      GC.LGJ_ID -> Json.toJson(l.lgjId),
      GC.LGJ_CODE -> Json.toJson(l.lgjCode),
      C.FCLGJ_IMPORTE -> Json.toJson(l.importe),
      C.FCLGJ_DESCRIP -> Json.toJson(l.descrip),
      C.FCLGJ_IMPORTE_ORIGEN -> Json.toJson(l.importeOrigen),
      C.FCLGJ_ORDEN -> Json.toJson(l.orden)
    )
    def cobranzaPercepcionWrites(p: CobranzaPercepcion) = Json.obj(
      C.FCPERC_ID -> Json.toJson(p.id),
      GC.PERC_ID -> Json.toJson(p.percId),
      GC.PERC_NAME -> Json.toJson(p.percName),
      C.FCPERC_BASE -> Json.toJson(p.base),
      C.FCPERC_PORCENTAJE -> Json.toJson(p.porcentaje),
      C.FCPERC_IMPORTE -> Json.toJson(p.importe),
      GC.CCOS_ID -> Json.toJson(p.ccosId),
      GC.CCOS_NAME -> Json.toJson(p.ccosName),
      C.FCPERC_DESCRIP -> Json.toJson(p.descrip),
      C.FCPERC_ORIGEN -> Json.toJson(p.origen),
      C.FCPERC_ORDEN -> Json.toJson(p.orden)
    )
    def writeCobranzaItems(items: List[CobranzaItem]) = items.map(item => cobranzaItemWrites(item))
    def writeCobranzaItemSeries(items: List[CobranzaItemSerie]) = items.map(item => cobranzaItemSerieWrites(item))
    def writeCobranzaOtros(items: List[CobranzaOtro]) = items.map(item => cobranzaOtroWrites(item))
    def writeCobranzaLegajos(items: List[CobranzaLegajo]) = items.map(item => cobranzaLegajoWrites(item))
    def writeCobranzaPercepciones(items: List[CobranzaPercepcion]) = items.map(item => cobranzaPercepcionWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA_COMPRA), { user =>
      Ok(Json.toJson(Cobranza.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a FacturaData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in Cobranza/Data, CobranzaItem/Data, etc
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

      // groups for CobranzaItemData
      //
      val facturaItem = Global.preprocessFormParams(List(C.COBZI_ID), "", params)
      val facturaItemBaseGroup = Global.preprocessFormParams(facturaItemBase, C.COBRANZA_ITEM_BASE, params)
      val facturaItemTotalsGroup = Global.preprocessFormParams(facturaItemTotals, C.COBRANZA_ITEM_TOTALS, params)

      // in the POSTED JSON we have this sctructure:
      //
      //     CobranzaItemSerieTMP: {
      //          items: [],
      //          deletedList: ""
      //      }
      //
      // we need to convert it into
      //
      //      deletedList: "",
      //      CobranzaItemSerieTMP: []
      //
      // NOTICE that deletedList is a field of CobranzaItemSerieTMP but in the converted structure
      // it is move up to the parent node ( the CobranzaItem )
      //
      // this is done because in database.js we have one Transaction object to manage items in a Master-Detail
      // relation like CobranzaItem -> CobranzaItemSerie or Cobranza -> CobranzaItem
      //
      // this Transaction object is an intermediary object which doesn't exists here
      //
      // so CobranzaItemData has deletedList field called serieDeleted and CobranzaData has four deletedList
      // fields: itemDeleted, otroDeleted, percepcionDeleted and legajoDeleted
      //

      val serieInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_ITEM_SERIE_TMP, params))
      val serieRows = Global.getParamsJsonRequestFor(GC.ITEMS, serieInfo)
      val deletedList: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, serieInfo).toList match {
        case Nil => Map(GC.DELETED_LIST -> Json.toJson(""))
        case deletedList :: t => Map(deletedList)
      }
      val serieItems = serieRows.toList match {
        case (k: String, item: JsValue) :: t => preprocessSeriesParam(item, C.COBRANZA_ITEM_SERIE_TMP)
        case _ => Map(C.COBRANZA_ITEM_SERIE_TMP -> JsArray(List()))
      }

      val item = JsObject(
        (facturaItem ++ facturaItemBaseGroup ++ facturaItemTotalsGroup ++ serieItems ++ deletedList).toSeq)
      item
    }

    def preprocessOtroParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(facturaOtro, "", params).toSeq)
    }

    def preprocessPercepcionParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(facturaPercepcion, "", params).toSeq)
    }

    def preprocessLegajoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(facturaLegajo, "", params).toSeq)
    }

    def preprocessRemitoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(facturaCobranza, "", params).toSeq)
    }

    def preprocessItemsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessItemParam(_))))
      case _ => Map.empty
    }

    def preprocessOtrosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessOtroParam(_))))
      case _ => Map.empty
    }

    def preprocessPercepcionesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessPercepcionParam(_))))
      case _ => Map.empty
    }

    def preprocessLegajosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessLegajoParam(_))))
      case _ => Map.empty
    }

    def preprocessFacturasParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessRemitoParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for CobranzaData
    //
    val facturaId = Global.preprocessFormParams(List("id"), "", params)
    val facturaIdGroup = Global.preprocessFormParams(cobranzaIdFields, C.COBRANZA_ID, params)
    val facturaBaseGroup = Global.preprocessFormParams(cobranzaBaseFields, C.COBRANZA_BASE, params)
    val facturaDatesGroup = Global.preprocessFormParams(facturaDatesFields, C.COBRANZA_DATES, params)
    val facturaPreciosGroup = Global.preprocessFormParams(facturaPreciosFields, C.COBRANZA_PRECIOS, params)
    val facturaCotizacionGroup = Global.preprocessFormParams(facturaCotizacionFields, C.COBRANZA_COTIZACION, params)
    val facturaStockGroup = Global.preprocessFormParams(facturaStockFields, C.COBRANZA_STOCK, params)
    val facturaTotalGroup = Global.preprocessFormParams(facturaTotalsFields, C.COBRANZA_TOTALS, params)

    // items
    //
    val itemsInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_ITEM_TMP, params))
    val itemRows = Global.getParamsJsonRequestFor(GC.ITEMS, itemsInfo)
    val itemDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, itemsInfo).toList match {
      case Nil => Map(C.COBRANZA_ITEM_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_ITEM_DELETED -> Json.toJson(deletedList._2))
    }
    val facturaItems = preprocessItemsParam(itemRows.head._2, C.COBRANZA_ITEM_TMP)

    // otros
    //
    val otrosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_OTRO_TMP, params))
    val otroRows = Global.getParamsJsonRequestFor(GC.ITEMS, otrosInfo)
    val otroDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, otrosInfo).toList match {
      case Nil => Map(C.COBRANZA_OTRO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_OTRO_DELETED -> Json.toJson(deletedList._2))
    }
    val facturaOtros = otroRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessOtrosParam(item, C.COBRANZA_OTRO_TMP)
      case _ => Map(C.COBRANZA_OTRO_TMP -> JsArray(List()))
    }

    // percepciones
    //
    val percepcionesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_PERCEPCION_TMP, params))
    val percepcionRows = Global.getParamsJsonRequestFor(GC.ITEMS, percepcionesInfo)
    val percepcionDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, percepcionesInfo).toList match {
      case Nil => Map(C.COBRANZA_PERCEPCION_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_PERCEPCION_DELETED -> Json.toJson(deletedList._2))
    }
    val facturaPercepciones = percepcionRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessPercepcionesParam(item, C.COBRANZA_PERCEPCION_TMP)
      case _ => Map(C.COBRANZA_PERCEPCION_TMP -> JsArray(List()))
    }

    // legajos
    //
    val legajosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_LEGAJO_TMP, params))
    val legajoRows = Global.getParamsJsonRequestFor(GC.ITEMS, legajosInfo)
    val legajoDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, legajosInfo).toList match {
      case Nil => Map(C.COBRANZA_LEGAJO_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_LEGAJO_DELETED -> Json.toJson(deletedList._2))
    }
    val facturaLegajos = legajoRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessLegajosParam(item, C.COBRANZA_LEGAJO_TMP)
      case _ => Map(C.COBRANZA_LEGAJO_TMP -> JsArray(List()))
    }

    // facturas
    //
    val facturasInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.REMITO_COBRANZA_TMP, params))
    val remitoRows = Global.getParamsJsonRequestFor(GC.ITEMS, facturasInfo)
    val facturaFacturas = remitoRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessFacturasParam(item, C.REMITO_COBRANZA_TMP)
      case _ => Map(C.REMITO_COBRANZA_TMP -> JsArray(List()))
    }

    JsObject(
      (facturaId ++ facturaIdGroup ++ facturaBaseGroup ++ facturaDatesGroup ++ facturaPreciosGroup
        ++ facturaCotizacionGroup ++ facturaStockGroup ++ facturaTotalGroup
        ++ facturaItems ++ itemDeleted ++ facturaOtros ++ otroDeleted
        ++ facturaLegajos ++ legajoDeleted ++ facturaPercepciones ++ percepcionDeleted ++ facturaFacturas).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getItems(items: List[CobranzaItemData]): List[CobranzaItem] = {
    items.map(item => {
      CobranzaItem(
        item.id,
        CobranzaItemBase(
          item.base.descrip,
          item.base.descuento,
          item.base.prId,
          item.base.ccosId,
          item.base.toId,
          item.base.cueId,
          item.base.cueIdIvaRi,
          item.base.cueIdIvaRni,
          item.base.stlId,
          item.base.stlCode,
          item.base.orden
        ),
        CobranzaItemTotals(
          item.totals.cantidad,
          item.totals.precio,
          item.totals.precioLista,
          item.totals.precioUser,
          item.totals.neto,
          item.totals.ivaRi,
          item.totals.ivaRni.getOrElse(0.0),
          item.totals.internos,
          item.totals.ivaRiPorc,
          item.totals.ivaRniPorc,
          item.totals.internosPorc,
          item.totals.importe,
          item.totals.importeOrigen
        ),
        item.series.map(serie => {
          CobranzaItemSerie(
            serie.id,
            serie.code,
            serie.descrip,
            DateFormatter.parse(serie.fechaVto),
            DBHelper.NoId
          )
        }),
        item.serieDeleted
      )
    })
  }

  def getOtros(otros: List[CobranzaOtroData]): List[CobranzaOtro] = {
    otros.map(otro => {
      CobranzaOtro(
        otro.id,
        otro.cueId,
        otro.debe,
        otro.haber,
        otro.ccosId,
        otro.descrip,
        otro.origen,
        otro.orden
      )
    })
  }

  def getLegajos(legajos: List[CobranzaLegajoData]): List[CobranzaLegajo] = {
    legajos.map(legajo => {
      CobranzaLegajo(
        legajo.id,
        legajo.lgjId,
        legajo.importe,
        legajo.descrip,
        legajo.importeOrigen,
        legajo.orden
      )
    })
  }

  def getPercepciones(percepciones: List[CobranzaPercepcionData]): List[CobranzaPercepcion] = {
    percepciones.map(percepcion => {
      CobranzaPercepcion(
        percepcion.id,
        percepcion.percId,
        percepcion.base,
        percepcion.porcentaje,
        percepcion.importe,
        percepcion.ccosId,
        percepcion.descrip,
        percepcion.origen,
        percepcion.orden
      )
    })
  }

  def getFacturas(facturas: List[FacturaCobranzaData]): List[FacturaCobranza] = {
    facturas.map(remito => {
      FacturaCobranza(
        remito.rciId,
        remito.cantidad,
        remito.fciId
      )
    })
  }

  def getCobranzaItems(cobranza: CobranzaData): CobranzaItems = {
    CobranzaItems(
      getItems(cobranza.items),

      List(), /* only used when loading an invoice to respond a get Cobranza */

      getOtros(cobranza.otros),
      getLegajos(cobranza.legajos),
      getPercepciones(cobranza.percepciones),

      /* only used in save */
      cobranza.itemDeleted,
      cobranza.otroDeleted,
      cobranza.legajoDeleted,
      cobranza.percepcionDeleted,

      getFacturas(cobranza.facturas)
    )
  }

  def getCobranza(cobranza: CobranzaData, id: Int): Cobranza = {
    Cobranza(
      id,
      CobranzaId(
        cobranza.ids.docId,
        cobranza.ids.numero,
        cobranza.ids.nroDoc),
      CobranzaBase(
        cobranza.base.cliId,
        cobranza.base.estId,
        cobranza.base.ccosId,
        cobranza.base.sucId,
        cobranza.base.cpgId,
        cobranza.base.lgjId,
        cobranza.base.cai,
        cobranza.base.tipoComprobante,
        cobranza.base.descrip,
        cobranza.base.grabarAsiento),
      Cobranza.emptyCobranzaReferences,
      CobranzaDates(
        DateFormatter.parse(cobranza.dates.fecha),
        DateFormatter.parse(cobranza.dates.fechaEntrega),
        DateFormatter.parse(cobranza.dates.fechaIva),
        DateFormatter.parse(cobranza.dates.fechaVto)),
      CobranzaPrecios(
        cobranza.precios.desc1,
        cobranza.precios.desc2,
        cobranza.precios.lpId,
        cobranza.precios.ldId),
      CobranzaCotizacion(
        cobranza.cotizacion.cotizacion,
        cobranza.cotizacion.cotizacionProveedor),
      CobranzaStock(
        cobranza.stock.proIdOrigen,
        cobranza.stock.proIdDestino,
        cobranza.stock.deplId),
      CobranzaTotals(
        cobranza.totals.neto,
        cobranza.totals.ivaRi,
        cobranza.totals.ivaRni,
        cobranza.totals.internos,
        cobranza.totals.subTotal,
        cobranza.totals.importeDesc1,
        cobranza.totals.importeDesc2,
        cobranza.totals.totalOtros,
        cobranza.totals.totalPercepciones,
        cobranza.totals.total,
        cobranza.totals.totalOrigen),
      getCobranzaItems(cobranza)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Cobranzas.update")

    cobranzaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cobranza => {
        Logger.debug(s"form: ${cobranza.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_COBRANZA_COMPRA), { user =>
          try {
            Ok(
              Json.toJson(
                Cobranza.update(user,
                  getCobranza(cobranza, id)
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
    Logger.debug("in Cobranzas.create")
    cobranzaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cobranza => {
        Logger.debug(s"form: ${cobranza.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_COBRANZA_COMPRA), { user =>
          try {
            Ok(
              Json.toJson(
                Cobranza.createFromRemito(user,
                  getCobranza(cobranza, DBHelper.NoId)
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
    Logger.debug("in Cobranzas.create")
    cobranzaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cobranza => {
        Logger.debug(s"form: ${cobranza.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_COBRANZA_COMPRA), { user =>
          try {
            Ok(
              Json.toJson(
                Cobranza.create(user,
                  getCobranza(cobranza, DBHelper.NoId)
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
    Logger.debug("in Cobranzas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_COBRANZA_COMPRA), { user =>
      try {
        Cobranza.delete(user, id)
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
            docId: Option[String],
            cpgId: Option[String],
            empId: Option[String]
            ) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA_COMPRA), { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            Cobranza.list(
              user,
              DateFormatter.parse(from.getOrElse("")), DateFormatter.parse(to.getOrElse("")),
              cliId, estId, ccosId, sucId, docId, cpgId, empId))))
    })
  }

  def parameters = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA_COMPRA), { user =>
      Ok(Json.toJson(Cobranza.loadParams(user)))
    })
  }

  def saveParameters = PostAction { implicit request =>
    Logger.debug("in Cobranzas.saveParameters")
    cobranzaParamsForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cobranzaParams => {
        Logger.debug(s"form: ${cobranzaParams.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA_COMPRA), { user =>
          Ok(
            Json.toJson(
              Cobranza.saveParams(user,
                CobranzaParams(
                  cobranzaParams.from,
                  cobranzaParams.to,
                  cobranzaParams.cliId,
                  cobranzaParams.estId,
                  cobranzaParams.ccosId,
                  cobranzaParams.sucId,
                  cobranzaParams.docId,
                  cobranzaParams.cpgId,
                  cobranzaParams.empId
                )
              )
            )
          )
        })
      }
    )
  }

  def notes(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA_COMPRA), { user =>
      Ok(Json.toJson(""))
    })
  }

  def listFacturas(cliId: Int, currencyId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_COBRANZA_COMPRA), { user =>
      Ok(Json.toJson(Recordset.getAsJson(Cobranza.listFacturas(user, cliId, currencyId))))
    })
  }

  def listFacturasItems(ids: Option[String]) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_COBRANZA_COMPRA), { user =>
      Ok(Json.toJson(Recordset.getAsJson(Cobranza.listFacturasItems(user, ids.getOrElse("")))))
    })
  }
}
