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


case class VentamodoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              ctaCte:               pv: Boolean,
              os: Boolean,
              cobz: Boolean,
              cmvxi: Boolean,
              cueId: Int,
              descrip: String
              )

object Ventamodos extends Controller with ProvidesUser {

  val ventamodoForm = Form(
    mapping(
      "id" -> optional(number),
      C.VM_NAME -> nonEmptyText,
      C.VM_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.VM_CTA_CTE ->       C.VM_PV -> boolean,
      C.VM_OS -> boolean,
      C.VM_COBZ -> boolean,
      C.VM_CMVXI -> boolean,
      C.CUE_ID -> number,
      C.VM_DESCRIP -> text
  )(VentamodoData.apply)(VentamodoData.unapply))

  implicit val ventamodoWrites = new Writes[Ventamodo] {
    def writes(ventamodo: Ventamodo) = Json.obj(
      "id" -> Json.toJson(ventamodo.id),
      C.VM_ID -> Json.toJson(ventamodo.id),
      C.VM_NAME -> Json.toJson(ventamodo.name),
      C.VM_CODE -> Json.toJson(ventamodo.code),
      DBHelper.ACTIVE -> Json.toJson(ventamodo.active),
      C.VM_CTA_CTE ->       C.VM_PV -> Json.toJson(ventamodo.pv),
      C.VM_OS -> Json.toJson(ventamodo.os),
      C.VM_COBZ -> Json.toJson(ventamodo.cobz),
      C.VM_CMVXI -> Json.toJson(ventamodo.cmvxi),
      C.CUE_ID -> Json.toJson(ventamodo.cueId),
      C.CUE_NAME -> Json.toJson(ventamodo.cueName),
      C.VM_DESCRIP -> Json.toJson(ventamodo.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_VENTAMODO), { user =>
      Ok(Json.toJson(Ventamodo.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in ventamodos.update")
    ventamodoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      ventamodo => {
        Logger.debug(s"form: ${ventamodo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_VENTAMODO), { user =>
          Ok(
            Json.toJson(
              Ventamodo.update(user,
                Ventamodo(
                       id,
                       ventamodo.name,
                       ventamodo.code,
                       ventamodo.active,
                       ventamodo.ctaCte,
                       ventamodo.pv,
                       ventamodo.os,
                       ventamodo.cobz,
                       ventamodo.cmvxi,
                       ventamodo.cueId,
                       ventamodo.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in ventamodos.create")
    ventamodoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      ventamodo => {
        Logger.debug(s"form: ${ventamodo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_VENTAMODO), { user =>
          Ok(
            Json.toJson(
              Ventamodo.create(user,
                Ventamodo(
                       ventamodo.name,
                       ventamodo.code,
                       ventamodo.active,
                       ventamodo.ctaCte,
                       ventamodo.pv,
                       ventamodo.os,
                       ventamodo.cobz,
                       ventamodo.cmvxi,
                       ventamodo.cueId,
                       ventamodo.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in ventamodos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_VENTAMODO), { user =>
      Ventamodo.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
