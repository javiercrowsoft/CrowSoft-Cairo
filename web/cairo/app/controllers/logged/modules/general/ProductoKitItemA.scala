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


case class ProductokititemaData(
              id: Option[Int],

              )

object Productokititemas extends Controller with ProvidesUser {

  val productokititemaForm = Form(
    mapping(
      "id" -> optional(number),

  )(ProductokititemaData.apply)(ProductokititemaData.unapply))

  implicit val productokititemaWrites = new Writes[Productokititema] {
    def writes(productokititema: Productokititema) = Json.obj(
      "id" -> Json.toJson(productokititema.id),
      C.ID -> Json.toJson(productokititema.id),

    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PRODUCTOKITITEMA), { user =>
      Ok(Json.toJson(Productokititema.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in productokititemas.update")
    productokititemaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      productokititema => {
        Logger.debug(s"form: ${productokititema.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PRODUCTOKITITEMA), { user =>
          Ok(
            Json.toJson(
              Productokititema.update(user,
                Productokititema(
                       id,

                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in productokititemas.create")
    productokititemaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      productokititema => {
        Logger.debug(s"form: ${productokititema.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PRODUCTOKITITEMA), { user =>
          Ok(
            Json.toJson(
              Productokititema.create(user,
                Productokititema(

                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in productokititemas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PRODUCTOKITITEMA), { user =>
      Productokititema.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
