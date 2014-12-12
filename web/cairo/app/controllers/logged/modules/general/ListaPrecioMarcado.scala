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

object ListasPrecioMarcado extends Controller with ProvidesUser {

  val listaPrecioMarcadoForm = Form(
    mapping(
      "id" -> optional(number),
      C.LPM_NAME -> nonEmptyText,
      C.LPM_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.LPM_BASE -> of(Global.doubleFormat),
      C.LPM_PORCENTAJE -> of(Global.doubleFormat),
      C.LPM_SALTO -> of(Global.doubleFormat),
      C.LPM_DECREMENTO -> of(Global.doubleFormat),
      C.LPM_PORCMINIMO -> of(Global.doubleFormat),
      C.LPM_PORCMAXIMO -> of(Global.doubleFormat),
      C.LPM_MONTOMINIMO -> of(Global.doubleFormat),
      C.MON_ID -> number,
      C.LPM_DESCRIP -> text
  )(ListapreciomarcadoData.apply)(ListapreciomarcadoData.unapply))

  implicit val listaPrecioMarcadoWrites = new Writes[Listapreciomarcado] {
    def writes(listaPrecioMarcado: Listapreciomarcado) = Json.obj(
      "id" -> Json.toJson(listaPrecioMarcado.id),
      C.LPM_ID -> Json.toJson(listaPrecioMarcado.id),
      C.LPM_NAME -> Json.toJson(listaPrecioMarcado.name),
      C.LPM_CODE -> Json.toJson(listaPrecioMarcado.code),
      DBHelper.ACTIVE -> Json.toJson(listaPrecioMarcado.active),
      C.LPM_BASE -> Json.toJson(listaPrecioMarcado.base),
      C.LPM_PORCENTAJE -> Json.toJson(listaPrecioMarcado.porcentaje),
      C.LPM_SALTO -> Json.toJson(listaPrecioMarcado.salto),
      C.LPM_DECREMENTO -> Json.toJson(listaPrecioMarcado.decremento),
      C.LPM_PORCMINIMO -> Json.toJson(listaPrecioMarcado.porcminimo),
      C.LPM_PORCMAXIMO -> Json.toJson(listaPrecioMarcado.porcmaximo),
      C.LPM_MONTOMINIMO -> Json.toJson(listaPrecioMarcado.montominimo),
      C.MON_ID -> Json.toJson(listaPrecioMarcado.monId),
      C.MON_NAME -> Json.toJson(listaPrecioMarcado.monName),
      C.LPM_DESCRIP -> Json.toJson(listaPrecioMarcado.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_LISTA_PRECIO_MARCADO), { user =>
      Ok(Json.toJson(Listapreciomarcado.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in ListasPrecioMarcado.update")
    listaPrecioMarcadoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      listaPrecioMarcado => {
        Logger.debug(s"form: ${listaPrecioMarcado.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_LISTA_PRECIO_MARCADO), { user =>
          Ok(
            Json.toJson(
              Listapreciomarcado.update(user,
                Listapreciomarcado(
                       id,
                       listaPrecioMarcado.name,
                       listaPrecioMarcado.code,
                       listaPrecioMarcado.active,
                       listaPrecioMarcado.base,
                       listaPrecioMarcado.porcentaje,
                       listaPrecioMarcado.salto,
                       listaPrecioMarcado.decremento,
                       listaPrecioMarcado.porcminimo,
                       listaPrecioMarcado.porcmaximo,
                       listaPrecioMarcado.montominimo,
                       listaPrecioMarcado.monId,
                       listaPrecioMarcado.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in ListasPrecioMarcado.create")
    listaPrecioMarcadoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      listaPrecioMarcado => {
        Logger.debug(s"form: ${listaPrecioMarcado.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_LISTA_PRECIO_MARCADO), { user =>
          Ok(
            Json.toJson(
              Listapreciomarcado.create(user,
                Listapreciomarcado(
                       listaPrecioMarcado.name,
                       listaPrecioMarcado.code,
                       listaPrecioMarcado.active,
                       listaPrecioMarcado.base,
                       listaPrecioMarcado.porcentaje,
                       listaPrecioMarcado.salto,
                       listaPrecioMarcado.decremento,
                       listaPrecioMarcado.porcminimo,
                       listaPrecioMarcado.porcmaximo,
                       listaPrecioMarcado.montominimo,
                       listaPrecioMarcado.monId,
                       listaPrecioMarcado.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in ListasPrecioMarcado.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_LISTA_PRECIO_MARCADO), { user =>
      Listapreciomarcado.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
