package controllers.logged.modules.documentos

import actions._
import controllers._
import formatters.json.DateFormatter
import models.cairo.modules.documentos._
import models.cairo.system.database.Recordset
import play.api.libs.json._
import play.api.mvc._


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

  def transInfo(doctId: Int, id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val info = Document.transInfo(user, doctId, id)
      Ok(
        Json.toJson(
          Json.obj(
            GC.ID -> Json.toJson(info.id),
            GC.COTIZACION -> Json.toJson(info.cotizacion),
            GC.TOTAL -> Json.toJson(info.total),
            GC.NRO_DOC -> Json.toJson(info.nrodoc),
            GC.PROV_ID -> Json.toJson(info.provId),
            GC.CLI_ID -> Json.toJson(info.cliId),
            GC.PROV_NAME -> Json.toJson(info.provName),
            GC.CLI_NAME -> Json.toJson(info.cliName),
            GC.SUC_ID -> Json.toJson(info.sucId),
            GC.DOC_ID -> Json.toJson(info.docId),
            GC.DOCT_ID -> Json.toJson(info.doctId),
            GC.EMP_ID -> Json.toJson(info.empId),
            GC.EMP_NAME -> Json.toJson(info.empName)
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

  def nextNumber(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val nextNumber = Document.nextNumber(user, id)
      Ok(
        Json.toJson(
          Json.obj(
            GC.TA_NUMBER -> Json.toJson(nextNumber.number),
            GC.TA_MASCARA -> Json.toJson(nextNumber.mask),
            GC.TA_ENABLED -> Json.toJson(nextNumber.enabled)
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

  def customerNextNumber(id: Int, cliId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val nextNumber = Document.customerNextNumber(user, id, cliId)
      Ok(
        Json.toJson(
          Json.obj(
            GC.TA_NUMBER -> Json.toJson(nextNumber.number),
            GC.TA_MASCARA -> Json.toJson(nextNumber.mask),
            GC.TA_ENABLED -> Json.toJson(nextNumber.enabled)
          )))
    })
  }

  def customerAccount(id: Int, cliId: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val accountInfo = Document.customerAccount(user, id, cliId)
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
            "name" -> Json.toJson(docInfo.name),
            "monId" -> Json.toJson(docInfo.monId)
          )))
    })
  }

  def reports(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Ok(
        Json.toJson(
          Recordset.getAsJson(
            Document.reports(user, id))))
    })
  }
}