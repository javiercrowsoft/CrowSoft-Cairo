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


case class TasaimpositivaData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              porcentaje: Double,
              cuecId: Int,
              codigoDgi1: String,
              codigoDgi2: String,
              tipo: Int
              )

object Tasaimpositivas extends Controller with ProvidesUser {

  val tasaimpositivaForm = Form(
    mapping(
      "id" -> optional(number),
      C.TI_NAME -> nonEmptyText,
      C.TI_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.TI_PORCENTAJE -> of(Global.doubleFormat),
      C.CUEC_ID -> number,
      C.TI_CODIGO_DGI1 -> text,
      C.TI_CODIGO_DGI2 -> text,
      C.TI_TIPO -> number
  )(TasaimpositivaData.apply)(TasaimpositivaData.unapply))

  implicit val tasaimpositivaWrites = new Writes[Tasaimpositiva] {
    def writes(tasaimpositiva: Tasaimpositiva) = Json.obj(
      "id" -> Json.toJson(tasaimpositiva.id),
      C.TI_ID -> Json.toJson(tasaimpositiva.id),
      C.TI_NAME -> Json.toJson(tasaimpositiva.name),
      C.TI_CODE -> Json.toJson(tasaimpositiva.code),
      DBHelper.ACTIVE -> Json.toJson(tasaimpositiva.active),
      C.TI_PORCENTAJE -> Json.toJson(tasaimpositiva.porcentaje),
      C.CUEC_ID -> Json.toJson(tasaimpositiva.cuecId),
      C.CUEC_NAME -> Json.toJson(tasaimpositiva.cuecName),
      C.TI_CODIGO_DGI1 -> Json.toJson(tasaimpositiva.codigoDgi1),
      C.TI_CODIGO_DGI2 -> Json.toJson(tasaimpositiva.codigoDgi2),
      C.TI_TIPO -> Json.toJson(tasaimpositiva.tipo)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_TASA_IMPOSITIVA), { user =>
      Ok(Json.toJson(Tasaimpositiva.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in tasaimpositivas.update")
    tasaimpositivaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      tasaimpositiva => {
        Logger.debug(s"form: ${tasaimpositiva.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_TASA_IMPOSITIVA), { user =>
          Ok(
            Json.toJson(
              Tasaimpositiva.update(user,
                Tasaimpositiva(
                       id,
                       tasaimpositiva.name,
                       tasaimpositiva.code,
                       tasaimpositiva.active,
                       tasaimpositiva.porcentaje,
                       tasaimpositiva.cuecId,
                       tasaimpositiva.codigoDgi1,
                       tasaimpositiva.codigoDgi2,
                       tasaimpositiva.tipo
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in tasaimpositivas.create")
    tasaimpositivaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      tasaimpositiva => {
        Logger.debug(s"form: ${tasaimpositiva.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_TASA_IMPOSITIVA), { user =>
          Ok(
            Json.toJson(
              Tasaimpositiva.create(user,
                Tasaimpositiva(
                       tasaimpositiva.name,
                       tasaimpositiva.code,
                       tasaimpositiva.active,
                       tasaimpositiva.porcentaje,
                       tasaimpositiva.cuecId,
                       tasaimpositiva.codigoDgi1,
                       tasaimpositiva.codigoDgi2,
                       tasaimpositiva.tipo
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in tasaimpositivas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_TASA_IMPOSITIVA), { user =>
      Tasaimpositiva.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
