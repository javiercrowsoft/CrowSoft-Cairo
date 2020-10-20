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


case class ChequeraData(
              id: Option[Int],
              code: String,
              active: Boolean,
              lastNumber: Int,
              maxNumber: Int,
              minNumber: Int,
              default: Boolean,
              cueId: Int
              )

object Chequeras extends Controller with ProvidesUser {

  val TC = models.cairo.modules.tesoreria.C

  val chequeraForm = Form(
    mapping(
      "id" -> optional(number),
      C.CHQ_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.CHQ_ULTIMO_NUMERO -> number,
      C.CHQ_NUMERO_DESDE -> number,
      C.CHQ_NUMERO_HASTA -> number,
      C.CHQ_DEFAULT -> boolean,
      C.CUE_ID -> number
  )(ChequeraData.apply)(ChequeraData.unapply))

  implicit val chequeraWrites = new Writes[Chequera] {
    def writes(chequera: Chequera) = Json.obj(
      "id" -> Json.toJson(chequera.id),
      C.CHQ_ID -> Json.toJson(chequera.id),
      C.CHQ_CODE -> Json.toJson(chequera.code),
      C.CHQ_ULTIMO_NUMERO -> Json.toJson(chequera.lastNumber),
      C.CHQ_NUMERO_DESDE -> Json.toJson(chequera.minNumber),
      C.CHQ_NUMERO_HASTA -> Json.toJson(chequera.maxNumber),
      C.CHQ_DEFAULT -> Json.toJson(chequera.default),
      C.CUE_ID ->  Json.toJson(chequera.cueId),
      C.CUE_NAME ->  Json.toJson(chequera.cueName),
      DBHelper.ACTIVE -> Json.toJson(chequera.active)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CHEQUERA), { user =>
      Ok(Json.toJson(Chequera.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in chequeras.update")
    chequeraForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      chequera => {
        Logger.debug(s"form: ${chequera.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CHEQUERA), { user =>
          Ok(
            Json.toJson(
              Chequera.update(user,
                Chequera(
                       id,
                       chequera.code,
                       chequera.active,
                       chequera.lastNumber,
                       chequera.minNumber,
                       chequera.maxNumber,
                       chequera.default,
                       chequera.cueId
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in chequeras.create")
    chequeraForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      chequera => {
        Logger.debug(s"form: ${chequera.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CHEQUERA), { user =>
          Ok(
            Json.toJson(
              Chequera.create(user,
                Chequera(
                       chequera.code,
                       chequera.active,
                       chequera.lastNumber,
                       chequera.minNumber,
                       chequera.maxNumber,
                       chequera.default,
                       chequera.cueId
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in chequeras.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CHEQUERA), { user =>
      Chequera.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

  def nextNumber(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val nextNumber = Chequera.nextNumber(user, id)
      Ok(
        Json.toJson(
          Json.obj(
            TC.CHEQ_NUMERO_DOC -> Json.toJson(nextNumber)
          )))
    })
  }
}
