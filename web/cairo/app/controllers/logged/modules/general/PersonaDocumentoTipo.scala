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


case class PersonaDocumentoTipoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              descrip: String
              )

object PersonaDocumentoTipos extends Controller with ProvidesUser {

  val personaDocumentoTipoForm = Form(
    mapping(
      "id" -> optional(number),
      C.PRSDT_NAME -> nonEmptyText,
      C.PRSDT_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.PRSDT_DESCRIP -> text
  )(PersonaDocumentoTipoData.apply)(PersonaDocumentoTipoData.unapply))

  implicit val personaDocumentoTipoWrites = new Writes[PersonaDocumentoTipo] {
    def writes(personaDocumentoTipo: PersonaDocumentoTipo) = Json.obj(
      "id" -> Json.toJson(personaDocumentoTipo.id),
      C.PRSDT_ID -> Json.toJson(personaDocumentoTipo.id),
      C.PRSDT_NAME -> Json.toJson(personaDocumentoTipo.name),
      C.PRSDT_CODE -> Json.toJson(personaDocumentoTipo.code),
      DBHelper.ACTIVE -> Json.toJson(personaDocumentoTipo.active),
      C.PRSDT_DESCRIP -> Json.toJson(personaDocumentoTipo.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PERSONADOCUMENTOTIPO), { user =>
      Ok(Json.toJson(PersonaDocumentoTipo.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in PersonaDocumentoTipos.update")
    personaDocumentoTipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      personaDocumentoTipo => {
        Logger.debug(s"form: ${personaDocumentoTipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PERSONADOCUMENTOTIPO), { user =>
          Ok(
            Json.toJson(
              PersonaDocumentoTipo.update(user,
                PersonaDocumentoTipo(
                       id,
                       personaDocumentoTipo.name,
                       personaDocumentoTipo.code,
                       personaDocumentoTipo.active,
                       personaDocumentoTipo.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in PersonaDocumentoTipos.create")
    personaDocumentoTipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      personaDocumentoTipo => {
        Logger.debug(s"form: ${personaDocumentoTipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PERSONADOCUMENTOTIPO), { user =>
          Ok(
            Json.toJson(
              PersonaDocumentoTipo.create(user,
                PersonaDocumentoTipo(
                       personaDocumentoTipo.name,
                       personaDocumentoTipo.code,
                       personaDocumentoTipo.active,
                       personaDocumentoTipo.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in PersonaDocumentoTipos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PERSONADOCUMENTOTIPO), { user =>
      PersonaDocumentoTipo.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
