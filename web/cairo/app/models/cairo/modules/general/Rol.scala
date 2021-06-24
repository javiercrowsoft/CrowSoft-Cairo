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

case class RolUsuario(
                       usId: Int,
                       usName: String
                     )

object RolUsuario {

  def apply(
             usId: Int
           ) = {

    new RolUsuario(
      usId,
      ""
    )
  }
}

case class RolItems(
                     usuarios: List[RolUsuario],

                     /* only used in save */
                     usuarioDeleted: String
                   )

case class Rol(
                    id: Int,
                    name: String,
                    active: Boolean,
                    descrip: String,

                    items: RolItems,

                    createdAt: Date,
                    updatedAt: Date,
                    updatedBy: Int) {

  def this(
            id: Int,
            name: String,
            active: Boolean,
            descrip: String,

            items: RolItems) = {

    this(
      id,
      name,
      active,
      descrip,

      items,

      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
            name: String,
            active: Boolean,
            descrip: String,

            items: RolItems) = {

    this(
      DBHelper.NoId,
      name,
      active,
      descrip,

      items)
  }

}

case class RolPermisoItem(
                        preId: Int,
                        perId: Int,
                        granted: Boolean
                      )

case class UsuarioItem(
                        usId: Int,
                        granted: Boolean
                      )

object Rol {

  lazy val emptyRolItems = RolItems(
    List(), ""
  )

  lazy val emptyRol = Rol(
    "",
    false,
    "",
    emptyRolItems)

  def apply(
             id: Int,
             name: String,
             active: Boolean,
             descrip: String,

             items: RolItems) = {

    new Rol(
      id,
      name,
      active,
      descrip,

      items)
  }

  def apply(
             name: String,
             active: Boolean,
             descrip: String,

             items: RolItems) = {

    new Rol(
      name,
      active,
      descrip,

      items)
  }

  private val rolParser: RowParser[Rol] = {
    SqlParser.get[Int](C.ROL_ID) ~
    SqlParser.get[String](C.ROL_NAME) ~
    SqlParser.get[Int](DBHelper.ACTIVE) ~
    SqlParser.get[String](C.ROL_DESCRIP) ~
    SqlParser.get[Date](DBHelper.CREATED_AT) ~
    SqlParser.get[Date](DBHelper.UPDATED_AT) ~
    SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
        id ~
        name ~
        active  ~
        descrip ~
        createdAt ~
        updatedAt ~
        updatedBy =>
          Rol(
            id,
            name,
            active != 0,
            descrip,
            emptyRolItems,
            createdAt,
            updatedAt,
            updatedBy)
    }
  }

  private val usuarioRolParser: RowParser[RolUsuario] = {
    SqlParser.get[Int](C.US_ID) ~
    SqlParser.get[String](C.US_NAME) map {
      case
        usId ~
        usName =>
          RolUsuario(
            usId,
            usName
          )
    }
  }

  def create(user: CompanyUser, rol: Rol): Rol = {
    save(user, rol, true)
  }

  def update(user: CompanyUser, rol: Rol): Rol = {
    save(user, rol, false)
  }

  private def save(user: CompanyUser, rol: Rol, isNew: Boolean): Rol = {
    def getFields = {
      List(
        Field(C.ROL_NAME, rol.name, FieldType.text),
        Field(DBHelper.ACTIVE, (if(rol.active) 1 else 0), FieldType.boolean),
        Field(C.ROL_DESCRIP, rol.descrip, FieldType.text)
      )
    }

    def getUsuarioFields(usuario: RolUsuario, rolId: Int) = {
      List(
        Field(C.US_ID, usuario.usId, FieldType.id),
        Field(C.ROL_ID, rolId, FieldType.id)
      )
    }

    def throwError = {
      throwException(s"Error when saving ${C.USUARIO}")
    }

    def throwException(message: String) = {
      throw new RuntimeException(message)
    }

    case class RolUsuarioInfo(rolId: Int, item: RolUsuario)

    def saveUsuario(itemInfo: RolUsuarioInfo) = {
      DBHelper.save(
        user,
        Register(
          C.USUARIO_ROL,
          "",
          DBHelper.NoId,
          false,
          true,
          true,
          getUsuarioFields(itemInfo.item, itemInfo.rolId)),
        true
      ) match {
        case SaveResult(true, id) => true
        case SaveResult(false, id) => throwError
      }
    }

    def saveUsuarios(rolId: Int) = {
      DBHelper.deleteItems(user, C.USUARIO_ROL, C.US_ID, rol.items.usuarioDeleted, s" AND rol_id = ${rolId}")
      val usuarios = loadUsuarios(user, rolId)
      rol.items.usuarios.filter(usuario => ! usuarios.exists(u => u.usId == usuario.usId)).map(usuario => saveUsuario(RolUsuarioInfo(rolId, usuario)))
    }

    DBHelper.saveEx(
      user,
      Register(
        C.ROL,
        C.ROL_ID,
        rol.id,
        false,
        true,
        true,
        getFields),
      isNew,
      ""
    ) match {
      case SaveResult(true, id) => {
        saveUsuarios(id)
        load(user, id).getOrElse(throwError)
      }
      case SaveResult(false, id) => throwError
    }
  }

  def load(user: CompanyUser, id: Int): Option[Rol] = {
    loadWhere(user, s"${C.ROL_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.ROL} t1 WHERE $where")
        .on(args: _*)
        .as(rolParser.singleOpt)
    }
  }

  private def loadRolItems(user: CompanyUser, id: Int) = {
    RolItems(
      loadUsuarios(user, id),
      "")
  }

  private def loadUsuarios(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.US_NAME} FROM ${C.USUARIO_ROL} t1 INNER JOIN ${C.USUARIO} t2 ON t1.${C.US_ID} = t2.${C.US_ID} WHERE t1.${C.ROL_ID} = {id} ORDER BY ${C.US_NAME}")
        .on('id -> id)
        .as(usuarioRolParser.*)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.ROL} WHERE ${C.ROL_ID} = {id}")
          .on('id -> id)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.ROL}. ${C.ROL_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Rol = {
    val p = load(user, id).getOrElse(emptyRol)

    Rol(
      p.id,
      p.name,
      p.active,
      p.descrip,

      loadRolItems(user, id)
    )
  }

  def getPermissions(user: CompanyUser, id: Int,
                     onlyGranted: Option[Boolean],
                     filter: Option[String]): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "{call sp_role_get_permissions(?, ?, ?, ?, ?)}"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, user.cairoCompanyId)
      cs.setInt(2, id)
      cs.setInt(3, if(onlyGranted.getOrElse(false)) 1 else 0)
      cs.setString(4, filter.getOrElse(""))
      cs.registerOutParameter(5, Types.OTHER)

      try {
        cs.execute()

        val rs = cs.getObject(5).asInstanceOf[java.sql.ResultSet]
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get permissions for role id $id and current user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def getUsuarios(user: CompanyUser, id: Int): Recordset = {

    DB.withTransaction(user.database.database) { implicit connection =>

      val sql = "select u.us_id, us_nombre, case when r.rol_id is not null then 1 else 0 end as granted " +
        "from Usuario u " +
        "left join UsuarioRol r on u.us_id = r.us_id " +
        "and r.rol_id = ? " +
        "order by us_nombre"
      val cs = connection.prepareCall(sql)

      cs.setInt(1, id)

      try {
        val rs = cs.executeQuery()
        Recordset.load(rs)

      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't get users for role id $id and current user ${user.toString}. Error ${e.toString}")
          throw e
        }
      } finally {
        cs.close
      }
    }
  }

  def updatePermission(user: CompanyUser, rolId: Int)(permiso: RolPermisoItem) = {
    Logger.info(s"update permiso $permiso for rol $rolId")
    if(permiso.granted) createPermission(user, rolId, permiso)
    else deletePermission(user, permiso.perId)
  }

  def updateUser(user: CompanyUser, rolId: Int)(rol: UsuarioItem) = {
    Logger.info(s"update rol $rol for role $rolId")
    if(rol.granted) createUsuario(user, rolId, rol)
    else deleteUser(user, rol.usId, rolId)
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

  def deleteUser(user: CompanyUser, usId: Int, rolId: Int) = {
    Logger.info(s"remove usuario rol us_id: $usId for rol_id: $rolId")
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.USUARIO_ROL} WHERE ${C.US_ID} = {usId} AND ${C.ROL_ID} = {rolId}")
          .on('usId -> usId, 'rolId -> rolId)
          .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.USUARIO_ROL}. ${C.US_ID} id: $usId for id: ${rolId}. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def createPermission(user: CompanyUser, rolId: Int, permiso: RolPermisoItem) = {
    Logger.info(s"create permiso $permiso for role $rolId")
    def getFields = {
      List(
        Field(C.PRE_ID, permiso.preId, FieldType.id),
        Field(C.ROL_ID, rolId, FieldType.id)
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
  def createUsuario(user: CompanyUser, rolId: Int, usuario: UsuarioItem) = {
    Logger.info(s"add user $usuario to role $rolId")
    def getFields = {
      List(
        Field(C.US_ID, usuario.usId, FieldType.id),
        Field(C.ROL_ID, rolId, FieldType.id)
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

  def updatePermissions(user: CompanyUser,
                        permissions: List[RolPermisoItem],
                        usuarios: List[UsuarioItem],
                        userId: Int) = {
    Logger.info(s"updatePermissions: permissions: ${permissions.size} - users: ${usuarios.size}")
    permissions.foreach(updatePermission(user, userId))
    usuarios.foreach(updateUser(user, userId))
  }
}