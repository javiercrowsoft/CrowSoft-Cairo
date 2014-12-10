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


case class EscalaData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean
              )

object Escalas extends Controller with ProvidesUser {

  val escalaForm = Form(
    mapping(
      "id" -> optional(number),
      C.ESC_NAME -> nonEmptyText,
      C.ESC_CODE -> text,
      DBHelper.ACTIVE -> boolean
  )(EscalaData.apply)(EscalaData.unapply))

  implicit val escalaWrites = new Writes[Escala] {
    def writes(escala: Escala) = Json.obj(
      "id" -> Json.toJson(escala.id),
      C.ESC_ID -> Json.toJson(escala.id),
      C.ESC_NAME -> Json.toJson(escala.name),
      C.ESC_CODE -> Json.toJson(escala.code),
      DBHelper.ACTIVE -> Json.toJson(escala.active)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_ESCALA), { user =>
      Ok(Json.toJson(Escala.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in escalas.update")
    escalaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      escala => {
        Logger.debug(s"form: ${escala.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_ESCALA), { user =>
          Ok(
            Json.toJson(
              Escala.update(user,
                Escala(
                       id,
                       escala.name,
                       escala.code,
                       escala.active
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in escalas.create")
    escalaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      escala => {
        Logger.debug(s"form: ${escala.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_ESCALA), { user =>
          Ok(
            Json.toJson(
              Escala.create(user,
                Escala(
                       escala.name,
                       escala.code,
                       escala.active
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in escalas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_ESCALA), { user =>
      Escala.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
