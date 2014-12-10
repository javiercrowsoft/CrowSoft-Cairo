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


case class ProductohelpconfigData(
              id: Option[Int],
              name: String,
              tecla: String,
              valorCode: String,
              atributoIndice: Int,
Int,
              default: Int,
              defaultSrv: Int,
              defaultPrp: Int,
              defaultPrns: Int,
              descrip: String
              )

object Productohelpconfigs extends Controller with ProvidesUser {

  val productohelpconfigForm = Form(
    mapping(
      "id" -> optional(number),
      C.PRHC_NAME -> nonEmptyText,
      C.PRHC_TECLA -> text,
      C.PRHC_VALOR_CODE -> text,
      C.PRHC_ATRIBUTO_INDICE -> number,
number,
      C.PRHC_DEFAULT -> number,
      C.PRHC_DEFAULT_SRV -> number,
      C.PRHC_DEFAULT_PRP -> number,
      C.PRHC_DEFAULT_PRNS -> number,
      C.PRHC_DESCRIP -> text
  )(ProductohelpconfigData.apply)(ProductohelpconfigData.unapply))

  implicit val productohelpconfigWrites = new Writes[Productohelpconfig] {
    def writes(productohelpconfig: Productohelpconfig) = Json.obj(
      "id" -> Json.toJson(productohelpconfig.id),
      C.PRHC_ID -> Json.toJson(productohelpconfig.id),
      C.PRHC_NAME -> Json.toJson(productohelpconfig.name),
      C.PRHC_TECLA -> Json.toJson(productohelpconfig.tecla),
      C.PRHC_VALOR_CODE -> Json.toJson(productohelpconfig.valorCode),
      C.PRHC_ATRIBUTO_INDICE -> Json.toJson(productohelpconfig.atributoIndice),
Json.toJson(productohelpconfig.atributoIndice),
      C.PRHC_DEFAULT -> Json.toJson(productohelpconfig.default),
      C.PRHC_DEFAULT_SRV -> Json.toJson(productohelpconfig.defaultSrv),
      C.PRHC_DEFAULT_PRP -> Json.toJson(productohelpconfig.defaultPrp),
      C.PRHC_DEFAULT_PRNS -> Json.toJson(productohelpconfig.defaultPrns),
      C.PRHC_DESCRIP -> Json.toJson(productohelpconfig.descrip)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_PRODUCTOHELPCONFIG), { user =>
      Ok(Json.toJson(Productohelpconfig.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in productohelpconfigs.update")
    productohelpconfigForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      productohelpconfig => {
        Logger.debug(s"form: ${productohelpconfig.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PRODUCTOHELPCONFIG), { user =>
          Ok(
            Json.toJson(
              Productohelpconfig.update(user,
                Productohelpconfig(
                       id,
                       productohelpconfig.name,
                       productohelpconfig.tecla,
                       productohelpconfig.valorCode,
                       productohelpconfig.atributoIndice,
                       productohelpconfig.default,
                       productohelpconfig.defaultSrv,
                       productohelpconfig.defaultPrp,
                       productohelpconfig.defaultPrns,
                       productohelpconfig.descrip
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in productohelpconfigs.create")
    productohelpconfigForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      productohelpconfig => {
        Logger.debug(s"form: ${productohelpconfig.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_PRODUCTOHELPCONFIG), { user =>
          Ok(
            Json.toJson(
              Productohelpconfig.create(user,
                Productohelpconfig(
                       productohelpconfig.name,
                       productohelpconfig.tecla,
                       productohelpconfig.valorCode,
                       productohelpconfig.atributoIndice,
                       productohelpconfig.default,
                       productohelpconfig.defaultSrv,
                       productohelpconfig.defaultPrp,
                       productohelpconfig.defaultPrns,
                       productohelpconfig.descrip
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in productohelpconfigs.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_PRODUCTOHELPCONFIG), { user =>
      Productohelpconfig.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
