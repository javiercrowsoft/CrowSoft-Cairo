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

case class Sucursal(
              id: Int,
              name: String,
              code: String,
              numero: Int,
              active: Boolean,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      numero: Int,
      active: Boolean,
      descrip: String) = {

    this(
      id,
      name,
      code,
      numero,
      active,
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      numero: Int,
      active: Boolean,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      numero,
      active,
      descrip)

  }

}

object Sucursal {

  lazy val emptySucursal = Sucursal(
    "",
    "",
    0,
    false,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      numero: Int,
      active: Boolean,
      descrip: String) = {

    new Sucursal(
      id,
      name,
      code,
      numero,
      active,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      numero: Int,
      active: Boolean,
      descrip: String) = {

    new Sucursal(
      name,
      code,
      numero,
      active,
      descrip)
  }

  private val sucursalParser: RowParser[Sucursal] = {
      SqlParser.get[Int](C.SUC_ID) ~
      SqlParser.get[String](C.SUC_NAME) ~
      SqlParser.get[String](C.SUC_CODE) ~
      SqlParser.get[Int](C.SUC_NUMERO) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.SUC_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              numero ~
              active ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Sucursal(
              id,
              name,
              code,
              numero,
              active != 0,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, sucursal: Sucursal): Sucursal = {
    save(user, sucursal, true)
  }

  def update(user: CompanyUser, sucursal: Sucursal): Sucursal = {
    save(user, sucursal, false)
  }

  private def save(user: CompanyUser, sucursal: Sucursal, isNew: Boolean): Sucursal = {
    def getFields = {
      List(
        Field(C.SUC_NAME, sucursal.name, FieldType.text),
        Field(C.SUC_CODE, sucursal.code, FieldType.text),
        Field(C.SUC_NUMERO, sucursal.numero, FieldType.number),
        Field(DBHelper.ACTIVE, Register.boolToInt(sucursal.active), FieldType.boolean),
        Field(C.SUC_DESCRIP, sucursal.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.SUCURSAL}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.SUCURSAL,
        C.SUC_ID,
        sucursal.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.SUC_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Sucursal] = {
    loadWhere(user, s"${C.SUC_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.SUCURSAL} t1 WHERE $where")
        .on(args: _*)
        .as(sucursalParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.SUCURSAL} WHERE ${C.SUC_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.SUCURSAL}. ${C.SUC_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Sucursal = {
    load(user, id) match {
      case Some(p) => p
      case None => emptySucursal
    }
  }
}
