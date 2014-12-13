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


case class PercepcionTipoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              generaSicore: Boolean,
              codigoSicore: String,
              cueId: Int,
              descrip: String
              )

object PercepcionTipos extends Controller with ProvidesUser {

  val percepcionTipoForm = Form(
    mapping(
      "id" -> optional(number),
      C.PERCT_NAME -> nonEmptyText,
      C.PERCT_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.PERCT_GENERA_SICORE -> boolean,
      C.PERCT_CODIGO_SICORE -> text,
      C.CUE_ID -> number,
      C.PERCT_DESCRIP -> text
  )(PercepcionTipoData.apply)(PercepcionTipoData.unapply))

  implicit val percepcionTipoWrites = new Writes[PercepcionTipo] {
    def writes(percepcionTipo: PercepcionTipo) = Json.obj(
      "id" -> Json.toJson(percepcionTipo.id),
      C.PERCT_ID -> Json.toJson(percepcionTipo.id),
      C.PERCT_NAME -> Json.toJson(percepcionTipo.name),
      C.PERCT_CODE -> Json.toJson(percepcionTipo.code),
      DBHelper.ACTIVE -> Json.toJson(percepcionTipo.active),
      C.PERCT_GENERA_SICORE -> Json.toJson(percepcionTipo.generaSicore),
      C.PERCT_CODIGO_SICORE -> Json.toJson(percepcionTipo.codigoSicore),
      C.CUE_ID -> Json.toJson(percepcionTipo.cueId),
      C.CUE_NAME -> Json.toJson(percepcionTipo.cueName),
      C.PERCT_DESCRIP -> Json.toJson(percepcionTipo.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PERCEPCIONTIPO), { user =>
      Ok(Json.toJson(PercepcionTipo.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in PercepcionTipos.update")
    percepcionTipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      percepcionTipo => {
        Logger.debug(s"form: ${percepcionTipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PERCEPCIONTIPO), { user =>
          Ok(
            Json.toJson(
              PercepcionTipo.update(user,
                PercepcionTipo(
                       id,
                       percepcionTipo.name,
                       percepcionTipo.code,
                       percepcionTipo.active,
                       percepcionTipo.generaSicore,
                       percepcionTipo.codigoSicore,
                       percepcionTipo.cueId,
                       percepcionTipo.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in PercepcionTipos.create")
    percepcionTipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      percepcionTipo => {
        Logger.debug(s"form: ${percepcionTipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PERCEPCIONTIPO), { user =>
          Ok(
            Json.toJson(
              PercepcionTipo.create(user,
                PercepcionTipo(
                       percepcionTipo.name,
                       percepcionTipo.code,
                       percepcionTipo.active,
                       percepcionTipo.generaSicore,
                       percepcionTipo.codigoSicore,
                       percepcionTipo.cueId,
                       percepcionTipo.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in PercepcionTipos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PERCEPCIONTIPO), { user =>
      PercepcionTipo.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
