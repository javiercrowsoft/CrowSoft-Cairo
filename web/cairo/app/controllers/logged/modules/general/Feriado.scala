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


case class FeriadoData(
              id: Option[Int],
              name: String,
              code: String,
              dia: Int,
              mes: Int,
              anio: Int,
              recurrente: Boolean,
              banco: Boolean,
              laboral: Boolean,
              local: Boolean,
              paId: Int,
              proId: Int,
              descrip: String
              )

object Feriados extends Controller with ProvidesUser {

  val feriadoForm = Form(
    mapping(
      "id" -> optional(number),
      C.FE_NAME -> nonEmptyText,
      C.FE_CODE -> text,
      C.FE_DIA -> number,
      C.FE_MES -> number,
      C.FE_ANIO -> number,
      C.FE_RECURRENTE -> boolean,
      C.FE_BANCO -> boolean,
      C.FE_LABORAL -> boolean,
      C.FE_LOCAL -> boolean,
      C.PA_ID -> number,
      C.PRO_ID -> number,
      C.FE_DESCRIP -> text
  )(FeriadoData.apply)(FeriadoData.unapply))

  implicit val feriadoWrites = new Writes[Feriado] {
    def writes(feriado: Feriado) = Json.obj(
      "id" -> Json.toJson(feriado.id),
      C.FE_ID -> Json.toJson(feriado.id),
      C.FE_NAME -> Json.toJson(feriado.name),
      C.FE_CODE -> Json.toJson(feriado.code),
      C.FE_DIA -> Json.toJson(feriado.dia),
      C.FE_MES -> Json.toJson(feriado.mes),
      C.FE_ANIO -> Json.toJson(feriado.anio),
      C.FE_RECURRENTE -> Json.toJson(feriado.recurrente),
      C.FE_BANCO -> Json.toJson(feriado.banco),
      C.FE_LABORAL -> Json.toJson(feriado.laboral),
      C.FE_LOCAL -> Json.toJson(feriado.local),
      C.PA_ID -> Json.toJson(feriado.paId),
      C.PA_NAME -> Json.toJson(feriado.paName),
      C.PRO_ID -> Json.toJson(feriado.proId),
      C.PRO_NAME -> Json.toJson(feriado.proName),
      C.FE_DESCRIP -> Json.toJson(feriado.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FERIADO), { user =>
      Ok(Json.toJson(Feriado.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in feriados.update")
    feriadoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      feriado => {
        Logger.debug(s"form: ${feriado.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_FERIADO), { user =>
          Ok(
            Json.toJson(
              Feriado.update(user,
                Feriado(
                       id,
                       feriado.name,
                       feriado.code,
                       feriado.dia,
                       feriado.mes,
                       feriado.anio,
                       feriado.recurrente,
                       feriado.banco,
                       feriado.laboral,
                       feriado.local,
                       feriado.paId,
                       feriado.proId,
                       feriado.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in feriados.create")
    feriadoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      feriado => {
        Logger.debug(s"form: ${feriado.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_FERIADO), { user =>
          Ok(
            Json.toJson(
              Feriado.create(user,
                Feriado(
                       feriado.name,
                       feriado.code,
                       feriado.dia,
                       feriado.mes,
                       feriado.anio,
                       feriado.recurrente,
                       feriado.banco,
                       feriado.laboral,
                       feriado.local,
                       feriado.paId,
                       feriado.proId,
                       feriado.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in feriados.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_FERIADO), { user =>
      Feriado.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
