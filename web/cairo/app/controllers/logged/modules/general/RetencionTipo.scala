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

object Retenciontipos extends Controller with ProvidesUser {

  val retenciontipoForm = Form(
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

  implicit val retenciontipoWrites = new Writes[Retenciontipo] {
    def writes(retenciontipo: Retenciontipo) = Json.obj(
      "id" -> Json.toJson(retenciontipo.id),
      C.RETT_ID -> Json.toJson(retenciontipo.id),
      C.RETT_NAME -> Json.toJson(retenciontipo.name),
      C.RETT_CODE -> Json.toJson(retenciontipo.code),
      DBHelper.ACTIVE -> Json.toJson(retenciontipo.active),
      C.RETT_GENERA_SICORE -> Json.toJson(retenciontipo.generaSicore),
      C.RETT_CODIGO_SICORE -> Json.toJson(retenciontipo.codigoSicore),
      C.CUE_ID -> Json.toJson(retenciontipo.cueId),
      C.CUE_NAME -> Json.toJson(retenciontipo.cueName),
      C.RETT_TIPO ->       C.RETT_DESCRIP -> Json.toJson(retenciontipo.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_RETENCIONTIPO), { user =>
      Ok(Json.toJson(Retenciontipo.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in retenciontipos.update")
    retenciontipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      retenciontipo => {
        Logger.debug(s"form: ${retenciontipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_RETENCIONTIPO), { user =>
          Ok(
            Json.toJson(
              Retenciontipo.update(user,
                Retenciontipo(
                       id,
                       retenciontipo.name,
                       retenciontipo.code,
                       retenciontipo.active,
                       retenciontipo.generaSicore,
                       retenciontipo.codigoSicore,
                       retenciontipo.cueId,
                       retenciontipo.tipo,
                       retenciontipo.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in retenciontipos.create")
    retenciontipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      retenciontipo => {
        Logger.debug(s"form: ${retenciontipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_RETENCIONTIPO), { user =>
          Ok(
            Json.toJson(
              Retenciontipo.create(user,
                Retenciontipo(
                       retenciontipo.name,
                       retenciontipo.code,
                       retenciontipo.active,
                       retenciontipo.generaSicore,
                       retenciontipo.codigoSicore,
                       retenciontipo.cueId,
                       retenciontipo.tipo,
                       retenciontipo.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in retenciontipos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_RETENCIONTIPO), { user =>
      Retenciontipo.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

