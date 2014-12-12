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


case class CircuitoContableData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              descrip: String
              )

object CircuitosContables extends Controller with ProvidesUser {

  val circuitoContableForm = Form(
    mapping(
      "id" -> optional(number),
      C.CICO_NAME -> nonEmptyText,
      C.CICO_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.CICO_DESCRIP -> text
  )(CircuitoContableData.apply)(CircuitoContableData.unapply))

  implicit val circuitoContableWrites = new Writes[CircuitoContable] {
    def writes(circuitoContable: CircuitoContable) = Json.obj(
      "id" -> Json.toJson(circuitoContable.id),
      C.CICO_ID -> Json.toJson(circuitoContable.id),
      C.CICO_NAME -> Json.toJson(circuitoContable.name),
      C.CICO_CODE -> Json.toJson(circuitoContable.code),
      DBHelper.ACTIVE -> Json.toJson(circuitoContable.active),
      C.CICO_DESCRIP -> Json.toJson(circuitoContable.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CIRCUITO_CONTABLE), { user =>
      Ok(Json.toJson(CircuitoContable.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in CircuitosContables.update")
    circuitoContableForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      circuitoContable => {
        Logger.debug(s"form: ${circuitoContable.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CIRCUITO_CONTABLE), { user =>
          Ok(
            Json.toJson(
              CircuitoContable.update(user,
                CircuitoContable(
                       id,
                       circuitoContable.name,
                       circuitoContable.code,
                       circuitoContable.active,
                       circuitoContable.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in CircuitosContables.create")
    circuitoContableForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      circuitoContable => {
        Logger.debug(s"form: ${circuitoContable.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CIRCUITO_CONTABLE), { user =>
          Ok(
            Json.toJson(
              CircuitoContable.create(user,
                CircuitoContable(
                       circuitoContable.name,
                       circuitoContable.code,
                       circuitoContable.active,
                       circuitoContable.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in CircuitosContables.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CIRCUITO_CONTABLE), { user =>
      CircuitoContable.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
