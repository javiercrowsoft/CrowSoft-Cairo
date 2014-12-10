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


case class FormapagoData(
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

object Formapagos extends Controller with ProvidesUser {

  val formapagoForm = Form(
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
  )(FormapagoData.apply)(FormapagoData.unapply))

  implicit val formapagoWrites = new Writes[Formapago] {
    def writes(formapago: Formapago) = Json.obj(
      "id" -> Json.toJson(formapago.id),
      C.FP_ID -> Json.toJson(formapago.id),
      C.FP_NAME -> Json.toJson(formapago.name),
      C.FP_CODE -> Json.toJson(formapago.code),
      DBHelper.ACTIVE -> Json.toJson(formapago.active),
      C.FP_LUNES -> Json.toJson(formapago.lunes),
      C.FP_MARTES -> Json.toJson(formapago.martes),
      C.FP_MIERCOLES -> Json.toJson(formapago.miercoles),
      C.FP_JUEVES -> Json.toJson(formapago.jueves),
      C.FP_VIERNES -> Json.toJson(formapago.viernes),
      C.FP_SABADO -> Json.toJson(formapago.sabado),
      C.FP_DOMINGO -> Json.toJson(formapago.domingo),
      C.FP_DESCRIP -> Json.toJson(formapago.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_FORMAPAGO), { user =>
      Ok(Json.toJson(Formapago.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in formapagos.update")
    formapagoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      formapago => {
        Logger.debug(s"form: ${formapago.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_FORMAPAGO), { user =>
          Ok(
            Json.toJson(
              Formapago.update(user,
                Formapago(
                       id,
                       formapago.name,
                       formapago.code,
                       formapago.active,
                       formapago.lunes,
                       formapago.martes,
                       formapago.miercoles,
                       formapago.jueves,
                       formapago.viernes,
                       formapago.sabado,
                       formapago.domingo,
                       formapago.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in formapagos.create")
    formapagoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      formapago => {
        Logger.debug(s"form: ${formapago.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_FORMAPAGO), { user =>
          Ok(
            Json.toJson(
              Formapago.create(user,
                Formapago(
                       formapago.name,
                       formapago.code,
                       formapago.active,
                       formapago.lunes,
                       formapago.martes,
                       formapago.miercoles,
                       formapago.jueves,
                       formapago.viernes,
                       formapago.sabado,
                       formapago.domingo,
                       formapago.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in formapagos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_FORMAPAGO), { user =>
      Formapago.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
