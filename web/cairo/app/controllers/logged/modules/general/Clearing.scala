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


case class ClearingData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              dias: Int,
              descrip: String
              )

object Clearings extends Controller with ProvidesUser {

  val clearingForm = Form(
    mapping(
      "id" -> optional(number),
      C.CLE_NAME -> nonEmptyText,
      C.CLE_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.CLE_DIAS -> number,
      C.CLE_DESCRIP -> text
  )(ClearingData.apply)(ClearingData.unapply))

  implicit val clearingWrites = new Writes[Clearing] {
    def writes(clearing: Clearing) = Json.obj(
      "id" -> Json.toJson(clearing.id),
      C.CLE_ID -> Json.toJson(clearing.id),
      C.CLE_NAME -> Json.toJson(clearing.name),
      C.CLE_CODE -> Json.toJson(clearing.code),
      DBHelper.ACTIVE -> Json.toJson(clearing.active),
      C.CLE_DIAS -> Json.toJson(clearing.dias),
      C.CLE_DESCRIP -> Json.toJson(clearing.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CLEARING), { user =>
      Ok(Json.toJson(Clearing.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Clearings.update")
    clearingForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      clearing => {
        Logger.debug(s"form: ${clearing.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CLEARING), { user =>
          Ok(
            Json.toJson(
              Clearing.update(user,
                Clearing(
                       id,
                       clearing.name,
                       clearing.code,
                       clearing.active,
                       clearing.dias,
                       clearing.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Clearings.create")
    clearingForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      clearing => {
        Logger.debug(s"form: ${clearing.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CLEARING), { user =>
          Ok(
            Json.toJson(
              Clearing.create(user,
                Clearing(
                       clearing.name,
                       clearing.code,
                       clearing.active,
                       clearing.dias,
                       clearing.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Clearings.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CLEARING), { user =>
      Clearing.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
