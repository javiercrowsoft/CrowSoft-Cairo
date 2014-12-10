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


case class ClientecontactotipoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              descrip: String
              )

object Clientecontactotipos extends Controller with ProvidesUser {

  val clientecontactotipoForm = Form(
    mapping(
      "id" -> optional(number),
      C.CLICT_NAME -> nonEmptyText,
      C.CLICT_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.CLICT_DESCRIP -> text
  )(ClientecontactotipoData.apply)(ClientecontactotipoData.unapply))

  implicit val clientecontactotipoWrites = new Writes[Clientecontactotipo] {
    def writes(clientecontactotipo: Clientecontactotipo) = Json.obj(
      "id" -> Json.toJson(clientecontactotipo.id),
      C.CLICT_ID -> Json.toJson(clientecontactotipo.id),
      C.CLICT_NAME -> Json.toJson(clientecontactotipo.name),
      C.CLICT_CODE -> Json.toJson(clientecontactotipo.code),
      DBHelper.ACTIVE -> Json.toJson(clientecontactotipo.active),
      C.CLICT_DESCRIP -> Json.toJson(clientecontactotipo.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CLIENTECONTACTOTIPO), { user =>
      Ok(Json.toJson(Clientecontactotipo.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in clientecontactotipos.update")
    clientecontactotipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      clientecontactotipo => {
        Logger.debug(s"form: ${clientecontactotipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CLIENTECONTACTOTIPO), { user =>
          Ok(
            Json.toJson(
              Clientecontactotipo.update(user,
                Clientecontactotipo(
                       id,
                       clientecontactotipo.name,
                       clientecontactotipo.code,
                       clientecontactotipo.active,
                       clientecontactotipo.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in clientecontactotipos.create")
    clientecontactotipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      clientecontactotipo => {
        Logger.debug(s"form: ${clientecontactotipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CLIENTECONTACTOTIPO), { user =>
          Ok(
            Json.toJson(
              Clientecontactotipo.create(user,
                Clientecontactotipo(
                       clientecontactotipo.name,
                       clientecontactotipo.code,
                       clientecontactotipo.active,
                       clientecontactotipo.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in clientecontactotipos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CLIENTECONTACTOTIPO), { user =>
      Clientecontactotipo.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
