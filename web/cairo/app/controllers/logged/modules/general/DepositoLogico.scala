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


case class DepositoLogicoData(
                        id: Option[Int],
                        name: String,
                        code: String,
                        active: Boolean,
                        descrip: String
                      )

object DepositosLogicos extends Controller with ProvidesUser {

  val depositoLogicoForm = Form(
    mapping(
      "id" -> optional(number),
      C.DEPL_NAME -> nonEmptyText,
      C.DEPL_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.DEPL_DESCRIP -> text
    )(DepositoLogicoData.apply)(DepositoLogicoData.unapply))

  implicit val depositoLogicoWrites = new Writes[DepositoLogico] {
    def writes(depositoLogico: DepositoLogico) = Json.obj(
      "id" -> Json.toJson(depositoLogico.id),
      C.DEPL_ID -> Json.toJson(depositoLogico.id),
      C.DEPL_NAME -> Json.toJson(depositoLogico.name),
      C.DEPL_CODE -> Json.toJson(depositoLogico.code),
      DBHelper.ACTIVE -> Json.toJson(depositoLogico.active),
      C.DEPL_DESCRIP -> Json.toJson(depositoLogico.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_DEPOSITO_LOGICO), { user =>
      Ok(Json.toJson(DepositoLogico.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in DepositosLogicos.update")
    depositoLogicoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      depositoLogico => {
        Logger.debug(s"form: ${depositoLogico.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_DEPOSITO_LOGICO), { user =>
          Ok(
            Json.toJson(
              DepositoLogico.update(user,
                DepositoLogico(
                  id,
                  depositoLogico.name,
                  depositoLogico.code,
                  depositoLogico.active,
                  depositoLogico.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in DepositosLogicos.create")
    depositoLogicoForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      depositoLogico => {
        Logger.debug(s"form: ${depositoLogico.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_DEPOSITO_LOGICO), { user =>
          Ok(
            Json.toJson(
              DepositoLogico.create(user,
                DepositoLogico(
                  depositoLogico.name,
                  depositoLogico.code,
                  depositoLogico.active,
                  depositoLogico.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in DepositosLogicos.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_DEPOSITO_LOGICO), { user =>
      DepositoLogico.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

  def info(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val info = DepositoLogico.info(user, id)
      Ok(
        Json.toJson(
          Json.obj(
            C.DEPF_ID -> Json.toJson(info.depfId),
            C.CTRL_STOCK_TYPE -> Json.toJson(info.ctrlStockType)
          )))
    })
  }

}
