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


case class ListapreciomarcadoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              base: Double,
              porcentaje: Double,
              salto: Double,
              decremento: Double,
              porcminimo: Double,
              porcmaximo: Double,
              montominimo: Double,
              monId: Int,
              descrip: String
              )

object Listapreciomarcados extends Controller with ProvidesUser {

  val listapreciomarcadoForm = Form(
    mapping(
      "id" -> optional(number),
      C.LPM_NAME -> nonEmptyText,
      C.LPM_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.LPM_BASE -> number,
      C.LPM_PORCENTAJE -> number,
      C.LPM_SALTO -> number,
      C.LPM_DECREMENTO -> number,
      C.LPM_PORCMINIMO -> number,
      C.LPM_PORCMAXIMO -> number,
      C.LPM_MONTOMINIMO -> number,
      C.MON_ID -> number,
      C.LPM_DESCRIP -> text
  )(ListapreciomarcadoData.apply)(ListapreciomarcadoData.unapply))

  implicit val listapreciomarcadoWrites = new Writes[Listapreciomarcado] {
    def writes(listapreciomarcado: Listapreciomarcado) = Json.obj(
      "id" -> Json.toJson(listapreciomarcado.id),
      C.LPM_ID -> Json.toJson(listapreciomarcado.id),
      C.LPM_NAME -> Json.toJson(listapreciomarcado.name),
      C.LPM_CODE -> Json.toJson(listapreciomarcado.code),
      DBHelper.ACTIVE -> Json.toJson(listapreciomarcado.active),
      C.LPM_BASE -> Json.toJson(listapreciomarcado.base),
      C.LPM_PORCENTAJE -> Json.toJson(listapreciomarcado.porcentaje),
      C.LPM_SALTO -> Json.toJson(listapreciomarcado.salto),
      C.LPM_DECREMENTO -> Json.toJson(listapreciomarcado.decremento),
      C.LPM_PORCMINIMO -> Json.toJson(listapreciomarcado.porcminimo),
      C.LPM_PORCMAXIMO -> Json.toJson(listapreciomarcado.porcmaximo),
      C.LPM_MONTOMINIMO -> Json.toJson(listapreciomarcado.montominimo),
      C.MON_ID -> Json.toJson(listapreciomarcado.monId),
      C.MON_NAME -> Json.toJson(listapreciomarcado.monName),
      C.LPM_DESCRIP -> Json.toJson(listapreciomarcado.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_LISTAPRECIOMARCADO), { user =>
      Ok(Json.toJson(Listapreciomarcado.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in listapreciomarcados.update")
    listapreciomarcadoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      listapreciomarcado => {
        Logger.debug(s"form: ${listapreciomarcado.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_LISTAPRECIOMARCADO), { user =>
          Ok(
            Json.toJson(
              Listapreciomarcado.update(user,
                Listapreciomarcado(
                       id,
                       listapreciomarcado.name,
                       listapreciomarcado.code,
                       listapreciomarcado.active,
                       listapreciomarcado.base,
                       listapreciomarcado.porcentaje,
                       listapreciomarcado.salto,
                       listapreciomarcado.decremento,
                       listapreciomarcado.porcminimo,
                       listapreciomarcado.porcmaximo,
                       listapreciomarcado.montominimo,
                       listapreciomarcado.monId,
                       listapreciomarcado.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in listapreciomarcados.create")
    listapreciomarcadoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      listapreciomarcado => {
        Logger.debug(s"form: ${listapreciomarcado.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_LISTAPRECIOMARCADO), { user =>
          Ok(
            Json.toJson(
              Listapreciomarcado.create(user,
                Listapreciomarcado(
                       listapreciomarcado.name,
                       listapreciomarcado.code,
                       listapreciomarcado.active,
                       listapreciomarcado.base,
                       listapreciomarcado.porcentaje,
                       listapreciomarcado.salto,
                       listapreciomarcado.decremento,
                       listapreciomarcado.porcminimo,
                       listapreciomarcado.porcmaximo,
                       listapreciomarcado.montominimo,
                       listapreciomarcado.monId,
                       listapreciomarcado.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in listapreciomarcados.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_LISTAPRECIOMARCADO), { user =>
      Listapreciomarcado.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
