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

case class Provincia(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              paId: Int,
              paName: String,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      paId: Int,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      paId,
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
      paId: Int,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      paId,
      descrip)

  }

}

object Provincia {

  lazy val emptyProvincia = Provincia(
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
      paId: Int,
      descrip: String) = {

    new Provincia(
      id,
      name,
      code,
      active,
      paId,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      paId: Int,
      descrip: String) = {

    new Provincia(
      name,
      code,
      active,
      paId,
      descrip)
  }

  private val provinciaParser: RowParser[Provincia] = {
      SqlParser.get[Int](C.PRO_ID) ~
      SqlParser.get[String](C.PRO_NAME) ~
      SqlParser.get[String](C.PRO_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.PA_ID) ~
      SqlParser.get[String](C.PA_NAME) ~
      SqlParser.get[String](C.PRO_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              paId ~
              paName ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Provincia(
              id,
              name,
              code,
              (if(active != 0) true else false),
              paId,
              paName,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, provincia: Provincia): Provincia = {
    save(user, provincia, true)
  }

  def update(user: CompanyUser, provincia: Provincia): Provincia = {
    save(user, provincia, false)
  }

  private def save(user: CompanyUser, provincia: Provincia, isNew: Boolean): Provincia = {
    def getFields = {
      List(
        Field(C.PRO_NAME, provincia.name, FieldType.text),
        Field(C.PRO_CODE, provincia.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(provincia.active) 1 else 0), FieldType.boolean),
        Field(C.PA_ID, provincia.paId, FieldType.id),
        Field(C.PRO_DESCRIP, provincia.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.PROVINCIA}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.PROVINCIA,
        C.PRO_ID,
        provincia.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.PRO_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Provincia] = {
    loadWhere(user, s"${C.PRO_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.PA_NAME} FROM ${C.PROVINCIA} t1" +
        s" LEFT JOIN ${C.PAIS} t2 ON t1.${C.PA_ID} = t2.${C.PA_ID} WHERE $where")
        .on(args: _*)
        .as(provinciaParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.PROVINCIA} WHERE ${C.PRO_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.PROVINCIA}. ${C.PRO_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Provincia = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyProvincia
    }
  }
}

