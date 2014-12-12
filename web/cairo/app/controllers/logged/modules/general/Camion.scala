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


case class CamionData(
              id: Option[Int],
              code: String,
              active: Boolean,
              esSemi: Boolean,
              patente: String,
              patentesemi: String,
              tara: Long,
              transId: Int,
              chofId: Int,
              descrip: String
              )

object Camions extends Controller with ProvidesUser {

  val camionForm = Form(
    mapping(
      "id" -> optional(number),
      C.CAM_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.CAM_ES_SEMI -> boolean,
      C.CAM_PATENTE -> text,
      C.CAM_PATENTESEMI -> text,
      C.CAM_TARA -> number,
      C.TRANS_ID -> number,
      C.CHOF_ID -> number,
      C.CAM_DESCRIP -> text
  )(CamionData.apply)(CamionData.unapply))

  implicit val camionWrites = new Writes[Camion] {
    def writes(camion: Camion) = Json.obj(
      "id" -> Json.toJson(camion.id),
      C.CAM_ID -> Json.toJson(camion.id),
      C.CAM_CODE -> Json.toJson(camion.code),
      DBHelper.ACTIVE -> Json.toJson(camion.active),
      C.CAM_ES_SEMI -> Json.toJson(camion.esSemi),
      C.CAM_PATENTE -> Json.toJson(camion.patente),
      C.CAM_PATENTESEMI -> Json.toJson(camion.patentesemi),
      C.CAM_TARA -> Json.toJson(camion.tara),
      C.TRANS_ID -> Json.toJson(camion.transId),
      C.TRANS_NAME -> Json.toJson(camion.transName),
      C.CHOF_ID -> Json.toJson(camion.chofId),
      C.CHOF_NAME -> Json.toJson(camion.chofName),
      C.CAM_DESCRIP -> Json.toJson(camion.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CAMION), { user =>
      Ok(Json.toJson(Camion.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Camiones.update")
    camionForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      camion => {
        Logger.debug(s"form: ${camion.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CAMION), { user =>
          Ok(
            Json.toJson(
              Camion.update(user,
                Camion(
                       id,
                       camion.code,
                       camion.active,
                       camion.esSemi,
                       camion.patente,
                       camion.patentesemi,
                       camion.tara,
                       camion.transId,
                       camion.chofId,
                       camion.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Camiones.create")
    camionForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      camion => {
        Logger.debug(s"form: ${camion.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CAMION), { user =>
          Ok(
            Json.toJson(
              Camion.create(user,
                Camion(
                       camion.code,
                       camion.active,
                       camion.esSemi,
                       camion.patente,
                       camion.patentesemi,
                       camion.tara,
                       camion.transId,
                       camion.chofId,
                       camion.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Camiones.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CAMION), { user =>
      Camion.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
