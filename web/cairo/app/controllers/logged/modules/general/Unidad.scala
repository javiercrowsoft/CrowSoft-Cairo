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


case class UnidadData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean
              )

object Unidads extends Controller with ProvidesUser {

  val unidadForm = Form(
    mapping(
      "id" -> optional(number),
      C.UN_NAME -> nonEmptyText,
      C.UN_CODE -> text,
      DBHelper.ACTIVE -> boolean
  )(UnidadData.apply)(UnidadData.unapply))

  implicit val unidadWrites = new Writes[Unidad] {
    def writes(unidad: Unidad) = Json.obj(
      "id" -> Json.toJson(unidad.id),
      C.UN_ID -> Json.toJson(unidad.id),
      C.UN_NAME -> Json.toJson(unidad.name),
      C.UN_CODE -> Json.toJson(unidad.code),
      DBHelper.ACTIVE -> Json.toJson(unidad.active)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_UNIDAD), { user =>
      Ok(Json.toJson(Unidad.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in unidads.update")
    unidadForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      unidad => {
        Logger.debug(s"form: ${unidad.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_UNIDAD), { user =>
          Ok(
            Json.toJson(
              Unidad.update(user,
                Unidad(
                       id,
                       unidad.name,
                       unidad.code,
                       unidad.active
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in unidads.create")
    unidadForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      unidad => {
        Logger.debug(s"form: ${unidad.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_UNIDAD), { user =>
          Ok(
            Json.toJson(
              Unidad.create(user,
                Unidad(
                       unidad.name,
                       unidad.code,
                       unidad.active
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in unidads.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_UNIDAD), { user =>
      Unidad.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
