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


case class RetenciontipoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              generaSicore: Boolean,
              codigoSicore: String,
              cueId: Int,
              tipo:               descrip: String
              )

object RetencionesTipo extends Controller with ProvidesUser {

  val retencionTipoForm = Form(
    mapping(
      "id" -> optional(number),
      C.RETT_NAME -> nonEmptyText,
      C.RETT_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.RETT_GENERA_SICORE -> boolean,
      C.RETT_CODIGO_SICORE -> text,
      C.CUE_ID -> number,
      C.RETT_TIPO ->       C.RETT_DESCRIP -> text
  )(RetenciontipoData.apply)(RetenciontipoData.unapply))

  implicit val retencionTipoWrites = new Writes[Retenciontipo] {
    def writes(retencionTipo: Retenciontipo) = Json.obj(
      "id" -> Json.toJson(retencionTipo.id),
      C.RETT_ID -> Json.toJson(retencionTipo.id),
      C.RETT_NAME -> Json.toJson(retencionTipo.name),
      C.RETT_CODE -> Json.toJson(retencionTipo.code),
      DBHelper.ACTIVE -> Json.toJson(retencionTipo.active),
      C.RETT_GENERA_SICORE -> Json.toJson(retencionTipo.generaSicore),
      C.RETT_CODIGO_SICORE -> Json.toJson(retencionTipo.codigoSicore),
      C.CUE_ID -> Json.toJson(retencionTipo.cueId),
      C.CUE_NAME -> Json.toJson(retencionTipo.cueName),
      C.RETT_TIPO ->       C.RETT_DESCRIP -> Json.toJson(retencionTipo.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_RETENCIONTIPO), { user =>
      Ok(Json.toJson(Retenciontipo.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in RetencionesTipo.update")
    retencionTipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      retencionTipo => {
        Logger.debug(s"form: ${retencionTipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_RETENCIONTIPO), { user =>
          Ok(
            Json.toJson(
              Retenciontipo.update(user,
                Retenciontipo(
                       id,
                       retencionTipo.name,
                       retencionTipo.code,
                       retencionTipo.active,
                       retencionTipo.generaSicore,
                       retencionTipo.codigoSicore,
                       retencionTipo.cueId,
                       retencionTipo.tipo,
                       retencionTipo.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in RetencionesTipo.create")
    retencionTipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      retencionTipo => {
        Logger.debug(s"form: ${retencionTipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_RETENCIONTIPO), { user =>
          Ok(
            Json.toJson(
              Retenciontipo.create(user,
                Retenciontipo(
                       retencionTipo.name,
                       retencionTipo.code,
                       retencionTipo.active,
                       retencionTipo.generaSicore,
                       retencionTipo.codigoSicore,
                       retencionTipo.cueId,
                       retencionTipo.tipo,
                       retencionTipo.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in RetencionesTipo.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_RETENCIONTIPO), { user =>
      Retenciontipo.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

