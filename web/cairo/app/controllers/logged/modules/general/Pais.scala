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


case class PaisData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              descrip: String
              )

object Paises extends Controller with ProvidesUser {

  val paisForm = Form(
    mapping(
      "id" -> optional(number),
      C.PA_NAME -> nonEmptyText,
      C.PA_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.PA_DESCRIP -> text
  )(PaisData.apply)(PaisData.unapply))

  implicit val paisWrites = new Writes[Pais] {
    def writes(pais: Pais) = Json.obj(
      "id" -> Json.toJson(pais.id),
      C.PA_ID -> Json.toJson(pais.id),
      C.PA_NAME -> Json.toJson(pais.name),
      C.PA_CODE -> Json.toJson(pais.code),
      DBHelper.ACTIVE -> Json.toJson(pais.active),
      C.PA_DESCRIP -> Json.toJson(pais.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PAIS), { user =>
      Ok(Json.toJson(Pais.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Paises.update")
    paisForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      pais => {
        Logger.debug(s"form: ${pais.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PAIS), { user =>
          Ok(
            Json.toJson(
              Pais.update(user,
                Pais(
                       id,
                       pais.name,
                       pais.code,
                       pais.active,
                       pais.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Paises.create")
    paisForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      pais => {
        Logger.debug(s"form: ${pais.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PAIS), { user =>
          Ok(
            Json.toJson(
              Pais.create(user,
                Pais(
                       pais.name,
                       pais.code,
                       pais.active,
                       pais.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Paises.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PAIS), { user =>
      Pais.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
