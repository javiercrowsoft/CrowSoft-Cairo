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


case class CiudadData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              proId: Int,
              descrip: String
              )

object Ciudads extends Controller with ProvidesUser {

  val ciudadForm = Form(
    mapping(
      "id" -> optional(number),
      C.CIU_NAME -> nonEmptyText,
      C.CIU_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.PRO_ID -> number,
      C.CIU_DESCRIP -> text
  )(CiudadData.apply)(CiudadData.unapply))

  implicit val ciudadWrites = new Writes[Ciudad] {
    def writes(ciudad: Ciudad) = Json.obj(
      "id" -> Json.toJson(ciudad.id),
      C.CIU_ID -> Json.toJson(ciudad.id),
      C.CIU_NAME -> Json.toJson(ciudad.name),
      C.CIU_CODE -> Json.toJson(ciudad.code),
      DBHelper.ACTIVE -> Json.toJson(ciudad.active),
      C.PRO_ID -> Json.toJson(ciudad.proId),
      C.PRO_NAME -> Json.toJson(ciudad.proName),
      C.CIU_DESCRIP -> Json.toJson(ciudad.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CIUDAD), { user =>
      Ok(Json.toJson(Ciudad.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Ciudades.update")
    ciudadForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      ciudad => {
        Logger.debug(s"form: ${ciudad.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CIUDAD), { user =>
          Ok(
            Json.toJson(
              Ciudad.update(user,
                Ciudad(
                       id,
                       ciudad.name,
                       ciudad.code,
                       ciudad.active,
                       ciudad.proId,
                       ciudad.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Ciudades.create")
    ciudadForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      ciudad => {
        Logger.debug(s"form: ${ciudad.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CIUDAD), { user =>
          Ok(
            Json.toJson(
              Ciudad.create(user,
                Ciudad(
                       ciudad.name,
                       ciudad.code,
                       ciudad.active,
                       ciudad.proId,
                       ciudad.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Ciudades.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CIUDAD), { user =>
      Ciudad.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
