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


case class SucursalData(
              id: Option[Int],
              name: String,
              code: String,
              numero: Long,
              active: Boolean,
              descrip: String
              )

object Sucursales extends Controller with ProvidesUser {

  val sucursalForm = Form(
    mapping(
      "id" -> optional(number),
      C.SUC_NAME -> nonEmptyText,
      C.SUC_CODE -> text,
      C.SUC_NUMERO -> number,
      DBHelper.ACTIVE -> boolean,
      C.SUC_DESCRIP -> text
  )(SucursalData.apply)(SucursalData.unapply))

  implicit val sucursalWrites = new Writes[Sucursal] {
    def writes(sucursal: Sucursal) = Json.obj(
      "id" -> Json.toJson(sucursal.id),
      C.SUC_ID -> Json.toJson(sucursal.id),
      C.SUC_NAME -> Json.toJson(sucursal.name),
      C.SUC_CODE -> Json.toJson(sucursal.code),
      C.SUC_NUMERO -> Json.toJson(sucursal.numero),
      DBHelper.ACTIVE -> Json.toJson(sucursal.active),
      C.SUC_DESCRIP -> Json.toJson(sucursal.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_SUCURSAL), { user =>
      Ok(Json.toJson(Sucursal.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Sucursales.update")
    sucursalForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      sucursal => {
        Logger.debug(s"form: ${sucursal.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_SUCURSAL), { user =>
          Ok(
            Json.toJson(
              Sucursal.update(user,
                Sucursal(
                       id,
                       sucursal.name,
                       sucursal.code,
                       sucursal.numero,
                       sucursal.active,
                       sucursal.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Sucursales.create")
    sucursalForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      sucursal => {
        Logger.debug(s"form: ${sucursal.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_SUCURSAL), { user =>
          Ok(
            Json.toJson(
              Sucursal.create(user,
                Sucursal(
                       sucursal.name,
                       sucursal.code,
                       sucursal.numero,
                       sucursal.active,
                       sucursal.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Sucursales.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_SUCURSAL), { user =>
      Sucursal.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
