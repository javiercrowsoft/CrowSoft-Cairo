package models.cairo.modules.general

import java.sql.{CallableStatement, Connection, ResultSet, SQLException, Types}
import anorm.SqlParser._
import anorm._
import services.{DateUtil, PasswordHash}
import services.db.DB
import models.cairo.system.database.{DBHelper, Field, FieldType, Recordset, Register, SaveResult}
import play.api.Play.current
import models.domain.{Company, CompanyUser}
import models.master.User

import java.util.Date
import play.api.Logger
import play.api.libs.json._

import scala.util.control.NonFatal

case class UsuarioCliProv(
                           id: Int,
                           cliId: Int,
                           cliName: String,
                           provId: Int,
                           provName: String
                         )

object UsuarioCliProv {

  def apply(
             id: Int,
             cliId: Int,
             provId: Int) = {

    new UsuarioCliProv(
      id,
      cliId,
      "",
      provId,
      ""
    )
  }
}

case class EmpresaUsuario(
                           id: Int,
                           empId: Int,
                           empName: String
                         )
object EmpresaUsuario {

  def apply(
             id: Int,
             empId: Int
           ) = {

    new EmpresaUsuario(
      id,
      empId,
      ""
    )
  }
}

case class UsuarioRol(
                       rolId: Int,
                       rolName: String
                     )

object UsuarioRol {

  def apply(
             rolId: Int
           ) = {

    new UsuarioRol(
      rolId,
      ""
    )
  }
}

case class UsuarioItems(
                         cliProvs: List[UsuarioCliProv],
                         empresas: List[EmpresaUsuario],
                         roles: List[UsuarioRol],

                         /* only used in save */
                         cliProvDeleted: String,
                         rolDeleted: String
                       )

case class Usuario(
                    id: Int,
                    name: String,
                    active: Boolean,
                    password: String,

                    usDeposito: Boolean,
                    externo: Boolean,
                    empXDpto: Boolean,
                    empresaEx: Boolean,

                    prsId: Int,
                    prsName: String,
                    sucId: Int,
                    sucName: String,

                    descrip: String,

                    items: UsuarioItems,

                    createdAt: Date,
                    updatedAt: Date,
                    updatedBy: Int) {

  def this(
            id: Int,
            name: String,
            active: Boolean,
            password: String,

            usDeposito: Boolean,
            externo: Boolean,
            empXDpto: Boolean,
            empresaEx: Boolean,

            prsId: Int,
            prsName: String,
            sucId: Int,
            sucName: String,

            descrip: String,

            items: UsuarioItems) = {

    this(
      id,
      name,
      active,
      password,
      usDeposito,
      externo,
      empXDpto,
      empresaEx,
      prsId,
      prsName,
      sucId,
      sucName,

      descrip,

      items,

      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
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

            items: UsuarioItems) = {

    this(
      DBHelper.NoId,
      name,
      active,
      password,

      usDeposito,
      externo,
      empXDpto,
      empresaEx,

      prsId,
      "",
      sucId,
      "",

      descrip,

      items)
  }

}

case class UsuarioPermisoItem(
                        preId: Int,
                        perId: Int,
                        granted: Boolean
                      )

case class RolItem(
                     rolId: Int,
                     granted: Boolean
                   )

object Usuario {

  lazy val emptyUsuarioItems = UsuarioItems(
    List(), List(), List(), "", ""
  )

  lazy val emptyUsuario = Usuario(
    "",
    false,
    "",
    false,
    false,
    false,
    false,
    DBHelper.NoId,
    DBHelper.NoId,
    "",
    emptyUsuarioItems)

  def apply(
             id: Int,
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

             items: UsuarioItems) = {

    new Usuario(
      id,
      name,
      active,
      password,

      usDeposito,
      externo,
      empXDpto,
      empresaEx,

      prsId,
      "",
      sucId,
      "",

      descrip,

      items)
  }

  def apply(
             id: Int,
             name: String,
             active: Boolean,
             password: String,

             usDeposito: Boolean,
             externo: Boolean,
             empXDpto: Boolean,
             empresaEx: Boolean,

             prsId: Int,
             prsName: String,
             sucId: Int,
             sucName: String,

             descrip: String,

             items: UsuarioItems) = {

    new Usuario(
      id,
      name,
      active,
      password,

      usDeposito,
      externo,
      empXDpto,
      empresaEx,

      prsId,
      prsName,
      sucId,
      sucName,

      descrip,

      items)
  }

  def apply(
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

             items: UsuarioItems) = {

    new Usuario(
      name,
      active,
      password,

      usDeposito,
      externo,
      empXDpto,
      empresaEx,

      prsId,
      sucId,

      descrip,

      items)
  }

  private val usuarioParser: RowParser[Usuario] = {
    SqlParser.get[Int](C.US_ID) ~
    SqlParser.get[String](C.US_NAME) ~
    SqlParser.get[Int](DBHelper.ACTIVE) ~
    SqlParser.get[Int](C.US_DEPOSITO) ~
    SqlParser.get[Int](C.US_EXTERNO) ~
    SqlParser.get[Int](C.US_EMP_X_DPTO) ~
    SqlParser.get[Int](C.US_EMPRESA_EX) ~
    SqlParser.get[Option[Int]](C.PRS_ID) ~
    SqlParser.get[Option[String]](C.PRS_NAME) ~
    SqlParser.get[Option[Int]](C.SUC_ID) ~
    SqlParser.get[Option[String]](C.SUC_NAME) ~
    SqlParser.get[String](C.US_DESCRIP) ~
    SqlParser.get[Date](DBHelper.CREATED_AT) ~
    SqlParser.get[Date](DBHelper.UPDATED_AT) ~
    SqlParser.get[Int](DBHelper.UPDATED_BY) map {
    case
        id ~
        name ~
        active  ~
        deposito ~
        externo ~
        empXDpto ~
        empresaEx ~
        prsId ~
        prsName ~
        sucId ~
        sucName ~
        descrip ~
        createdAt ~
        updatedAt ~
        updatedBy =>
      Usuario(
        id,
        name,
        active != 0,
        "", /* password is never read */
        deposito != 0,
        externo != 0,
        empXDpto != 0,
        empresaEx != 0,
        prsId.getOrElse(DBHelper.NoId),
        prsName.getOrElse(""),
        sucId.getOrElse(DBHelper.NoId),
        sucName.getOrElse(""),
        descrip,
        emptyUsuarioItems,
        createdAt,
        updatedAt,
        updatedBy)
    }
  }

  private val usuarioCliProvParser: RowParser[UsuarioCliProv] = {
    SqlParser.get[Int](C.US_EMP_ID) ~
    SqlParser.get[Option[Int]](C.CLI_ID) ~
    SqlParser.get[Option[String]](C.CLI_NAME) ~
    SqlParser.get[Option[Int]](C.PROV_ID) ~
    SqlParser.get[Option[String]](C.PROV_NAME) map {
    case
        id ~
        cliId ~
        cliName ~
        provId ~
        provName =>
      UsuarioCliProv(
        id,
        cliId.getOrElse(DBHelper.NoId),
        cliName.getOrElse(""),
        provId.getOrElse(DBHelper.NoId),
        provName.getOrElse("")
      )
    }
  }

  private val empresaUsuarioParser: RowParser[EmpresaUsuario] = {
    SqlParser.get[Option[Int]](C.EMP_US_ID) ~
    SqlParser.get[Int](C.EMP_ID) ~
    SqlParser.get[String](C.EMP_NAME) map {
    case
        id ~
        empId ~
        empName =>
      EmpresaUsuario(
        id.getOrElse(DBHelper.NoId),
        empId,
        empName
      )
    }
  }

  private val usuarioRolParser: RowParser[UsuarioRol] = {
    SqlParser.get[Int](C.ROL_ID) ~
    SqlParser.get[String](C.ROL_NAME) map {
    case
        rolId ~
        rolName =>
      UsuarioRol(
        rolId,
        rolName
      )
    }
  }

  def create(user: CompanyUser, usuario: Usuario): Usuario = {
    save(user, usuario, true)
  }

  def update(user: CompanyUser, usuario: Usuario): Usuario = {
    save(user, usuario, false)
  }

  private def save(user: CompanyUser, usuario: Usuario, isNew: Boolean): Usuario = {
    def getFields = {
      List(
        Field(C.US_NAME, usuario.name, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(usuario.active), FieldType.boolean),

        /* TODO: save password */

        Field(C.US_DEPOSITO, Register.boolToInt(usuario.usDeposito), FieldType.boolean),
        Field(C.US_EXTERNO, Register.boolToInt(usuario.externo), FieldType.boolean),
        Field(C.US_EMP_X_DPTO, Register.boolToInt(usuario.empXDpto), FieldType.boolean),
        Field(C.US_EMPRESA_EX, Register.boolToInt(usuario.empresaEx), FieldType.boolean),

        Field(C.PRS_ID, usuario.prsId, FieldType.id),
        Field(C.SUC_ID, usuario.sucId, FieldType.id),
        Field(C.US_DESCRIP, usuario.descrip, FieldType.text)
      )
    }

    def getCliProvFields(cliProv: UsuarioCliProv, usId: Int) = {
      List(
        Field(C.US_ID, usId, FieldType.id),
        Field(C.CLI_ID, cliProv.cliId, FieldType.id),
        Field(C.PROV_ID, cliProv.provId, FieldType.id)
      )
    }

    def getEmpresaFields(empresa: EmpresaUsuario, usId: Int) = {
      List(
        Field(C.US_ID, usId, FieldType.id),
        Field(C.EMP_ID, empresa.empId, FieldType.id)
      )
    }

    def getRolFields(rol: UsuarioRol, usId: Int) = {
      List(
        Field(C.US_ID, usId, FieldType.id),
        Field(C.ROL_ID, rol.rolId, FieldType.id)
      )
    }

    def throwError = {
      throwException(s"Error when saving ${C.USUARIO}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    case class UsuarioCliProvInfo(usId: Int, item: UsuarioCliProv)

    def saveCliProv(itemInfo: UsuarioCliProvInfo) = {
      DBHelper.save(
        user,
        Register(
          C.USUARIO_EMPRESA,
          C.US_EMP_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getCliProvFields(itemInfo.item, itemInfo.usId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }
    
    def saveCliProvs(usId: Int) = {
      DBHelper.deleteItems(user, C.USUARIO_EMPRESA, C.US_EMP_ID, usuario.items.cliProvDeleted, s" AND us_id = ${usId}")
      usuario.items.cliProvs.map(cliProv => saveCliProv(UsuarioCliProvInfo(usId, cliProv)))
    }

    case class EmpresaUsuarioInfo(usId: Int, item: EmpresaUsuario)

    def saveEmpresa(itemInfo: EmpresaUsuarioInfo) = {
      DBHelper.save(
        user,
        Register(
          C.EMPRESA_USUARIO,
          C.EMP_US_ID,
          itemInfo.item.id,
          false,
          true,
          true,
          getEmpresaFields(itemInfo.item, itemInfo.usId)),
        itemInfo.item.id == DBHelper.NewId
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveEmpresas(usId: Int) = {
      DBHelper.deleteItems(user, C.EMPRESA_USUARIO, C.US_ID, usId.toString, "")
      usuario.items.empresas.map(empresa => saveEmpresa(EmpresaUsuarioInfo(usId, empresa)))
    }

    case class UsuarioRolInfo(usId: Int, item: UsuarioRol)

    def saveRol(itemInfo: UsuarioRolInfo) = {
      DBHelper.save(
        user,
        Register(
          C.USUARIO_ROL,
          "",
          DBHelper.NoId,
          false,
          true,
          true,
          getRolFields(itemInfo.item, itemInfo.usId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveRoles(usId: Int) = {
      DBHelper.deleteItems(user, C.USUARIO_ROL, C.ROL_ID, usuario.items.rolDeleted, s" AND us_id = ${usId}")
      val roles = loadRoles(user, usId)
      usuario.items.roles.filter(rol => ! roles.exists(r => r.rolId == rol.rolId)).map(rol => saveRol(UsuarioRolInfo(usId, rol)))
    }

    def getUserNameFromDomain = {
      val userEmail = user.masterUser.email
      val domain = userEmail.substring(userEmail.indexOf("@"))
      usuario.name.replace(" ", "_").toLowerCase + domain
    }

    val masterUser = if(usuario.id != DBHelper.NoId) User.load(usuario.id) else None

    val masterUserId: Int = masterUser match {
      case Some(user) => {
        val userNameWithDomain = getUserNameFromDomain
        if(user.username != userNameWithDomain) {
          User.update(
            usuario.id,
            userNameWithDomain,
            userNameWithDomain
          )
        }
        if(! usuario.password.isEmpty) {
          User.updatePassword(usuario.id, usuario.password)
        }
        usuario.id
      }
      case None => {

        // must be a new Usuario
        //
        if(! isNew) throwException(s"Error when saving ${C.USUARIO}. Cant't find a master user for user ${usuario.name}")

        val userName = getUserNameFromDomain
        val emailAddress = userName
        val password = PasswordHash.createHash(usuario.password)
        val code = PasswordHash.createCode(usuario.password)
        User.save(
          User(
            NotAssigned,
            userName,
            emailAddress,
            password,
            code,
            usuario.active,
            false,
            "",
            "",
            "",
            "",
            false,
            null,
            null
          )
        )
      }
    }

    def saveCompanyUser(usId: Int, empId: Int) = {
      CompanyUser.findByCompanyAndUser(user.masterUser, empId, usId) match {
        case None => {
          //
          // we validate that the empId has a coId in the domain database
          //
          val coId = Company.load(user.masterUser, empId)
            .getOrElse(throwException(s"Error when saving ${C.USUARIO}. Cant't find a company for empId $empId"))
            .id.getOrElse(DBHelper.NoId)
          CompanyUser.save(user.masterUser, coId, usId)
        }
        case _ => // nothing to do
      }
    }

    def saveCompaniesUser(usId: Int) = {
      Logger.debug(user.database.toString)
      CompanyUser.removeUser(user, usId)
      if(usuario.active) {
        usuario.items.empresas.map(empresa => saveCompanyUser(usId, empresa.empId))
      }
    }

    // TODO: this has to be in a transaction so we need to create a new method saveEx which receives a connection
    //       and DBHelper.saveEx must check if this connection parameter is null use the existing code, but if not is
    //       null use the parameter connection

    DBHelper.saveEx(
      user,
      Register(
        C.USUARIO,
        C.US_ID,
        masterUserId,
        false,
        true,
        true,
        getFields),
      isNew,
      ""
    ) match {
      case SaveResult(true, id) => {
        saveCliProvs(id)
        saveEmpresas(id)
        saveRoles(id)
        saveCompaniesUser(id)
        load(user, id).getOrElse(throwError)
      }
      case SaveResult(false, id) => throwError
    }
  }

  def load(user: CompanyUser, id: Int): Option[Usuario] = {
    loadWhere(user, s"${C.US_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.PRS_NAME}, t3.${C.SUC_NAME} FROM ${C.USUARIO} t1 LEFT JOIN ${C.PERSONA} t2 ON t1.${C.PRS_ID} = t2.${C.PRS_ID} LEFT JOIN ${C.SUCURSAL} t3 ON t1.${C.SUC_ID} = t3.${C.SUC_ID} WHERE $where")
        .on(args: _*)
        .as(usuarioParser.singleOpt)
    }
  }

  private def loadUsuarioItems(user: CompanyUser, id: Int) = {
    UsuarioItems(
      loadCliProvs(user, id),
      loadEmpresas(user, id),
      loadRoles(user, id),
      "", "")
  }

  private def loadCliProvs(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.CLI_NAME}, t3.${C.PROV_NAME} FROM ${C.USUARIO_EMPRESA} t1 LEFT JOIN ${C.CLIENTE} t2 ON t1.${C.CLI_ID} = t2.${C.CLI_ID} LEFT JOIN ${C.PROVEEDOR} t3 ON t1.${C.PROV_ID} = t3.${C.PROV_ID} WHERE t1.${C.US_ID} = {id}")
        .on('id -> id)
        .as(usuarioCliProvParser.*)
    }
  }

  private def loadEmpresas(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.${C.EMP_US_ID}, t2.${C.EMP_ID}, t2.${C.EMP_NAME} FROM ${C.EMPRESA} t2 LEFT JOIN ${C.EMPRESA_USUARIO} t1 ON t1.${C.EMP_ID} = t2.${C.EMP_ID} AND t1.${C.US_ID} = {id} ORDER BY ${C.EMP_NAME}")
        .on('id -> id)
        .as(empresaUsuarioParser.*)
    }
  }

  private def loadRoles(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.ROL_NAME} FROM ${C.USUARIO_ROL} t1 INNER JOIN ${C.ROL} t2 ON t1.${C.ROL_ID} = t2.${C.ROL_ID} WHERE t1.${C.US_ID} = {id} ORDER BY ${C.ROL_NAME}")
        .on('id -> id)
        .as(usuarioRolParser.*)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.USUARIO} WHERE ${C.US_ID} = {id}")
          .on('id -> id)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.USUARIO}. ${C.US_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Usuario = {
    val p = load(user, id).getOrElse(emptyUsuario)

    Usuario(
      p.id,
      p.name,
      p.active,
      p.password, // password is always empty
      p.usDeposito,
      p.externo,
      p.empXDpto,
      p.empresaEx,

      p.prsId,
      p.prsName,
      p.sucId,
      p.sucName,

      p.descrip,

      loadUsuarioItems(user, id)
    )
  }

  def getPermissions(user: CompanyUser, id: Int,
                     onlyGranted: Option[Boolean],
                     onlyDirect: Option[Boolean],
                     onlyInherited: Option[Boolean],
                     filter: Option[String]): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_user_get_permissions(?, ?, ?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, Register.boolToInt(onlyGranted.getOrElse(false)))
      cs.setInt(4, Register.boolToInt(onlyDirect.getOrElse(false)))
      cs.setInt(5, Register.boolToInt(onlyInherited.getOrElse(false)))
      cs.setString(6, filter.getOrElse(""))
      cs.registerOutParameter(7, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(7).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get permissions for user id $id and current user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def getRoles(user: CompanyUser, id: Int): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "select r.rol_id, rol_nombre, case when u.us_id is not null then 1 else 0 end as granted " +
                "from Rol r " +
                "left join UsuarioRol u on r.rol_id = u.rol_id " +
                "and u.us_id = ? " +
                "order by rol_nombre"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)

      try {
        val rs = cs.executeQuery()
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get roles for user id $id and current user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def updatePermission(user: CompanyUser, usId: Int)(permiso: UsuarioPermisoItem) = {
    Logger.info(s"update permiso $permiso for user $usId")
    if(permiso.granted) createPermission(user, usId, permiso)
    else deletePermission(user, permiso.perId)
  }

  def updateRole(user: CompanyUser, usId: Int)(rol: RolItem) = {
    Logger.info(s"update rol $rol for user $usId")
    if(rol.granted) createRole(user, usId, rol)
    else deleteRole(user, rol.rolId, usId)
  }

  def deletePermission(user: CompanyUser, id: Int) = {
    Logger.info(s"remove permiso per_id: $id")
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.PERMISO} WHERE ${C.PER_ID} = {id}")
          .on('id -> id)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.PERMISO}. ${C.PER_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def deleteRole(user: CompanyUser, rolId: Int, usId: Int) = {
    Logger.info(s"remove usuario rol rol_id: $rolId for user_id: $usId")
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.USUARIO_ROL} WHERE ${C.ROL_ID} = {rolId} AND ${C.US_ID} = {usId}")
          .on('rolId -> rolId, 'usId -> usId)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.USUARIO_ROL}. ${C.ROL_ID} id: $rolId for id: ${usId}. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def createPermission(user: CompanyUser, usId: Int, permiso: UsuarioPermisoItem) = {
    Logger.info(s"create permiso $permiso for user $usId")
    def getFields = {
      List(
        Field(C.PRE_ID, permiso.preId, FieldType.id),
        Field(C.US_ID, usId, FieldType.id)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.PERMISO}")
    }

    DBHelper.save(
      user,
      Register(
        C.PERMISO,
        C.PER_ID,
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, _) =>
      case SaveResult(false, _) => throwException
    }
  }
  def createRole(user: CompanyUser, usId: Int, rol: RolItem) = {
    Logger.info(s"add rol $rol to user $usId")
    def getFields = {
      List(
        Field(C.ROL_ID, rol.rolId, FieldType.id),
        Field(C.US_ID, usId, FieldType.id)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.USUARIO_ROL}")
    }

    DBHelper.save(
      user,
      Register(
        C.USUARIO_ROL,
        "",
        DBHelper.NoId,
        false,
        true,
        true,
        getFields),
      true
    ) match {
      case SaveResult(true, _) =>
      case SaveResult(false, _) => throwException
    }
  }

  def updateSysModulo(user: CompanyUser, usId: Int) = {
    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_sys_module_get_ex(?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, usId)

      try {
        cs.execute()
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get update sysModulo for user id $usId and current user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def updatePermissions(user: CompanyUser,
                        permissions: List[UsuarioPermisoItem],
                        roles: List[RolItem],
                        usId: Int): Unit = {
    Logger.info(s"updatePermissions: permissions: ${permissions.size} - roles: ${roles.size}")
    permissions.foreach(updatePermission(user, usId))
    roles.foreach(updateRole(user, usId))
    if(! permissions.isEmpty || ! roles.isEmpty) updateSysModulo(user, usId)
  }
}