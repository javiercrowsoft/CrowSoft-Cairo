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

case class Escala(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean) = {

    this(
      id,
      name,
      code,
      active,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active)

  }

}

object Escala {

  lazy val emptyEscala = Escala(
    "",
    "",
    false)

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean) = {

    new Escala(
      id,
      name,
      code,
      active)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean) = {

    new Escala(
      name,
      code,
      active)
  }

  private val escalaParser: RowParser[Escala] = {
      SqlParser.get[Int](C.ESC_ID) ~
      SqlParser.get[String](C.ESC_NAME) ~
      SqlParser.get[String](C.ESC_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Escala(
              id,
              name,
              code,
              active != 0,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, escala: Escala): Escala = {
    save(user, escala, true)
  }

  def update(user: CompanyUser, escala: Escala): Escala = {
    save(user, escala, false)
  }

  private def save(user: CompanyUser, escala: Escala, isNew: Boolean): Escala = {
    def getFields = {
      List(
        Field(C.ESC_NAME, escala.name, FieldType.text),
        Field(C.ESC_CODE, escala.code, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(escala.active), FieldType.boolean)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.ESCALA}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.ESCALA,
        C.ESC_ID,
        escala.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.ESC_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Escala] = {
    loadWhere(user, s"${C.ESC_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.ESCALA} t1 WHERE $where")
        .on(args: _*)
        .as(escalaParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.ESCALA} WHERE ${C.ESC_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.ESCALA}. ${C.ESC_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Escala = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyEscala
    }
  }
}
