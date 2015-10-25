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

case class CircuitoContable(
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

object CircuitoContable {

  lazy val emptyCircuitoContable = CircuitoContable(
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

    new CircuitoContable(
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

    new CircuitoContable(
      name,
      code,
      active,
      descrip)
  }

  private val circuitoContableParser: RowParser[CircuitoContable] = {
      SqlParser.get[Int](C.CICO_ID) ~
      SqlParser.get[String](C.CICO_NAME) ~
      SqlParser.get[String](C.CICO_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[String](C.CICO_DESCRIP) ~
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
        CircuitoContable(
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

  def create(user: CompanyUser, circuitoContable: CircuitoContable): CircuitoContable = {
    save(user, circuitoContable, true)
  }

  def update(user: CompanyUser, circuitoContable: CircuitoContable): CircuitoContable = {
    save(user, circuitoContable, false)
  }

  private def save(user: CompanyUser, circuitoContable: CircuitoContable, isNew: Boolean): CircuitoContable = {
    def getFields = {
      List(
        Field(C.CICO_NAME, circuitoContable.name, FieldType.text),
        Field(C.CICO_CODE, circuitoContable.code, FieldType.text),
        Field(DBHelper.ACTIVE, Register.boolToInt(circuitoContable.active), FieldType.boolean),
        Field(C.CICO_DESCRIP, circuitoContable.descrip, FieldType.text)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CIRCUITO_CONTABLE}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CIRCUITO_CONTABLE,
        C.CICO_ID,
        circuitoContable.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CICO_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[CircuitoContable] = {
    loadWhere(user, s"${C.CICO_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.CIRCUITO_CONTABLE} WHERE $where")
        .on(args: _*)
        .as(circuitoContableParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CIRCUITO_CONTABLE} WHERE ${C.CICO_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CIRCUITO_CONTABLE}. ${C.CICO_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): CircuitoContable = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyCircuitoContable
    }
  }
}
