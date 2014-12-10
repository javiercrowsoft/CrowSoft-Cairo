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


case class ReglaliquidacionData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              descrip: String
              )

object Reglaliquidacions extends Controller with ProvidesUser {

  val reglaliquidacionForm = Form(
    mapping(
      "id" -> optional(number),
      C.REL_NAME -> nonEmptyText,
      C.REL_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.REL_DESCRIP -> text
  )(ReglaliquidacionData.apply)(ReglaliquidacionData.unapply))

  implicit val reglaliquidacionWrites = new Writes[Reglaliquidacion] {
    def writes(reglaliquidacion: Reglaliquidacion) = Json.obj(
      "id" -> Json.toJson(reglaliquidacion.id),
      C.REL_ID -> Json.toJson(reglaliquidacion.id),
      C.REL_NAME -> Json.toJson(reglaliquidacion.name),
      C.REL_CODE -> Json.toJson(reglaliquidacion.code),
      DBHelper.ACTIVE -> Json.toJson(reglaliquidacion.active),
      C.REL_DESCRIP -> Json.toJson(reglaliquidacion.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_REGLALIQUIDACION), { user =>
      Ok(Json.toJson(Reglaliquidacion.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in reglaliquidacions.update")
    reglaliquidacionForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      reglaliquidacion => {
        Logger.debug(s"form: ${reglaliquidacion.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_REGLALIQUIDACION), { user =>
          Ok(
            Json.toJson(
              Reglaliquidacion.update(user,
                Reglaliquidacion(
                       id,
                       reglaliquidacion.name,
                       reglaliquidacion.code,
                       reglaliquidacion.active,
                       reglaliquidacion.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in reglaliquidacions.create")
    reglaliquidacionForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      reglaliquidacion => {
        Logger.debug(s"form: ${reglaliquidacion.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_REGLALIQUIDACION), { user =>
          Ok(
            Json.toJson(
              Reglaliquidacion.create(user,
                Reglaliquidacion(
                       reglaliquidacion.name,
                       reglaliquidacion.code,
                       reglaliquidacion.active,
                       reglaliquidacion.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in reglaliquidacions.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_REGLALIQUIDACION), { user =>
      Reglaliquidacion.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
