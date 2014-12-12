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


case class CuentagrupoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              tipo: Int,
              cueId: Int,
              descrip: String
              )

object Cuentagrupos extends Controller with ProvidesUser {

  val cuentagrupoForm = Form(
    mapping(
      "id" -> optional(number),
      C.CUEG_NAME -> nonEmptyText,
      C.CUEG_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.CUEG_TIPO -> number,
      C.CUE_ID -> number,
      C.CUEG_DESCRIP -> text
  )(CuentagrupoData.apply)(CuentagrupoData.unapply))

  implicit val cuentagrupoWrites = new Writes[Cuentagrupo] {
    def writes(cuentagrupo: Cuentagrupo) = Json.obj(
      "id" -> Json.toJson(cuentagrupo.id),
      C.CUEG_ID -> Json.toJson(cuentagrupo.id),
      C.CUEG_NAME -> Json.toJson(cuentagrupo.name),
      C.CUEG_CODE -> Json.toJson(cuentagrupo.code),
      DBHelper.ACTIVE -> Json.toJson(cuentagrupo.active),
      C.CUEG_TIPO -> Json.toJson(cuentagrupo.tipo),
      C.CUE_ID -> Json.toJson(cuentagrupo.cueId),
      C.CUE_NAME -> Json.toJson(cuentagrupo.cueName),
      C.CUEG_DESCRIP -> Json.toJson(cuentagrupo.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CUENTAGRUPO), { user =>
      Ok(Json.toJson(Cuentagrupo.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in cuentagrupos.update")
    cuentagrupoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cuentagrupo => {
        Logger.debug(s"form: ${cuentagrupo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CUENTAGRUPO), { user =>
          Ok(
            Json.toJson(
              Cuentagrupo.update(user,
                Cuentagrupo(
                       id,
                       cuentagrupo.name,
                       cuentagrupo.code,
                       cuentagrupo.active,
                       cuentagrupo.tipo,
                       cuentagrupo.cueId,
                       cuentagrupo.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in cuentagrupos.create")
    cuentagrupoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cuentagrupo => {
        Logger.debug(s"form: ${cuentagrupo.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CUENTAGRUPO), { user =>
          Ok(
            Json.toJson(
              Cuentagrupo.create(user,
                Cuentagrupo(
                       cuentagrupo.name,
                       cuentagrupo.code,
                       cuentagrupo.active,
                       cuentagrupo.tipo,
                       cuentagrupo.cueId,
                       cuentagrupo.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in cuentagrupos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CUENTAGRUPO), { user =>
      Cuentagrupo.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
