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


case class EmpresadeleteData(
              id: Option[Int],

              )

object Empresadeletes extends Controller with ProvidesUser {

  val empresadeleteForm = Form(
    mapping(
      "id" -> optional(number),

  )(EmpresadeleteData.apply)(EmpresadeleteData.unapply))

  implicit val empresadeleteWrites = new Writes[Empresadelete] {
    def writes(empresadelete: Empresadelete) = Json.obj(
      "id" -> Json.toJson(empresadelete.id),
      C.ID -> Json.toJson(empresadelete.id),

    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_EMPRESADELETE), { user =>
      Ok(Json.toJson(Empresadelete.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in empresadeletes.update")
    empresadeleteForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      empresadelete => {
        Logger.debug(s"form: ${empresadelete.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_EMPRESADELETE), { user =>
          Ok(
            Json.toJson(
              Empresadelete.update(user,
                Empresadelete(
                       id,

                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in empresadeletes.create")
    empresadeleteForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      empresadelete => {
        Logger.debug(s"form: ${empresadelete.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_EMPRESADELETE), { user =>
          Ok(
            Json.toJson(
              Empresadelete.create(user,
                Empresadelete(

                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in empresadeletes.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_EMPRESADELETE), { user =>
      Empresadelete.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
