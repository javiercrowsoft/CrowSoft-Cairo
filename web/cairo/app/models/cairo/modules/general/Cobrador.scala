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

case class Cobrador(
              id: Int,
              name: String,
              code: String,
              active: Boolean,
              relId: Int,
              relName: String,
              comision: Double,
              descrip: String,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      relId: Int,
      comision: Double,
      descrip: String) = {

    this(
      id,
      name,
      code,
      active,
      relId,
      "",
      comision,
      descrip,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      name: String,
      code: String,
      active: Boolean,
      relId: Int,
      comision: Double,
      descrip: String) = {

    this(
      DBHelper.NoId,
      name,
      code,
      active,
      relId,
      comision,
      descrip)

  }

}

object Cobrador {

  lazy val emptyCobrador = Cobrador(
    "",
    "",
    false,
    DBHelper.NoId,
    0,
    "")

  def apply(
      id: Int,
      name: String,
      code: String,
      active: Boolean,
      relId: Int,
      comision: Double,
      descrip: String) = {

    new Cobrador(
      id,
      name,
      code,
      active,
      relId,
      comision,
      descrip)
  }

  def apply(
      name: String,
      code: String,
      active: Boolean,
      relId: Int,
      comision: Double,
      descrip: String) = {

    new Cobrador(
      name,
      code,
      active,
      relId,
      comision,
      descrip)
  }

  private val cobradorParser: RowParser[Cobrador] = {
      SqlParser.get[Int](C.COB_ID) ~
      SqlParser.get[String](C.COB_NAME) ~
      SqlParser.get[String](C.COB_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.REL_ID) ~
      SqlParser.get[String](C.REL_NAME) ~
      SqlParser.get[Double](C.COB_COMISION) ~
      SqlParser.get[String](C.COB_DESCRIP) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              name ~
              code ~
              active ~
              relId ~
              relName ~
              comision ~
              descrip  ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Cobrador(
              id,
              name,
              code,
              active != 0,
              relId,
              relName,
              comision,
              descrip,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, cobrador: Cobrador): Cobrador = {
    save(user, cobrador, true)
  }

  def update(user: CompanyUser, cobrador: Cobrador): Cobrador = {
    save(user, cobrador, false)
  }

  private def save(user: CompanyUser, cobrador: Cobrador, isNew: Boolean): Cobrador = {
    def getFields = {
      List(
        Field(C.COB_NAME, cobrador.name, FieldType.text),
        Field(C.COB_CODE, cobrador.code, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(cobrador.active), FieldType.boolean),
        Field(C.REL_ID, cobrador.relId, FieldType.id),
        Field(C.COB_COMISION, cobrador.comision, FieldType.number),
        Field(C.COB_DESCRIP, cobrador.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.COBRADOR}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.COBRADOR,
        C.COB_ID,
        cobrador.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.COB_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Cobrador] = {
    loadWhere(user, s"${C.COB_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.*, t2.${C.REL_NAME}" +
        s" FROM ${C.COBRADOR} t1" +
        s" LEFT JOIN ${C.REGLALIQUIDACION} t2 ON t1.${C.REL_ID} = t2.${C.REL_ID} WHERE $where")
        .on(args: _*)
        .as(cobradorParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.COBRADOR} WHERE ${C.COB_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.COBRADOR}. ${C.COB_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Cobrador = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyCobrador
    }
  }
}
