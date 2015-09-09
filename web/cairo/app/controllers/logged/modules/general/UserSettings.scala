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


case class UserSettingData(id: Option[Int])

object UserSettings extends Controller with ProvidesUser {

  val userSettingForm = Form(
    mapping(
      "id" -> optional(number)
    )(UserSettingData.apply)(UserSettingData.unapply))

  implicit val userSettingWrites = new Writes[UserSetting] {
    def writes(userSetting: UserSetting) = Json.obj(
      "id" -> Json.toJson(userSetting.userId),
      "settings" -> Json.toJson(writeSettings(userSetting.settings))
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
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.MODIFY_USER_SETTINGS), { user =>
      Ok(Json.toJson(UserSetting.get(user, id)))
    })
  }

  // TODO: this method is not completed. It is not saving the form
  //
  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in UserSettings.update")
    userSettingForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      userSetting => {
        Logger.debug(s"form: ${userSetting.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.MODIFY_USER_SETTINGS), { user =>
          Ok(
            Json.toJson(
              UserSetting.update(user,
                UserSetting(
                  id, List()
                ))))
        })
      }
    )
  }

  def getCajaInfo() = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(Json.toJson(Recordset.getAsJson(UserSetting.getCajaInfo(user))))
    })
  }

}