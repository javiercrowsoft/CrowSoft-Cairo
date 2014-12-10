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

case class Clientecontactotipo(
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

object Clientecontactotipo {

  lazy val emptyClientecontactotipo = Clientecontactotipo(
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

    new Clientecontactotipo(
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

    new Clientecontactotipo(
      name,
      code,
      active,
      descrip)
  }

  private val clientecontactotipoParser: RowParser[Clientecontactotipo] = {
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
        Clientecontactotipo(
              id,
              name,
              code,
              (if(active != 0) true else false),
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, clientecontactotipo: Clientecontactotipo): Clientecontactotipo = {
    save(user, clientecontactotipo, true)
  }

  def update(user: CompanyUser, clientecontactotipo: Clientecontactotipo): Clientecontactotipo = {
    save(user, clientecontactotipo, false)
  }

  private def save(user: CompanyUser, clientecontactotipo: Clientecontactotipo, isNew: Boolean): Clientecontactotipo = {
    def getFields = {
      List(
        Field(C.CLICT_NAME, clientecontactotipo.name, FieldType.text),
        Field(C.CLICT_CODE, clientecontactotipo.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(clientecontactotipo.active) 1 else 0), FieldType.boolean),
        Field(C.CLICT_DESCRIP, clientecontactotipo.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CLIENTECONTACTOTIPO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CLIENTECONTACTOTIPO,
        C.CLICT_ID,
        clientecontactotipo.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CLICT_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Clientecontactotipo] = {
    loadWhere(user, s"${C.CLICT_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.CLIENTECONTACTOTIPO} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
        .on(args: _*)
        .as(clientecontactotipoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CLIENTECONTACTOTIPO} WHERE ${C.CLICT_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CLIENTECONTACTOTIPO}. ${C.CLICT_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Clientecontactotipo = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyClientecontactotipo
    }
  }
}
