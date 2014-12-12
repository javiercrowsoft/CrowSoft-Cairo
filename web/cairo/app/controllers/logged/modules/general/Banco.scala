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


case class BancoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              mail: String,
              contacto: String,
              telefono: String,
              direccion: String,
              web: String
              )

object Bancos extends Controller with ProvidesUser {

  val bancoForm = Form(
    mapping(
      "id" -> optional(number),
      C.BCO_NAME -> nonEmptyText,
      C.BCO_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.BCO_MAIL -> text,
      C.BCO_CONTACTO -> text,
      C.BCO_TELEFONO -> text,
      C.BCO_DIRECCION -> text,
      C.BCO_WEB -> text
  )(BancoData.apply)(BancoData.unapply))

  implicit val bancoWrites = new Writes[Banco] {
    def writes(banco: Banco) = Json.obj(
      "id" -> Json.toJson(banco.id),
      C.BCO_ID -> Json.toJson(banco.id),
      C.BCO_NAME -> Json.toJson(banco.name),
      C.BCO_CODE -> Json.toJson(banco.code),
      DBHelper.ACTIVE -> Json.toJson(banco.active),
      C.BCO_MAIL -> Json.toJson(banco.mail),
      C.BCO_CONTACTO -> Json.toJson(banco.contacto),
      C.BCO_TELEFONO -> Json.toJson(banco.telefono),
      C.BCO_DIRECCION -> Json.toJson(banco.direccion),
      C.BCO_WEB -> Json.toJson(banco.web)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_BANCO), { user =>
      Ok(Json.toJson(Banco.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Bancos.update")
    bancoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      banco => {
        Logger.debug(s"form: ${banco.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_BANCO), { user =>
          Ok(
            Json.toJson(
              Banco.update(user,
                Banco(
                       id,
                       banco.name,
                       banco.code,
                       banco.active,
                       banco.mail,
                       banco.contacto,
                       banco.telefono,
                       banco.direccion,
                       banco.web
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Bancos.create")
    bancoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      banco => {
        Logger.debug(s"form: ${banco.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_BANCO), { user =>
          Ok(
            Json.toJson(
              Banco.create(user,
                Banco(
                       banco.name,
                       banco.code,
                       banco.active,
                       banco.mail,
                       banco.contacto,
                       banco.telefono,
                       banco.direccion,
                       banco.web
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Bancos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_BANCO), { user =>
      Banco.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}