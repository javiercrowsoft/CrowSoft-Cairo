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

case class ReglaLiquidacion(
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

object ReglaLiquidacion {

  lazy val emptyReglaLiquidacion = ReglaLiquidacion(
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

    new ReglaLiquidacion(
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

    new ReglaLiquidacion(
      name,
      code,
      active,
      descrip)
  }

  private val reglaLiquidacionParser: RowParser[ReglaLiquidacion] = {
      SqlParser.get[Int](C.REL_ID) ~
      SqlParser.get[String](C.REL_NAME) ~
      SqlParser.get[String](C.REL_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.REL_DESCRIP) ~
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
        ReglaLiquidacion(
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

  def create(user: CompanyUser, reglaLiquidacion: ReglaLiquidacion): ReglaLiquidacion = {
    save(user, reglaLiquidacion, true)
  }

  def update(user: CompanyUser, reglaLiquidacion: ReglaLiquidacion): ReglaLiquidacion = {
    save(user, reglaLiquidacion, false)
  }

  private def save(user: CompanyUser, reglaLiquidacion: ReglaLiquidacion, isNew: Boolean): ReglaLiquidacion = {
    def getFields = {
      List(
        Field(C.REL_NAME, reglaLiquidacion.name, FieldType.text),
        Field(C.REL_CODE, reglaLiquidacion.code, FieldType.text),
        Field(DBHelper.ACTIVE, (if(reglaLiquidacion.active) 1 else 0), FieldType.boolean),
        Field(C.REL_DESCRIP, reglaLiquidacion.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.REGLALIQUIDACION}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.REGLALIQUIDACION,
        C.REL_ID,
        reglaLiquidacion.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.REL_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[ReglaLiquidacion] = {
    loadWhere(user, s"${C.REL_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.REGLALIQUIDACION} t1 WHERE $where")
        .on(args: _*)
        .as(reglaLiquidacionParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.REGLALIQUIDACION} WHERE ${C.REL_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.REGLALIQUIDACION}. ${C.REL_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): ReglaLiquidacion = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyReglaLiquidacion
    }
  }
}

