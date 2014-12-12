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


case class TransporteData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              direccion: String,
              telefono: String,
              proId: Int,
              mail: String,
              web: String,
              provId: Int,
              horarioMdesde: Date,
              horarioMhasta: Date,
              horarioTdesde: Date,
              horarioThasta: Date,
              descrip: String
              )

object Transportes extends Controller with ProvidesUser {

  val transporteForm = Form(
    mapping(
      "id" -> optional(number),
      C.TRANS_NAME -> nonEmptyText,
      C.TRANS_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.TRANS_DIRECCION -> text,
      C.TRANS_TELEFONO -> text,
      C.PRO_ID -> number,
      C.TRANS_MAIL -> text,
      C.TRANS_WEB -> text,
      C.PROV_ID -> number,
      C.TRANS_HORARIO_MDESDE -> number,
      C.TRANS_HORARIO_MHASTA -> number,
      C.TRANS_HORARIO_TDESDE -> number,
      C.TRANS_HORARIO_THASTA -> number,
      C.TRANS_DESCRIP -> text
  )(TransporteData.apply)(TransporteData.unapply))

  implicit val transporteWrites = new Writes[Transporte] {
    def writes(transporte: Transporte) = Json.obj(
      "id" -> Json.toJson(transporte.id),
      C.TRANS_ID -> Json.toJson(transporte.id),
      C.TRANS_NAME -> Json.toJson(transporte.name),
      C.TRANS_CODE -> Json.toJson(transporte.code),
      DBHelper.ACTIVE -> Json.toJson(transporte.active),
      C.TRANS_DIRECCION -> Json.toJson(transporte.direccion),
      C.TRANS_TELEFONO -> Json.toJson(transporte.telefono),
      C.PRO_ID -> Json.toJson(transporte.proId),
      C.PRO_NAME -> Json.toJson(transporte.proName),
      C.TRANS_MAIL -> Json.toJson(transporte.mail),
      C.TRANS_WEB -> Json.toJson(transporte.web),
      C.PROV_ID -> Json.toJson(transporte.provId),
      C.PROV_NAME -> Json.toJson(transporte.provName),
      C.TRANS_HORARIO_MDESDE -> Json.toJson(transporte.horarioMdesde),
      C.TRANS_HORARIO_MHASTA -> Json.toJson(transporte.horarioMhasta),
      C.TRANS_HORARIO_TDESDE -> Json.toJson(transporte.horarioTdesde),
      C.TRANS_HORARIO_THASTA -> Json.toJson(transporte.horarioThasta),
      C.TRANS_DESCRIP -> Json.toJson(transporte.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_TRANSPORTE), { user =>
      Ok(Json.toJson(Transporte.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in transportes.update")
    transporteForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      transporte => {
        Logger.debug(s"form: ${transporte.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_TRANSPORTE), { user =>
          Ok(
            Json.toJson(
              Transporte.update(user,
                Transporte(
                       id,
                       transporte.name,
                       transporte.code,
                       transporte.active,
                       transporte.direccion,
                       transporte.telefono,
                       transporte.proId,
                       transporte.mail,
                       transporte.web,
                       transporte.provId,
                       transporte.horarioMdesde,
                       transporte.horarioMhasta,
                       transporte.horarioTdesde,
                       transporte.horarioThasta,
                       transporte.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in transportes.create")
    transporteForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      transporte => {
        Logger.debug(s"form: ${transporte.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_TRANSPORTE), { user =>
          Ok(
            Json.toJson(
              Transporte.create(user,
                Transporte(
                       transporte.name,
                       transporte.code,
                       transporte.active,
                       transporte.direccion,
                       transporte.telefono,
                       transporte.proId,
                       transporte.mail,
                       transporte.web,
                       transporte.provId,
                       transporte.horarioMdesde,
                       transporte.horarioMhasta,
                       transporte.horarioTdesde,
                       transporte.horarioThasta,
                       transporte.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in transportes.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_TRANSPORTE), { user =>
      Transporte.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
