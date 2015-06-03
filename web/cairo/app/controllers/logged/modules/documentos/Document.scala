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

  def supplierNextNumber(id: Int, provId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val nextNumber = Document.supplierNextNumber(user, id, provId)
      Ok(
        Json.toJson(
          Json.obj(
            GC.TA_NUMBER -> Json.toJson(nextNumber.number),
            GC.TA_MASCARA -> Json.toJson(nextNumber.mask),
            GC.TA_ENABLED -> Json.toJson(nextNumber.enabled)
          )))
    })
  }

  def supplierAccount(id: Int, provId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val accountInfo = Document.supplierAccount(user, id, provId)
      Ok(
        Json.toJson(
          Json.obj(
            GC.CUE_ID -> Json.toJson(accountInfo.cueId),
            GC.MON_ID -> Json.toJson(accountInfo.monId)
          )))
    })
  }

  def isValidDate(id: Int, date: String) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val dateInfo = Document.isValidDate(user, id, DateFormatter.parse(date))
      Ok(
        Json.toJson(
          Json.obj(
            "isvalid" -> Json.toJson(dateInfo.isValid),
            "range" -> Json.toJson(dateInfo.range)
          )))
    })
  }

  def fromDoctId(doctId: Int, doctIdApplic: Int, id: Int, idEx: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val docInfo = Document.fromDoctId(user, doctId, doctIdApplic, id, idEx)
      Ok(
        Json.toJson(
          Json.obj(
            "id" -> Json.toJson(docInfo.id),
            "name" -> Json.toJson(docInfo.name)
          )))
    })
  }
}