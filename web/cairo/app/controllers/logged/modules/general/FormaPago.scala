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


case class FormaPagoData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              lunes: Boolean,
              martes: Boolean,
              miercoles: Boolean,
              jueves: Boolean,
              viernes: Boolean,
              sabado: Boolean,
              domingo: Boolean,
              descrip: String
              )

object FormasPago extends Controller with ProvidesUser {

  val formaPagoForm = Form(
    mapping(
      "id" -> optional(number),
      C.FP_NAME -> nonEmptyText,
      C.FP_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.FP_LUNES -> boolean,
      C.FP_MARTES -> boolean,
      C.FP_MIERCOLES -> boolean,
      C.FP_JUEVES -> boolean,
      C.FP_VIERNES -> boolean,
      C.FP_SABADO -> boolean,
      C.FP_DOMINGO -> boolean,
      C.FP_DESCRIP -> text
  )(FormaPagoData.apply)(FormaPagoData.unapply))

  implicit val formaPagoWrites = new Writes[FormaPago] {
    def writes(formaPago: FormaPago) = Json.obj(
      "id" -> Json.toJson(formaPago.id),
      C.FP_ID -> Json.toJson(formaPago.id),
      C.FP_NAME -> Json.toJson(formaPago.name),
      C.FP_CODE -> Json.toJson(formaPago.code),
      DBHelper.ACTIVE -> Json.toJson(formaPago.active),
      C.FP_LUNES -> Json.toJson(formaPago.lunes),
      C.FP_MARTES -> Json.toJson(formaPago.martes),
      C.FP_MIERCOLES -> Json.toJson(formaPago.miercoles),
      C.FP_JUEVES -> Json.toJson(formaPago.jueves),
      C.FP_VIERNES -> Json.toJson(formaPago.viernes),
      C.FP_SABADO -> Json.toJson(formaPago.sabado),
      C.FP_DOMINGO -> Json.toJson(formaPago.domingo),
      C.FP_DESCRIP -> Json.toJson(formaPago.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FORMAPAGO), { user =>
      Ok(Json.toJson(FormaPago.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in FormasPago.update")
    formaPagoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      formaPago => {
        Logger.debug(s"form: ${formaPago.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_FORMAPAGO), { user =>
          Ok(
            Json.toJson(
              FormaPago.update(user,
                FormaPago(
                       id,
                       formaPago.name,
                       formaPago.code,
                       formaPago.active,
                       formaPago.lunes,
                       formaPago.martes,
                       formaPago.miercoles,
                       formaPago.jueves,
                       formaPago.viernes,
                       formaPago.sabado,
                       formaPago.domingo,
                       formaPago.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in FormasPago.create")
    formaPagoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      formaPago => {
        Logger.debug(s"form: ${formaPago.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_FORMAPAGO), { user =>
          Ok(
            Json.toJson(
              FormaPago.create(user,
                FormaPago(
                       formaPago.name,
                       formaPago.code,
                       formaPago.active,
                       formaPago.lunes,
                       formaPago.martes,
                       formaPago.miercoles,
                       formaPago.jueves,
                       formaPago.viernes,
                       formaPago.sabado,
                       formaPago.domingo,
                       formaPago.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in FormasPago.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_FORMAPAGO), { user =>
      FormaPago.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
