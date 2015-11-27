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


case class ContabilidadSettingData(id: Option[Int])

object ContabilidadSettings extends Controller with ProvidesUser {

  val contabilidadSettingForm = Form(
    mapping(
      "id" -> optional(number)
    )(ContabilidadSettingData.apply)(ContabilidadSettingData.unapply))

  implicit val contabilidadSettingWrites = new Writes[ContabilidadSetting] {
    def writes(contabilidadSetting: ContabilidadSetting) = Json.obj(
      "id" -> Json.toJson(contabilidadSetting.userId),
      "settings" -> Json.toJson(writeSettings(contabilidadSetting.settings))
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
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.MODIFY_CONFIG_CONTABILIDAD), { user =>
      Ok(Json.toJson(ContabilidadSetting.get(user, id)))
    })
  }

  // TODO: this method is not completed. It is not saving the form
  //
  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in ContabilidadSettings.update")
    contabilidadSettingForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      contabilidadSetting => {
        Logger.debug(s"form: ${contabilidadSetting.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.MODIFY_CONFIG_CONTABILIDAD), { user =>
          Ok(
            Json.toJson(
              ContabilidadSetting.update(user,
                ContabilidadSetting(
                  id, List()
                ))))
        })
      }
    )
  }

}