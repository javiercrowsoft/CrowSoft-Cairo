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


case class ProvinciaData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              paId: Int,
              descrip: String
              )

object Provincias extends Controller with ProvidesUser {

  val provinciaForm = Form(
    mapping(
      "id" -> optional(number),
      C.PRO_NAME -> nonEmptyText,
      C.PRO_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.PA_ID -> number,
      C.PRO_DESCRIP -> text
  )(ProvinciaData.apply)(ProvinciaData.unapply))

  implicit val provinciaWrites = new Writes[Provincia] {
    def writes(provincia: Provincia) = Json.obj(
      "id" -> Json.toJson(provincia.id),
      C.PRO_ID -> Json.toJson(provincia.id),
      C.PRO_NAME -> Json.toJson(provincia.name),
      C.PRO_CODE -> Json.toJson(provincia.code),
      DBHelper.ACTIVE -> Json.toJson(provincia.active),
      C.PA_ID -> Json.toJson(provincia.paId),
      C.PA_NAME -> Json.toJson(provincia.paName),
      C.PRO_DESCRIP -> Json.toJson(provincia.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PROVINCIA), { user =>
      Ok(Json.toJson(Provincia.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in provincias.update")
    provinciaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      provincia => {
        Logger.debug(s"form: ${provincia.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PROVINCIA), { user =>
          Ok(
            Json.toJson(
              Provincia.update(user,
                Provincia(
                       id,
                       provincia.name,
                       provincia.code,
                       provincia.active,
                       provincia.paId,
                       provincia.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in provincias.create")
    provinciaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      provincia => {
        Logger.debug(s"form: ${provincia.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PROVINCIA), { user =>
          Ok(
            Json.toJson(
              Provincia.create(user,
                Provincia(
                       provincia.name,
                       provincia.code,
                       provincia.active,
                       provincia.paId,
                       provincia.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in provincias.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PROVINCIA), { user =>
      Provincia.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}