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


case class CuentaGrupoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              tipo: Int,
              cueId: Int,
              descrip: String
              )

object CuentaGrupos extends Controller with ProvidesUser {

  val cuentaGrupoForm = Form(
    mapping(
      "id" -> optional(number),
      C.CUEG_NAME -> nonEmptyText,
      C.CUEG_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.CUEG_TIPO -> number,
      C.CUE_ID -> number,
      C.CUEG_DESCRIP -> text
  )(CuentaGrupoData.apply)(CuentaGrupoData.unapply))

  implicit val cuentaGrupoWrites = new Writes[CuentaGrupo] {
    def writes(cuentaGrupo: CuentaGrupo) = Json.obj(
      "id" -> Json.toJson(cuentaGrupo.id),
      C.CUEG_ID -> Json.toJson(cuentaGrupo.id),
      C.CUEG_NAME -> Json.toJson(cuentaGrupo.name),
      C.CUEG_CODE -> Json.toJson(cuentaGrupo.code),
      DBHelper.ACTIVE -> Json.toJson(cuentaGrupo.active),
      C.CUEG_TIPO -> Json.toJson(cuentaGrupo.tipo),
      C.CUE_ID -> Json.toJson(cuentaGrupo.cueId),
      C.CUE_NAME -> Json.toJson(cuentaGrupo.cueName),
      C.CUEG_DESCRIP -> Json.toJson(cuentaGrupo.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CUENTAGRUPO), { user =>
      Ok(Json.toJson(CuentaGrupo.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in CuentaGrupos.update")
    cuentaGrupoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cuentaGrupo => {
        Logger.debug(s"form: ${cuentaGrupo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CUENTAGRUPO), { user =>
          Ok(
            Json.toJson(
              CuentaGrupo.update(user,
                CuentaGrupo(
                       id,
                       cuentaGrupo.name,
                       cuentaGrupo.code,
                       cuentaGrupo.active,
                       cuentaGrupo.tipo,
                       cuentaGrupo.cueId,
                       cuentaGrupo.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in CuentaGrupos.create")
    cuentaGrupoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cuentaGrupo => {
        Logger.debug(s"form: ${cuentaGrupo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CUENTAGRUPO), { user =>
          Ok(
            Json.toJson(
              CuentaGrupo.create(user,
                CuentaGrupo(
                       cuentaGrupo.name,
                       cuentaGrupo.code,
                       cuentaGrupo.active,
                       cuentaGrupo.tipo,
                       cuentaGrupo.cueId,
                       cuentaGrupo.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in CuentaGrupos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CUENTAGRUPO), { user =>
      CuentaGrupo.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
