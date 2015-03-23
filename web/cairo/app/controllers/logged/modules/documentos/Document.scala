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


object Documents extends Controller with ProvidesUser {

  val GC = models.cairo.modules.general.C

  def editStatus(id: Int, preId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val status = Document.editStatus(user, id, preId)
      Ok(
        Json.toJson(
          Json.obj(
            GC.DOC_EDITABLE_STATUS -> Json.toJson(status.status),
            GC.DOC_EDITABLE_MESSAGE -> Json.toJson(status.message)
          )))
    })
  }

  def info(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val info = Document.info(user, id)
      Ok(
        Json.toJson(
          Json.obj(
            GC.MON_ID -> Json.toJson(info.monId),
            GC.DOCT_ID -> Json.toJson(info.doctId),
            GC.DOC_TIPO_FACTURA -> Json.toJson(info.docTipoFactura),
            GC.DOC_MUEVE_STOCK -> Json.toJson(info.mueveStock)
          )))
    })
  }
}