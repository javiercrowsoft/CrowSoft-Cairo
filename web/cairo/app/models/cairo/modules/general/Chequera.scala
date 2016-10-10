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

case class Chequera(
              id: Int,
              code: String,
              active: Boolean,
              lastNumber: Int,
              maxNumber: Int,
              minNumber: Int,
              default: Boolean,
              createdAt: Date,
              updatedAt: Date,
              updatedBy: Int) {

  def this(
      id: Int,
      code: String,
      active: Boolean,
      lastNumber: Int,
      maxNumber: Int,
      minNumber: Int,
      default: Boolean) = {

    this(
      id,
      code,
      active,
      lastNumber,
      maxNumber,
      minNumber,
      default,
      DateUtil.currentTime,
      DateUtil.currentTime,
      DBHelper.NoId)
  }

  def this(
      code: String,
      active: Boolean,
      lastNumber: Int,
      maxNumber: Int,
      minNumber: Int,
      default: Boolean) = {

    this(
      DBHelper.NoId,
      code,
      active,
      lastNumber,
      maxNumber,
      minNumber,
      default)

  }

}

object Chequera {

  lazy val emptyChequera = Chequera("", false, 0, 0, 0, false)

  def apply(
      id: Int,
      code: String,
      active: Boolean,
      lastNumber: Int,
      maxNumber: Int,
      minNumber: Int,
      default: Boolean) = {

    new Chequera(
      id,
      code,
      active,
      lastNumber,
      maxNumber,
      minNumber,
      default)
  }

  def apply(
      code: String,
      active: Boolean,
      lastNumber: Int,
      maxNumber: Int,
      minNumber: Int,
      default: Boolean) = {

    new Chequera(
      code,
      active,
      lastNumber,
      maxNumber,
      minNumber,
      default)
  }

  private val chequeraParser: RowParser[Chequera] = {
      SqlParser.get[Int](C.CHQ_ID) ~
      SqlParser.get[String](C.CHQ_CODE) ~
      SqlParser.get[Int](DBHelper.ACTIVE) ~
      SqlParser.get[Int](C.CHQ_NUMERO_DESDE) ~
      SqlParser.get[Int](C.CHQ_NUMERO_HASTA) ~
      SqlParser.get[Int](C.CHQ_ULTIMO_NUMERO) ~
      SqlParser.get[Int](C.CHQ_DEFAULT) ~
      SqlParser.get[Date](DBHelper.CREATED_AT) ~
      SqlParser.get[Date](DBHelper.UPDATED_AT) ~
      SqlParser.get[Int](DBHelper.UPDATED_BY) map {
      case
              id ~
              code ~
              active  ~
              minNumber ~
              maxNumber ~
              lastNumber ~
              default ~
              createdAt ~
              updatedAt ~
              updatedBy =>
        Chequera(
              id,
              code,
              active != 0,
              minNumber,
              maxNumber,
              lastNumber,
              default != 0,
              createdAt,
              updatedAt,
              updatedBy)
    }
  }

  def create(user: CompanyUser, chequera: Chequera): Chequera = {
    save(user, chequera, true)
  }

  def update(user: CompanyUser, chequera: Chequera): Chequera = {
    save(user, chequera, false)
  }

  private def save(user: CompanyUser, chequera: Chequera, isNew: Boolean): Chequera = {
    def getFields = {
      List(
        Field(C.CHQ_CODE, chequera.code, FieldType.text),
        Field(C.CHQ_ULTIMO_NUMERO, chequera.lastNumber, FieldType.number),
        Field(C.CHQ_NUMERO_DESDE, chequera.minNumber, FieldType.number),
        Field(C.CHQ_NUMERO_HASTA, chequera.maxNumber, FieldType.number),
        Field(C.CHQ_DEFAULT, Register.boolToInt(chequera.default), FieldType.boolean),
        Field(DBHelper.ACTIVE, Register.boolToInt(chequera.active), FieldType.boolean)
      )
    }
    def throwException = {
      throw new RuntimeException(s"Error when saving ${C.CHEQUERA}")
    }

    DBHelper.saveEx(
      user,
      Register(
        C.CHEQUERA,
        C.CHQ_ID,
        chequera.id,
        false,
        true,
        true,
        getFields),
      isNew,
      C.CHQ_CODE
    ) match {
      case SaveResult(true, id) => load(user, id).getOrElse(throwException)
      case SaveResult(false, id) => throwException
    }
  }

  def load(user: CompanyUser, id: Int): Option[Chequera] = {
    loadWhere(user, s"${C.CHQ_ID} = {id}", 'id -> id)
  }

  def loadWhere(user: CompanyUser, where: String, args : scala.Tuple2[scala.Any, anorm.ParameterValue[_]]*) = {
    DB.withConnection(user.database.database) { implicit connection =>
      SQL(s"SELECT t1.* FROM ${C.CHEQUERA} t1 WHERE $where")
        .on(args: _*)
        .as(chequeraParser.singleOpt)
    }
  }

  def delete(user: CompanyUser, id: Int) = {
    DB.withConnection(user.database.database) { implicit connection =>
      try {
        SQL(s"DELETE FROM ${C.CHEQUERA} WHERE ${C.CHQ_ID} = {id}")
        .on('id -> id)
        .executeUpdate
      } catch {
        case NonFatal(e) => {
          Logger.error(s"can't delete a ${C.CHEQUERA}. ${C.CHQ_ID} id: $id. Error ${e.toString}")
          throw e
        }
      }
    }
  }

  def get(user: CompanyUser, id: Int): Chequera = {
    load(user, id) match {
      case Some(p) => p
      case None => emptyChequera
    }
  }

  def nextNumber(user: CompanyUser, id: Int): Int = {

    load(user, id)  match {
      case Some(chequera) => {
        val nextNumber = chequera.lastNumber + 1
        if(chequera.minNumber > nextNumber)
          chequera.minNumber
        else if(chequera.maxNumber < nextNumber)
          chequera.maxNumber
        else
          nextNumber
      }
      case None => 0
    }
  }
}
