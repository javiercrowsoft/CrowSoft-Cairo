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
import formatters.json.DateFormatter
import formatters.json.DateFormatter._

case class FechaControlAccesoData(
                                   id: Option[Int],
                                   name: String,
                                   code: String,
                                   active: Boolean,
                                   desde: String,
                                   hasta: String
                                 )

object FechaControlAccesos extends Controller with ProvidesUser {

  val fechaControlAccesoForm = Form(
    mapping(
      "id" -> optional(number),
      C.FCA_NAME -> nonEmptyText,
      C.FCA_CODE -> text,    
      DBHelper.ACTIVE -> boolean,
      C.FCA_FECHA_DESDE -> text,
      C.FCA_FECHA_HASTA -> text
    )(FechaControlAccesoData.apply)(FechaControlAccesoData.unapply))

  implicit val fechaControlAccesoWrites = new Writes[FechaControlAcceso] {
    def writes(fechaControlAcceso: FechaControlAcceso) = Json.obj(
      "id" -> Json.toJson(fechaControlAcceso.id),
      C.FCA_ID -> Json.toJson(fechaControlAcceso.id),
      C.FCA_NAME -> Json.toJson(fechaControlAcceso.name),
      C.FCA_CODE -> Json.toJson(fechaControlAcceso.code),
      DBHelper.ACTIVE -> Json.toJson(fechaControlAcceso.active),
      C.FCA_FECHA_DESDE -> Json.toJson(fechaControlAcceso.desde),
      C.FCA_FECHA_HASTA -> Json.toJson(fechaControlAcceso.hasta)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FECHA_CONTROL_ACCESO), { user =>
      Ok(Json.toJson(FechaControlAcceso.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in FechaControlAccesos.update")
    fechaControlAccesoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      fechaControlAcceso => {
        Logger.debug(s"form: ${fechaControlAcceso.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_FECHA_CONTROL_ACCESO), { user =>
          Ok(
            Json.toJson(
              FechaControlAcceso.update(user,
                FechaControlAcceso(
                  id,
                  fechaControlAcceso.name,
                  fechaControlAcceso.code,
                  fechaControlAcceso.active,
                  DateFormatter.parse(fechaControlAcceso.desde),
                  DateFormatter.parse(fechaControlAcceso.hasta)
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in FechaControlAccesos.create")
    fechaControlAccesoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      fechaControlAcceso => {
        Logger.debug(s"form: ${fechaControlAcceso.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_FECHA_CONTROL_ACCESO), { user =>
          Ok(
            Json.toJson(
              FechaControlAcceso.create(user,
                FechaControlAcceso(
                  fechaControlAcceso.name,
                  fechaControlAcceso.code,
                  fechaControlAcceso.active,
                  DateFormatter.parse(fechaControlAcceso.desde),
                  DateFormatter.parse(fechaControlAcceso.hasta)
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in FechaControlAccesos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_FECHA_CONTROL_ACCESO), { user =>
      FechaControlAcceso.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}