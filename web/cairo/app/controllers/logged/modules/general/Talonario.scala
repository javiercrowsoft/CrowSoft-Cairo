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


case class TalonarioData(
                          id: Option[Int],
                          name: String,
                          code: String,
                          descrip: String,
                          ultimoNro: Int,
                          tipo: Int,
                          mascara: String,
                          tipoAFIP: Int,
                          puntoVta: Int,
                          active: Boolean,
                          cai: String,
                          empId: Int
                     )

object Talonarios extends Controller with ProvidesUser {

  val talonarioForm = Form(
    mapping(
      "id" -> optional(number),
      C.TA_NAME -> nonEmptyText,
      C.TA_CODE -> text,
      C.TA_DESCRIP -> text,
      C.TA_ULTIMO_NRO -> number,
      C.TA_TIPO -> number,
      C.TA_MASCARA -> text,
      C.TA_TIPO_AFIP -> number,
      C.TA_PUNTO_VTA -> number,
      DBHelper.ACTIVE -> boolean,
      C.TA_CAI -> text,
      C.EMP_ID -> number
    )(TalonarioData.apply)(TalonarioData.unapply))

  implicit val talonarioWrites = new Writes[Talonario] {
    def writes(talonario: Talonario) = Json.obj(
      "id" -> Json.toJson(talonario.id),
      C.TA_ID -> Json.toJson(talonario.id),
      C.TA_NAME -> Json.toJson(talonario.name),
      C.TA_CODE -> Json.toJson(talonario.code),
      C.TA_DESCRIP -> Json.toJson(talonario.descrip),
      C.TA_ULTIMO_NRO -> Json.toJson(talonario.ultimoNro),
      C.TA_TIPO -> Json.toJson(talonario.tipo),
      C.TA_MASCARA -> Json.toJson(talonario.mascara),
      C.TA_TIPO_AFIP -> Json.toJson(talonario.tipoAFIP),
      C.TA_PUNTO_VTA -> Json.toJson(talonario.puntoVta),
      DBHelper.ACTIVE -> Json.toJson(talonario.active),
      C.TA_CAI -> Json.toJson(talonario.cai),
      C.EMP_ID -> Json.toJson(talonario.empId),
      C.EMP_NAME -> Json.toJson(talonario.empName)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_TALONARIO), { user =>
      Ok(Json.toJson(Talonario.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in talonarios.update")
    talonarioForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      talonario => {
        Logger.debug(s"form: ${talonario.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_TALONARIO), { user =>
          Ok(
            Json.toJson(
              Talonario.update(user,
                Talonario(
                  id,
                  talonario.name,
                  talonario.code,
                  talonario.descrip,
                  talonario.ultimoNro,
                  talonario.tipo,
                  talonario.mascara,
                  talonario.tipoAFIP,
                  talonario.puntoVta,
                  talonario.active,
                  talonario.cai,
                  talonario.empId
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in talonarios.create")
    talonarioForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      talonario => {
        Logger.debug(s"form: ${talonario.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_TALONARIO), { user =>
          Ok(
            Json.toJson(
              Talonario.create(user,
                Talonario(
                  talonario.name,
                  talonario.code,
                  talonario.descrip,
                  talonario.ultimoNro,
                  talonario.tipo,
                  talonario.mascara,
                  talonario.tipoAFIP,
                  talonario.puntoVta,
                  talonario.active,
                  talonario.cai,
                  talonario.empId
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in talonarios.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_TALONARIO), { user =>
      Talonario.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
