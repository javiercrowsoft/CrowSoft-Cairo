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

object Cheques extends Controller with ProvidesUser {

  val TC = models.cairo.modules.tesoreria.C

  def info(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val info = Cheque.info(user, id)
      Ok(
        Json.toJson(
          Json.obj(
            C.BCO_NAME -> Json.toJson(info.bcoName),
            C.CUE_NAME -> Json.toJson(info.cueName),
            C.CLI_NAME -> Json.toJson(info.cliName),
            C.CLE_NAME -> Json.toJson(info.cleName),
            C.BCO_ID -> Json.toJson(info.bcoId),
            C.CUE_ID -> Json.toJson(info.cueId),
            TC.CHEQ_FECHA_VTO -> Json.toJson(info.fechaVto),
            TC.CHEQ_FECHA_COBRO -> Json.toJson(info.fechaCobro),
            TC.CHEQ_IMPORTE -> Json.toJson(info.importe),
            TC.CHEQ_IMPORTE_ORIGEN -> Json.toJson(info.importeOrigen)
          )))
    })
  }
}
