package models.cairo.modules.general

import java.sql.{Connection, CallableStatement, ResultSet, Types, SQLException}
import anorm.SqlParser._
import anorm._
import services.DateUtil
import services.db.DB
import models.cairo.system.database.{DBHelper, Register, Field, FieldType, SaveResult}
import play.api.Play.current
import models.domain.CompanyUser
import java.util.Date
import play.api.Logger
import play.api.libs.json._
import scala.util.control.NonFatal

case class ClienteContactoTipo(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      descrip)

  }

}

object ClienteContactoTipo {

  lazy val emptyClienteContactoTipo = ClienteContactoTipo(
    "",
    "",
    false,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      descrip: String) = {

    new ClienteContactoTipo(
      id,
      name,
      code,
      active,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      descrip: String) = {

    new ClienteContactoTipo(
      name,
      code,
      active,
      descrip)
  }

  private val clienteContactoTipoParser: RowParser[ClienteContactoTipo] = {
      SqlParser.get[Int](C.CLICT_ID) ~
      SqlParser.get[String](C.CLICT_NAME) ~
      SqlParser.get[String](C.CLICT_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.CLICT_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        ClienteContactoTipo(
              id,
              name,
              code,
              active != 0,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, clienteContactoTipo: ClienteContactoTipo): ClienteContactoTipo = {
    save(user, clienteContactoTipo, true)
  }

  def update(user: CompanyUser, clienteContactoTipo: ClienteContactoTipo): ClienteContactoTipo = {
    save(user, clienteContactoTipo, false)
  }

  private def save(user: CompanyUser, clienteContactoTipo: ClienteContactoTipo, isNew: Boolean): ClienteContactoTipo = {
    def getFields = {
      List(
        Field(C.CLICT_NAME, clienteContactoTipo.name, FieldType.text),
        Field(C.CLICT_CODE, clienteContactoTipo.code, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(clienteContactoTipo.active), FieldType.boolean),
        Field(C.CLICT_DESCRIP, clienteContactoTipo.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CLIENTE_CONTACTO_TIPO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CLIENTE_CONTACTO_TIPO,
        C.CLICT_ID,
        clienteContactoTipo.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CLICT_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, _) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[ClienteContactoTipo] = {
    loadWhere(user, s"${C.CLICT_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.CLIENTE_CONTACTO_TIPO} t1 WHERE $where")
        .on(args: _*)
        .as(clienteContactoTipoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CLIENTE_CONTACTO_TIPO} WHERE ${C.CLICT_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CLIENTE_CONTACTO_TIPO}. ${C.CLICT_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): ClienteContactoTipo = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyClienteContactoTipo
    }
  }
}
