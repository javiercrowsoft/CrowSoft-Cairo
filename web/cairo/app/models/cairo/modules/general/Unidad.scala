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

case class Unidad(
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

object Unidad {

  lazy val emptyUnidad = Unidad(
    "",
    "",
    false)

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean) = {

    new Unidad(
      id,
      name,
      code,
      active)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean) = {

    new Unidad(
      name,
      code,
      active)
  }

  private val unidadParser: RowParser[Unidad] = {
      SqlParser.get[Int](C.UN_ID) ~
      SqlParser.get[String](C.UN_NAME) ~
      SqlParser.get[String](C.UN_CODE) ~
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
        Unidad(
              id,
              name,
              code,
              (if(active != 0) true else false),
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, unidad: Unidad): Unidad = {
    save(user, unidad, true)
  }

  def update(user: CompanyUser, unidad: Unidad): Unidad = {
    save(user, unidad, false)
  }

  private def save(user: CompanyUser, unidad: Unidad, isNew: Boolean): Unidad = {
    def getFields = {
      List(
        Field(C.UN_NAME, unidad.name, FieldType.text),
        Field(C.UN_CODE, unidad.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(unidad.active) 1 else 0), FieldType.boolean)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.UNIDAD}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.UNIDAD,
        C.UN_ID,
        unidad.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.UN_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Unidad] = {
    loadWhere(user, s"${C.UN_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.UNIDAD} t1 WHERE $where")
        .on(args: _*)
        .as(unidadParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.UNIDAD} WHERE ${C.UN_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.UNIDAD}. ${C.UN_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Unidad = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyUnidad
    }
  }
}

