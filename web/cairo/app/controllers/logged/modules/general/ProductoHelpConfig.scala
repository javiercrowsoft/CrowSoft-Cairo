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


case class ProductoHelpConfigData(
              id: Option[Int],
              name: String,
              tecla: String,
              valorCode: String,
              atributoIndice: Int,
              default: Int,
              defaultSrv: Int,
              defaultPrp: Int,
              defaultPrns: Int,
              descrip: String
              )

object ProductosHelpConfig extends Controller with ProvidesUser {

  val productoHelpConfigForm = Form(
    mapping(
      "id" -> optional(number),
      C.PRHC_NAME -> nonEmptyText,
      C.PRHC_TECLA -> text,
      C.PRHC_VALOR_CODE -> text,
      C.PRHC_ATRIBUTO_INDICE -> number,
      C.PRHC_DEFAULT -> number,
      C.PRHC_DEFAULT_SRV -> number,
      C.PRHC_DEFAULT_PRP -> number,
      C.PRHC_DEFAULT_PRNS -> number,
      C.PRHC_DESCRIP -> text
  )(ProductoHelpConfigData.apply)(ProductoHelpConfigData.unapply))

  implicit val productoHelpConfigWrites = new Writes[ProductoHelpConfig] {
    def writes(productoHelpConfig: ProductoHelpConfig) = Json.obj(
      "id" -> Json.toJson(productoHelpConfig.id),
      C.PRHC_ID -> Json.toJson(productoHelpConfig.id),
      C.PRHC_NAME -> Json.toJson(productoHelpConfig.name),
      C.PRHC_TECLA -> Json.toJson(productoHelpConfig.tecla),
      C.PRHC_VALOR_CODE -> Json.toJson(productoHelpConfig.valorCode),
      C.PRHC_ATRIBUTO_INDICE -> Json.toJson(productoHelpConfig.atributoIndice),
      C.PRHC_DEFAULT -> Json.toJson(productoHelpConfig.default),
      C.PRHC_DEFAULT_SRV -> Json.toJson(productoHelpConfig.defaultSrv),
      C.PRHC_DEFAULT_PRP -> Json.toJson(productoHelpConfig.defaultPrp),
      C.PRHC_DEFAULT_PRNS -> Json.toJson(productoHelpConfig.defaultPrns),
      C.PRHC_DESCRIP -> Json.toJson(productoHelpConfig.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PRODUCTO_HELP_CONFIG), { user =>
      Ok(Json.toJson(ProductoHelpConfig.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in ProductosHelpConfig.update")
    productoHelpConfigForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      productoHelpConfig => {
        Logger.debug(s"form: ${productoHelpConfig.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PRODUCTO_HELP_CONFIG), { user =>
          Ok(
            Json.toJson(
              ProductoHelpConfig.update(user,
                ProductoHelpConfig(
                       id,
                       productoHelpConfig.name,
                       productoHelpConfig.tecla,
                       productoHelpConfig.valorCode,
                       productoHelpConfig.atributoIndice,
                       productoHelpConfig.default,
                       productoHelpConfig.defaultSrv,
                       productoHelpConfig.defaultPrp,
                       productoHelpConfig.defaultPrns,
                       productoHelpConfig.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in ProductosHelpConfig.create")
    productoHelpConfigForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      productoHelpConfig => {
        Logger.debug(s"form: ${productoHelpConfig.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PRODUCTO_HELP_CONFIG), { user =>
          Ok(
            Json.toJson(
              ProductoHelpConfig.create(user,
                ProductoHelpConfig(
                       productoHelpConfig.name,
                       productoHelpConfig.tecla,
                       productoHelpConfig.valorCode,
                       productoHelpConfig.atributoIndice,
                       productoHelpConfig.default,
                       productoHelpConfig.defaultSrv,
                       productoHelpConfig.defaultPrp,
                       productoHelpConfig.defaultPrns,
                       productoHelpConfig.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in ProductosHelpConfig.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PRODUCTO_HELP_CONFIG), { user =>
      ProductoHelpConfig.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
