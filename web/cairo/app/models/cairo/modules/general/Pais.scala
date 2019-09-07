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

case class Pais(
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

object Pais {

  lazy val emptyPais = Pais(
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

    new Pais(
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

    new Pais(
      name,
      code,
      active,
      descrip)
  }

  private val paisParser: RowParser[Pais] = {
      SqlParser.get[Int](C.PA_ID) ~
      SqlParser.get[String](C.PA_NAME) ~
      SqlParser.get[String](C.PA_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.PA_DESCRIP) ~
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
        Pais(
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

  def create(user: CompanyUser, pais: Pais): Pais = {
    save(user, pais, true)
  }

  def update(user: CompanyUser, pais: Pais): Pais = {
    save(user, pais, false)
  }

  private def save(user: CompanyUser, pais: Pais, isNew: Boolean): Pais = {
    def getFields = {
      List(
        Field(C.PA_NAME, pais.name, FieldType.text),
        Field(C.PA_CODE, pais.code, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(pais.active), FieldType.boolean),
        Field(C.PA_DESCRIP, pais.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.PAIS}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.PAIS,
        C.PA_ID,
        pais.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.PA_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, _) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Pais] = {
    loadWhere(user, s"${C.PA_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.PAIS} t1 WHERE $where")
        .on(args: _*)
        .as(paisParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.PAIS} WHERE ${C.PA_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.PAIS}. ${C.PA_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Pais = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyPais
    }
  }
}

