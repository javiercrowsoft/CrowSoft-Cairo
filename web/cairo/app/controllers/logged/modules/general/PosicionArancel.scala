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


case class PosicionArancelData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              tiIdDerechos: Int,
              tiIdEstadistica: Int,
              descrip: String
              )

object PosicionAranceles extends Controller with ProvidesUser {

  val posicionArancelForm = Form(
    mapping(
      "id" -> optional(number),
      C.POAR_NAME -> nonEmptyText,
      C.POAR_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.TI_ID_DERECHOS -> number,
      C.TI_ID_ESTADISTICA -> number,
      C.POAR_DESCRIP -> text
  )(PosicionArancelData.apply)(PosicionArancelData.unapply))

  implicit val posicionArancelWrites = new Writes[PosicionArancel] {
    def writes(posicionArancel: PosicionArancel) = Json.obj(
      "id" -> Json.toJson(posicionArancel.id),
      C.POAR_ID -> Json.toJson(posicionArancel.id),
      C.POAR_NAME -> Json.toJson(posicionArancel.name),
      C.POAR_CODE -> Json.toJson(posicionArancel.code),
      DBHelper.ACTIVE -> Json.toJson(posicionArancel.active),
      C.TI_ID_DERECHOS -> Json.toJson(posicionArancel.tiIdDerechos),
      C.TI_DERECHOS -> Json.toJson(posicionArancel.tiDerechos),
      C.TI_ID_ESTADISTICA -> Json.toJson(posicionArancel.tiIdEstadistica),
      C.TI_ESTADISTICA -> Json.toJson(posicionArancel.tiEstadistica),
      C.POAR_DESCRIP -> Json.toJson(posicionArancel.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_POSICION_ARANCEL), { user =>
      Ok(Json.toJson(PosicionArancel.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in PosicionAranceles.update")
    posicionArancelForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      posicionArancel => {
        Logger.debug(s"form: ${posicionArancel.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_POSICION_ARANCEL), { user =>
          Ok(
            Json.toJson(
              PosicionArancel.update(user,
                PosicionArancel(
                       id,
                       posicionArancel.name,
                       posicionArancel.code,
                       posicionArancel.active,
                       posicionArancel.tiIdDerechos,
                       posicionArancel.tiIdEstadistica,
                       posicionArancel.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in PosicionAranceles.create")
    posicionArancelForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      posicionArancel => {
        Logger.debug(s"form: ${posicionArancel.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_POSICION_ARANCEL), { user =>
          Ok(
            Json.toJson(
              PosicionArancel.create(user,
                PosicionArancel(
                       posicionArancel.name,
                       posicionArancel.code,
                       posicionArancel.active,
                       posicionArancel.tiIdDerechos,
                       posicionArancel.tiIdEstadistica,
                       posicionArancel.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in PosicionAranceles.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_POSICION_ARANCEL), { user =>
      PosicionArancel.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
