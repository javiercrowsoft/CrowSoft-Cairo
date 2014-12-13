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


case class TasaImpositivaData(
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

object TasasImpositivas extends Controller with ProvidesUser {

  val tasaImpositivaForm = Form(
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
  )(TasaImpositivaData.apply)(TasaImpositivaData.unapply))

  implicit val tasaImpositivaWrites = new Writes[TasaImpositiva] {
    def writes(tasaImpositiva: TasaImpositiva) = Json.obj(
      "id" -> Json.toJson(tasaImpositiva.id),
      C.TI_ID -> Json.toJson(tasaImpositiva.id),
      C.TI_NAME -> Json.toJson(tasaImpositiva.name),
      C.TI_CODE -> Json.toJson(tasaImpositiva.code),
      DBHelper.ACTIVE -> Json.toJson(tasaImpositiva.active),
      C.TI_PORCENTAJE -> Json.toJson(tasaImpositiva.porcentaje),
      C.CUEC_ID -> Json.toJson(tasaImpositiva.cuecId),
      C.CUEC_NAME -> Json.toJson(tasaImpositiva.cuecName),
      C.TI_CODIGO_DGI1 -> Json.toJson(tasaImpositiva.codigoDgi1),
      C.TI_CODIGO_DGI2 -> Json.toJson(tasaImpositiva.codigoDgi2),
      C.TI_TIPO -> Json.toJson(tasaImpositiva.tipo)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_TASA_IMPOSITIVA), { user =>
      Ok(Json.toJson(TasaImpositiva.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in tasaImpositivas.update")
    tasaImpositivaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      tasaImpositiva => {
        Logger.debug(s"form: ${tasaImpositiva.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_TASA_IMPOSITIVA), { user =>
          Ok(
            Json.toJson(
              TasaImpositiva.update(user,
                TasaImpositiva(
                       id,
                       tasaImpositiva.name,
                       tasaImpositiva.code,
                       tasaImpositiva.active,
                       tasaImpositiva.porcentaje,
                       tasaImpositiva.cuecId,
                       tasaImpositiva.codigoDgi1,
                       tasaImpositiva.codigoDgi2,
                       tasaImpositiva.tipo
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in tasaImpositivas.create")
    tasaImpositivaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      tasaImpositiva => {
        Logger.debug(s"form: ${tasaImpositiva.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_TASA_IMPOSITIVA), { user =>
          Ok(
            Json.toJson(
              TasaImpositiva.create(user,
                TasaImpositiva(
                       tasaImpositiva.name,
                       tasaImpositiva.code,
                       tasaImpositiva.active,
                       tasaImpositiva.porcentaje,
                       tasaImpositiva.cuecId,
                       tasaImpositiva.codigoDgi1,
                       tasaImpositiva.codigoDgi2,
                       tasaImpositiva.tipo
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in tasaImpositivas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_TASA_IMPOSITIVA), { user =>
      TasaImpositiva.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
