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


case class ReglaLiquidacionData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              descrip: String
              )

object ReglasLiquidacion extends Controller with ProvidesUser {

  val reglaLiquidacionForm = Form(
    mapping(
      "id" -> optional(number),
      C.REL_NAME -> nonEmptyText,
      C.REL_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.REL_DESCRIP -> text
  )(ReglaLiquidacionData.apply)(ReglaLiquidacionData.unapply))

  implicit val reglaLiquidacionWrites = new Writes[ReglaLiquidacion] {
    def writes(reglaLiquidacion: ReglaLiquidacion) = Json.obj(
      "id" -> Json.toJson(reglaLiquidacion.id),
      C.REL_ID -> Json.toJson(reglaLiquidacion.id),
      C.REL_NAME -> Json.toJson(reglaLiquidacion.name),
      C.REL_CODE -> Json.toJson(reglaLiquidacion.code),
      DBHelper.ACTIVE -> Json.toJson(reglaLiquidacion.active),
      C.REL_DESCRIP -> Json.toJson(reglaLiquidacion.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_REGLALIQUIDACION), { user =>
      Ok(Json.toJson(ReglaLiquidacion.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in reglaLiquidacions.update")
    reglaLiquidacionForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      reglaLiquidacion => {
        Logger.debug(s"form: ${reglaLiquidacion.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_REGLALIQUIDACION), { user =>
          Ok(
            Json.toJson(
              ReglaLiquidacion.update(user,
                ReglaLiquidacion(
                       id,
                       reglaLiquidacion.name,
                       reglaLiquidacion.code,
                       reglaLiquidacion.active,
                       reglaLiquidacion.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in reglaLiquidacions.create")
    reglaLiquidacionForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      reglaLiquidacion => {
        Logger.debug(s"form: ${reglaLiquidacion.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_REGLALIQUIDACION), { user =>
          Ok(
            Json.toJson(
              ReglaLiquidacion.create(user,
                ReglaLiquidacion(
                       reglaLiquidacion.name,
                       reglaLiquidacion.code,
                       reglaLiquidacion.active,
                       reglaLiquidacion.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in reglaLiquidacions.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_REGLALIQUIDACION), { user =>
      ReglaLiquidacion.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
