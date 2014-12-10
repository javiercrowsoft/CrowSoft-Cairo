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


case class GastoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              tipo: String,
              fijo: Double,
              minimo: Double,
              porcentaje: Double,
              importe: Double,
              monId: Int,
              tiId: Int,
              descrip: String
              )

object Gastos extends Controller with ProvidesUser {

  val gastoForm = Form(
    mapping(
      "id" -> optional(number),
      C.GTO_NAME -> nonEmptyText,
      C.GTO_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.GTO_TIPO -> text,
      C.GTO_FIJO -> number,
      C.GTO_MINIMO -> number,
      C.GTO_PORCENTAJE -> number,
      C.GTO_IMPORTE -> number,
      C.MON_ID -> number,
      C.TI_ID -> number,
      C.GTO_DESCRIP -> text
  )(GastoData.apply)(GastoData.unapply))

  implicit val gastoWrites = new Writes[Gasto] {
    def writes(gasto: Gasto) = Json.obj(
      "id" -> Json.toJson(gasto.id),
      C.GTO_ID -> Json.toJson(gasto.id),
      C.GTO_NAME -> Json.toJson(gasto.name),
      C.GTO_CODE -> Json.toJson(gasto.code),
      DBHelper.ACTIVE -> Json.toJson(gasto.active),
      C.GTO_TIPO -> Json.toJson(gasto.tipo),
      C.GTO_FIJO -> Json.toJson(gasto.fijo),
      C.GTO_MINIMO -> Json.toJson(gasto.minimo),
      C.GTO_PORCENTAJE -> Json.toJson(gasto.porcentaje),
      C.GTO_IMPORTE -> Json.toJson(gasto.importe),
      C.MON_ID -> Json.toJson(gasto.monId),
      C.MON_NAME -> Json.toJson(gasto.monName),
      C.TI_ID -> Json.toJson(gasto.tiId),
      C.TI_NAME -> Json.toJson(gasto.tiName),
      C.GTO_DESCRIP -> Json.toJson(gasto.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_GASTO), { user =>
      Ok(Json.toJson(Gasto.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in gastos.update")
    gastoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      gasto => {
        Logger.debug(s"form: ${gasto.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_GASTO), { user =>
          Ok(
            Json.toJson(
              Gasto.update(user,
                Gasto(
                       id,
                       gasto.name,
                       gasto.code,
                       gasto.active,
                       gasto.tipo,
                       gasto.fijo,
                       gasto.minimo,
                       gasto.porcentaje,
                       gasto.importe,
                       gasto.monId,
                       gasto.tiId,
                       gasto.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in gastos.create")
    gastoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      gasto => {
        Logger.debug(s"form: ${gasto.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_GASTO), { user =>
          Ok(
            Json.toJson(
              Gasto.create(user,
                Gasto(
                       gasto.name,
                       gasto.code,
                       gasto.active,
                       gasto.tipo,
                       gasto.fijo,
                       gasto.minimo,
                       gasto.porcentaje,
                       gasto.importe,
                       gasto.monId,
                       gasto.tiId,
                       gasto.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in gastos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_GASTO), { user =>
      Gasto.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
