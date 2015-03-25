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


object Proveedores extends Controller with ProvidesUser {

  def info(id: Int, docId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val info = Proveedor.info(user, id, docId)
      Ok(
        Json.toJson(
          Json.obj(
            C.LP_ID -> Json.toJson(info.lpId),
            C.LP_NAME -> Json.toJson(info.lpName),
            C.LD_ID -> Json.toJson(info.ldId),
            C.LD_NAME -> Json.toJson(info.ldName),
            C.CPG_ID -> Json.toJson(info.cpgId),
            C.CPG_NAME -> Json.toJson(info.cpgName),
            C.CPG_ES_LIBRE -> Json.toJson(info.cpgEsLibre),
            C.HAS_IVA_RI -> Json.toJson(info.ivaRi),
            C.HAS_IVA_RNI -> Json.toJson(info.ivaRni)
          )))
    })
  }

  def name(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok
    })
  }

  def dataAdd(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok
    })
  }

  def catFiscal(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok
    })
  }

}