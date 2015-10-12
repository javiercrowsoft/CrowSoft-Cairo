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

case class RubroTablaItemData(
                                id: Int,
                                code: String,
                                name: String,
                                descrip: String
                                )
case class RubroTablaData(
                           id: Option[Int],
                           name: String,
                           code: String,
                           active: Boolean,
                           descrip: String,
                           items: List[RubroTablaItemData],
                           itemDeleted: String
                           )

object RubroTablas extends Controller with ProvidesUser {

  val rubroTablaFields = List("id", DBHelper.ACTIVE, C.RUBT_CODE, C.RUBT_NAME, C.RUBT_DESCRIP)

  val rubroTablaItemFields = List(C.RUBTI_ID, C.RUBTI_CODE, C.RUBTI_NAME, C.RUBTI_DESCRIP)

  val rubroTablaForm = Form(
    mapping(
      "id" -> optional(number),
      C.RUBT_NAME -> nonEmptyText,
      C.RUBT_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.RUBT_DESCRIP -> text,
      C.RUBRO_TABLA_ITEM -> Forms.list[RubroTablaItemData](
        mapping(
          C.RUBTI_ID -> number,
          C.RUBTI_CODE -> text,
          C.RUBTI_NAME -> text,
          C.RUBTI_DESCRIP -> text
        )(RubroTablaItemData.apply)(RubroTablaItemData.unapply)
      ),
      C.RUBRO_TABLA_ITEM_DELETED -> text
    )(RubroTablaData.apply)(RubroTablaData.unapply))

  implicit val rubroTablaWrites = new Writes[RubroTabla] {
    def writes(rubroTabla: RubroTabla) = Json.obj(
      "id" -> Json.toJson(rubroTabla.id),
      C.RUBT_ID -> Json.toJson(rubroTabla.id),
      C.RUBT_NAME -> Json.toJson(rubroTabla.name),
      C.RUBT_CODE -> Json.toJson(rubroTabla.code),
      DBHelper.ACTIVE -> Json.toJson(rubroTabla.active),
      C.RUBT_DESCRIP -> Json.toJson(rubroTabla.descrip),

      // Items
      "items" -> Json.toJson(writeRubroTablaItems(rubroTabla.items))
    )
    def rubroTablaItemWrites(p: RubroTablaItem) = Json.obj(
      C.RUBTI_ID -> Json.toJson(p.id),
      C.RUBTI_CODE -> Json.toJson(p.code),
      C.RUBTI_NAME -> Json.toJson(p.name),
      C.RUBTI_DESCRIP -> Json.toJson(p.descrip)
    )
    def writeRubroTablaItems(items: List[RubroTablaItem]) = items.map(item => rubroTablaItemWrites(item))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_RUBROTABLA), { user =>
      Ok(Json.toJson(RubroTabla.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a RubroTablaData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in RubroTabla/Data, RubroTablaItem/Data, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def getJsValueAsMap(list: Map[String, JsValue]): Map[String, JsValue] = list.toList match {
      case (key: String, jsValue: JsValue) :: t => jsValue.as[Map[String, JsValue]]
      case _ => Map.empty
    }

    def preprocessItemParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(rubroTablaItemFields, "", params).toSeq)
    }

    def preprocessItemsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessItemParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for FacturaCompraData
    //
    val rubroTablaId = Global.preprocessFormParams(rubroTablaFields, "", params)

    // items
    //
    val itemsInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.RUBRO_TABLA_ITEM, params))
    val itemRows = Global.getParamsJsonRequestFor(C.ITEMS, itemsInfo)
    val itemDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, itemsInfo).toList match {
      case Nil => Map(C.RUBRO_TABLA_ITEM_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.RUBRO_TABLA_ITEM_DELETED -> Json.toJson(deletedList._2))
    }
    val rubroTablaItems = preprocessItemsParam(itemRows.head._2, C.RUBRO_TABLA_ITEM)

    JsObject(
      (rubroTablaId ++ rubroTablaItems ++ itemDeleted).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getRubroTablaItems(items: List[RubroTablaItemData]): List[RubroTablaItem] = {
    items.map(item => {
      RubroTablaItem(
        item.id,
        item.code,
        item.name,
        item.descrip
      )
    })
  }

  def getRubroTabla(rubroTabla: RubroTablaData, id: Int): RubroTabla = {
    RubroTabla(
      id,
      rubroTabla.name,
      rubroTabla.code,
      rubroTabla.active,
      rubroTabla.descrip,
      getRubroTablaItems(rubroTabla.items),
      rubroTabla.itemDeleted
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in RubroTablas.update")
    rubroTablaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      rubroTabla => {
        Logger.debug(s"form: ${rubroTabla.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_RUBROTABLA), { user =>
          Ok(
            Json.toJson(
              RubroTabla.update(user,
                getRubroTabla(rubroTabla, id)
              )
            )
          )
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in RubroTablas.create")
    rubroTablaForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      rubroTabla => {
        Logger.debug(s"form: ${rubroTabla.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_RUBROTABLA), { user =>
          Ok(
            Json.toJson(
              RubroTabla.create(user,
                getRubroTabla(rubroTabla, DBHelper.NoId)
              )
            )
          )
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in RubroTablas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_RUBROTABLA), { user =>
      RubroTabla.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}