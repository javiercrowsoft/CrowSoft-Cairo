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


case class CobradorData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              relId: Int,
              comision: Double,
              descrip: String
              )

object Cobradors extends Controller with ProvidesUser {

  val cobradorForm = Form(
    mapping(
      "id" -> optional(number),
      C.COB_NAME -> nonEmptyText,
      C.COB_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.REL_ID -> number,
      C.COB_COMISION -> of(Global.doubleFormat),
      C.COB_DESCRIP -> text
  )(CobradorData.apply)(CobradorData.unapply))

  implicit val cobradorWrites = new Writes[Cobrador] {
    def writes(cobrador: Cobrador) = Json.obj(
      "id" -> Json.toJson(cobrador.id),
      C.COB_ID -> Json.toJson(cobrador.id),
      C.COB_NAME -> Json.toJson(cobrador.name),
      C.COB_CODE -> Json.toJson(cobrador.code),
      DBHelper.ACTIVE -> Json.toJson(cobrador.active),
      C.REL_ID -> Json.toJson(cobrador.relId),
      C.REL_NAME -> Json.toJson(cobrador.relName),
      C.COB_COMISION -> Json.toJson(cobrador.comision),
      C.COB_DESCRIP -> Json.toJson(cobrador.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_COBRADOR), { user =>
      Ok(Json.toJson(Cobrador.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in cobradors.update")
    cobradorForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cobrador => {
        Logger.debug(s"form: ${cobrador.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_COBRADOR), { user =>
          Ok(
            Json.toJson(
              Cobrador.update(user,
                Cobrador(
                       id,
                       cobrador.name,
                       cobrador.code,
                       cobrador.active,
                       cobrador.relId,
                       cobrador.comision,
                       cobrador.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in cobradors.create")
    cobradorForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cobrador => {
        Logger.debug(s"form: ${cobrador.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_COBRADOR), { user =>
          Ok(
            Json.toJson(
              Cobrador.create(user,
                Cobrador(
                       cobrador.name,
                       cobrador.code,
                       cobrador.active,
                       cobrador.relId,
                       cobrador.comision,
                       cobrador.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in cobradors.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_COBRADOR), { user =>
      Cobrador.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
