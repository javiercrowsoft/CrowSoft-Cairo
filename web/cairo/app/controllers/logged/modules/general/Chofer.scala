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
import java.util.Date


case class ChoferData(
                       id: Option[Int],
                       name: String,
                       code: String,
                       active: Boolean,
                       transId: Int,
                       camId: Int,
                       direccion: String,
                       dni: Int,
                       fechadeNacimiento: Date,
                       telefono: String,
                       descrip: String
                       )

object Choferes extends Controller with ProvidesUser {

  val choferForm = Form(
    mapping(
      "id" -> optional(number),
      C.CHOF_NAME -> nonEmptyText,
      C.CHOF_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.TRANS_ID -> number,
      C.CAM_ID -> number,
      C.CHOF_DIRECCION -> text,
      C.CHOF_DNI -> number,
      C.CHOF_FECHA_NACIMIENTO -> date,
      C.CHOF_TELEFONO -> text,
      C.CHOF_DESCRIP -> text
    )(ChoferData.apply)(ChoferData.unapply))

  implicit val choferWrites = new Writes[Chofer] {
    def writes(chofer: Chofer) = Json.obj(
      "id" -> Json.toJson(chofer.id),
      C.CHOF_ID -> Json.toJson(chofer.id),
      C.CHOF_NAME -> Json.toJson(chofer.name),
      C.CHOF_CODE -> Json.toJson(chofer.code),
      DBHelper.ACTIVE -> Json.toJson(chofer.active),
      C.TRANS_ID -> Json.toJson(chofer.transId),
      C.TRANS_NAME -> Json.toJson(chofer.transName),
      C.CAM_ID -> Json.toJson(chofer.camId),
      C.CAM_PATENTE -> Json.toJson(chofer.camPatente),
      C.CHOF_DIRECCION -> Json.toJson(chofer.direccion),
      C.CHOF_DNI -> Json.toJson(chofer.dni),
      C.CHOF_FECHA_NACIMIENTO -> Json.toJson(chofer.fechadeNacimiento),
      C.CHOF_TELEFONO -> Json.toJson(chofer.telefono),
      C.CHOF_DESCRIP -> Json.toJson(chofer.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CHOFER), { user =>
      Ok(Json.toJson(Chofer.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Choferes.update")
    choferForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      chofer => {
        Logger.debug(s"form: ${chofer.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CHOFER), { user =>
          Ok(
            Json.toJson(
              Chofer.update(user,
                Chofer(
                  id,
                  chofer.name,
                  chofer.code,
                  chofer.active,
                  chofer.transId,
                  chofer.camId,
                  chofer.direccion,
                  chofer.dni,
                  chofer.fechadeNacimiento,
                  chofer.telefono,
                  chofer.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Choferes.create")
    choferForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      chofer => {
        Logger.debug(s"form: ${chofer.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CHOFER), { user =>
          Ok(
            Json.toJson(
              Chofer.create(user,
                Chofer(
                  chofer.name,
                  chofer.code,
                  chofer.active,
                  chofer.transId,
                  chofer.camId,
                  chofer.direccion,
                  chofer.dni,
                  chofer.fechadeNacimiento,
                  chofer.telefono,
                  chofer.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Choferes.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CHOFER), { user =>
      Chofer.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}