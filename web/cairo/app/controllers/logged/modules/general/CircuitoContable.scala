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


case class CircuitocontableData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              descrip: String
              )

object Circuitocontables extends Controller with ProvidesUser {

  val circuitocontableForm = Form(
    mapping(
      "id" -> optional(number),
      C.CICO_NAME -> nonEmptyText,
      C.CICO_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.CICO_DESCRIP -> text
  )(CircuitocontableData.apply)(CircuitocontableData.unapply))

  implicit val circuitocontableWrites = new Writes[Circuitocontable] {
    def writes(circuitocontable: Circuitocontable) = Json.obj(
      "id" -> Json.toJson(circuitocontable.id),
      C.CICO_ID -> Json.toJson(circuitocontable.id),
      C.CICO_NAME -> Json.toJson(circuitocontable.name),
      C.CICO_CODE -> Json.toJson(circuitocontable.code),
      DBHelper.ACTIVE -> Json.toJson(circuitocontable.active),
      C.CICO_DESCRIP -> Json.toJson(circuitocontable.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CIRCUITOCONTABLE), { user =>
      Ok(Json.toJson(Circuitocontable.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in CircuitosContables.update")
    circuitocontableForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      circuitocontable => {
        Logger.debug(s"form: ${circuitocontable.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CIRCUITOCONTABLE), { user =>
          Ok(
            Json.toJson(
              Circuitocontable.update(user,
                Circuitocontable(
                       id,
                       circuitocontable.name,
                       circuitocontable.code,
                       circuitocontable.active,
                       circuitocontable.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in CircuitosContables.create")
    circuitocontableForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      circuitocontable => {
        Logger.debug(s"form: ${circuitocontable.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CIRCUITOCONTABLE), { user =>
          Ok(
            Json.toJson(
              Circuitocontable.create(user,
                Circuitocontable(
                       circuitocontable.name,
                       circuitocontable.code,
                       circuitocontable.active,
                       circuitocontable.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in CircuitosContables.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CIRCUITOCONTABLE), { user =>
      Circuitocontable.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
