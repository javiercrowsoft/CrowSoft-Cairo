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

case class UsuarioCliProvData(
                               id: Int,
                               cliId: Int,
                               provId: Int
                             )

case class EmpresaUsuarioData(
                               empId: Int
                             )

case class UsuarioRolData(
                           rolId: Int
                         )

case class UsuarioItemsData(
                             cliProvs: List[UsuarioCliProvData],
                             empresas: List[EmpresaUsuarioData],
                             roles: List[UsuarioRolData],

                             cliProvDeleted: String,
                             rolDeleted: String
                           )

case class UsuarioData(
                        id: Option[Int],
                        name: String,
                        active: Boolean,
                        password: String,
                        usDeposito: Boolean,
                        externo: Boolean,
                        empXDpto: Boolean,
                        empresaEx: Boolean,
                        prsId: Int,
                        sucId: Int,
                        descrip: String,

                        items: UsuarioItemsData
                      )

case class UsuarioPermisoData (
                                id: Int,
                                permisos: List[UsuarioPermisoItem],
                                roles: List[RolItem]
                              )

object Usuarios extends Controller with ProvidesUser {

  val usuarioCliProvFields = List(C.US_EMP_ID, C.CLI_ID, C.PROV_ID)
  val usuarioEmpresaFields = List(C.EMP_ID)
  val usuarioRolFields = List(C.ROL_ID)
  val permisoFields = List(C.PRE_ID, C.PER_ID, C.GRANTED)
  val rolFields = List(C.ROL_ID, C.GRANTED)

  val usuarioForm = Form(
    mapping(
      "id" -> optional(number),
      C.US_NAME -> nonEmptyText,
      DBHelper.ACTIVE -> boolean,
      C.US_PASSWORD -> text,
      C.US_DEPOSITO -> boolean,
      C.US_EXTERNO -> boolean,
      C.US_EMP_X_DPTO -> boolean,
      C.US_EMPRESA_EX -> boolean,
      C.PRS_ID -> number,
      C.SUC_ID -> number,
      C.US_DESCRIP -> text,
      C.USUARIO_ITEMS -> mapping(
        C.USUARIO_EMPRESA -> Forms.list[UsuarioCliProvData](
          mapping(
            C.US_EMP_ID -> number,
            C.CLI_ID -> number,
            C.PROV_ID -> number
          )(UsuarioCliProvData.apply)(UsuarioCliProvData.unapply)
        ),
        C.EMPRESA_USUARIO -> Forms.list[EmpresaUsuarioData] (
          mapping(
            C.EMP_ID -> number
          )(EmpresaUsuarioData.apply)(EmpresaUsuarioData.unapply)
        ),
        C.USUARIO_ROL -> Forms.list[UsuarioRolData](
          mapping(
            C.ROL_ID -> number
          )(UsuarioRolData.apply)(UsuarioRolData.unapply)
        ),
        C.USUARIO_EMPRESA_DELETED -> text,
        C.USUARIO_ROL_DELETED -> text
      )(UsuarioItemsData.apply)(UsuarioItemsData.unapply)
    )(UsuarioData.apply)(UsuarioData.unapply))

  implicit val usuarioWrites = new Writes[Usuario] {
    def writes(usuario: Usuario) = Json.obj(
      "id" -> Json.toJson(usuario.id),
      C.US_ID -> Json.toJson(usuario.id),
      C.US_NAME -> Json.toJson(usuario.name),
      DBHelper.ACTIVE -> Json.toJson(usuario.active),
      C.US_DEPOSITO -> Json.toJson(usuario.usDeposito),
      C.US_EXTERNO -> Json.toJson(usuario.externo),
      C.US_EMP_X_DPTO -> Json.toJson(usuario.empXDpto),
      C.US_EMPRESA_EX -> Json.toJson(usuario.empresaEx),
      C.PRS_ID -> Json.toJson(usuario.prsId),
      C.PRS_NAME -> Json.toJson(usuario.prsName),
      C.SUC_ID -> Json.toJson(usuario.sucId),
      C.SUC_NAME -> Json.toJson(usuario.sucName),
      C.US_DESCRIP -> Json.toJson(usuario.descrip),

      // Items
      "cliProv" -> Json.toJson(writeUsuarioCliProvs(usuario.items.cliProvs)),
      "empresas" -> Json.toJson(writeUsuarioEmpresas(usuario.items.empresas)),
      "roles" -> Json.toJson(writeUsuarioRoles(usuario.items.roles))
    )
    def usuarioCliProvWrites(p: UsuarioCliProv) = Json.obj(
      C.US_EMP_ID -> Json.toJson(p.id),
      C.CLI_ID -> Json.toJson(p.cliId),
      C.CLI_NAME -> Json.toJson(p.cliName),
      C.PROV_ID -> Json.toJson(p.provId),
      C.PROV_NAME -> Json.toJson(p.provName)
    )
    def usuarioEmpresaWrites(p: EmpresaUsuario) = Json.obj(
      C.EMP_US_ID -> Json.toJson(p.id),
      C.EMP_ID -> Json.toJson(p.empId),
      C.EMP_NAME -> Json.toJson(p.empName)
    )
    def usuarioRolWrites(p: UsuarioRol) = Json.obj(
      C.ROL_ID -> Json.toJson(p.rolId),
      C.ROL_NAME -> Json.toJson(p.rolName)
    )
    def writeUsuarioCliProvs(items: List[UsuarioCliProv]) = items.map(item => usuarioCliProvWrites(item))
    def writeUsuarioEmpresas(items: List[EmpresaUsuario]) = items.map(item => usuarioEmpresaWrites(item))
    def writeUsuarioRoles(items: List[UsuarioRol]) = items.map(item => usuarioRolWrites(item))
  }

  val permisosForm = Form(
    mapping(
      "id" -> number,
      C.PERMISO -> Forms.list[UsuarioPermisoItem](
        mapping(
          C.PRE_ID -> number,
          C.PER_ID -> number,
          C.GRANTED -> boolean
        )(UsuarioPermisoItem.apply)(UsuarioPermisoItem.unapply)
      ),
      C.USUARIO_ROL -> Forms.list[RolItem](
        mapping(
          C.ROL_ID -> number,
          C.GRANTED -> boolean
        )(RolItem.apply)(RolItem.unapply)
      )
    )(UsuarioPermisoData.apply)(UsuarioPermisoData.unapply))

  def get(id: Int) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.LIST_USUARIO), { user =>
      Ok(Json.toJson(Usuario.get(user, id)))
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // this functions convert the plain JSON received in CREATE and UPDATE into a UsuarioData structure
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

    def preprocessCliProvParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(usuarioCliProvFields, "", params).toSeq)
    }

    def preprocessEmpresaParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(usuarioEmpresaFields, "", params).toSeq)
    }

    def preprocessRolParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(usuarioRolFields, "", params).toSeq)
    }

    def preprocessCliProvsParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessCliProvParam(_))))
      case _ => Map.empty
    }

    def preprocessEmpresasParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessEmpresaParam(_))))
      case _ => Map.empty
    }

    def preprocessRolesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessRolParam(_))))
      case _ => Map.empty
    }

    val params = Global.getParamsFromJsonRequest

    // group for usuario
    //
    val usuarioBase = Global.preprocessFormParams(
      List(
        "id",
        C.US_NAME,
        DBHelper.ACTIVE,
        C.US_PASSWORD,

        C.US_DEPOSITO,
        C.US_EXTERNO,
        C.US_EMP_X_DPTO,
        C.US_EMPRESA_EX,

        C.PRS_ID,
        C.SUC_ID,
        C.US_DESCRIP)
      , "", params)

    // cliente proveedor
    //
    val cliProvsInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.USUARIO_EMPRESA, params))
    val cliProvRows = Global.getParamsJsonRequestFor(C.ITEMS, cliProvsInfo)
    val cliProvDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, cliProvsInfo).toList match {
      case Nil => Map(C.USUARIO_EMPRESA_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.USUARIO_EMPRESA_DELETED -> Json.toJson(deletedList._2))
    }
    val usuarioCliProvs = cliProvRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessCliProvsParam(item, C.USUARIO_EMPRESA)
      case _ => Map(C.USUARIO_EMPRESA -> JsArray(List()))
    }

    // empresas
    //
    val empresasInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.EMPRESA_USUARIO, params))
    val empresaRows = Global.getParamsJsonRequestFor(C.ITEMS, empresasInfo)
    val usuarioEmpresas = empresaRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessEmpresasParam(item, C.EMPRESA_USUARIO)
      case _ => Map(C.EMPRESA_USUARIO -> JsArray(List()))
    }

    // roles
    //
    val rolesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.USUARIO_ROL, params))
    val rolRows = Global.getParamsJsonRequestFor(C.ITEMS, rolesInfo)
    val rolDeleted: Map[String, JsValue] = Global.getParamsJsonRequestFor(C.DELETED_LIST, rolesInfo).toList match {
      case Nil => Map(C.USUARIO_ROL_DELETED -> Json.toJson(""))
      case deletedList :: t => Map(C.USUARIO_ROL_DELETED -> Json.toJson(deletedList._2))
    }
    val usuarioRoles = rolRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessRolesParam(item, C.USUARIO_ROL)
      case _ => Map(C.USUARIO_ROL -> JsArray(List()))
    }

    val usuarioItems = Map(C.USUARIO_ITEMS -> JsObject((
           usuarioCliProvs ++ cliProvDeleted ++ usuarioEmpresas ++ usuarioRoles ++ rolDeleted).toSeq
    ))

    JsObject(
      (usuarioBase ++ usuarioItems).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  def getCliProvs(cliProvs: List[UsuarioCliProvData]): List[UsuarioCliProv] = {
    cliProvs.map(cliProv => {
      UsuarioCliProv(
        cliProv.id,
        cliProv.cliId,
        cliProv.provId
      )
    })
  }

  def getEmpresas(empresas: List[EmpresaUsuarioData]): List[EmpresaUsuario] = {
    empresas.map(empresa => {
      EmpresaUsuario(
        DBHelper.NewId,
        empresa.empId
      )
    })
  }

  def getRoles(roles: List[UsuarioRolData]): List[UsuarioRol] = {
    roles.map(rol => {
      UsuarioRol(
        rol.rolId
      )
    })
  }

  def getUsuarioItems(usuario: UsuarioItemsData): UsuarioItems = {
    UsuarioItems(
      getCliProvs(usuario.cliProvs),
      getEmpresas(usuario.empresas),
      getRoles(usuario.roles),
      usuario.cliProvDeleted,
      usuario.rolDeleted
    )
  }

  def getUsuario(usuario: UsuarioData, id: Int): Usuario = {
    Usuario(
      id,
      usuario.name,
      usuario.active,
      usuario.password,

      usuario.usDeposito,
      usuario.externo,
      usuario.empXDpto,
      usuario.empresaEx,

      usuario.prsId,
      usuario.sucId,

      usuario.descrip,

      getUsuarioItems(usuario.items)
    )
  }

  def update(id: Int) = PostAction { implicit request =>
    Logger.debug("in Usuarios.update")
    usuarioForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      usuario => {
        Logger.debug(s"form: ${usuario.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_USUARIO), { user =>
          Ok(
            Json.toJson(
              Usuario.update(user,
                getUsuario(usuario, id)
              )
            )
          )
        })
      }
    )
  }

  def create = PostAction { implicit request =>
    Logger.debug("in Usuarios.create")
    usuarioForm.bind(preprocessParams).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      usuario => {
        Logger.debug(s"form: ${usuario.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.NEW_USUARIO), { user =>
          Ok(
            Json.toJson(
              Usuario.create(user,
                getUsuario(usuario, DBHelper.NoId)
              )
            )
          )
        })
      }
    )
  }

  def delete(id: Int) = PostAction { implicit request =>
    Logger.debug("in Usuarios.delete")
    LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.DELETE_USUARIO), { user =>
      Usuario.delete(user, id)
      // Backbonejs requires at least an empty json object in the response
      // if not it will call errorHandler even when we responded with 200 OK :P
      Ok(JsonUtil.emptyJson)
    })
  }

  def getPermissions(id: Int,
                     onlyGranted: Option[Boolean],
                     onlyDirect: Option[Boolean],
                     onlyInherited: Option[Boolean],
                     filter: Option[String]) = GetAction { implicit request =>
    LoggedIntoCompanyResponse.getAction(request, { user =>
      val requestedUser = Usuario.get(user, id)
      Ok(Json.obj(
          C.US_ID -> requestedUser.id,
          C.US_NAME -> requestedUser.name,
          "permissions" -> Recordset.getAsJson(Usuario.getPermissions(user, id, onlyGranted, onlyDirect, onlyInherited, filter)),
          "roles" -> Recordset.getAsJson(Usuario.getRoles(user, id))
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

    def preprocessRolesParam(items: JsValue, group: String): Map[String, JsValue] = items match {
      case JsArray(arr) => Map(group -> JsArray(arr.map(preprocessRoleParam(_))))
      case _ => Map.empty
    }

    def preprocessRoleParam(field: JsValue) = {
      val params = field.as[Map[String, JsValue]]
      JsObject(Global.preprocessFormParams(rolFields, "", params).toSeq)
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

    val rolesInfo = getJsValueAsMap(Global.getParamsJsonRequestFor(C.USUARIO_ROL, params))
    val rolRows = Global.getParamsJsonRequestFor(C.ITEMS, rolesInfo)
    val roles = rolRows.toList match {
      case (_: String, item: JsValue) :: _ => preprocessRolesParam(item, C.USUARIO_ROL)
      case _ => Map(C.USUARIO_ROL -> JsArray(List()))
    }

    JsObject(
      (permisoBase ++ permisos ++ roles).toSeq)
  }
  //
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  def updatePermissions(id: Long) = PostAction { implicit request =>
    Logger.debug("in Usuarios.updatePermissions")
    permisosForm.bind(preprocessParamsPermissions).fold(
      formWithErrors => {
        Logger.debug(s"invalid form: ${formWithErrors.toString}")
        BadRequest
      },
      UsuarioPermisoData => {
        Logger.debug(s"form: ${UsuarioPermisoData.toString}")
        LoggedIntoCompanyResponse.getAction(request, CairoSecurity.hasPermissionTo(S.EDIT_PERMISO), { user =>
          Usuario.updatePermissions(user, UsuarioPermisoData.permisos, UsuarioPermisoData.roles, UsuarioPermisoData.id)
          // Backbonejs requires at least an empty json object in the response
          // if not it will call errorHandler even when we responded with 200 OK :P
          Ok(JsonUtil.emptyJson)
        })
      }
    )
  }
}