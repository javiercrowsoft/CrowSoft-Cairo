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


case class PercepciontipoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              generaSicore: Boolean,
              codigoSicore: String,
              cueId: Int,
              descrip: String
              )

object Percepciontipos extends Controller with ProvidesUser {

  val percepciontipoForm = Form(
    mapping(
      "id" -> optional(number),
      C.PERCT_NAME -> nonEmptyText,
      C.PERCT_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.PERCT_GENERA_SICORE -> boolean,
      C.PERCT_CODIGO_SICORE -> text,
      C.CUE_ID -> number,
      C.PERCT_DESCRIP -> text
  )(PercepciontipoData.apply)(PercepciontipoData.unapply))

  implicit val percepciontipoWrites = new Writes[Percepciontipo] {
    def writes(percepciontipo: Percepciontipo) = Json.obj(
      "id" -> Json.toJson(percepciontipo.id),
      C.PERCT_ID -> Json.toJson(percepciontipo.id),
      C.PERCT_NAME -> Json.toJson(percepciontipo.name),
      C.PERCT_CODE -> Json.toJson(percepciontipo.code),
      DBHelper.ACTIVE -> Json.toJson(percepciontipo.active),
      C.PERCT_GENERA_SICORE -> Json.toJson(percepciontipo.generaSicore),
      C.PERCT_CODIGO_SICORE -> Json.toJson(percepciontipo.codigoSicore),
      C.CUE_ID -> Json.toJson(percepciontipo.cueId),
      C.CUE_NAME -> Json.toJson(percepciontipo.cueName),
      C.PERCT_DESCRIP -> Json.toJson(percepciontipo.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PERCEPCIONTIPO), { user =>
      Ok(Json.toJson(Percepciontipo.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in percepciontipos.update")
    percepciontipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      percepciontipo => {
        Logger.debug(s"form: ${percepciontipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PERCEPCIONTIPO), { user =>
          Ok(
            Json.toJson(
              Percepciontipo.update(user,
                Percepciontipo(
                       id,
                       percepciontipo.name,
                       percepciontipo.code,
                       percepciontipo.active,
                       percepciontipo.generaSicore,
                       percepciontipo.codigoSicore,
                       percepciontipo.cueId,
                       percepciontipo.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in percepciontipos.create")
    percepciontipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      percepciontipo => {
        Logger.debug(s"form: ${percepciontipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PERCEPCIONTIPO), { user =>
          Ok(
            Json.toJson(
              Percepciontipo.create(user,
                Percepciontipo(
                       percepciontipo.name,
                       percepciontipo.code,
                       percepciontipo.active,
                       percepciontipo.generaSicore,
                       percepciontipo.codigoSicore,
                       percepciontipo.cueId,
                       percepciontipo.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in percepciontipos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PERCEPCIONTIPO), { user =>
      Percepciontipo.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
