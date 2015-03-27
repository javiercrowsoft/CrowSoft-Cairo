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

case class Banco(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              mail: String,
              contacto: String,
              telefono: String,
              direccion: String,
              web: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      mail: String,
      contacto: String,
      telefono: String,
      direccion: String,
      web: String) = {

    this(
      id,
      name,
      code,
      active,
      mail,
      contacto,
      telefono,
      direccion,
      web,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean,
      mail: String,
      contacto: String,
      telefono: String,
      direccion: String,
      web: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      mail,
      contacto,
      telefono,
      direccion,
      web)

  }

}

object Banco {

  lazy val emptyBanco = Banco(
    "",
    "",
    false,
    "",
    "",
    "",
    "",
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      mail: String,
      contacto: String,
      telefono: String,
      direccion: String,
      web: String) = {

    new Banco(
      id,
      name,
      code,
      active,
      mail,
      contacto,
      telefono,
      direccion,
      web)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      mail: String,
      contacto: String,
      telefono: String,
      direccion: String,
      web: String) = {

    new Banco(
      name,
      code,
      active,
      mail,
      contacto,
      telefono,
      direccion,
      web)
  }

  private val bancoParser: RowParser[Banco] = {
      SqlParser.get[Int](C.BCO_ID) ~
      SqlParser.get[String](C.BCO_NAME) ~
      SqlParser.get[String](C.BCO_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.BCO_MAIL) ~
      SqlParser.get[String](C.BCO_CONTACTO) ~
      SqlParser.get[String](C.BCO_TELEFONO) ~
      SqlParser.get[String](C.BCO_DIRECCION) ~
      SqlParser.get[String](C.BCO_WEB) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              mail ~
              contacto ~
              telefono ~
              direccion ~
              web  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Banco(
              id,
              name,
              code,
              active != 0,
              mail,
              contacto,
              telefono,
              direccion,
              web,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, banco: Banco): Banco = {
    save(user, banco, true)
  }

  def update(user: CompanyUser, banco: Banco): Banco = {
    save(user, banco, false)
  }

  private def save(user: CompanyUser, banco: Banco, isNew: Boolean): Banco = {
    def getFields = {
      List(
        Field(C.BCO_NAME, banco.name, FieldType.text),
        Field(C.BCO_CODE, banco.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(banco.active) 1 else 0), FieldType.boolean),
        Field(C.BCO_MAIL, banco.mail, FieldType.text),
        Field(C.BCO_CONTACTO, banco.contacto, FieldType.text),
        Field(C.BCO_TELEFONO, banco.telefono, FieldType.text),
        Field(C.BCO_DIRECCION, banco.direccion, FieldType.text),
        Field(C.BCO_WEB, banco.web, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.BANCO}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.BANCO,
        C.BCO_ID,
        banco.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.BCO_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Banco] = {
    loadWhere(user, s"${C.BCO_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.BANCO} t1 WHERE $where")
        .on(args: _*)
        .as(bancoParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.BANCO} WHERE ${C.BCO_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.BANCO}. ${C.BCO_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Banco = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyBanco
    }
  }
}