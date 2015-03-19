package controllers.logged.modules.documentos

import controllers._
import models.cairo.modules.general.ProductoProveedor
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.documentos._
import models.cairo.system.security.CairoSecurity
import models.cairo.system.database.{Recordset, DBHelper}
import java.util.Date
import formatters.json.DateFormatter
import formatters.json.DateFormatter._


object Currencies extends Controller with ProvidesUser {

  val GC = models.cairo.modules.general.C

  def rate(id: Int, date: String) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val rate = Currency.rate(user, id, DateFormatter.parse(date))
      Ok(Json.toJson(Json.obj(GC.MON_PRECIO -> Json.toJson(rate))))
    })
  }
}