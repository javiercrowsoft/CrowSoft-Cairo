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


case class CentroCostoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              compra: Int,
              venta: Int,
              idPadre: Int,
              descrip: String
              )

object CentrosCosto extends Controller with ProvidesUser {

  val centroCostoForm = Form(
    mapping(
      "id" -> optional(number),
      C.CCOS_NAME -> nonEmptyText,
      C.CCOS_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.CCOS_COMPRA -> number,
      C.CCOS_VENTA -> number,
      C.CCOS_ID_PADRE -> number,
      C.CCOS_DESCRIP -> text
  )(CentroCostoData.apply)(CentroCostoData.unapply))

  implicit val centroCostoWrites = new Writes[CentroCosto] {
    def writes(centroCosto: CentroCosto) = Json.obj(
      "id" -> Json.toJson(centroCosto.id),
      C.CCOS_ID -> Json.toJson(centroCosto.id),
      C.CCOS_NAME -> Json.toJson(centroCosto.name),
      C.CCOS_CODE -> Json.toJson(centroCosto.code),
      DBHelper.ACTIVE -> Json.toJson(centroCosto.active),
      C.CCOS_COMPRA -> Json.toJson(centroCosto.compra),
      C.CCOS_VENTA -> Json.toJson(centroCosto.venta),
      C.CCOS_ID_PADRE -> Json.toJson(centroCosto.idPadre),
      C.CCOS_PADRE_NAME -> Json.toJson(centroCosto.padreName),
      C.CCOS_DESCRIP -> Json.toJson(centroCosto.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CENTRO_COSTO), { user =>
      Ok(Json.toJson(CentroCosto.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in CentrosCosto.update")
    centroCostoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      centroCosto => {
        Logger.debug(s"form: ${centroCosto.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CENTRO_COSTO), { user =>
          Ok(
            Json.toJson(
              CentroCosto.update(user,
                CentroCosto(
                       id,
                       centroCosto.name,
                       centroCosto.code,
                       centroCosto.active,
                       centroCosto.compra,
                       centroCosto.venta,
                       centroCosto.idPadre,
                       centroCosto.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in CentrosCosto.create")
    centroCostoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      centroCosto => {
        Logger.debug(s"form: ${centroCosto.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CENTRO_COSTO), { user =>
          Ok(
            Json.toJson(
              CentroCosto.create(user,
                CentroCosto(
                       centroCosto.name,
                       centroCosto.code,
                       centroCosto.active,
                       centroCosto.compra,
                       centroCosto.venta,
                       centroCosto.idPadre,
                       centroCosto.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in CentrosCosto.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CENTRO_COSTO), { user =>
      CentroCosto.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
