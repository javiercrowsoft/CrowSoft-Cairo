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


case class CentrocostoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              compra: Int,
              venta: Int,
              idPadre: Int,
              descrip: String
              )

object Centrocostos extends Controller with ProvidesUser {

  val centrocostoForm = Form(
    mapping(
      "id" -> optional(number),
      C.CCOS_NAME -> nonEmptyText,
      C.CCOS_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.CCOS_COMPRA -> number,
      C.CCOS_VENTA -> number,
      C.CCOS_ID_PADRE -> number,
      C.CCOS_DESCRIP -> text
  )(CentrocostoData.apply)(CentrocostoData.unapply))

  implicit val centrocostoWrites = new Writes[Centrocosto] {
    def writes(centrocosto: Centrocosto) = Json.obj(
      "id" -> Json.toJson(centrocosto.id),
      C.CCOS_ID -> Json.toJson(centrocosto.id),
      C.CCOS_NAME -> Json.toJson(centrocosto.name),
      C.CCOS_CODE -> Json.toJson(centrocosto.code),
      DBHelper.ACTIVE -> Json.toJson(centrocosto.active),
      C.CCOS_COMPRA -> Json.toJson(centrocosto.compra),
      C.CCOS_VENTA -> Json.toJson(centrocosto.venta),
      C.CCOS_ID_PADRE -> Json.toJson(centrocosto.idPadre),
      C.CCOS_NAME -> Json.toJson(centrocosto.ccosName),
      C.CCOS_DESCRIP -> Json.toJson(centrocosto.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CENTROCOSTO), { user =>
      Ok(Json.toJson(Centrocosto.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in CentroCostos.update")
    centrocostoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      centrocosto => {
        Logger.debug(s"form: ${centrocosto.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CENTROCOSTO), { user =>
          Ok(
            Json.toJson(
              Centrocosto.update(user,
                Centrocosto(
                       id,
                       centrocosto.name,
                       centrocosto.code,
                       centrocosto.active,
                       centrocosto.compra,
                       centrocosto.venta,
                       centrocosto.idPadre,
                       centrocosto.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in CentroCostos.create")
    centrocostoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      centrocosto => {
        Logger.debug(s"form: ${centrocosto.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CENTROCOSTO), { user =>
          Ok(
            Json.toJson(
              Centrocosto.create(user,
                Centrocosto(
                       centrocosto.name,
                       centrocosto.code,
                       centrocosto.active,
                       centrocosto.compra,
                       centrocosto.venta,
                       centrocosto.idPadre,
                       centrocosto.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in CentroCostos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CENTROCOSTO), { user =>
      Centrocosto.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
