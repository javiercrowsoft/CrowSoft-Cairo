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
import models.cairo.system.database.{DBHelper, Recordset}

case class RolUsuarioData(
                           usId: Int
                         )

case class RolItemsData(
                         roles: List[RolUsuarioData],
                         rolDeleted: String
                       )

case class RolData(
                    id: Option[Int],
                    name: String,
                    active: Boolean,
                    descrip: String,

                    items: RolItemsData
                  )

case class RolPermisoData (
                            id: Int,
                            permisos: List[RolPermisoItem],
                            usuarios: List[UsuarioItem]
                          )

object Roles extends Controller with ProvidesUser {

  val rolUsuarioFields = List(C.US_ID)
  val permisoFields = List(C.PRE_ID, C.PER_ID, C.GRANTED)
  val usuarioFields = List(C.US_ID, C.GRANTED)

  val rolForm = Form(
    mapping(
      "id" -> optional(number),
      C.ROL_NAME -> nonEmptyText,
      DBHelper.ACTIVE -> boolean,
      C.ROL_DESCRIP -> text,
      C.ROL_ITEMS -> mapping(
        C.USUARIO_ROL -> Forms.list[RolUsuarioData](
          mapping(
            C.US_ID -> number
          )(RolUsuarioData.apply)(RolUsuarioData.unapply)
        ),
        C.USUARIO_ROL_DELETED -> text
      )(RolItemsData.apply)(RolItemsData.unapply)
    )(RolData.apply)(RolData.unapply))

  implicit val rolWrites = new Writes[Rol] {
    def writes(rol: Rol) = Json.obj(
      "id" -> Json.toJson(rol.id),
      C.ROL_ID -> Json.toJson(rol.id),
      C.ROL_NAME -> Json.toJson(rol.name),
      DBHelper.ACTIVE -> Json.toJson(rol.active),
      C.ROL_DESCRIP -> Json.toJson(rol.descrip),

      // Items
      "usuarios" -> Json.toJson(writeRolUsuarios(rol.items.usuarios))
    )
    def rolUsuarioWrites(p: RolUsuario) = Json.obj(
      C.US_ID -> Json.toJson(p.usId),
      C.US_NAME -> Json.toJson(p.usName)
    )
    def writeRolUsuarios(items: List[RolUsuario]) = items.map(item => rolUsuarioWrites(item))
  }

  val permisosForm = Form(
    mapping(
      "id" -> number,
      C.PERMISO -> Forms.list[RolPermisoItem](
        mapping(
          C.PRE_ID -> number,
          C.PER_ID -> number,
          C.GRANTED -> boolean
        )(RolPermisoItem.apply)(RolPermisoItem.unapply)
      ),
      C.USUARIO_ROL -> Forms.list[UsuarioItem](
        mapping(
          C.US_ID -> number,
          C.GRANTED -> boolean
        )(UsuarioItem.apply)(UsuarioItem.unapply)
      )
    )(RolPermisoData.apply)(RolPermisoData.unapply))

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_ROL), { user =>
      Ok(Json.toJson(Rol.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a RolData structure
  //
  // because the limitation to 18 fields in case class used for FORM mapping we have grouped the fields
  // in Producto/Data, ProductoItem/Data, etc
  //
  // the below routines group a flat JSON and in some cases rename the name of the fields or move
  // fields to the parent node in the JSON structure to match the case class
  //

  def getJsValueAsMap(list: Map[String, JsValue]): Map[String, JsValue] = list.toList match {
    case (key: String, jsValue: JsValue) :: t => jsValue.as[Map[String, JsValue]]
    case _ => Map.empty
  }

  private def preprocessParams(implicit request:Request[AnyContent]): JsObject = {

    def preprocessUsuarioParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(rolUsuarioFields, "", params).toSeq)
    }

    def preprocessUsuariosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessUsuarioParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // group for rol
    //
    val rolBase = Global.preprocessFormParams(
      List(
        "id",
        C.ROL_NAME,
        DBHelper.ACTIVE,
        C.ROL_DESCRIP)
      , "", params)

    // usuarios
    //
    val usuariosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.USUARIO_ROL, params))
    val usuarioRows = Global.getParamsJsonRequestFor(C.ITEMS, usuariosInfo)
    val usuarioDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, usuariosInfo).toList match {
      case Nil => Map(C.USUARIO_ROL_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.USUARIO_ROL_DELETED -> Json.toJson(deletedList._2))
    }
    val rolUsuarios = usuarioRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessUsuariosParam(item, C.USUARIO_ROL)
      case _ => Map(C.USUARIO_ROL -> JsArray(List()))
    }

    val rolItems = Map(C.ROL_ITEMS -> JsObject((
      rolUsuarios ++ usuarioDeleted).toSeq
    ))

    JsObject(
      (rolBase ++ rolItems).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getUsuarios(usuarios: List[RolUsuarioData]): List[RolUsuario] = {
    usuarios.map(rol => {
      RolUsuario(
        rol.usId
      )
    })
  }

  def getRolItems(rol: RolItemsData): RolItems = {
    RolItems(
      getUsuarios(rol.roles),
      rol.rolDeleted
    )
  }

  def getRol(rol: RolData, id: Int): Rol = {
    Rol(
      id,
      rol.name,
      rol.active,
      rol.descrip,

      getRolItems(rol.items)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Roles.update")
    rolForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      rol => {
        Logger.debug(s"form: ${rol.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_ROL), { user =>
          Ok(
            Json.toJson(
              Rol.update(user,
                getRol(rol, id)
              )
            )
          )
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Roles.create")
    rolForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      rol => {
        Logger.debug(s"form: ${rol.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_ROL), { user =>
          Ok(
            Json.toJson(
              Rol.create(user,
                getRol(rol, DBHelper.NoId)
              )
            )
          )
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Roles.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_ROL), { user =>
      Rol.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

  def getPermissions(id: Int,
                     onlyGranted: Option[Boolean],
                     filter: Option[String]) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val requestedRol = Rol.get(user, id)
      Ok(Json.obj(
        C.ROL_ID -> requestedRol.id,
        C.ROL_NAME -> requestedRol.name,
        "permissions" -> Recordset.getAsJson(Rol.getPermissions(user, id, onlyGranted, filter)),
        "users" -> Recordset.getAsJson(Rol.getUsuarios(user, id))
      ))
    })
  }

  private def preprocessParamsPermissions(implicit request:Request[AnyContent]): JsObject = {

    def preprocessPermisosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessPermisoParam(_))))
      case _ => Map.empty
    }

    def preprocessPermisoParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(permisoFields, "", params).toSeq)
    }

    def preprocessUsuariosParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessUsuarioParam(_))))
      case _ => Map.empty
    }

    def preprocessUsuarioParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(usuarioFields, "", params).toSeq)
    }

    val params = Global.getParamsFromJsonRequest

    val permisoBase = Global.preprocessFormParams(List("id"), "", params)

    // permissions
    //
    val permisosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.PERMISO, params))
    val permisoRows = Global.getParamsJsonRequestFor(C.ITEMS, permisosInfo)
    val permisos = permisoRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessPermisosParam(item, C.PERMISO)
      case _ => Map(C.PERMISO -> JsArray(List()))
    }

    val usuariosInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.USUARIO_ROL, params))
    val usuarioRows = Global.getParamsJsonRequestFor(C.ITEMS, usuariosInfo)
    val usuarios = usuarioRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessUsuariosParam(item, C.USUARIO_ROL)
      case _ => Map(C.USUARIO_ROL -> JsArray(List()))
    }

    JsObject(
      (permisoBase ++ permisos ++ usuarios).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  def updatePermissions(id: Long) = PostAction { implicit request =>
    Logger.debug("in Roles.updatePermissions")
    permisosForm.bind(preprocessParamsPermissions).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      RolPermisoData => {
        Logger.debug(s"form: ${RolPermisoData.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PERMISO), { user =>
          Rol.updatePermissions(user, RolPermisoData.permisos, RolPermisoData.usuarios, RolPermisoData.id)
          // Backbonejs requires at least an empty json object in the response
          // if not it will call errorHandler even when we responded with 200 OK :P
          Ok(JsonUtil.emptyJson)
        })
      }
    )
  }
}