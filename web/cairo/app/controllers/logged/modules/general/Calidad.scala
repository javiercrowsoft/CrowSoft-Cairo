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


case class CalidadData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              descrip: String
              )

object Calidads extends Controller with ProvidesUser {

  val calidadForm = Form(
    mapping(
      "id" -> optional(number),
      C.CALID_NAME -> nonEmptyText,
      C.CALID_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.CALID_DESCRIP -> text
  )(CalidadData.apply)(CalidadData.unapply))

  implicit val calidadWrites = new Writes[Calidad] {
    def writes(calidad: Calidad) = Json.obj(
      "id" -> Json.toJson(calidad.id),
      C.CALID_ID -> Json.toJson(calidad.id),
      C.CALID_NAME -> Json.toJson(calidad.name),
      C.CALID_CODE -> Json.toJson(calidad.code),
      DBHelper.ACTIVE -> Json.toJson(calidad.active),
      C.CALID_DESCRIP -> Json.toJson(calidad.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CALIDAD), { user =>
      Ok(Json.toJson(Calidad.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Calidades.update")
    calidadForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      calidad => {
        Logger.debug(s"form: ${calidad.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CALIDAD), { user =>
          Ok(
            Json.toJson(
              Calidad.update(user,
                Calidad(
                       id,
                       calidad.name,
                       calidad.code,
                       calidad.active,
                       calidad.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Calidades.create")
    calidadForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      calidad => {
        Logger.debug(s"form: ${calidad.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CALIDAD), { user =>
          Ok(
            Json.toJson(
              Calidad.create(user,
                Calidad(
                       calidad.name,
                       calidad.code,
                       calidad.active,
                       calidad.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Calidades.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CALIDAD), { user =>
      Calidad.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
