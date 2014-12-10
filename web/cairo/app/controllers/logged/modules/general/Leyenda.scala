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


case class LeyendaData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              idmId: Int,
              descrip: String,
              leytexto: String
              )

object Leyendas extends Controller with ProvidesUser {

  val leyendaForm = Form(
    mapping(
      "id" -> optional(number),
      C.LEY_NAME -> nonEmptyText,
      C.LEY_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.IDM_ID -> number,
      C.LEY_DESCRIP -> text,
      C.LEYTEXTO -> text
  )(LeyendaData.apply)(LeyendaData.unapply))

  implicit val leyendaWrites = new Writes[Leyenda] {
    def writes(leyenda: Leyenda) = Json.obj(
      "id" -> Json.toJson(leyenda.id),
      C.LEY_ID -> Json.toJson(leyenda.id),
      C.LEY_NAME -> Json.toJson(leyenda.name),
      C.LEY_CODE -> Json.toJson(leyenda.code),
      DBHelper.ACTIVE -> Json.toJson(leyenda.active),
      C.IDM_ID -> Json.toJson(leyenda.idmId),
      C.IDM_NAME -> Json.toJson(leyenda.idmName),
      C.LEY_DESCRIP -> Json.toJson(leyenda.descrip),
      C.LEYTEXTO -> Json.toJson(leyenda.leytexto)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_LEYENDA), { user =>
      Ok(Json.toJson(Leyenda.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in leyendas.update")
    leyendaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      leyenda => {
        Logger.debug(s"form: ${leyenda.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_LEYENDA), { user =>
          Ok(
            Json.toJson(
              Leyenda.update(user,
                Leyenda(
                       id,
                       leyenda.name,
                       leyenda.code,
                       leyenda.active,
                       leyenda.idmId,
                       leyenda.descrip,
                       leyenda.leytexto
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in leyendas.create")
    leyendaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      leyenda => {
        Logger.debug(s"form: ${leyenda.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_LEYENDA), { user =>
          Ok(
            Json.toJson(
              Leyenda.create(user,
                Leyenda(
                       leyenda.name,
                       leyenda.code,
                       leyenda.active,
                       leyenda.idmId,
                       leyenda.descrip,
                       leyenda.leytexto
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in leyendas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_LEYENDA), { user =>
      Leyenda.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
