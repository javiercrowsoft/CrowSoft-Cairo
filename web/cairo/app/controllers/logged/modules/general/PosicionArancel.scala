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


case class PosicionarancelData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              tiIdDerechos: Int,
              tiIdEstadistica: Int,
              descrip: String
              )

object Posicionarancels extends Controller with ProvidesUser {

  val posicionarancelForm = Form(
    mapping(
      "id" -> optional(number),
      C.POAR_NAME -> nonEmptyText,
      C.POAR_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.TI_ID_DERECHOS -> number,
      C.TI_ID_ESTADISTICA -> number,
      C.POAR_DESCRIP -> text
  )(PosicionarancelData.apply)(PosicionarancelData.unapply))

  implicit val posicionarancelWrites = new Writes[Posicionarancel] {
    def writes(posicionarancel: Posicionarancel) = Json.obj(
      "id" -> Json.toJson(posicionarancel.id),
      C.POAR_ID -> Json.toJson(posicionarancel.id),
      C.POAR_NAME -> Json.toJson(posicionarancel.name),
      C.POAR_CODE -> Json.toJson(posicionarancel.code),
      DBHelper.ACTIVE -> Json.toJson(posicionarancel.active),
      C.TI_ID_DERECHOS -> Json.toJson(posicionarancel.tiIdDerechos),
      C.TI_NAME -> Json.toJson(posicionarancel.tiName),
      C.TI_ID_ESTADISTICA -> Json.toJson(posicionarancel.tiIdEstadistica),
      C.TI_NAME -> Json.toJson(posicionarancel.tiName),
      C.POAR_DESCRIP -> Json.toJson(posicionarancel.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_POSICIONARANCEL), { user =>
      Ok(Json.toJson(Posicionarancel.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in posicionarancels.update")
    posicionarancelForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      posicionarancel => {
        Logger.debug(s"form: ${posicionarancel.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_POSICIONARANCEL), { user =>
          Ok(
            Json.toJson(
              Posicionarancel.update(user,
                Posicionarancel(
                       id,
                       posicionarancel.name,
                       posicionarancel.code,
                       posicionarancel.active,
                       posicionarancel.tiIdDerechos,
                       posicionarancel.tiIdEstadistica,
                       posicionarancel.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in posicionarancels.create")
    posicionarancelForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      posicionarancel => {
        Logger.debug(s"form: ${posicionarancel.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_POSICIONARANCEL), { user =>
          Ok(
            Json.toJson(
              Posicionarancel.create(user,
                Posicionarancel(
                       posicionarancel.name,
                       posicionarancel.code,
                       posicionarancel.active,
                       posicionarancel.tiIdDerechos,
                       posicionarancel.tiIdEstadistica,
                       posicionarancel.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in posicionarancels.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_POSICIONARANCEL), { user =>
      Posicionarancel.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
