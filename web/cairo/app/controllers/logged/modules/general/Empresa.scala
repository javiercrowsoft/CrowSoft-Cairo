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


case class EmpresaData(
              id: Option[Int],
              active: Boolean,
              razonsocial: String,
              cuit: String,
              ingresosbrutos: String,
              catfiscal:               chequeorden: String,
              calle: String,
              callenumero: String,
              piso: String,
              depto: String,
              localidad: String,
              codpostal: String,
              tel: String,
              fax: String,
              email: String,
              web: String,
              descrip: String
              )

object Empresas extends Controller with ProvidesUser {

  val empresaForm = Form(
    mapping(
      "id" -> optional(number),
      DBHelper.ACTIVE -> boolean,
      C.EMP_RAZONSOCIAL -> text,
      C.EMP_CUIT -> text,
      C.EMP_INGRESOSBRUTOS -> text,
      C.EMP_CATFISCAL ->       C.EMP_CHEQUEORDEN -> text,
      C.EMP_CALLE -> text,
      C.EMP_CALLENUMERO -> text,
      C.EMP_PISO -> text,
      C.EMP_DEPTO -> text,
      C.EMP_LOCALIDAD -> text,
      C.EMP_CODPOSTAL -> text,
      C.EMP_TEL -> text,
      C.EMP_FAX -> text,
      C.EMP_EMAIL -> text,
      C.EMP_WEB -> text,
      C.EMP_DESCRIP -> text
  )(EmpresaData.apply)(EmpresaData.unapply))

  implicit val empresaWrites = new Writes[Empresa] {
    def writes(empresa: Empresa) = Json.obj(
      "id" -> Json.toJson(empresa.id),
      C.EMP_ID -> Json.toJson(empresa.id),
      DBHelper.ACTIVE -> Json.toJson(empresa.active),
      C.EMP_RAZONSOCIAL -> Json.toJson(empresa.razonsocial),
      C.EMP_CUIT -> Json.toJson(empresa.cuit),
      C.EMP_INGRESOSBRUTOS -> Json.toJson(empresa.ingresosbrutos),
      C.EMP_CATFISCAL ->       C.EMP_CHEQUEORDEN -> Json.toJson(empresa.chequeorden),
      C.EMP_CALLE -> Json.toJson(empresa.calle),
      C.EMP_CALLENUMERO -> Json.toJson(empresa.callenumero),
      C.EMP_PISO -> Json.toJson(empresa.piso),
      C.EMP_DEPTO -> Json.toJson(empresa.depto),
      C.EMP_LOCALIDAD -> Json.toJson(empresa.localidad),
      C.EMP_CODPOSTAL -> Json.toJson(empresa.codpostal),
      C.EMP_TEL -> Json.toJson(empresa.tel),
      C.EMP_FAX -> Json.toJson(empresa.fax),
      C.EMP_EMAIL -> Json.toJson(empresa.email),
      C.EMP_WEB -> Json.toJson(empresa.web),
      C.EMP_DESCRIP -> Json.toJson(empresa.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_EMPRESA), { user =>
      Ok(Json.toJson(Empresa.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in empresas.update")
    empresaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      empresa => {
        Logger.debug(s"form: ${empresa.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_EMPRESA), { user =>
          Ok(
            Json.toJson(
              Empresa.update(user,
                Empresa(
                       id,
                       empresa.active,
                       empresa.razonsocial,
                       empresa.cuit,
                       empresa.ingresosbrutos,
                       empresa.catfiscal,
                       empresa.chequeorden,
                       empresa.calle,
                       empresa.callenumero,
                       empresa.piso,
                       empresa.depto,
                       empresa.localidad,
                       empresa.codpostal,
                       empresa.tel,
                       empresa.fax,
                       empresa.email,
                       empresa.web,
                       empresa.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in empresas.create")
    empresaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      empresa => {
        Logger.debug(s"form: ${empresa.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_EMPRESA), { user =>
          Ok(
            Json.toJson(
              Empresa.create(user,
                Empresa(
                       empresa.active,
                       empresa.razonsocial,
                       empresa.cuit,
                       empresa.ingresosbrutos,
                       empresa.catfiscal,
                       empresa.chequeorden,
                       empresa.calle,
                       empresa.callenumero,
                       empresa.piso,
                       empresa.depto,
                       empresa.localidad,
                       empresa.codpostal,
                       empresa.tel,
                       empresa.fax,
                       empresa.email,
                       empresa.web,
                       empresa.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in empresas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_EMPRESA), { user =>
      Empresa.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
