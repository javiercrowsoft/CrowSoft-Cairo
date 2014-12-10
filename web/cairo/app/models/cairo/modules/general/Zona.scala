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

case class Zona(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              precio: Double,
              prId: Int,
              prName: String,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      precio: Double,
      prId: Int,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      precio,
      prId,
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
      precio: Double,
      prId: Int,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      precio,
      prId,
      descrip)

  }

}

object Zona {

  lazy val emptyZona = Zona(
    "",
    "",
    false,
    0,
    DBHelper.NoId,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      precio: Double,
      prId: Int,
      descrip: String) = {

    new Zona(
      id,
      name,
      code,
      active,
      precio,
      prId,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      precio: Double,
      prId: Int,
      descrip: String) = {

    new Zona(
      name,
      code,
      active,
      precio,
      prId,
      descrip)
  }

  private val zonaParser: RowParser[Zona] = {
      SqlParser.get[Int](C.ZON_ID) ~
      SqlParser.get[String](C.ZON_NAME) ~
      SqlParser.get[String](C.ZON_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Double](C.ZON_PRECIO) ~
      SqlParser.get[Int](C.PR_ID) ~
      SqlParser.get[String](C.PR_NAME) ~
      SqlParser.get[String](C.ZON_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              precio ~
              prId ~
              prName ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Zona(
              id,
              name,
              code,
              (if(active != 0) true else false),
              precio,
              prId,
              prName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, zona: Zona): Zona = {
    save(user, zona, true)
  }

  def update(user: CompanyUser, zona: Zona): Zona = {
    save(user, zona, false)
  }

  private def save(user: CompanyUser, zona: Zona, isNew: Boolean): Zona = {
    def getFields = {
      List(
        Field(C.ZON_NAME, zona.name, FieldType.text),
        Field(C.ZON_CODE, zona.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(zona.active) 1 else 0), FieldType.boolean),
        Field(C.ZON_PRECIO, zona.precio, FieldType.number),
        Field(C.PR_ID, zona.prId, FieldType.id),
        Field(C.ZON_DESCRIP, zona.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.ZONA}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.ZONA,
        C.ZON_ID,
        zona.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.ZON_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Zona] = {
    loadWhere(user, s"${C.ZON_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.FK_NAME} FROM ${C.ZONA} t1 INNER JOIN ${C.???} t2 ON t1.${C.FK_ID} = t2.${C.FK_ID} WHERE $where")
        .on(args: _*)
        .as(zonaParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.ZONA} WHERE ${C.ZON_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.ZONA}. ${C.ZON_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Zona = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyZona
    }
  }
}

