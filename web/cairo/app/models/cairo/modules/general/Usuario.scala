package models.cairo.modules.general

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.{PasswordHash, DateUtil}
import services.db.DB
import models.cairo.system.database.{DBHelper, Register, Field, FieldType, SaveResult}
import play.api.Play.current
import models.domain.{ CompanyUser, Company }
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
        Field(DBHelper.ACTIVE, (if(usuario.active) 1 else 0), FieldType.boolean),

        /* TODO: save password */

        Field(C.US_DEPOSITO, (if(usuario.usDeposito) 1 else 0), FieldType.boolean),
        Field(C.US_EXTERNO, (if(usuario.externo) 1 else 0), FieldType.boolean),
        Field(C.US_EMP_X_DPTO, (if(usuario.empXDpto) 1 else 0), FieldType.boolean),
        Field(C.US_EMPRESA_EX, (if(usuario.empresaEx) 1 else 0), FieldType.boolean),

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
      val dbName = user.database.database
      val domain = dbName.substring(0, dbName.lastIndexOf("_"))
      usuario.name.replace(" ", "_") + "@" + domain
    }

    val masterUser = if(usuario.id != DBHelper.NoId) User.load(usuario.id) else None

    val masterUserId = masterUser match {
      case Some(user) => {
        val userNameWithDomain = getUserNameFromDomain
        if(user.username != getUserNameFromDomain) {
          User.update(
            user.id,
            userNameWithDomain,
            userNameWithDomain
          )
        }
        user.id
      }
      case None => {

        // must be a new Usuario
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
      CompanyUser.findByCompanyAndUser(user, empId) match {
        case None => CompanyUser.save(
          CompanyUser(
            user.masterUser,
            Company.load(empId).getOrElse(throwError),
            user.database
          )
        )
        case _ => // nothing to do
      }
    }

    def saveCompaniesUser(usId: Int) = {
      usuario.items.empresas.map(empresa => saveCompanyUser(usId, empresa.id))
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
        saveCompanyUser(id)
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
      SQL(s"SELECT t1.${C.EMP_US_ID}, t2.${C.EMP_ID} t2.${C.EMP_NAME} FROM ${C.EMPRESA} t2 LEFT JOIN ${C.EMPRESA_USUARIO} t1 ON t1.${C.EMP_ID} = t2.${C.EMP_ID} WHERE t1.${C.US_ID} = {id}")
        .on('id -> id)
        .as(empresaUsuarioParser.*)
    }
  }

  private def loadRoles(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.ROL_NAME} FROM ${C.USUARIO_ROL} t1 INNER JOIN ${C.ROL} t2 ON t1.${C.ROL_ID} = t2.${C.ROL_ID} WHERE t1.${C.US_ID} = {id}")
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
    load(user, id) match {
      case Some(p) => {
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
      case None => emptyUsuario
    }
  }
}