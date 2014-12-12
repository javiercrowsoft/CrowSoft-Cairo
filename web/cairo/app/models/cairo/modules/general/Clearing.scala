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

case class Clearing(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              dias: Int,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      dias: Int,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      dias,
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean,
      dias: Int,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      dias,
      descrip)

  }

}

object Clearing {

  lazy val emptyClearing = Clearing(
    "",
    "",
    false,
    null,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      dias: Int,
      descrip: String) = {

    new Clearing(
      id,
      name,
      code,
      active,
      dias,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      dias: Int,
      descrip: String) = {

    new Clearing(
      name,
      code,
      active,
      dias,
      descrip)
  }

  private val clearingParser: RowParser[Clearing] = {
      SqlParser.get[Int](C.CLE_ID) ~
      SqlParser.get[String](C.CLE_NAME) ~
      SqlParser.get[String](C.CLE_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.CLE_DIAS) ~
      SqlParser.get[String](C.CLE_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              dias ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Clearing(
              id,
              name,
              code,
              (if(active != 0) true else false),
              dias,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, clearing: Clearing): Clearing = {
    save(user, clearing, true)
  }

  def update(user: CompanyUser, clearing: Clearing): Clearing = {
    save(user, clearing, false)
  }

  private def save(user: CompanyUser, clearing: Clearing, isNew: Boolean): Clearing = {
    def getFields = {
      List(
        Field(C.CLE_NAME, clearing.name, FieldType.text),
        Field(C.CLE_CODE, clearing.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(clearing.active) 1 else 0), FieldType.boolean),
        Field(C.CLE_DIAS, clearing.dias, FieldType.number),
        Field(C.CLE_DESCRIP, clearing.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CLEARING}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CLEARING,
        C.CLE_ID,
        clearing.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CLE_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Clearing] = {
    loadWhere(user, s"${C.CLE_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.CLEARING} t1 WHERE $where")
        .on(args: _*)
        .as(clearingParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CLEARING} WHERE ${C.CLE_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CLEARING}. ${C.CLE_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Clearing = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyClearing
    }
  }
}
