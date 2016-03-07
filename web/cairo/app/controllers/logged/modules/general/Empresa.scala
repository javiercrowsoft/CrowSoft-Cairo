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

case class EmpresaAddressData(
                               calle: String,
                               callenumero: String,
                               piso: String,
                               depto: String,
                               localidad: String,
                               codpostal: String,
                               tel: String,
                               fax: String,
                               email: String,
                               web: String
                             )

case class EmpresaData(
              id: Option[Int],
              name: String,
              active: Boolean,
              razonsocial: String,
              cuit: String,
              ingresosbrutos: String,
              catfiscal: Int,
              chequeorden: String,
              descrip: String,
              address: EmpresaAddressData
              )

object Empresas extends Controller with ProvidesUser {

  val empresaForm = Form(
    mapping(
      "id" -> optional(number),
      C.EMP_NAME -> nonEmptyText,
      DBHelper.ACTIVE -> boolean,
      C.EMP_RAZONSOCIAL -> text,
      C.EMP_CUIT -> text,
      C.EMP_INGRESOSBRUTOS -> text,
      C.EMP_CATFISCAL -> number,
      C.EMP_CHEQUEORDEN -> text,
      C.EMP_DESCRIP -> text,
      C.EMPRESA_ADDRESS -> mapping (
        C.EMP_CALLE -> text,
        C.EMP_CALLENUMERO -> text,
        C.EMP_PISO -> text,
        C.EMP_DEPTO -> text,
        C.EMP_LOCALIDAD -> text,
        C.EMP_CODPOSTAL -> text,
        C.EMP_TEL -> text,
        C.EMP_FAX -> text,
        C.EMP_EMAIL -> text,
        C.EMP_WEB -> text
      )(EmpresaAddressData.apply)(EmpresaAddressData.unapply)
  )(EmpresaData.apply)(EmpresaData.unapply))

  implicit val empresaWrites = new Writes[Empresa] {
    def writes(empresa: Empresa) = Json.obj(
      "id" -> Json.toJson(empresa.id),
      C.EMP_ID -> Json.toJson(empresa.id),
      C.EMP_NAME -> Json.toJson(empresa.name),
      DBHelper.ACTIVE -> Json.toJson(empresa.active),
      C.EMP_RAZONSOCIAL -> Json.toJson(empresa.razonsocial),
      C.EMP_CUIT -> Json.toJson(empresa.cuit),
      C.EMP_INGRESOSBRUTOS -> Json.toJson(empresa.ingresosbrutos),
      C.EMP_CATFISCAL -> Json.toJson(empresa.catfiscal),
      C.EMP_CHEQUEORDEN -> Json.toJson(empresa.chequeorden),
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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a RubroData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in Empresa/Address, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //
  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    val params = Global.getParamsFromJsonRequest

    // groups for rubroData
    //
    val empresaId = Global.preprocessFormParams(
      List(
        "id",
        C.EMP_NAME,
        DBHelper.ACTIVE,
        C.EMP_RAZONSOCIAL,
        C.EMP_CUIT,
        C.EMP_INGRESOSBRUTOS,
        C.EMP_CATFISCAL,
        C.EMP_CHEQUEORDEN,
        C.EMP_DESCRIP),
      "", params)
    val empresaTableGroup = Global.preprocessFormParams(
      List(
        C.EMP_CALLE,
        C.EMP_CALLENUMERO,
        C.EMP_PISO,
        C.EMP_DEPTO,
        C.EMP_LOCALIDAD,
        C.EMP_CODPOSTAL,
        C.EMP_TEL,
        C.EMP_FAX,
        C.EMP_EMAIL,
        C.EMP_WEB),
      C.EMPRESA_ADDRESS, params)

    JsObject((empresaId ++ empresaTableGroup).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getEmpresa(empresa: EmpresaData, id: Int): Empresa = {
    Empresa(
      id,
      empresa.name,
      empresa.active,
      empresa.razonsocial,
      empresa.cuit,
      empresa.ingresosbrutos,
      empresa.catfiscal,
      empresa.chequeorden,
      empresa.address.calle,
      empresa.address.callenumero,
      empresa.address.piso,
      empresa.address.depto,
      empresa.address.localidad,
      empresa.address.codpostal,
      empresa.address.tel,
      empresa.address.fax,
      empresa.address.email,
      empresa.address.web,
      empresa.descrip
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Empresas.update")
    empresaForm.bind(preprocessParams).fold(
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
                getEmpresa(empresa, id)
              )
            )
          )
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Empresas.create")
    empresaForm.bind(preprocessParams).fold(
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
                getEmpresa(empresa, DBHelper.NoId)
              )
            )
          )
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Empresas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_EMPRESA), { user =>
      Empresa.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
