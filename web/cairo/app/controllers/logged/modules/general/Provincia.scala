package controllers.logged.modules.general

import controllers._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import actions._
import play.api.Logger
import play.api.libs.json._
import models.cairo.modules.general._

case class ProvinciaData(id: Option[Int], name: String, code: String, active: Boolean, paId: Int)

object Provincias extends Controller with ProvidesUser {

  val provinciaForm = Form(
    mapping(
      "id" -> optional(number),
      "name" -> nonEmptyText,
      "code" -> text,
      "active" -> boolean,
      "paId" -> number
    )(ProvinciaData.apply)(ProvinciaData.unapply))

  implicit val provinciaWrites = new Writes[Provincia] {
    def writes(provincia: Provincia) = Json.obj(
      "id" -> Json.toJson(provincia.id),
      "name" -> Json.toJson(provincia.name),
      "code" -> Json.toJson(provincia.code),
      "active" -> Json.toJson(provincia.active),
      "paId" -> Json.toJson(provincia.paId),
      "paName" -> Json.toJson(provincia.paName)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
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
        LoggedIntoCompanyResponse.getAction(request, { user =>
          Ok(
            Json.toJson(
              Provincia.update(user, Provincia(id, provincia.name, provincia.code, provincia.active, provincia.paId))))
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
        LoggedIntoCompanyResponse.getAction(request, { user =>
          Ok(
            Json.toJson(
              Provincia.create(user, Provincia(provincia.name, provincia.code, provincia.active, provincia.paId))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in provincias.delete")
    LoggedIntoCompanyResponse.getAction(request, { user =>
      Provincia.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}