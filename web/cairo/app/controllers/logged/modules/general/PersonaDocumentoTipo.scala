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


case class PersonadocumentotipoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              descrip: String
              )

object Personadocumentotipos extends Controller with ProvidesUser {

  val personadocumentotipoForm = Form(
    mapping(
      "id" -> optional(number),
      C.PRSDT_NAME -> nonEmptyText,
      C.PRSDT_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.PRSDT_DESCRIP -> text
  )(PersonadocumentotipoData.apply)(PersonadocumentotipoData.unapply))

  implicit val personadocumentotipoWrites = new Writes[Personadocumentotipo] {
    def writes(personadocumentotipo: Personadocumentotipo) = Json.obj(
      "id" -> Json.toJson(personadocumentotipo.id),
      C.PRSDT_ID -> Json.toJson(personadocumentotipo.id),
      C.PRSDT_NAME -> Json.toJson(personadocumentotipo.name),
      C.PRSDT_CODE -> Json.toJson(personadocumentotipo.code),
      DBHelper.ACTIVE -> Json.toJson(personadocumentotipo.active),
      C.PRSDT_DESCRIP -> Json.toJson(personadocumentotipo.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PERSONADOCUMENTOTIPO), { user =>
      Ok(Json.toJson(Personadocumentotipo.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in personadocumentotipos.update")
    personadocumentotipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      personadocumentotipo => {
        Logger.debug(s"form: ${personadocumentotipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PERSONADOCUMENTOTIPO), { user =>
          Ok(
            Json.toJson(
              Personadocumentotipo.update(user,
                Personadocumentotipo(
                       id,
                       personadocumentotipo.name,
                       personadocumentotipo.code,
                       personadocumentotipo.active,
                       personadocumentotipo.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in personadocumentotipos.create")
    personadocumentotipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      personadocumentotipo => {
        Logger.debug(s"form: ${personadocumentotipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PERSONADOCUMENTOTIPO), { user =>
          Ok(
            Json.toJson(
              Personadocumentotipo.create(user,
                Personadocumentotipo(
                       personadocumentotipo.name,
                       personadocumentotipo.code,
                       personadocumentotipo.active,
                       personadocumentotipo.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in personadocumentotipos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PERSONADOCUMENTOTIPO), { user =>
      Personadocumentotipo.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
