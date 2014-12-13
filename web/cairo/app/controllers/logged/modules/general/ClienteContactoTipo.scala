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


case class ClienteContactoTipoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              descrip: String
              )

object ClienteContactoTipos extends Controller with ProvidesUser {

  val clienteContactoTipoForm = Form(
    mapping(
      "id" -> optional(number),
      C.CLICT_NAME -> nonEmptyText,
      C.CLICT_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.CLICT_DESCRIP -> text
  )(ClienteContactoTipoData.apply)(ClienteContactoTipoData.unapply))

  implicit val clienteContactoTipoWrites = new Writes[ClienteContactoTipo] {
    def writes(clienteContactoTipo: ClienteContactoTipo) = Json.obj(
      "id" -> Json.toJson(clienteContactoTipo.id),
      C.CLICT_ID -> Json.toJson(clienteContactoTipo.id),
      C.CLICT_NAME -> Json.toJson(clienteContactoTipo.name),
      C.CLICT_CODE -> Json.toJson(clienteContactoTipo.code),
      DBHelper.ACTIVE -> Json.toJson(clienteContactoTipo.active),
      C.CLICT_DESCRIP -> Json.toJson(clienteContactoTipo.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CLIENTE_CONTACTO_TIPO), { user =>
      Ok(Json.toJson(ClienteContactoTipo.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in ClienteContactoTipos.update")
    clienteContactoTipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      clienteContactoTipo => {
        Logger.debug(s"form: ${clienteContactoTipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CLIENTE_CONTACTO_TIPO), { user =>
          Ok(
            Json.toJson(
              ClienteContactoTipo.update(user,
                ClienteContactoTipo(
                       id,
                       clienteContactoTipo.name,
                       clienteContactoTipo.code,
                       clienteContactoTipo.active,
                       clienteContactoTipo.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in ClienteContactoTipos.create")
    clienteContactoTipoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      clienteContactoTipo => {
        Logger.debug(s"form: ${clienteContactoTipo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CLIENTE_CONTACTO_TIPO), { user =>
          Ok(
            Json.toJson(
              ClienteContactoTipo.create(user,
                ClienteContactoTipo(
                       clienteContactoTipo.name,
                       clienteContactoTipo.code,
                       clienteContactoTipo.active,
                       clienteContactoTipo.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in ClienteContactoTipos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CLIENTE_CONTACTO_TIPO), { user =>
      ClienteContactoTipo.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
