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


case class StockSettingData(id: Option[Int])

object StockSettings extends Controller with ProvidesUser {

  val stockSettingForm = Form(
    mapping(
      "id" -> optional(number)
    )(StockSettingData.apply)(StockSettingData.unapply))

  implicit val stockSettingWrites = new Writes[StockSetting] {
    def writes(stockSetting: StockSetting) = Json.obj(
      "id" -> Json.toJson(stockSetting.userId),
      "settings" -> Json.toJson(writeSettings(stockSetting.settings))
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
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.MODIFY_CONFIG_STOCK), { user =>
      Ok(Json.toJson(StockSetting.get(user, id)))
    })
  }

  // TODO: this method is not completed. It is not saving the form
  //
  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in StockSettings.update")
    stockSettingForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      stockSetting => {
        Logger.debug(s"form: ${stockSetting.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.MODIFY_CONFIG_STOCK), { user =>
          Ok(
            Json.toJson(
              StockSetting.update(user,
                StockSetting(
                  id, List()
                ))))
        })
      }
    )
  }

}