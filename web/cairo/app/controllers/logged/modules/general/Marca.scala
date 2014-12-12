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


case class MarcaData(
              id: Option[Int],
              name: String,
              code: String,
              active: Boolean,
              descrip: String,
              textoWeb: String
              )

object Marcas extends Controller with ProvidesUser {

  val marcaForm = Form(
    mapping(
      "id" -> optional(number),
      C.MARC_NAME -> nonEmptyText,
      C.MARC_CODE -> text,
      DBHelper.ACTIVE -> boolean,
      C.MARC_DESCRIP -> text,
      C.MARC_TEXTO_WEB -> text
  )(MarcaData.apply)(MarcaData.unapply))

  implicit val marcaWrites = new Writes[Marca] {
    def writes(marca: Marca) = Json.obj(
      "id" -> Json.toJson(marca.id),
      C.MARC_ID -> Json.toJson(marca.id),
      C.MARC_NAME -> Json.toJson(marca.name),
      C.MARC_CODE -> Json.toJson(marca.code),
      DBHelper.ACTIVE -> Json.toJson(marca.active),
      C.MARC_DESCRIP -> Json.toJson(marca.descrip),
      C.MARC_TEXTO_WEB -> Json.toJson(marca.textoWeb)
    )
  }

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_MARCA), { user =>
      Ok(Json.toJson(Marca.get(user, id)))
    })
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in marcas.update")
    marcaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      marca => {
        Logger.debug(s"form: ${marca.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_MARCA), { user =>
          Ok(
            Json.toJson(
              Marca.update(user,
                Marca(
                       id,
                       marca.name,
                       marca.code,
                       marca.active,
                       marca.descrip,
                       marca.textoWeb
                ))))
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in marcas.create")
    marcaForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      marca => {
        Logger.debug(s"form: ${marca.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_MARCA), { user =>
          Ok(
            Json.toJson(
              Marca.create(user,
                Marca(
                       marca.name,
                       marca.code,
                       marca.active,
                       marca.descrip,
                       marca.textoWeb
                ))))
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in marcas.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_MARCA), { user =>
      Marca.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

}
