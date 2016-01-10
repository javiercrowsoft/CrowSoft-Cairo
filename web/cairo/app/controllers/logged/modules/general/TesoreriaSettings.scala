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
import models.cairo.system.database.{Recordset, DBHelper}


case class TesoreriaSettingData(
                                 id: Option[Int],
                                 items: List[SettingData]
                                 )

object TesoreriaSettings extends Controller with ProvidesUser {

  val settingFields = List(C.CFG_ASPECTO, C.CFG_GRUPO, C.CFG_VALOR, C.EMP_ID, C.CFG_FILTER)

  val tesoreriaSettingForm = Form(
    mapping(
      "id" -> optional(number),
      C.CONFIGURACION -> Forms.list[SettingData](
        mapping(
          C.CFG_ASPECTO -> text,
          C.CFG_GRUPO -> text,
          C.CFG_VALOR -> text,
          C.EMP_ID -> optional(number),
          C.CFG_FILTER -> text)
          (SettingData.apply)(SettingData.unapply)
      )
    )(TesoreriaSettingData.apply)(TesoreriaSettingData.unapply))

  implicit val tesoreriaSettingWrites = new Writes[TesoreriaSetting] {
    def writes(tesoreriaSetting: TesoreriaSetting) = Json.obj(
      "id" -> Json.toJson(tesoreriaSetting.userId),
      "settings" -> Json.toJson(writeSettings(tesoreriaSetting.settings))
    )
    def writeSettingValue(value: Any) = value match {
      case value: String => Json.toJson(value)
      case complexSetting: ComplexSetting => Json.obj(
        "id" -> complexSetting.id,
        "name" -> complexSetting.name
      )
      case _ => Json.toJson("")
    }
    def settingWrites(setting: Setting) = Json.obj(
      C.CFG_GRUPO -> Json.toJson(setting.group),
      C.CFG_ASPECTO -> Json.toJson(setting.key),
      C.CFG_VALOR -> Json.toJson(writeSettingValue(setting.value))
    )
    def writeSettings(items: List[Setting]) = items.map(setting => settingWrites(setting))
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.MODIFY_CONFIG_TESORERIA), { user =>
      Ok(Json.toJson(TesoreriaSetting.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in UPDATE into a SettingData structure
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
      val settingItem = Global.preprocessFormParams(settingFields, "", params)
      val item = JsObject((settingItem).toSeq)
      item
    }

    def preprocessItemsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessItemParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // groups for SettingCompraData
    //
    val settingId = Global.preprocessFormParams(List("id"), "", params)

    // items
    //
    val itemsInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.CONFIGURACION, params))
    val itemRows = Global.getParamsJsonRequestFor(C.ITEMS, itemsInfo)
    val settingItems = preprocessItemsParam(itemRows.head._2, C.CONFIGURACION)

    JsObject(
      (settingId ++ settingItems).toSeq)
  }

  def getItems(items: List[SettingData]): List[Setting] = {
    items.map(item => {
      Setting(
        item.key, item.group, item.value, item.empId.getOrElse(DBHelper.NoId), item.filter
      )
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in TesoreriaSettings.update")

    tesoreriaSettingForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      tesoreriaSetting => {
        Logger.debug(s"form: ${tesoreriaSetting.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.MODIFY_CONFIG_TESORERIA), { user =>
          Ok(
            Json.toJson(
              TesoreriaSetting.update(user,
                TesoreriaSetting(
                  id, getItems(tesoreriaSetting.items)
                ))))
        })
      }
    )
  }

}