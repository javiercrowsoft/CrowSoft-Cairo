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
                             cobId: Int,
                             lgjId: Int,
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
                                 cueId: Int,
                                 ccosId: Int,
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
                               fvId: Int,
                               fvdId: Int,
                               importe: Double,
                               importeOrigen: Double,
                               cotizacion: Double
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

  val cobranzaTotalsFields = List(C.COBZ_NETO, C.COBZ_TOTAL)

  val cobranzaItemBase = List(C.COBZI_DESCRIP, GC.PR_ID, GC.CCOS_ID, GC.TO_ID, GC.CUE_ID, C.COBZI_ORDEN)

  val cobranzaItemTotals = List(C.COBZI_IMPORTE, C.COBZI_IMPORTE_ORIGEN)

  val facturaCobranza = List(C.FV_ID, C.FVD_ID, C.FV_COBZ_IMPORTE, C.FV_COBZ_IMPORTE_ORIGEN, C.FV_COBZ_COTIZACION)

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
            GC.CUE_ID -> number,
            GC.CCOS_ID -> number,
            C.COBZI_ORDEN -> number)
            (CobranzaItemDataBase.apply)(CobranzaItemDataBase.unapply),
          C.COBRANZA_ITEM_TOTALS -> mapping (
            C.COBZI_IMPORTE -> of(Global.doubleFormat),
            C.COBZI_IMPORTE_ORIGEN -> of(Global.doubleFormat))
            (CobranzaItemDataTotals.apply)(CobranzaItemDataTotals.unapply)
        )(CobranzaItemData.apply)(CobranzaItemData.unapply)
      ),
      C.COBRANZA_ITEM_DELETED -> text,
      C.FACTURA_VENTA_COBRANZA_TMP -> Forms.list[FacturaCobranzaData](
        mapping (
          C.FV_ID -> number,
          C.FVD_ID -> number,
          C.FV_COBZ_IMPORTE -> of(Global.doubleFormat),
          C.FV_COBZ_IMPORTE_ORIGEN -> of(Global.doubleFormat),
          C.FV_COBZ_COTIZACION -> of(Global.doubleFormat)
        )(FacturaCobranzaData.apply)(FacturaCobranzaData.unapply)
      )
    )(CobranzaData.apply)(CobranzaData.unapply)
  )

  implicit val cobranzaParamsWrites = new Writes[CobranzaParams] {
    def writes(cobranzaParams: CobranzaParams) = Json.obj(
      GC.FROM -> Json.toJson(cobranzaParams.from),
      GC.TO -> Json.toJson(cobranzaParams.to),
      GC.CLI_ID -> Json.toJson(cobranzaParams.cliId),
      GC.CLI_NAME -> Json.toJson(cobranzaParams.cliName),
      GC.EST_ID -> Json.toJson(cobranzaParams.estId),
      GC.EST_NAME -> Json.toJson(cobranzaParams.estName),
      GC.CCOS_ID -> Json.toJson(cobranzaParams.ccosId),
      GC.CCOS_NAME -> Json.toJson(cobranzaParams.ccosName),
      GC.SUC_ID -> Json.toJson(cobranzaParams.sucId),
      GC.SUC_NAME -> Json.toJson(cobranzaParams.sucName),
      GC.COB_ID -> Json.toJson(cobranzaParams.cobId),
      GC.COB_NAME -> Json.toJson(cobranzaParams.cobName),
      GC.DOC_ID -> Json.toJson(cobranzaParams.docId),
      GC.DOC_NAME -> Json.toJson(cobranzaParams.docName),
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

      C.COBZ_FECHA -> Json.toJson(cobranza.fecha),

      GC.CLI_ID -> Json.toJson(cobranza.base.cliId),
      GC.CLI_NAME -> Json.toJson(cobranza.base.cliName),
      GC.EST_ID -> Json.toJson(cobranza.base.estId),
      GC.EST_NAME -> Json.toJson(cobranza.base.estName),
      GC.SUC_ID -> Json.toJson(cobranza.base.sucId),
      GC.SUC_NAME -> Json.toJson(cobranza.base.sucName),
      GC.CCOS_ID -> Json.toJson(cobranza.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(cobranza.base.ccosName),
      GC.COB_ID -> Json.toJson(cobranza.base.cobId),
      GC.COB_NAME -> Json.toJson(cobranza.base.cobName),
      GC.LGJ_ID -> Json.toJson(cobranza.base.lgjId),
      GC.LGJ_CODE -> Json.toJson(cobranza.base.lgjCode),
      C.COBZ_DESCRIP -> Json.toJson(cobranza.base.descrip),
      C.COBZ_GRABAR_ASIENTO -> Json.toJson(cobranza.base.grabarAsiento),

      GC.DOCT_ID -> Json.toJson(cobranza.references.doctId),
      GC.DOCT_NAME -> Json.toJson(cobranza.references.doctName),
      GC.TA_MASCARA -> Json.toJson(cobranza.references.taMascara),
      GC.TA_PROPUESTO -> Json.toJson(cobranza.references.taPropuesto),
      C.COBZ_FIRMADO -> Json.toJson(cobranza.references.firmado),
      C.AS_ID -> Json.toJson(cobranza.references.asId),
      GC.EDITABLE -> Json.toJson(cobranza.references.editable),
      GC.EDIT_MSG -> Json.toJson(cobranza.references.editMsg),

      C.COBZ_COTIZACION -> Json.toJson(cobranza.cotizacion),

      C.COBZ_NETO -> Json.toJson(cobranza.totals.neto),
      C.COBZ_OTROS -> Json.toJson(cobranza.totals.totalOtros),
      C.COBZ_TOTAL -> Json.toJson(cobranza.totals.total),

      "items" -> Json.toJson(writeCobranzaItems(cobranza.items.items))
    )
    def cobranzaItemWrites(i: CobranzaItem) = Json.obj(
      C.COBZI_ID -> Json.toJson(i.id),
      C.COBZI_DESCRIP -> Json.toJson(i.base.descrip),
      GC.CUE_ID -> Json.toJson(i.base.cueId),
      GC.CUE_NAME -> Json.toJson(i.base.cueName),
      GC.CCOS_ID -> Json.toJson(i.base.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.base.ccosName),
      C.COBZI_ORDEN -> Json.toJson(i.base.orden),
      C.COBZI_IMPORTE -> Json.toJson(i.totals.importe),
      C.COBZI_IMPORTE_ORIGEN -> Json.toJson(i.totals.importeOrigen)
    )
    def writeCobranzaItems(items: List[CobranzaItem]) = items.map(item => cobranzaItemWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA), { user =>
      Ok(Json.toJson(Cobranza.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a CobranzaData structure
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
      val cobranzaItem = Global.preprocessFormParams(List(C.COBZI_ID), "", params)
      val cobranzaItemBaseGroup = Global.preprocessFormParams(cobranzaItemBase, C.COBRANZA_ITEM_BASE, params)
      val cobranzaItemTotalsGroup = Global.preprocessFormParams(cobranzaItemTotals, C.COBRANZA_ITEM_TOTALS, params)

      val item = JsObject(
        (cobranzaItem ++ cobranzaItemBaseGroup ++ cobranzaItemTotalsGroup).toSeq)
      item
    }

    def preprocessFacturaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(facturaCobranza, "", params).toSeq)
    }

    def preprocessItemsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessItemParam(_))))
      case _ => Map.empty
    }

    def preprocessFacturasParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessFacturaParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for CobranzaData
    //
    val facturaId = Global.preprocessFormParams(List("id"), "", params)
    val facturaIdGroup = Global.preprocessFormParams(cobranzaIdFields, C.COBRANZA_ID, params)
    val facturaBaseGroup = Global.preprocessFormParams(cobranzaBaseFields, C.COBRANZA_BASE, params)
    val facturaTotalGroup = Global.preprocessFormParams(cobranzaTotalsFields, C.COBRANZA_TOTALS, params)

    // items
    //
    val itemsInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.COBRANZA_ITEM_TMP, params))
    val itemRows = Global.getParamsJsonRequestFor(GC.ITEMS, itemsInfo)
    val itemDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, itemsInfo).toList match {
      case Nil => Map(C.COBRANZA_ITEM_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.COBRANZA_ITEM_DELETED -> Json.toJson(deletedList._2))
    }
    val facturaItems = preprocessItemsParam(itemRows.head._2, C.COBRANZA_ITEM_TMP)

    // facturas
    //
    val facturasInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.FACTURA_VENTA_COBRANZA_TMP, params))
    val facturaRows = Global.getParamsJsonRequestFor(GC.ITEMS, facturasInfo)
    val facturaFacturas = facturaRows.toList match {
      case (k: String, item: JsValue) :: t => preprocessFacturasParam(item, C.FACTURA_VENTA_COBRANZA_TMP)
      case _ => Map(C.FACTURA_VENTA_COBRANZA_TMP -> JsArray(List()))
    }

    JsObject(
      (facturaId ++ facturaIdGroup ++ facturaBaseGroup ++ facturaTotalGroup
        ++ facturaItems ++ itemDeleted ++ facturaFacturas).toSeq)
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
          item.base.cueId,
          item.base.ccosId,
          item.base.orden
        ),
        CobranzaItemTotals(
          item.totals.importe,
          item.totals.importeOrigen
        )
      )
    })
  }

  def getFacturas(facturas: List[FacturaCobranzaData]): List[FacturaCobranza] = {
    facturas.map(factura => {
      FacturaCobranza(
        factura.fvId,
        factura.fvdId,
        factura.importe,
        factura.importeOrigen,
        factura.cotizacion
      )
    })
  }

  def getCobranzaItems(cobranza: CobranzaData): CobranzaItems = {
    CobranzaItems(
      getItems(cobranza.items),

      /* only used in save */
      cobranza.itemDeleted,

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
        cobranza.base.cobId,
        cobranza.base.lgjId,
        cobranza.base.descrip,
        cobranza.base.grabarAsiento),
      Cobranza.emptyCobranzaReferences,
      DateFormatter.parse(cobranza.fecha),
      cobranza.cotizacion,
      CobranzaTotals(
        cobranza.totals.neto,
        cobranza.totals.totalOtros,
        cobranza.totals.total),
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
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_COBRANZA), { user =>
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

  def create = PostAction { implicit request =>
    Logger.debug("in Cobranzas.create")
    cobranzaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cobranza => {
        Logger.debug(s"form: ${cobranza.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_COBRANZA), { user =>
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
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_COBRANZA), { user =>
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
            cobId: Option[String],
            docId: Option[String],
            empId: Option[String]
            ) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA), { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            Cobranza.list(
              user,
              DateFormatter.parse(from.getOrElse("")), DateFormatter.parse(to.getOrElse("")),
              cliId, estId, ccosId, sucId, cobId, docId, empId))))
    })
  }

  def parameters = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA), { user =>
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
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA), { user =>
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
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRANZA), { user =>
      Ok(Json.toJson(""))
    })
  }

  def listFacturas(cliId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_COBRANZA), { user =>
      Ok(Json.toJson(Recordset.getAsJson(Cobranza.listFacturas(user, cliId))))
    })
  }
}
