package controllers.logged.modules.contabilidad

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.contabilidad._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.{Recordset, DBHelper}
import java.util.Date
import formatters.json.DateFormatter
import formatters.json.DateFormatter._
import scala.util.control.NonFatal

case class AsientoIdData(
                          docId: Int,
                          numero: Int,
                          nroDoc: String
                         )

case class AsientoBaseData(
                            descrip: String,
                            fecha: String
                           )

case class AsientoItemData(
                            id: Int,
                            descrip: String,
                            cueId: Int,
                            ccosId: Int,
                            debe: Double,
                            haber: Double,
                            origen: Double,
                            orden: Int
                          )

case class AsientoData(
                        id: Option[Int],
                        ids: AsientoIdData,
                        base: AsientoBaseData,
                        items: List[AsientoItemData],
                        itemDeleted: String
                      )

case class AsientoParamsData(
                                from: String,
                                to: String,
                                docId: String,
                                empId: String
                                )

object Asientos extends Controller with ProvidesUser {

  val GC = models.cairo.modules.general.C

  val asientoParamsForm: Form[AsientoParamsData] = Form(
    mapping(
      GC.FROM -> text,
      GC.TO -> text,
      GC.DOC_ID -> text,
      GC.EMP_ID -> text
    )(AsientoParamsData.apply)(AsientoParamsData.unapply)
  )

  val asientoIdFields = List(GC.DOC_ID, C.AS_NUMERO, C.AS_NRODOC)

  val asientoBaseFields = List(C.AS_DESCRIP, C.AS_FECHA)

  val asientoItemData = List(C.ASI_ID, C.ASI_DESCRIP, GC.CUE_ID, GC.CCOS_ID, C.ASI_DEBE, C.ASI_HABER, C.ASI_ORIGEN, C.ASI_ORDEN)

  val asientoForm: Form[AsientoData] = Form(
    mapping(
      "id" -> optional(number),
      C.ASIENTO_ID -> mapping(
        GC.DOC_ID -> number,
        C.AS_NUMERO -> number,
        C.AS_NRODOC -> text)
        (AsientoIdData.apply)(AsientoIdData.unapply),
      C.ASIENTO_BASE -> mapping(
        C.AS_DESCRIP -> text,
        C.AS_FECHA -> text)
      (AsientoBaseData.apply)(AsientoBaseData.unapply),
      C.ASIENTO_ITEM_TMP -> Forms.list[AsientoItemData](
        mapping(
          C.ASI_ID -> number,
          C.ASI_DESCRIP -> text,
          GC.CUE_ID -> number,
          GC.CCOS_ID -> number,
          C.ASI_DEBE -> of(Global.doubleFormat),
          C.ASI_HABER -> of(Global.doubleFormat),
          C.ASI_ORIGEN -> of(Global.doubleFormat),
          C.ASI_ORDEN -> number)
        (AsientoItemData.apply)(AsientoItemData.unapply)
      ),
      C.ASIENTO_ITEM_DELETED -> text
    )(AsientoData.apply)(AsientoData.unapply)
  )

  implicit val asientoParamsWrites = new Writes[AsientoParams] {
    def writes(asientoParams: AsientoParams) = Json.obj(
      GC.FROM -> Json.toJson(asientoParams.from),
      GC.TO -> Json.toJson(asientoParams.to),
      GC.DOC_ID -> Json.toJson(asientoParams.docId),
      GC.DOC_NAME -> Json.toJson(asientoParams.docName),
      GC.EMP_ID -> Json.toJson(asientoParams.empId),
      GC.EMP_NAME -> Json.toJson(asientoParams.empName)
    )
  }

  implicit val asientoWrites = new Writes[Asiento] {
    def writes(asiento: Asiento) = Json.obj(
      "id" -> Json.toJson(asiento.id),
      C.AS_ID -> Json.toJson(asiento.id),

      GC.DOC_ID -> Json.toJson(asiento.ids.docId),
      GC.DOC_NAME -> Json.toJson(asiento.ids.docName),
      C.AS_NRODOC -> Json.toJson(asiento.ids.nroDoc),
      C.AS_NUMERO -> Json.toJson(asiento.ids.numero),
      C.AS_FECHA -> Json.toJson(asiento.base.fecha),
      C.AS_DESCRIP -> Json.toJson(asiento.base.descrip),

      GC.DOCT_ID -> Json.toJson(asiento.references.doctId),
      C.DOCT_ID_CLIENTE -> Json.toJson(asiento.references.doctIdCliente),
      C.ID_CLIENTE -> Json.toJson(asiento.references.idCliente),
      C.DOC_CLIENTE -> Json.toJson(asiento.references.docCliente),
      GC.TA_MASCARA -> Json.toJson(asiento.references.taMascara),
      GC.TA_PROPUESTO -> Json.toJson(asiento.references.taPropuesto),
      
      GC.EDITABLE -> Json.toJson(asiento.references.editable),
      GC.EDIT_MSG -> Json.toJson(asiento.references.editMsg),

      // Items
      "items" -> Json.toJson(writeAsientoItems(asiento.items.items))
    )
    def asientoItemWrites(i: AsientoItem) = Json.obj(
      C.ASI_ID -> Json.toJson(i.id),
      C.ASI_DESCRIP -> Json.toJson(i.descrip),
      GC.CUE_ID -> Json.toJson(i.cueId),
      GC.CUE_NAME -> Json.toJson(i.cueName),
      GC.CCOS_ID -> Json.toJson(i.ccosId),
      GC.CCOS_NAME -> Json.toJson(i.ccosName),
      C.ASI_DEBE -> Json.toJson(i.debe),
      C.ASI_HABER -> Json.toJson(i.haber),
      C.ASI_ORIGEN -> Json.toJson(i.origen),
      C.ASI_ORDEN -> Json.toJson(i.orden)
    )
    def writeAsientoItems(items: List[AsientoItem]) = items.map(item => asientoItemWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_ASIENTO), { user =>
      Ok(Json.toJson(Asiento.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a AsientoData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in Asiento/Data, AsientoItem/Data, etc
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

      // groups for AsientoItemData
      //
      val asientoItem = Global.preprocessFormParams(asientoItemData, "", params)

      JsObject((asientoItem).toSeq)
    }

    def preprocessItemsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessItemParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for AsientoData
    //
    val asientoId = Global.preprocessFormParams(List("id"), "", params)
    val asientoIdGroup = Global.preprocessFormParams(asientoIdFields, C.ASIENTO_ID, params)
    val asientoBaseGroup = Global.preprocessFormParams(asientoBaseFields, C.ASIENTO_BASE, params)

    // items
    //
    val itemsInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.ASIENTO_ITEM_TMP, params))
    val itemRows = Global.getParamsJsonRequestFor(GC.ITEMS, itemsInfo)
    val itemDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(GC.DELETED_LIST, itemsInfo).toList match {
      case Nil => Map(C.ASIENTO_ITEM_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.ASIENTO_ITEM_DELETED -> Json.toJson(deletedList._2))
    }
    val asientoItems = preprocessItemsParam(itemRows.head._2, C.ASIENTO_ITEM_TMP)

    JsObject((asientoId ++ asientoIdGroup ++ asientoBaseGroup ++ asientoItems ++ itemDeleted).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getItems(items: List[AsientoItemData]): List[AsientoItem] = {
    items.map(item => {
      AsientoItem(
        item.id,
        item.descrip,
        item.cueId,
        item.ccosId,
        item.debe,
        item.haber,
        item.origen,
        item.orden
      )
    })
  }

  def getAsientoItems(asiento: AsientoData): AsientoItems = {
    AsientoItems(
      getItems(asiento.items),
      asiento.itemDeleted
    )
  }

  def getAsiento(asiento: AsientoData, id: Int): Asiento = {
    Asiento(
      id,
      AsientoId(
        asiento.ids.docId,
        asiento.ids.numero,
        asiento.ids.nroDoc),
      AsientoBase(
        DateFormatter.parse(asiento.base.fecha),
        asiento.base.descrip),
      Asiento.emptyAsientoReferences,
      getAsientoItems(asiento)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Asientos.update")

    asientoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      asiento => {
        Logger.debug(s"form: ${asiento.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_ASIENTO), { user =>
          try {
            Ok(
              Json.toJson(
                Asiento.update(user,
                  getAsiento(asiento, id)
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
    Logger.debug("in Asientos.create")
    asientoForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      asiento => {
        Logger.debug(s"form: ${asiento.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_ASIENTO), { user =>
          try {
            Ok(
              Json.toJson(
                Asiento.create(user,
                  getAsiento(asiento, DBHelper.NoId)
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
    Logger.debug("in Asientos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_ASIENTO), { user =>
      try {
        Asiento.delete(user, id)
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
            docId: Option[String],
            empId: Option[String]
    ) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_ASIENTO), { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            Asiento.list(
              user,
              DateFormatter.parse(from.getOrElse("")), DateFormatter.parse(to.getOrElse("")),
              docId, empId))))
    })
  }

  def parameters = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_ASIENTO), { user =>
      Ok(Json.toJson(Asiento.loadParams(user)))
    })
  }

  def saveParameters = PostAction { implicit request =>
    Logger.debug("in Asientos.saveParameters")
    asientoParamsForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      asientoParams => {
        Logger.debug(s"form: ${asientoParams.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_ASIENTO), { user =>
          Ok(
            Json.toJson(
              Asiento.saveParams(user,
                AsientoParams(
                    asientoParams.from,
                    asientoParams.to,
                    asientoParams.docId,
                    asientoParams.empId
                )
              )
            )
          )
        })
      }
    )
  }

  def notes(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_ASIENTO), { user =>
      Ok(Json.toJson(""))
    })
  }
}