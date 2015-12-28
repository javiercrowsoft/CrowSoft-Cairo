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


case class CuentaData(
              id: Option[Int],
              name: String,
              code: String,
              identificacionExterna: String,
              active: Boolean,
              monId: Int,
              llevaCentroCosto: Boolean,
              producto: Boolean,
              esEfectivo: Boolean,
              esTicket: Boolean,
              cuecId: Int,
              bcoId: Int,
              codigoRpt: String,
              descrip: String
              )

object Cuentas extends Controller with ProvidesUser {

  val cuentaForm = Form(
    mapping(
      "id" -> optional(number),
      C.CUE_NAME -> nonEmptyText,
      C.CUE_CODE -> text,
      C.CUE_IDENTIFICACION_EXTERNA -> text,
      DBHelper.ACTIVE -> boolean,
      C.MON_ID -> number,
      C.CUE_LLEVA_CENTRO_COSTO -> boolean,
      C.CUE_PRODUCTO -> boolean,
      C.CUE_ES_EFECTIVO -> boolean,
      C.CUE_ES_TICKET -> boolean,
      C.CUEC_ID -> number,
      C.BCO_ID -> number,
      C.CUE_CODIGO_RPT -> text,
      C.CUE_DESCRIP -> text
  )(CuentaData.apply)(CuentaData.unapply))

  implicit val cuentaWrites = new Writes[Cuenta] {
    def writes(cuenta: Cuenta) = Json.obj(
      "id" -> Json.toJson(cuenta.id),
      C.CUE_ID -> Json.toJson(cuenta.id),
      C.CUE_NAME -> Json.toJson(cuenta.name),
      C.CUE_CODE -> Json.toJson(cuenta.code),
      C.CUE_IDENTIFICACION_EXTERNA -> Json.toJson(cuenta.identificacionExterna),
      DBHelper.ACTIVE -> Json.toJson(cuenta.active),
      C.MON_ID -> Json.toJson(cuenta.monId),
      C.MON_NAME -> Json.toJson(cuenta.monName),
      C.CUE_LLEVA_CENTRO_COSTO -> Json.toJson(cuenta.llevaCentroCosto),
      C.CUE_PRODUCTO -> Json.toJson(cuenta.producto),
      C.CUE_ES_EFECTIVO -> Json.toJson(cuenta.esEfectivo),
      C.CUE_ES_TICKET -> Json.toJson(cuenta.esTicket),
      C.CUEC_ID -> Json.toJson(cuenta.cuecId),
      C.CUEC_NAME -> Json.toJson(cuenta.cuecName),
      C.BCO_ID -> Json.toJson(cuenta.bcoId),
      C.BCO_NAME -> Json.toJson(cuenta.bcoName),
      C.CUE_CODIGO_RPT -> Json.toJson(cuenta.codigoRpt),
      C.CUE_DESCRIP -> Json.toJson(cuenta.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_CUENTA), { user =>
      Ok(Json.toJson(Cuenta.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in cuentas.update")
    cuentaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cuenta => {
        Logger.debug(s"form: ${cuenta.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_CUENTA), { user =>
          Ok(
            Json.toJson(
              Cuenta.update(user,
                Cuenta(
                       id,
                       cuenta.name,
                       cuenta.code,
                       cuenta.identificacionExterna,
                       cuenta.active,
                       cuenta.monId,
                       cuenta.llevaCentroCosto,
                       cuenta.producto,
                       cuenta.esEfectivo,
                       cuenta.esTicket,
                       cuenta.cuecId,
                       cuenta.bcoId,
                       cuenta.codigoRpt,
                       cuenta.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in cuentas.create")
    cuentaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      cuenta => {
        Logger.debug(s"form: ${cuenta.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_CUENTA), { user =>
          Ok(
            Json.toJson(
              Cuenta.create(user,
                Cuenta(
                       cuenta.name,
                       cuenta.code,
                       cuenta.identificacionExterna,
                       cuenta.active,
                       cuenta.monId,
                       cuenta.llevaCentroCosto,
                       cuenta.producto,
                       cuenta.esEfectivo,
                       cuenta.esTicket,
                       cuenta.cuecId,
                       cuenta.bcoId,
                       cuenta.codigoRpt,
                       cuenta.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in cuentas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_CUENTA), { user =>
      Cuenta.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

  def info(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val info = Cuenta.info(user, id)
      Ok(
        Json.toJson(
          Json.obj(
            C.MON_ID -> Json.toJson(info.monId),
            C.EMP_ID -> Json.toJson(info.empId)
          )))
    })
  }

  def currency(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val info = Cuenta.currency(user, id)
      Ok(
        Json.toJson(
          Json.obj(
            C.MON_ID -> Json.toJson(info.monId),
            C.MON_NAME -> Json.toJson(info.monName)
          )))
    })
  }

}
