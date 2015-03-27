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

case class Calidad(
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

object Calidad {

  lazy val emptyCalidad = Calidad(
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

    new Calidad(
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

    new Calidad(
      name,
      code,
      active,
      descrip)
  }

  private val calidadParser: RowParser[Calidad] = {
      SqlParser.get[Int](C.CALID_ID) ~
      SqlParser.get[String](C.CALID_NAME) ~
      SqlParser.get[String](C.CALID_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.CALID_DESCRIP) ~
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
        Calidad(
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

  def create(user: CompanyUser, calidad: Calidad): Calidad = {
    save(user, calidad, true)
  }

  def update(user: CompanyUser, calidad: Calidad): Calidad = {
    save(user, calidad, false)
  }

  private def save(user: CompanyUser, calidad: Calidad, isNew: Boolean): Calidad = {
    def getFields = {
      List(
        Field(C.CALID_NAME, calidad.name, FieldType.text),
        Field(C.CALID_CODE, calidad.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(calidad.active) 1 else 0), FieldType.boolean),
        Field(C.CALID_DESCRIP, calidad.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CALIDAD}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CALIDAD,
        C.CALID_ID,
        calidad.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CALID_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Calidad] = {
    loadWhere(user, s"${C.CALID_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.CALIDAD} t1 WHERE $where")
        .on(args: _*)
        .as(calidadParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CALIDAD} WHERE ${C.CALID_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CALIDAD}. ${C.CALID_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Calidad = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyCalidad
    }
  }
}
