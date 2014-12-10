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


case class ZonaData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              precio: Double,
              prId: Int,
              descrip: String
              )

object Zonas extends Controller with ProvidesUser {

  val zonaForm = Form(
    mapping(
      "id" -> optional(number),
      C.ZON_NAME -> nonEmptyText,
      C.ZON_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.ZON_PRECIO -> number,
      C.PR_ID -> number,
      C.ZON_DESCRIP -> text
  )(ZonaData.apply)(ZonaData.unapply))

  implicit val zonaWrites = new Writes[Zona] {
    def writes(zona: Zona) = Json.obj(
      "id" -> Json.toJson(zona.id),
      C.ZON_ID -> Json.toJson(zona.id),
      C.ZON_NAME -> Json.toJson(zona.name),
      C.ZON_CODE -> Json.toJson(zona.code),
      DBHelper.ACTIVE -> Json.toJson(zona.active),
      C.ZON_PRECIO -> Json.toJson(zona.precio),
      C.PR_ID -> Json.toJson(zona.prId),
      C.PR_NAME -> Json.toJson(zona.prName),
      C.ZON_DESCRIP -> Json.toJson(zona.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_ZONA), { user =>
      Ok(Json.toJson(Zona.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in zonas.update")
    zonaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      zona => {
        Logger.debug(s"form: ${zona.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_ZONA), { user =>
          Ok(
            Json.toJson(
              Zona.update(user,
                Zona(
                       id,
                       zona.name,
                       zona.code,
                       zona.active,
                       zona.precio,
                       zona.prId,
                       zona.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in zonas.create")
    zonaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      zona => {
        Logger.debug(s"form: ${zona.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_ZONA), { user =>
          Ok(
            Json.toJson(
              Zona.create(user,
                Zona(
                       zona.name,
                       zona.code,
                       zona.active,
                       zona.precio,
                       zona.prId,
                       zona.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in zonas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_ZONA), { user =>
      Zona.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
