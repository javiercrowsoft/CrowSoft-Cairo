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

case class Ciudad(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              proId: Int,
              proName: String,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      proId: Int,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      proId,
      "",
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean,
      proId: Int,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      proId,
      descrip)

  }

}

object Ciudad {

  lazy val emptyCiudad = Ciudad(
    "",
    "",
    false,
    DBHelper.NoId,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      proId: Int,
      descrip: String) = {

    new Ciudad(
      id,
      name,
      code,
      active,
      proId,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      proId: Int,
      descrip: String) = {

    new Ciudad(
      name,
      code,
      active,
      proId,
      descrip)
  }

  private val ciudadParser: RowParser[Ciudad] = {
      SqlParser.get[Int](C.CIU_ID) ~
      SqlParser.get[String](C.CIU_NAME) ~
      SqlParser.get[String](C.CIU_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.PRO_ID) ~
      SqlParser.get[String](C.PRO_NAME) ~
      SqlParser.get[String](C.CIU_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              proId ~
              proName ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Ciudad(
              id,
              name,
              code,
              active != 0,
              proId,
              proName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, ciudad: Ciudad): Ciudad = {
    save(user, ciudad, true)
  }

  def update(user: CompanyUser, ciudad: Ciudad): Ciudad = {
    save(user, ciudad, false)
  }

  private def save(user: CompanyUser, ciudad: Ciudad, isNew: Boolean): Ciudad = {
    def getFields = {
      List(
        Field(C.CIU_NAME, ciudad.name, FieldType.text),
        Field(C.CIU_CODE, ciudad.code, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(ciudad.active), FieldType.boolean),
        Field(C.PRO_ID, ciudad.proId, FieldType.id),
        Field(C.CIU_DESCRIP, ciudad.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CIUDAD}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CIUDAD,
        C.CIU_ID,
        ciudad.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CIU_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Ciudad] = {
    loadWhere(user, s"${C.CIU_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.PRO_NAME}" +
        s" FROM ${C.CIUDAD} t1" +
        s" LEFT JOIN ${C.PROVINCIA} t2 ON t1.${C.PRO_ID} = t2.${C.PRO_ID}" +
        s" WHERE $where")
        .on(args: _*)
        .as(ciudadParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CIUDAD} WHERE ${C.CIU_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CIUDAD}. ${C.CIU_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Ciudad = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyCiudad
    }
  }
}
