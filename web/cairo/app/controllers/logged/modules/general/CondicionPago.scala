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
import formatters.json.DateFormatter._


object CondicionesPago extends Controller with ProvidesUser {

  def info(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val info = CondicionPago.info(user, id)
      Ok(
        Json.toJson(
          Json.obj(
            C.LP_ID -> Json.toJson(info.id),
            C.LP_NAME -> Json.toJson(info.name),
            C.CPG_ES_LIBRE -> Json.toJson(info.esLibre)
          )))
    })
  }

}